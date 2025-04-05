const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const port = 4000;

// PostgreSQL connection
// NOTE: use YOUR postgres username and password here
const pool = new Pool({
  user: 'test',
  host: 'localhost',
  database: 'ecommerce',
  password: 'test',
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// CORS: Give permission to localhost:3000 (ie our React app)
// to use this backend API
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Session information
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

/////////////////////////////////////////////////////////////
// Authentication APIs
// Signup, Login, IsLoggedIn and Logout

// Redirect unauthenticated users to the login page with respective status code
function isAuthenticated(req, res, next) {
  if(req.session.userId){
    next();
  }
  else{
    res.status(400).json({message:"Unauthorized"})
  }
}

// return JSON object with the following fields: {username, email, password}
app.post('/signup', async (req, res) => {
  try{
    const {username, email, password} = req.body;
    const user_rows = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if(user_rows.rows.length > 0){
      return res.status(400).json({message: "Error: Email is already registered."});
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id", [username, email, hashPassword]);
    req.session.userId = result.rows[0].user_id;
    req.session.username = username;
    res.status(200).json({message: "User Registered Successfully"});
  }
  catch (error){
    res.status(500).json({message: "Error signing up"});
  }
});

// return JSON object with the following fields: {email, password}
app.post("/login",  async (req, res) => {
  try{
    const {email, password} = req.body;
    const user_row = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if(user_row.rows.length === 0){
      return res.status(400).json({message: "Invalid Credentials"});
    } 
    const user = user_row.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if(!valid){
      return res.status(400).json({message: "Invalid Credentials"});
    }
    req.session.userId = user.user_id;
    req.session.username = user.username;
    res.status(200).json({message:"Login successful"});
  }
  catch{
    res.status(500).json({message: "Error logging in"});
  }
});


// Implement API used to check if the client is currently logged in or not.
app.get("/isLoggedIn", async (req, res) => {
  if(req.session && req.session.userId){
    const username = req.session.username;
    res.status(200).json({loggedIn : true, message : "Logged in", username});
  }
  else{
    res.status(400).json({loggedIn : false, message : "Not logged in"});
  }
});

// TODO: Implement API used to logout the user
app.post("/logout", (req, res) => {
  req.session.destroy((err)=>{
    if(err){
      res.status(500).json({message: "Failed to log out"});
    }
    else{
      res.status(200).json({message: "Logged out successfully"});
    }
  })
});

////////////////////////////////////////////////////
// APIs for the movie database

app.get("/getMovieContainingText", async (req, res) => {
  try {
    const { text } = req.query;

    const movieQuery = await pool.query(
      "SELECT id, title, category, poster_path, release_date, vote_average FROM movies_shows WHERE title ILIKE $1 ORDER BY popularity DESC, vote_average DESC LIMIT 5",
      [`%${text}%`]
    );

    const castQuery = await pool.query(
      "SELECT id, name, popularity, known_for_department, profile_path FROM person WHERE name ILIKE $1 ORDER BY popularity DESC LIMIT 5",
      [`%${text}%`]
    );

    res.status(200).json({
      movies: movieQuery.rows,
      cast: castQuery.rows
    });

  } catch (error) {
    console.error("Error fetching movie or cast:", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
});

app.get("/getMovieShowDetails", async (req, res) => {
  try {
    const { id } = req.query;
    const movieOrShowQuery = await pool.query(
      "SELECT * FROM movies_shows WHERE id = $1",
      [id]
    );
    if(movieOrShowQuery.rows.length === 0){
      return res.status(404).json({message: "Movie or Show not found"});
    }
    const countryQuery = await pool.query(
      "SELECT english_name FROM countries WHERE iso_3166_1 = $1",
      [movieOrShowQuery.rows[0].origin_country]
    );
    const LanguageQuery = await pool.query(
      "SELECT english_name FROM languages WHERE iso_639_1 = $1",
      [movieOrShowQuery.rows[0].original_language]
    );
    const genreQuery = await pool.query(
      "SELECT genres.id as genre_id, genre.name as genre_name FROM movies_shows_genres join genres on genre.id=movies_shows_genres.genre_id WHERE id = $1",
      [id]
    ); 
    const productionQuery = await pool.query(
      "SELECT production_companies.name FROM production_companies join movies_shows_production_company on production_companies.id = movies_shows_production_company.production_company_id WHERE movies_shows_production_company.id = $1",
      [id]
    );
    const castQuery = await pool.query(
      "SELECT person.id, name, character profile_path FROM person JOIN cast_movies_shows ON person.id = cast_movies_shows.person_id WHERE movie_cast.movie_id = $1",
      [id]
    );
    const crewQuery = await pool.query(
      "SELECT person.id, name, department_name, job_title, profile_path FROM person JOIN movie_cast ON person.id = crew_movies_shows.person_id WHERE movies_crew.movie_id = $1",
      [id]
    );
    if(movieOrShowQuery.rows[0].category === "movie"){
      const collectionQuery = await pool.query(
        "SELECT name FROM collections WHERE collection_id = $1",
        [movieOrShowQuery.rows[0].belongs_to_collection]
      );
      const movieQuery = await pool.query(
        "SELECT * FROM movies_shows WHERE collection_id = $1",
        [id]
      ); 
      res.status(200).json({
        moviesOrShow: movieOrShowQuery.rows[0],
        country: countryQuery.rows[0],
        language: LanguageQuery.rows[0],
        genres: genreQuery.rows,
        production: productionQuery.rows,
        cast: castQuery.rows,
        crew: crewQuery.rows,
        collection: collectionQuery.rows,
        movieDetails: movieQuery.rows
      });
    }
    else {
      const episodeQuery = await pool.query(
        "SELECT * FROM episodes WHERE show_id = $1",
        [id]
      );
      const seasonQuery = await pool.query(
        "SELECT * FROM seasons WHERE show_id = $1",
        [id]
      );
      const showQuery = await pool.query(
        "SELECT * FROM showDetails WHERE id = $1",
        [id]
      );
      res.status(200).json({
        moviesOrShow: movieOrShowQuery.rows[0],
        country: countryQuery.rows[0],
        language: LanguageQuery.rows[0],
        genres: genreQuery.rows,
        production: productionQuery.rows,
        cast: castQuery.rows,
        crew: crewQuery.rows,
        episode: episodeQuery.rows,
        season: seasonQuery.rows,
        showDetails: showQuery.rows
      });
    }
  } catch (error) {
    console.error("Error fetching movie or cast:", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
}
);

app.get("/getPersonDetails", async (req, res) => {
  try {
    const { id } = req.query;
    const personQuery = await pool.query(
      "SELECT * FROM person WHERE id = $1",
      [id]
    );
    if(personQuery.rows.length === 0){
      return res.status(404).json({message: "Person not found"});
    }
    const moviesShowsCastQuery = await pool.query(
      "SELECT movies_shows.id, title, category, poster_path, release_date,end_date,character, vote_average FROM movies_shows JOIN cast_movies_shows ON movies_shows.id = cast_movies_shows.movie_id WHERE cast_movies_shows.person_id = $1 order by popularity desc",
      [id]
    );
    const moviesShowsCrewQuery = await pool.query(
      "SELECT movies_shows.id, title, category, poster_path, release_date,end_date,job_title, vote_average FROM movies_shows JOIN crew_movies_shows ON movies_shows.id = crew_movies_shows.movie_id WHERE crew_movies_shows.person_id = $1 order by popularity desc",
      [id]
    );
    res.status(200).json({
      person: personQuery.rows[0],
      cast : moviesShowsCastQuery.rows,
      crew : moviesShowsCrewQuery.rows
    });
  } catch (error) {
    console.error("Error fetching movie or cast:", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
});
app.get("/getMovieShowByGenreId", async (req, res) => {
  try {
    const { genre_id } = req.query;
    const movieOrShowQuery = await pool.query(
      "SELECT id, title, category, poster_path, release_date, vote_average FROM movies_shows WHERE id IN (SELECT movie_id FROM movies_shows_genres WHERE genre_id = $1) ORDER BY popularity DESC, vote_average",
      [genre_id]
    );
    const genreQuery = await pool.query(
      "SELECT name FROM genres WHERE id = $1",
      [genre_id]
    );
    res.status(200).json({
      moviesOrShow: movieOrShowQuery.rows,
      genre: genreQuery.rows[0]
    });
  } catch (error) {
    console.error("Error fetching movie or cast:", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
});
app.get("/getMovieShowByCollectionId", async (req, res) => {
  try {
    const { collection_id } = req.query;
    const movieOrShowQuery = await pool.query(
      "SELECT id, title, category, poster_path, release_date, vote_average FROM movies_shows WHERE collection_id = $1 ORDER BY popularity DESC, vote_average",
      [collection_id]
    );
    const collectionQuery = await pool.query(
      "SELECT name FROM collections WHERE collection_id = $1",
      [collection_id]
    );
    res.status(200).json({
      moviesOrShow: movieOrShowQuery.rows,
      collection: collectionQuery.rows[0]
    });
  } catch (error) {
    console.error("Error fetching movie or cast:", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
});
app.get("/getMovieByPopularity", async (req, res) => {
  try {
    const movieQuery = await pool.query(
      "SELECT id, title, category, poster_path, release_date, vote_average FROM movies_shows WHERE category = 'movie' ORDER BY popularity DESC, vote_average DESC"
    );
    res.status(200).json({
      movies: movieQuery.rows
    });
  } catch (error) {
    console.error("Error fetching movies :", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
});
app.get("/getShowsByPopularity", async (req, res) => {
  try {
    const ShowQuery = await pool.query(
      "SELECT id, title, category, poster_path, release_date, vote_average FROM movies_shows WHERE category = 'tv' ORDER BY popularity DESC, vote_average DESC"
    );
    res.status(200).json({
      Shows : ShowQuery.rows
    });
  } catch (error) {
    console.error("Error fetching shows: ", error);
    res.status(500).json({ message: "Error getting shows details" });
  }
});
////////////////////////////////////////////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});