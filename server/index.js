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
  user: 'atharva',
  host: 'localhost',
  database: 'atharva',
  password: 'atharva',
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
  if(req.session.username){
    next();
  }
  else{
    res.status(400).json({message:"Unauthorized"})
  }
}

// return JSON object with the following fields: {username, email, password}
app.post('/signup', async (req, res) => {
  try{
    const {username, password, email} = req.body;
    console.log("Received signup request:", req.body);
    const user_rows = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if(user_rows.rows.length > 0){
      return res.status(400).json({message: "Error: Email is already registered."});
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING username,email", [username, email, hashPassword]);
    req.session.email = result.rows[0].email;
    req.session.username = result.rows[0].username;
    console.log("User registered successfully:", result.rows[0]);
    res.status(200).json({message: "User Registered Successfully"});
  }
  catch (error){
    console.error("Error signing up:", error);
    res.status(500).json({message: "Error signing up"});
  }
});

// return JSON object with the following fields: {email, password}
app.post("/login",  async (req, res) => {
  try{
    const {user, password} = req.body;
    let user_row;
    if(user.includes("@")){
      user_row = await pool.query("SELECT * FROM users WHERE email = $1", [user]);
    }
    else{
      user_row = await pool.query("SELECT * FROM users WHERE username = $1", [user]);
    }
    // console.log("Received login request:", user_row.rows);
    if(user_row.rows.length === 0){
      return res.status(400).json({message: "Invalid Credentials"});
    } 
    const dbUser = user_row.rows[0];
    const valid = await bcrypt.compare(password, dbUser.password_hash);
    // console.log("Password comparison result:", valid);
    if(!valid){
      return res.status(400).json({message: "Invalid Credentials"});
    }
    req.session.email = dbUser.email;
    req.session.username = dbUser.username;
    // console.log("User logged in successfully:", req.session);
    res.status(200).json({message:"Login successful"});
  }
  catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({message: "Error logging in"});
  }
});


// Implement API used to check if the client is currently logged in or not.
app.get("/isLoggedIn", async (req, res) => {
  // console.log("Received isLoggedIn request:", req.session);
  if(req.session && req.session.username){
    const username = req.session.username;
    const email = req.session.email;
    res.status(200).json({loggedIn : true, username : username, email : email});
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

app.get("/getMatchingItem", async (req, res) => {
  try {
    const { text } = req.query;

    const movieQuery = await pool.query(
      "SELECT id, title, category as type, poster_path as image, EXTRACT(YEAR FROM release_date) as \"startYear\", NULL as \"endYear\", vote_average as rating FROM movies_shows WHERE title ILIKE $1 ORDER BY popularity DESC, vote_average DESC LIMIT 20",
      [`%${text}%`]
    );

    const castQuery = await pool.query(
      "SELECT id, name as title, popularity, known_for_department as role, profile_path as image FROM person WHERE name ILIKE $1 ORDER BY popularity DESC LIMIT 10",
      [`%${text}%`]
    );

    res.status(200).json(movieQuery.rows.concat(castQuery.rows));
  } catch (error) {
    console.error("Error fetching movie or cast:", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
});

app.get("/getMatchingItemPages", async (req, res) => {
  try {
    const { text, pageNo, pageLimit } = req.query;

    const page = parseInt(pageNo);
    const limit = parseInt(pageLimit);
    const offset = (page - 1) * limit;

    const movieQuery = await pool.query(
      "SELECT id, title, category, poster_path, release_date, vote_average FROM movies_shows WHERE title ILIKE $1 ORDER BY popularity DESC, vote_average DESC",
      [`%${text}%`]
    );

    const castQuery = await pool.query(
      "SELECT id, name, popularity, known_for_department, profile_path FROM person WHERE name ILIKE $1 ORDER BY popularity DESC",
      [`%${text}%`]
    );

    res.status(200).json({
      movies: movieQuery.rows.slice(offset, offset + limit),
      cast: castQuery.rows.slice(offset, offset + limit)
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
      "SELECT id, title, category as type, poster_path as image, EXTRACT(YEAR FROM release_date) as \"startYear\", EXTRACT(YEAR FROM end_date) as \"endYear\", vote_average as rating,vote_count as numRating, popularity, overview as description, origin_country FROM movies_shows WHERE id = $1",
      [id]
    );
    if(movieOrShowQuery.rows.length === 0){
      return res.status(400).json({message: "Movie or Show not found"});
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
      "SELECT genres.id as genre_id, genres.name as genre_name FROM movies_shows_genres join genres on genres.id=movies_shows_genres.genre_id WHERE movies_shows_genres.id = $1",
      [id]
    ); 
    const productionQuery = await pool.query(
      "SELECT production_companies.name FROM production_companies join movies_shows_production_company on production_companies.id = movies_shows_production_company.production_company_id WHERE movies_shows_production_company.id = $1",
      [id]
    );
    const castQuery = await pool.query(
      "SELECT person.id, name, character, profile_path AS image FROM person JOIN cast_movies_shows ON person.id = cast_movies_shows.person_id WHERE cast_movies_shows.id = $1 ORDER BY person.popularity DESC",
      [id]
    );
    const crewQuery = await pool.query(
      "SELECT person.id, name, department_name, job_title, profile_path AS image FROM person JOIN crew_movies_shows ON person.id = crew_movies_shows.person_id WHERE crew_movies_shows.id = $1 ORDER BY person.popularity DESC",
      [id]
    );
    if(movieOrShowQuery.rows[0].type === "movie"){
      const movieQuery = await pool.query(
        "SELECT runtime as duration,budget,revenue,belongs_to_collection FROM movies_details WHERE id = $1",
        [id]
      ); 
      const collectionQuery = await pool.query(
        "SELECT name FROM collections WHERE id = $1",
        [movieQuery.rows[0].belongs_to_collection]
      );
      res.status(200).json({
        id: movieOrShowQuery.rows[0].id,
        title: movieOrShowQuery.rows[0].title,
        type: movieOrShowQuery.rows[0].type,
        image: movieOrShowQuery.rows[0].image,
        startYear: movieOrShowQuery.rows[0].startYear,
        endYear: movieOrShowQuery.rows[0].endYear,
        rating: movieOrShowQuery.rows[0].rating,
        numRating: movieOrShowQuery.rows[0].numRating,
        popularity: movieOrShowQuery.rows[0].popularity,
        description: movieOrShowQuery.rows[0].description,
        user_rating: null,
        duration: movieQuery.rows[0].duration,
        budget: movieQuery.rows[0].budget,
        revenue: movieQuery.rows[0].revenue,
        country: countryQuery.rows[0].english_name,
        language: LanguageQuery.rows[0],
        tags: genreQuery.rows,
        productionCompany: productionQuery.rows,
        cast: castQuery.rows,
        crew: crewQuery.rows,
        collection: collectionQuery.rows[0],
        // movieDetails: movieQuery.rows[0]
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
        "SELECT * FROM shows_details WHERE id = $1",
        [id]
      );

      res.status(200).json({
        id: movieOrShowQuery.rows[0].id,
        title: movieOrShowQuery.rows[0].title,
        type: movieOrShowQuery.rows[0].type,
        image: movieOrShowQuery.rows[0].image,
        startYear: movieOrShowQuery.rows[0].startYear,
        endYear: movieOrShowQuery.rows[0].endYear,
        rating: movieOrShowQuery.rows[0].rating,
        numRating: movieOrShowQuery.rows[0].numRating,
        popularity: movieOrShowQuery.rows[0].popularity,
        description: movieOrShowQuery.rows[0].description,
        user_rating: null,
        country: countryQuery.rows[0],
        language: LanguageQuery.rows[0],
        tags: genreQuery.rows,
        productionCompany: productionQuery.rows,
        cast: castQuery.rows,
        crew: crewQuery.rows,
        episodes: episodeQuery.rows,
        seasons: seasonQuery.rows,
        showDetails: showQuery.rows[0]
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
      return res.status(400).json({message: "Person not found"});
    }
    const moviesShowsCastQuery = await pool.query(
      "SELECT movies_shows.id, title, category, poster_path, release_date,end_date,character, vote_average FROM movies_shows JOIN cast_movies_shows ON movies_shows.id = cast_movies_shows.id WHERE cast_movies_shows.person_id = $1 order by popularity desc",
      [id]
    );
    const moviesShowsCrewQuery = await pool.query(
      "SELECT movies_shows.id, title, category, poster_path, release_date,end_date,job_title, vote_average,department_name FROM movies_shows JOIN crew_movies_shows ON movies_shows.id = crew_movies_shows.id WHERE crew_movies_shows.person_id = $1 order by popularity desc",
      [id]
    );
    const distinctRoles = await pool.query(
      "SELECT DISTINCT job_title as role FROM movies_shows JOIN crew_movies_shows ON movies_shows.id = crew_movies_shows.id WHERE crew_movies_shows.person_id = $1 order by popularity desc",
      [id]
    );
    res.status(200).json({
      id: personQuery.rows[0].id,
      name: personQuery.rows[0].name,
      popularity: personQuery.rows[0].popularity,
      image: personQuery.rows[0].profile_path,
      description: personQuery.rows[0].biography,
      birthday: personQuery.rows[0].birthday,
      deathday: personQuery.rows[0].deathday,
      // person: personQuery.rows[0],
      cast : moviesShowsCastQuery.rows,
      crew : moviesShowsCrewQuery.rows,
      roles : distinctRoles.rows,
    });
  } catch (error) {
    console.error("Error fetching movie or cast:", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
});
app.get("/getMovieShowByGenreId", async (req, res) => {
  try {
    const { genre_id, pageNo, pageLimit } = req.query;
    const page = parseInt(pageNo);
    const limit = parseInt(pageLimit);
    const offset = (page - 1) * limit;

    const movieOrShowQuery = await pool.query(
      "SELECT id, title, category, poster_path, release_date, vote_average FROM movies_shows WHERE id IN (SELECT id FROM movies_shows_genres WHERE genre_id = $1) ORDER BY popularity DESC, vote_average",
      [genre_id]
    );
    const genreQuery = await pool.query(
      "SELECT name FROM genres WHERE id = $1",
      [genre_id]
    );
    res.status(200).json({
      moviesOrShow: movieOrShowQuery.rows.slice(offset, offset + limit),
      genre: genreQuery.rows[0]
    });
  } catch (error) {
    console.error("Error fetching movie or cast:", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
});
app.get("/getMovieShowByCollectionId", async (req, res) => {
  try {
    const { collection_id, pageNo, pageLimit } = req.query;
    const page = parseInt(pageNo);
    const limit = parseInt(pageLimit);
    const offset = (page - 1) * limit;

    const movieOrShowQuery = await pool.query(
      "SELECT id, title, category, poster_path, release_date, vote_average FROM movies_shows WHERE collection_id = $1 ORDER BY popularity DESC, vote_average",
      [collection_id]
    );
    const collectionQuery = await pool.query(
      "SELECT name FROM collections WHERE collection_id = $1",
      [collection_id]
    );
    res.status(200).json({
      moviesOrShow: movieOrShowQuery.rows.slice(offset, offset + limit),
      collection: collectionQuery.rows[0]
    });
  } catch (error) {
    console.error("Error fetching movie or cast:", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
});
app.get("/getMovieByPopularity", async (req, res) => {
  try {
    const {pageNo, pageLimit} = req.query;
    const page = parseInt(pageNo);
    const limit = parseInt(pageLimit);
    const offset = (page - 1) * limit;

    const movieQuery = await pool.query(
      "SELECT id, title, category, poster_path, release_date, vote_average FROM movies_shows WHERE category = 'movie' ORDER BY popularity DESC, vote_average DESC"
    );
    
    res.status(200).json({
      movies : movieQuery.rows.slice(offset, offset + limit)
    });
  } catch (error) {
    console.error("Error fetching movies :", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
});
app.get("/getShowsByPopularity", async (req, res) => {
  try {
    const {pageNo, pageLimit} = req.query;
    const page = parseInt(pageNo);
    const limit = parseInt(pageLimit);
    const offset = (page - 1) * limit;

    const ShowQuery = await pool.query(
      "SELECT id, title, category, poster_path, release_date, vote_average FROM movies_shows WHERE category = 'tv' ORDER BY popularity DESC, vote_average DESC"
    );
    res.status(200).json({
      Shows : ShowQuery.rows.slice(offset, offset + limit)
    });
  } catch (error) {
    console.error("Error fetching shows: ", error);
    res.status(500).json({ message: "Error getting shows details" });
  }
});

// app.post("/submitRating", isAuthenticated, async (req, res) => {
//   try {
//     const { id, rating } = req.query;
//     const username = req.session.username;
//     await pool.query(
//       "INSERT INTO movies_shows_reviews_ratings (username, id, rating) VALUES ($1, $2, $3)",
//       [username, id, rating]
//     );
//     await pool.query(
//       `UPDATE movies_shows
//       SET vote_average = ((vote_average * vote_count) + $1) / (vote_count + 1),
//           vote_count = vote_count + 1
//       WHERE id = $2`,
//       [rating, id]
//     );
//     res.status(200).json({
//       message: "Rating submitted successfully"
//     });
//   } catch (error) {
//     console.error("Error submitting rating:", error);
//     res.status(500).json({ message: "Error submitting rating" });
//   }
// });

// app.post("/submitEpisodeRating", isAuthenticated, async (req, res) => {
//   try {
//     const { id, rating } = req.query;
//     const username = req.session.username;
//     await pool.query(
//       "INSERT INTO episode_reviews_ratings (username, id, rating) VALUES ($1, $2, $3)",
//       [username, id, rating]
//     );
//     await pool.query(
//       `UPDATE episodes
//       SET vote_average = ((vote_average * vote_count) + $1) / (vote_count + 1),
//           vote_count = vote_count + 1
//       WHERE id = $2`,
//       [rating, id]
//     );
//     const seasonResult = await pool.query(
//       "SELECT season_id FROM episodes WHERE id = $1",
//       [id]
//     );
//     const season_id = seasonResult.rows[0].season_id;
//     await pool.query(
//       `UPDATE seasons
//       SET vote_average = (SELECT CASE WHEN SUM(vote_count) = 0 THEN 0 ELSE SUM(vote_average * vote_count) / SUM(vote_count) END FROM episodes WHERE season_id = $1),
//       WHERE id = $1`,
//       [season_id]
//     );
//     res.status(200).json({
//       message: "Rating submitted successfully"
//     });
//   } catch (error) {
//     console.error("Error submitting rating:", error);
//     res.status(500).json({ message: "Error submitting rating" });
//   }
// });

app.post("/submitRatingReview", isAuthenticated, async (req, res) => {
  try {
    const { id, rating, review } = req.query;
    const username = req.session.username;

    const ratingOrReviewExists = await pool.query(
      "SELECT * FROM movies_shows_reviews_ratings WHERE username = $1 AND id = $2",
      [username, id]
    );

    if(ratingOrReviewExists.rows.length > 0){
        await pool.query(
          `UPDATE movies_shows
          SET vote_average = ((vote_average * vote_count) - $1 + $2) / (vote_count),
              vote_count = vote_count
          WHERE id = $3`,
          [ratingOrReviewExists.rows[0].rating, rating, id]
        );
        await pool.query(
            "UPDATE movies_shows_reviews_ratings SET rating = $1, review = $2 WHERE username = $3 AND id = $4",
            [rating, review, username, id]
        );
    }
    else{
        await pool.query(
          `UPDATE movies_shows
          SET vote_average = ((vote_average * vote_count) + $1) / (vote_count + 1),
              vote_count = vote_count + 1
          WHERE id = $2`,
          [rating, id]
        );
      await pool.query(
          "INSERT INTO movies_shows_reviews_ratings (username, id, rating, review) VALUES ($1, $2, $3, $4)",
          [username, id, rating, review]
        );
    }
    res.status(200).json({
      message: "Review submitted successfully"
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Error submitting review" });
  }
});

app.post("/submitEpisodeRatingReview", isAuthenticated, async (req, res) => {
  try {
    const { id, rating, review } = req.query;
    const username = req.session.userId;
    const ratingOrReviewExists = await pool.query(
      "SELECT * FROM episode_reviews_ratings WHERE username = $1 AND id = $2",
      [username, id]
    );
    if(ratingOrReviewExists.rows.length > 0){
        await pool.query(
          `UPDATE episodes
          SET vote_average = ((vote_average * vote_count) - $1 + $2) / (vote_count),
              vote_count = vote_count
          WHERE id = $3`,
          [ratingOrReviewExists.rows[0].rating, rating, id]
        );
        await pool.query(
            "UPDATE episode_reviews_ratings SET rating = $1, review = $2 WHERE username = $3 AND id = $4",
            [rating, review, username, id]
        );
    }
    else{
        await pool.query(
          `UPDATE episodes
          SET vote_average = ((vote_average * vote_count) + $1) / (vote_count + 1),
              vote_count = vote_count + 1
          WHERE id = $2`,
          [rating, id]
        );
      await pool.query(
          "INSERT INTO episode_reviews_ratings (username, id, rating, review) VALUES ($1, $2, $3, $4)",
          [username, id, rating, review]
        );
    }
    res.status(200).json({
      message: "Review submitted successfully"
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Error submitting review" });
  }
});

////////////////////////////////////////////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});