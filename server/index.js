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

app.get("/getMovieDetails", async (req, res) => {
  try {
    const { movieId } = req.query;
    const result = await pool.query("SELECT * FROM movies WHERE movie_id = $1", [movieId]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error getting movie details" });
  }
});

////////////////////////////////////////////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});