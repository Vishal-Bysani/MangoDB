DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS movies_details CASCADE;
DROP TABLE IF EXISTS movies_shows_genres CASCADE;
DROP TABLE IF EXISTS movies_shows_spoken_languages CASCADE;
DROP TABLE IF EXISTS movies_shows_production_company CASCADE;
DROP TABLE IF EXISTS cast_movies_shows CASCADE;
DROP TABLE IF EXISTS crew_movies_shows CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS shows_details CASCADE;
DROP TABLE IF EXISTS person CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS production_companies CASCADE;
DROP TABLE IF EXISTS movies_shows CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS countries CASCADE;

CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_critic BOOLEAN DEFAULT FALSE,
    is_authenticated BOOLEAN DEFAULT FALSE,
    registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE IF NOT EXISTS favourites (
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,  -- User ID
    id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- Movie ID
    PRIMARY KEY (username, id)  -- Composite Primary Key
);

CREATE TABLE IF NOT EXISTS watchlist (
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,  -- User ID
    id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- Movie ID
    PRIMARY KEY (username, id)  -- Composite Primary Key
);

CREATE TABLE IF NOT EXISTS watchedlist (
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,  -- User ID
    id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- Movie ID
    PRIMARY KEY (username, id)  -- Composite Primary Key
);

CREATE TABLE IF NOT EXISTS following(
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,  -- User ID
    followed_username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,  -- Followed User ID
    PRIMARY KEY (username, followed_username)  -- Composite Primary Key
);


CREATE TABLE IF NOT EXISTS countries (
    iso_3166_1 TEXT NOT NULL PRIMARY KEY,
    english_name TEXT NOT NULL,
    native_name TEXT 
);

CREATE TABLE IF NOT EXISTS languages (
    iso_639_1 TEXT NOT NULL PRIMARY KEY,
    english_name TEXT NOT NULL,
    name TEXT 
);

CREATE TABLE IF NOT EXISTS departments (
    
    name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS jobs (
    department_name TEXT REFERENCES departments(name) ON DELETE CASCADE,
    title TEXT NOT NULL,
    PRIMARY KEY (department_name, title)  -- Correct way to define a composite primary key
);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
); 

CREATE TABLE IF NOT EXISTS collections (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    overview TEXT,
    poster_path TEXT,                        -- URL Path for Poster Image
    backdrop_path TEXT                        -- URL Path for Backdrop Image
);

CREATE TABLE IF NOT EXISTS production_companies (
    id SERIAL PRIMARY KEY,
    logo_path TEXT,                        -- URL Path for Logo Image
    name TEXT NOT NULL,
    origin_country TEXT REFERENCES countries(iso_3166_1) ON DELETE SET NULL  -- Country Code
);


CREATE TABLE IF NOT EXISTS movies_shows (
    tmdb_id INTEGER,
    id SERIAL PRIMARY KEY,                   -- Unique ID from TMDb
    title TEXT NOT NULL,                      -- Movie or TV Show Title
    original_title TEXT,                      -- Original Title
    original_language TEXT REFERENCES languages(iso_639_1) ON DELETE SET NULL,   -- Language Code (e.g., "en")
    overview TEXT,                             -- Description/Synopsis
    release_date DATE,                         -- Release Date (YYYY-MM-DD) or first air date for shows
    end_date DATE,                             -- End Date (YYYY-MM-DD) for shows
    category TEXT CHECK (category IN ('movie', 'tv')), -- Flag to differentiate movie/tv show
    popularity NUMERIC,                        -- Popularity Score
    vote_average NUMERIC,                      -- Average Rating
    vote_count INTEGER,                        -- Number of Votes
    adult INTEGER CHECK (adult in (0,1)) ,                             -- Flag for adult content
    backdrop_path TEXT,                        -- URL Path for Backdrop Image
    poster_path TEXT,                          -- URL Path for Poster Image
    tagline TEXT,                             -- Tagline
    status TEXT ,  -- Status
    origin_country TEXT REFERENCES countries(iso_3166_1) ON DELETE SET NULL,  -- Country Code
    iso_3166_1 TEXT,                -- Country Code
    certificate TEXT,               -- Certificate
    FOREIGN KEY (iso_3166_1, certificate) REFERENCES certifications(iso_3166_1, certificate) ON DELETE SET NULL,  -- Certificate
    rotten_mangoes INT CHECK (rotten_mangoes >= 0 AND rotten_mangoes <= 100) DEFAULT 0,  -- Rotten Mangoes Score
    rotten_mangoes_votes INT DEFAULT 100,  -- Rotten Mangoes Count
);

CREATE TABLE IF NOT EXISTS movies_shows_genres (
    id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- Movie ID
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,  -- Genre ID

    PRIMARY KEY (id, genre_id)  -- Composite Primary Key
);

CREATE TABLE IF NOT EXISTS movies_shows_spoken_languages (
    id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- Movie ID
    iso_639_1 TEXT REFERENCES languages(iso_639_1) ON DELETE CASCADE,  -- Language Code

    PRIMARY KEY (id, iso_639_1) -- Composite Primary Key
);

CREATE TABLE IF NOT EXISTS movies_shows_production_company (
    id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- Movie ID
    production_company_id INTEGER REFERENCES production_companies(id) ON DELETE CASCADE,  -- Production Company ID

    PRIMARY KEY (id, production_company_id)  -- Composite Primary Key
);

CREATE TABLE IF NOT EXISTS movies_shows_reviews_ratings (
    username TEXT REFERENCES users(username),
    id INTEGER REFERENCES movies_shows(id),
    review TEXT,
    rating INTEGER NOT NULL,
    PRIMARY KEY (username, id)
);

CREATE TABLE IF NOT EXISTS movies_details (
    id INTEGER PRIMARY KEY REFERENCES movies_shows(id) ON DELETE CASCADE,                   -- Unique ID from TMDb
    belongs_to_collection INTEGER REFERENCES collections(id) ON DELETE SET NULL,  -- Collection ID
    budget BIGINT DEFAULT 0,                           -- Budget
    revenue BIGINT DEFAULT 0,                           -- Revenue
    runtime INTEGER                          -- Runtime in minutes
);

CREATE TABLE IF NOT EXISTS seasons (
    show_id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- TV Show ID
    id SERIAL PRIMARY KEY,                   -- Unique ID from TMDb
    name TEXT,                      -- Season Name
    overview TEXT,                             -- Description/Synopsis
    air_date DATE,                         -- Air Date (YYYY-MM-DD)
    season_number INTEGER NOT NULL,                   -- Season Number
    episode_count INTEGER NOT NULL,                   -- Number of Episodes
    poster_path TEXT,                        -- URL Path for Poster Image
    vote_average NUMERIC                   -- Average Rating
);

CREATE TABLE IF NOT EXISTS episodes (
    show_id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- TV Show ID
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,  -- Season ID
    id SERIAL PRIMARY KEY,                   -- Unique ID from TMDb
    name TEXT NOT NULL,                      -- Episode Name
    overview TEXT,                             -- Description/Synopsis
    air_date DATE,                         -- Air Date (YYYY-MM-DD)
    runtime INTEGER,                             -- Runtime in minutes
    season_number INTEGER NOT NULL,                   -- Season Number
    episode_number INTEGER NOT NULL,                   -- Episode Number
    still_path TEXT,                        -- URL Path for Still Image
    vote_average NUMERIC,                      -- Average Rating
    vote_count INTEGER                       -- Number of Votes
);

CREATE TABLE IF NOT EXISTS episodes_shows_reviews_ratings (
    username TEXT REFERENCES users(username),
    id INTEGER REFERENCES episodes(id),
    review TEXT,
    rating INTEGER NOT NULL,
    PRIMARY KEY (username, id)
);

CREATE TABLE IF NOT EXISTS person (
    adult INTEGER CHECK (adult in (0,1)) ,
    gender INTEGER DEFAULT 0,               -- 1 is female, 2 is male 
    biography TEXT,                             -- Biography
    birthday DATE,                             -- Date of Birth (YYYY-MM-DD)
    deathday DATE,                             -- Date of Death (YYYY-MM-DD)
    id SERIAL PRIMARY KEY,                   -- Unique ID from TMDb
    name TEXT NOT NULL,
    place_of_birth TEXT,                      -- Place of Birth
    original_name TEXT,                      -- Original Name
    popularity NUMERIC,                        -- Popularity Score
    profile_path TEXT,                        -- URL Path for Profile Image
    known_for_department TEXT
);

CREATE TABLE IF NOT EXISTS crew_movies_shows (
    id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- Movie ID
    person_id INTEGER REFERENCES person(id) ON DELETE CASCADE,  -- Person ID
    -- department_name TEXT REFERENCES departments(name) ON DELETE CASCADE,  -- Department Name
    department_name TEXT ,  -- Department Name
    job_title TEXT ,  -- Job Title
    PRIMARY KEY (id, person_id, department_name, job_title)
    -- FOREIGN KEY (department_name, job_title) REFERENCES jobs(department_name, title) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cast_movies_shows (
    id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- Movie ID
    person_id INTEGER REFERENCES person(id) ON DELETE CASCADE,  -- Person ID
      -- Department Name -- known_for_department TEXT REFERENCES departments(name) ON DELETE SET NULL,  -- Department Name
    character TEXT NOT NULL,                      -- Character Name
    PRIMARY KEY (id, person_id, character)
);

CREATE TABLE IF NOT EXISTS shows_details (
    id INTEGER PRIMARY KEY REFERENCES movies_shows(id) ON DELETE CASCADE,                   -- Unique ID from TMDb
    number_of_episodes INTEGER DEFAULT 0,                   -- Total Number of Episodes
    number_of_seasons INTEGER DEFAULT 0                  -- Total Number of Seasons
);

CREATE TABLE IF NOT EXISTS movies_shows_videos (
    id INTEGER REFERENCES movies_shows(id) ON DELETE CASCADE,  -- Movie ID
    video_path TEXT NOT NULL,  -- Video URL Path
    type TEXT,
    PRIMARY KEY (id, video_path)  -- Composite Primary Key
);

CREATE TABLE IF NOT EXISTS seasons_videos (
    id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,  -- Season ID
    video_path TEXT NOT NULL,  -- Video URL Path
    type TEXT,
    PRIMARY KEY (id, video_path)  -- Composite Primary Key
);

CREATE TABLE IF NOT EXISTS certifications (
    iso_3166_1 TEXT REFERENCES countries(iso_3166_1) ON DELETE CASCADE,  -- Country Code
    certificate TEXT NOT NULL,  -- Certificate
    meaning TEXT,  -- Meaning
    PRIMARY KEY (iso_3166_1, certificate)
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT,
    publisher TEXT,
    published_date TEXT,
    page_count INT,
    average_rating FLOAT,
    ratings_count INT,
    overview TEXT,
    preview_link TEXT,
    cover_url TEXT
);

CREATE TABLE authors(
    author_id SERIAL PRIMARY KEY,
    name TEXT
);
CREATE TABLE authors_books (
    id INTEGER,
    author_id INTEGER,
    PRIMARY KEY (id,author_id)
);

CREATE TABLE books_genres (
    id INTEGER REFERENCES books(id),
    genre_id INTEGER REFERENCES book_categories(id),
    PRIMARY KEY (id, genre_id)
);

CREATE TABLE books_categories(
    id SERIAL PRIMARY KEY,
    name TEXT
);