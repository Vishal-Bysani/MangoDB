const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require("uuid");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Pool } = require("pg");
const config = require('./config');
const cron = require('node-cron');
const { spawn } = require("child_process");
const { title } = require("process");
const app = express();
const port = 4000;
// PostgreSQL connection

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email,
    pass: config.pass,
  },
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
    cookie: { httpOnly: true, maxAge: config.SESSION_EXPIRY }, // 1 hour
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
    const token = jwt.sign({email: email}, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRY});
    const url = `${config.BASE_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Verify your email for MangoDB",
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
    });
    
    console.log("Email sent successfully:", result.rows[0]);
    res.status(200).json({message: "Email sent successfully", mail_sent : true});
  }
  catch (error){
    console.error("Error signing up:", error);
    res.status(500).json({message: "Error signing up", mail_sent : false});
  }
});

cron.schedule('*/1 * * * *', async () => {
  try {
    await pool.query("DELETE FROM users WHERE is_authenticated = false AND registration_time < NOW() - INTERVAL {$1}", [config.JWT_EXPIRY]);
    console.log("Deleted unverified users older than {$1}", [config.JWT_EXPIRY]);
  } catch (error) {
    console.error("Error sending reminder email:", error);
  }
});

app.get("/verify-email", async (req, res) => {
  console.log("Received email verification request:", req.query);
  try {
    const {token} = req.query;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    const {email} = jwt.verify(token, config.JWT_SECRET);
    const result = await pool.query("UPDATE users SET is_authenticated = true WHERE email = $1", [email]);
    if (result.rowCount === 0) {
      return res.status(400).send(
        `<html>
          <head>
            <title>Oops!</title>
          </head>
          <body style="text-align: center; font-family: Arial, sans-serif, padding-top :100px;">
            <h1>⚠️ Invalid or Expired Link</h1>
            <p>Please try signing up again or request a new verification link.</p>
          </body>
        </html>`
      );
    }

    const user = await pool.query("SELECT username FROM users WHERE email = $1", [email]);
    req.session.username = user.rows[0].username;
    req.session.email = email;

    res.status(200).send(
      `<html>
        <head>
          <title>Email Verified</title>
        </head>
        <body style="text-align: center; font-family: Arial, sans-serif, padding-top :100px;">
          <h1>Email Verified Successfully 🎉</h1>
          <p>Thank you for verifying your email. You can now log in to your account and enjoy the website.</p>
        </body>
      </html>`
    )
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(400).send(
      `<html>
        <head>
          <title>Oops!</title>
        </head>
        <body style="text-align: center; font-family: Arial, sans-serif, padding-top :100px;">
          <h1>⚠️ Invalid or Expired Link</h1>
          <p>Please try signing up again or request a new verification link.</p>
        </body>
      </html>`
    )
  };
});

// return JSON object with the following fields: {email, password}
app.post("/login",  async (req, res) => {
  try{
    const {user, password} = req.body;
    let user_row;
    if(user.includes("@")){
      user_row = await pool.query("SELECT * FROM users WHERE email = $1 AND is_authenticated = true", [user]);
    }
    else{
      user_row = await pool.query("SELECT * FROM users WHERE username = $1 AND is_authenticated = true", [user]);
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
      "SELECT id, title, category as type,rotten_mangoes, rotten_mangoes_votes, poster_path as image, EXTRACT(YEAR FROM release_date) as \"startYear\", EXTRACT(YEAR FROM end_date) as \"endYear\", vote_average as rating FROM movies_shows WHERE title ILIKE $1 ORDER BY popularity DESC, vote_average DESC LIMIT 20",
      [`%${text}%`]
    );

    const castQuery = await pool.query(
      "SELECT id, name as title, popularity, known_for_department as role, profile_path as image FROM person WHERE name ILIKE $1 ORDER BY popularity DESC LIMIT 10",
      [`%${text}%`]
    );

    const bookQuery = await pool.query(
      "SELECT id, title, author, average_rating,ratings_count, cover_url as image FROM books WHERE title ILIKE $1 ORDER BY popularity DESC LIMIT 10",
      [`%${text}%`]
    );

    res.status(200).json(movieQuery.rows.concat(castQuery.rows).concat(bookQuery.rows));
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
      "SELECT id, title,rotten_mangoes,rotten_mangoes_votes, category, poster_path, release_date, vote_average FROM movies_shows WHERE title ILIKE $1 ORDER BY popularity DESC, vote_average DESC",
      [`%${text}%`]
    );

    const castQuery = await pool.query(
      "SELECT id, name, popularity, known_for_department, profile_path FROM person WHERE name ILIKE $1 ORDER BY popularity DESC",
      [`%${text}%`]
    );
    const bookQuery = await pool.query(
      "SELECT id, title, author, average_rating,ratings_count, cover_url as image FROM books WHERE title ILIKE $1 ORDER BY popularity DESC LIMIT 10",
      [`%${text}%`]
    );

    res.status(200).json({
      movies: movieQuery.rows.slice(offset, offset + limit),
      cast: castQuery.rows.slice(offset, offset + limit),
      books : bookQuery.rows.slice(offset, offset + limit)
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
      "SELECT id, title, rotten_mangoes, rotten_mangoes_votes, category as type, poster_path as image, backdrop_path as backdrop, EXTRACT(YEAR FROM release_date) as \"startYear\", EXTRACT(YEAR FROM end_date) as \"endYear\", vote_average as rating, vote_count as \"numRating\", popularity, overview as description, origin_country FROM movies_shows WHERE id = $1",
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
    const videoQuery = await pool.query(
      "SELECT video_path as video, type FROM movies_shows JOIN movies_shows_videos ON movies_shows.id = movies_shows_videos.id WHERE movies_shows.id = $1",
      [id]
    );
    const favouriteQuery = await pool.query(
      "SELECT * FROM favourites WHERE username = $1 AND id = $2",
      [req.session.username, id]
    );
    const ratingQuery = await pool.query(
      "SELECT rating FROM movies_shows_reviews_ratings WHERE username = $1 AND id = $2",
      [req.session.username, id]
    );
    const reviewQuery = await pool.query(
      "SELECT username, rating, review as text FROM movies_shows_reviews_ratings WHERE id = $1",
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
        rotten_mangoes: movieOrShowQuery.rows[0].rotten_mangoes,
        rotten_mangoes_votes: movieOrShowQuery.rows[0].rotten_mangoes_votes,
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
        video: videoQuery.rows,
        backdrop: movieOrShowQuery.rows[0].backdrop,
        favourite: favouriteQuery.rows.length > 0,
        user_rating: ratingQuery.rows.length > 0 ? ratingQuery.rows[0].rating : null,
        reviews: reviewQuery.rows
      });
    }
    else {
      const episodeQuery = await pool.query(
        "SELECT COUNT(*) as count FROM episodes WHERE show_id = $1",
        [id]
      );
      const seasonQuery = await pool.query(
        "SELECT * FROM seasons WHERE show_id = $1",
        [id]
      );
      console.log("Received show details: " + JSON.stringify(movieOrShowQuery.rows[0]));
      res.status(200).json({
        id: movieOrShowQuery.rows[0].id,
        rotten_mangoes: movieOrShowQuery.rows[0].rotten_mangoes,
        rotten_mangoes_votes: movieOrShowQuery.rows[0].rotten_mangoes_votes,
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
        country: countryQuery.rows[0].english_name,
        language: LanguageQuery.rows[0],
        tags: genreQuery.rows,
        productionCompany: productionQuery.rows,
        cast: castQuery.rows,
        crew: crewQuery.rows,
        episodes: episodeQuery.rows[0].count,
        seasons: seasonQuery.rows,
        video: videoQuery.rows,
        backdrop: movieOrShowQuery.rows[0].backdrop,
        favourite: favouriteQuery.rows.length > 0,
        user_rating: ratingQuery.rows.length > 0 ? ratingQuery.rows[0].rating : null,
        reviews: reviewQuery.rows
      });
    }
  } catch (error) {
    console.error("Error fetching movie or cast:", error);
    res.status(500).json({ message: "Error getting movie details" });
  }
}
);

app.get("/getSeasonDetails", async (req, res) => {
  try {
    const {show_id, season_id} = req.query;
    const seasonQuery = await pool.query("SELECT * FROM seasons WHERE show_id = $1 AND id = $2", [show_id, season_id]);
    const season_videos = await pool.query("SELECT * FROM seasons_videos WHERE id = $1", [season_id]);
    if(seasonQuery.rows.length === 0){
      return res.status(400).json({message: "Season not found"});
    }
    const episodeQuery = await pool.query("SELECT * FROM episodes WHERE show_id = $1 AND season_id = $2 ORDER BY episode_number", [show_id, season_id]);
    
    const response = {
      season_id: seasonQuery.rows[0].id,
      season_number: seasonQuery.rows[0].season_number,
      season_name: seasonQuery.rows[0].name,
      season_overview: seasonQuery.rows[0].overview,
      season_air_date: seasonQuery.rows[0].air_date,
      season_poster_path: seasonQuery.rows[0].poster_path,
      season_episode_count: seasonQuery.rows[0].episode_count,
      season_vote_average: seasonQuery.rows[0].vote_average,
      season_videos: season_videos.rows
    };

    if (episodeQuery.rows.length > 0) {
      response.episodes = episodeQuery.rows.map((ep) => ({
        id: ep.id,
        episode_number: ep.episode_number,
        name: ep.name,
        overview: ep.overview,
        air_date: ep.air_date,
        still_path: ep.still_path,
        vote_average: ep.vote_average,
        vote_count: ep.vote_count,
        runtime : ep.runtime
      }));
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching season details:", error);
    res.status(500).json({ message: "Error getting season details" });
  }
});

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
    const moviesShowsQuery = await pool.query(
      "(SELECT movies_shows.id, title, category, poster_path as image, EXTRACT(YEAR FROM release_date) as \"startYear\", EXTRACT(YEAR FROM end_date) as \"endYear\", vote_average as rating FROM movies_shows JOIN cast_movies_shows ON movies_shows.id = cast_movies_shows.id WHERE cast_movies_shows.person_id = $1 order by popularity desc) UNION DISTINCT (SELECT movies_shows.id, title, category, poster_path as image, EXTRACT(YEAR FROM release_date) as \"startYear\", EXTRACT(YEAR FROM end_date) as \"endYear\", vote_average as rating FROM movies_shows JOIN crew_movies_shows ON movies_shows.id = crew_movies_shows.id WHERE crew_movies_shows.person_id = $1 order by popularity desc)",
      [id]
    );
    const distinctRoles = await pool.query(
      "SELECT DISTINCT job_title as role FROM movies_shows JOIN crew_movies_shows ON movies_shows.id = crew_movies_shows.id WHERE crew_movies_shows.person_id = $1",
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
      knownFor : moviesShowsQuery.rows,
      roles : distinctRoles.rows.map(role => role.role).concat(personQuery.rows[0].known_for_department),
      gender: personQuery.rows[0].gender,
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
      "SELECT id, title, category, rotten_mangoes, rotten_mangoes_votes, poster_path, release_date, vote_average FROM movies_shows JOIN movies_details ON movies_shows.id = movies_details.id WHERE belongs_to_collection = $1 ORDER BY release_date",
      [collection_id]
    );
    const collectionQuery = await pool.query(
      "SELECT name, overview, poster_path FROM collections WHERE id = $1",
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

app.get("/getMoviesByPopularity", async (req, res) => {
  try {
    const {pageNo, pageLimit} = req.query;
    const page = parseInt(pageNo);
    const limit = parseInt(pageLimit);
    const offset = (page - 1) * limit; 

    const movieQuery = await pool.query(
      "SELECT id, title, category, poster_path as image, EXTRACT(YEAR FROM release_date) as year, vote_average as rating FROM movies_shows WHERE category = 'movie' ORDER BY popularity DESC, rating DESC"
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
      "SELECT id, title, category, poster_path AS image, EXTRACT(YEAR FROM release_date) as year, vote_average as rating FROM movies_shows WHERE category = 'tv' ORDER BY popularity DESC, rating DESC"
    );
    res.status(200).json({
      shows : ShowQuery.rows.slice(offset, offset + limit)
    });
  } catch (error) {
    console.error("Error fetching shows: ", error);
    res.status(500).json({ message: "Error getting shows details" });
  }
});

app.get("/getBooksByPopularity", async (req, res) => {
  try {
    const {pageNo, pageLimit} = req.query;
    const page = parseInt(pageNo);
    const limit = parseInt(pageLimit);
    const offset = (page - 1) * limit;

    const BookQuery = await pool.query(
      "SELECT id, title, publisher,published_date, page_count, cover_url AS image, average_rating, maturity_rating as rating FROM books ORDER BY popularity DESC, rating DESC"
    );
    res.status(200).json({
      books : BookQuery.rows.slice(offset, offset + limit)
    });
  } catch (error) {
    console.error("Error fetching books: ", error);
    res.status(500).json({ message: "Error getting books details" });
  }
});

app.get("/filterItems", async (req, res) => {
  try {
    const {
      searchText,
      personId,
      genreId,
      year,
      minRating,
      orderByRating,
      orderByPopularity,
      forMovie,
      forShow,
      pageNo = 1,
      pageLimit = 10,
    } = req.query;

    const page = parseInt(pageNo);
    const limit = parseInt(pageLimit);
    const offset = (page - 1) * limit;

    let baseQuery = "SELECT DISTINCT ms.id, ms.title, ms.category, ms.poster_path as image, ms.rotten_mangoes, ms.rotten_mangoes_votes, EXTRACT(YEAR FROM ms.release_date) as \"startYear\", EXTRACT(YEAR FROM ms.end_date) as \"endYear\", ms.vote_average as rating, ms.popularity, ms.overview as description FROM movies_shows ms";

    let conditions = [];
    let values = [];
    let idx = 1;

    if (genreId) {
      let genreName = await pool.query(
        "SELECT name FROM genres WHERE id = $1",
        [parseInt(genreId)]
      );
      genreName = genreName.rows[0].name;
      baseQuery += ` JOIN movies_shows_genres msg ON ms.id = msg.id`;
      baseQuery += ` JOIN genres g ON msg.genre_id = g.id`;
      conditions.push(`(msg.genre_id = $${idx++} OR g.name ILIKE $${idx++} OR $${idx++} ILIKE '%' || g.name || '%')`);
      values.push(parseInt(genreId));
      values.push(`%${genreName}%`);
      values.push(`${genreName}`);
    }

    if (personId) {
      baseQuery += ` JOIN crew_movies_shows msc ON ms.id = msc.id`;
      conditions.push(`msc.person_id = $${idx++}`);
      values.push(parseInt(personId));

      baseQuery += ` JOIN cast_movies_shows cmv ON ms.id = cmv.id`;
      conditions.push(`cmv.person_id = $${idx++}`);
      values.push(parseInt(personId));
    }

    if (year) {
      conditions.push(`EXTRACT(YEAR FROM ms.release_date) = $${idx++}`);
      values.push(parseInt(year));
    }

    if (minRating) {
      conditions.push(`ms.vote_average >= $${idx++}`);
      values.push(parseFloat(minRating));
    }

    if (forMovie && forShow) {
      conditions.push(`(ms.category = 'movie' OR ms.category = 'tv')`);
    } else if (forMovie) {
      conditions.push(`ms.category = 'movie'`);
    } else if (forShow) {
      conditions.push(`ms.category = 'tv'`);
    }

    if (searchText) {
      conditions.push(`ms.title ILIKE $${idx++}`);
      values.push(`%${searchText}%`);
    }

    if (conditions.length) {
      baseQuery += ` WHERE ` + conditions.join(" AND ");
    }

    const orderConditions = [];
    if (orderByPopularity) orderConditions.push(`ms.popularity DESC`);
    if (orderByRating) orderConditions.push(`ms.vote_average DESC`);
    if (!orderConditions.length) orderConditions.push(`ms.popularity DESC`);

    baseQuery += ` ORDER BY ${orderConditions.join(", ")}`;

    baseQuery += ` LIMIT $${idx++} OFFSET $${idx++}`;
    values.push(limit, offset);
    
    const movies = await pool.query(baseQuery, values);
    const items = await Promise.all(movies.rows.map(async (movie) => {
      const castResult = await pool.query(
        "SELECT character, person.name FROM cast_movies_shows JOIN person ON cast_movies_shows.person_id = person.id WHERE cast_movies_shows.id = $1",
        [movie.id]
      );
      const crewResult = await pool.query(
        "SELECT job_title, person.name FROM crew_movies_shows JOIN person ON crew_movies_shows.person_id = person.id WHERE crew_movies_shows.id = $1",
        [movie.id]
      );
      return {
        ...movie,
        cast : castResult.rows,
        crew : crewResult.rows
      }
    }));

    res.status(200).json({
        items
    })
  } catch (error) {
    console.error("Error fetching filtered items:", error);
    res.status(500).json({ message: "Error getting movie/show details" });
  }
});

app.get("/listGenres", async (req, res) => {
  try {
    const genreQuery = await pool.query(
      "SELECT id, name FROM genres ORDER BY name"
    );
    res.status(200).json(genreQuery.rows);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ message: "Error getting genres" });
  }
});

app.get("/matchingPersons", async (req, res) => {
  try {
    const { searchText, searchLimit } = req.query;
    const personQuery = await pool.query(
      "SELECT id, name, popularity, profile_path, known_for_department as image FROM person WHERE name ILIKE $1 ORDER BY popularity DESC LIMIT $2",
      [`${searchText}%`, searchLimit]
    );
    res.status(200).json(personQuery.rows);
  } catch (error) {
    console.error("Error fetching persons:", error);
    res.status(500).json({ message: "Error getting persons" });
  }
});

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
    const username = req.session.username;
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

app.get("/getFavourites", isAuthenticated, async (req, res) => {
  try {
    const username = req.session.username;
    const favouritesQuery = await pool.query(
      "SELECT movies_shows.id, title, category, poster_path as image FROM movies_shows JOIN favourites ON movies_shows.id = favourites.id WHERE favourites.username = $1",
      [username]
    );
    res.status(200).json(favouritesQuery.rows);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ message: "Error getting favourites" });
  }
});

app.post("/addToFavourites", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.query;
    const username = req.session.username;
    const addToFavouritesQuery = await pool.query(
      "INSERT INTO favourites (username, id) VALUES ($1, $2)",
      [username, id]
    );
    res.status(200).json({message: "Added to favourites"});
  } catch (error) {
    console.error("Error adding to favourites:", error);
    res.status(500).json({ message: "Error adding to favourites" });
  }
});

app.post("/removeFromFavourites", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.query;
    const username = req.session.username;
    const removeFromFavouritesQuery = await pool.query(
      "DELETE FROM favourites WHERE username = $1 AND id = $2",
      [username, id]
    );
    res.status(200).json({message: "Removed from favourites"});
  } catch (error) {
    console.error("Error removing from favourites:", error);
    res.status(500).json({ message: "Error removing from favourites" });
  }
});

app.get("/getWatchlist", isAuthenticated, async (req, res) => {
  try {
    const username = req.session.username;
    const watchlistQuery = await pool.query(
      "SELECT movies_shows.id, title, category, poster_path as image FROM movies_shows JOIN watchlist ON movies_shows.id = watchlist.id WHERE watchlist.username = $1",
      [username]
    );
    res.status(200).json(watchlistQuery.rows);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ message: "Error getting watchlist" });
  }
});

app.post("/addToWatchlist", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.query;
    const username = req.session.username;
    const addToWatchlistQuery = await pool.query(
      "INSERT INTO watchlist (username, id) VALUES ($1, $2)",
      [username, id]
    );
    res.status(200).json({message: "Added to watchlist"});
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    res.status(500).json({ message: "Error adding to watchlist" });
  }
});

app.post("/removeFromWatchlist", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.query;
    const username = req.session.username;
    const removeFromWatchlistQuery = await pool.query(
      "DELETE FROM watchlist WHERE username = $1 AND id = $2",
      [username, id]
    );
    res.status(200).json({message: "Removed from watchlist"});
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    res.status(500).json({ message: "Error removing from watchlist" });
  }
});

app.get("/getWatchedList", isAuthenticated, async (req, res) => {
  try {
    const username = req.session.username;
    const watchedListQuery = await pool.query(
      "SELECT movies_shows.id, title, category, poster_path as image FROM movies_shows JOIN watchedlist ON movies_shows.id = watchedlist.id WHERE watchedlist.username = $1",
      [username]
    );
    res.status(200).json(watchedListQuery.rows);
  } catch (error) {
    console.error("Error fetching watched list:", error);
    res.status(500).json({ message: "Error getting watched list" });
  }
});

app.post("/addToWatchedList", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.query;
    const username = req.session.username;
    await pool.query('BEGIN');
    const addToWatchedListQuery = await pool.query(
      "INSERT INTO watchedlist (username, id) VALUES ($1, $2)",
      [username, id]
    );
    await pool.query(
      "DELETE FROM watchlist WHERE username = $1 AND id = $2",
      [username, id]
    );
    await pool.query('COMMIT');
    res.status(200).json({message: "Added to watched list"});
  } catch (error) {
    console.error("Error adding to watched list:", error);
    res.status(500).json({ message: "Error adding to watched list" });
  }
});

app.post("/removeFromWatchedList", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.query;
    const username = req.session.username;
    const removeFromWatchedListQuery = await pool.query(
      "DELETE FROM watchedlist WHERE username = $1 AND id = $2",
      [username, id]
    );
    res.status(200).json({message: "Removed from watched list"});
  } catch (error) {
    console.error("Error removing from watched list:", error);
    res.status(500).json({ message: "Error removing from watched list" });
  }
});

app.get("/getFollowers", isAuthenticated, async (req, res) => {
  try {
    const username = req.session.username;
    const followersQuery = await pool.query(
      "SELECT * FROM following WHERE followed_username = $1",
      [username]
    );
    res.status(200).json(followersQuery.rows);
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ message: "Error getting followers" });
  }
});

app.get("/getFollowing", isAuthenticated, async (req, res) => {
  try {
    const username = req.session.username;
    const followingQuery = await pool.query(
      "SELECT * FROM following WHERE username = $1",
      [username]
    );
    res.status(200).json(followingQuery.rows);
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json({ message: "Error getting following" });
  }
});

app.post("/followUser", isAuthenticated, async (req, res) => {
  try {
    const { followed_username } = req.query;
    const username = req.session.username;
    const followUserQuery = await pool.query(
      "INSERT INTO following (username, followed_username) VALUES ($1, $2)",
      [username, followed_username]
    );
    res.status(200).json({message: "Followed user"});
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Error following user" });
  }
});

app.get("/getUserDetails", async (req, res) => {
  try {
    const username = req.query.username;
    const joinDateQuery = await pool.query(
      "SELECT DATE(registration_time) AS \"joinDate\" FROM users WHERE username = $1",
      [username]
    );
    const favouritesQuery = await pool.query(
      "SELECT movies_shows.id, title, category, poster_path as image FROM movies_shows JOIN favourites ON movies_shows.id = favourites.id WHERE favourites.username = $1",
      [username]
    );
    const watchlistQuery = await pool.query(
      "SELECT movies_shows.id, title, category, poster_path as image FROM movies_shows JOIN watchlist ON movies_shows.id = watchlist.id WHERE watchlist.username = $1",
      [username]
    );
    const watchedListQuery = await pool.query(
      "SELECT movies_shows.id, title, category, poster_path as image FROM movies_shows JOIN watchedlist ON movies_shows.id = watchedlist.id WHERE watchedlist.username = $1",
      [username]
    );
    const followersQuery = await pool.query(
      "SELECT username FROM following WHERE followed_username = $1",
      [username]
    );
    const followingQuery = await pool.query(
      "SELECT followed_username as username FROM following WHERE following.username = $1",
      [username]
    );
    res.status(200).json({
      joinDate: joinDateQuery.rows[0].joinDate.toISOString().split('T')[0],
      favourites: favouritesQuery.rows,
      watchlist: watchlistQuery.rows,
      watchedList: watchedListQuery.rows,
      followers: followersQuery.rows,
      following: followingQuery.rows
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Error getting user details" });
  }
});
app.get("/getBooksDetails", async (req, res) => {
  try {
    const { id } = req.query;
    const bookQuery = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [id]
    );
    const authorQuery = await pool.query(
      "SELECT authors.name from authors_books join authors on authors.author_id = author_books.author_id WHERE authors_books.id = $1",
      [id]
    );
    const genreQuery = await pool.query(
      "SELECT books_categories.name FROM books_genres join books_categories on books_categories.id = books_genres.genre_id WHERE books_genres.id = $1",
      [id]
    );
    const collectionQuery = await pool.query(
      "SELECT name FROM books_collections WHERE id = $1",
      [bookQuery.rows[0].collection_id]
    );
    const similarbookQuery = await pool.query(
      "SELECT id, title, cover_url ,maturity_rating, average_rating FROM books WHERE author_id = $1 ORDER BY published_date",
      [author_id]
    );
    if(bookQuery.rows.length === 0){
      return res.status(400).json({message: "Book not found"});
    }
    res.status(200).json({
      title : bookQuery.rows[0].title,
      publisher : bookQuery.rows[0].publisher,
      published_date : bookQuery.rows[0].published_date,
      page_count : bookQuery.rows[0].page_count,
      vote_average : bookQuery.rows[0].average_rating,
      vote_count : bookQuery.rows[0].ratings_count,
      overview : bookQuery.rows[0].overview,
      maturity_rating : bookQuery.rows[0].maturity_rating,
      authors : authorQuery.rows,
      genres : genreQuery.rows,
      collection : collectionQuery.rows[0],
      similarbookQuery : similarbookQuery.rows,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Error getting book details" });
  }
});
app.get("/getBooksByAuthorId", async (req, res) => {
  try {
    const { author_id, pageNo, pageLimit } = req.query;
    const page = parseInt(pageNo);
    const limit = parseInt(pageLimit);
    const offset = (page - 1) * limit;

    const bookQuery = await pool.query(
      "SELECT id, title, publisher, published_date, page_count, category, poster_path,maturity_rating release_date, average_rating, ratings_count, overview, preview_link FROM books WHERE author_id = $1 ORDER BY published_date",
      [author_id]
    );
    res.status(200).json(bookQuery.rows.slice(offset, offset + limit));
  } catch (error) {
    console.error("Error fetching book details :", error);
    res.status(500).json({ message: "Error getting book details" });
  }
});

////////////////////////////////////////////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});