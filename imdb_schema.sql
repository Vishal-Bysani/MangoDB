--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: imdbuser
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO imdbuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors_books; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.authors_books (
    id integer NOT NULL,
    author_id integer NOT NULL
);


ALTER TABLE public.authors_books OWNER TO imdbuser;

--
-- Name: books; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.books (
    id integer NOT NULL,
    title text,
    publisher text,
    published_date text,
    page_count integer,
    average_rating double precision,
    ratings_count integer,
    overview text,
    preview_link text,
    cover_url text,
    maturity_rating text,
    popularity numeric
);


ALTER TABLE public.books OWNER TO imdbuser;

--
-- Name: books_favourites; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.books_favourites (
    username text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.books_favourites OWNER TO imdbuser;

--
-- Name: books_genres; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.books_genres (
    id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.books_genres OWNER TO imdbuser;

--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: imdbuser
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_id_seq OWNER TO imdbuser;

--
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: imdbuser
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- Name: books_reviews_ratings; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.books_reviews_ratings (
    username text NOT NULL,
    id integer NOT NULL,
    review text,
    rating integer NOT NULL
);


ALTER TABLE public.books_reviews_ratings OWNER TO imdbuser;

--
-- Name: cast_movies_shows; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.cast_movies_shows (
    id integer NOT NULL,
    person_id integer NOT NULL,
    "character" text NOT NULL
);


ALTER TABLE public.cast_movies_shows OWNER TO imdbuser;

--
-- Name: certifications; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.certifications (
    iso_3166_1 text NOT NULL,
    certificate text NOT NULL,
    meaning text
);


ALTER TABLE public.certifications OWNER TO imdbuser;

--
-- Name: collections; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.collections (
    id integer NOT NULL,
    name text NOT NULL,
    overview text,
    poster_path text,
    backdrop_path text
);


ALTER TABLE public.collections OWNER TO imdbuser;

--
-- Name: collections_id_seq; Type: SEQUENCE; Schema: public; Owner: imdbuser
--

CREATE SEQUENCE public.collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.collections_id_seq OWNER TO imdbuser;

--
-- Name: collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: imdbuser
--

ALTER SEQUENCE public.collections_id_seq OWNED BY public.collections.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.countries (
    iso_3166_1 text NOT NULL,
    english_name text NOT NULL,
    native_name text
);


ALTER TABLE public.countries OWNER TO imdbuser;

--
-- Name: crew_movies_shows; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.crew_movies_shows (
    id integer NOT NULL,
    person_id integer NOT NULL,
    department_name text NOT NULL,
    job_title text NOT NULL
);


ALTER TABLE public.crew_movies_shows OWNER TO imdbuser;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.departments (
    name text NOT NULL
);


ALTER TABLE public.departments OWNER TO imdbuser;

--
-- Name: episodes; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.episodes (
    show_id integer,
    season_id integer,
    id integer NOT NULL,
    name text NOT NULL,
    overview text,
    air_date date,
    runtime integer,
    season_number integer NOT NULL,
    episode_number integer NOT NULL,
    still_path text,
    vote_average numeric,
    vote_count integer
);


ALTER TABLE public.episodes OWNER TO imdbuser;

--
-- Name: episodes_id_seq; Type: SEQUENCE; Schema: public; Owner: imdbuser
--

CREATE SEQUENCE public.episodes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.episodes_id_seq OWNER TO imdbuser;

--
-- Name: episodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: imdbuser
--

ALTER SEQUENCE public.episodes_id_seq OWNED BY public.episodes.id;


--
-- Name: episodes_shows_reviews_ratings; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.episodes_shows_reviews_ratings (
    username text NOT NULL,
    id integer NOT NULL,
    review text,
    rating integer NOT NULL
);


ALTER TABLE public.episodes_shows_reviews_ratings OWNER TO imdbuser;

--
-- Name: favourites; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.favourites (
    username text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.favourites OWNER TO imdbuser;

--
-- Name: following; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.following (
    username text NOT NULL,
    followed_username text NOT NULL
);


ALTER TABLE public.following OWNER TO imdbuser;

--
-- Name: genres; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.genres OWNER TO imdbuser;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.jobs (
    department_name text NOT NULL,
    title text NOT NULL
);


ALTER TABLE public.jobs OWNER TO imdbuser;

--
-- Name: languages; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.languages (
    iso_639_1 text NOT NULL,
    english_name text NOT NULL,
    name text
);


ALTER TABLE public.languages OWNER TO imdbuser;

--
-- Name: movies_details; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.movies_details (
    id integer NOT NULL,
    belongs_to_collection integer,
    budget bigint DEFAULT 0,
    revenue bigint DEFAULT 0,
    runtime integer
);


ALTER TABLE public.movies_details OWNER TO imdbuser;

--
-- Name: movies_shows; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.movies_shows (
    tmdb_id integer,
    id integer NOT NULL,
    title text NOT NULL,
    original_title text,
    original_language text,
    overview text,
    release_date date,
    end_date date,
    category text,
    popularity numeric,
    vote_average numeric,
    vote_count integer,
    adult integer,
    backdrop_path text,
    poster_path text,
    tagline text,
    status text,
    origin_country text,
    iso_3166_1 text,
    certificate text,
    rotten_mangoes integer,
    rotten_mangoes_votes integer DEFAULT 100,
    CONSTRAINT movies_shows_adult_check CHECK ((adult = ANY (ARRAY[0, 1]))),
    CONSTRAINT movies_shows_category_check CHECK ((category = ANY (ARRAY['movie'::text, 'tv'::text])))
);


ALTER TABLE public.movies_shows OWNER TO imdbuser;

--
-- Name: movies_shows_genres; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.movies_shows_genres (
    id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.movies_shows_genres OWNER TO imdbuser;

--
-- Name: movies_shows_id_seq; Type: SEQUENCE; Schema: public; Owner: imdbuser
--

CREATE SEQUENCE public.movies_shows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_shows_id_seq OWNER TO imdbuser;

--
-- Name: movies_shows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: imdbuser
--

ALTER SEQUENCE public.movies_shows_id_seq OWNED BY public.movies_shows.id;


--
-- Name: movies_shows_production_company; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.movies_shows_production_company (
    id integer NOT NULL,
    production_company_id integer NOT NULL
);


ALTER TABLE public.movies_shows_production_company OWNER TO imdbuser;

--
-- Name: movies_shows_reviews_ratings; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.movies_shows_reviews_ratings (
    username text NOT NULL,
    id integer NOT NULL,
    review text,
    rating integer NOT NULL
);


ALTER TABLE public.movies_shows_reviews_ratings OWNER TO imdbuser;

--
-- Name: movies_shows_spoken_languages; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.movies_shows_spoken_languages (
    id integer NOT NULL,
    iso_639_1 text NOT NULL
);


ALTER TABLE public.movies_shows_spoken_languages OWNER TO imdbuser;

--
-- Name: movies_shows_videos; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.movies_shows_videos (
    id integer NOT NULL,
    video_path text NOT NULL,
    type text
);


ALTER TABLE public.movies_shows_videos OWNER TO imdbuser;

--
-- Name: person; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.person (
    adult integer,
    gender integer DEFAULT 0,
    biography text,
    birthday date,
    deathday date,
    id integer NOT NULL,
    name text NOT NULL,
    place_of_birth text,
    original_name text,
    popularity numeric,
    profile_path text,
    known_for_department text,
    CONSTRAINT person_adult_check CHECK ((adult = ANY (ARRAY[0, 1])))
);


ALTER TABLE public.person OWNER TO imdbuser;

--
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: imdbuser
--

CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.person_id_seq OWNER TO imdbuser;

--
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: imdbuser
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- Name: production_companies; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.production_companies (
    id integer NOT NULL,
    logo_path text,
    name text NOT NULL,
    origin_country text
);


ALTER TABLE public.production_companies OWNER TO imdbuser;

--
-- Name: production_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: imdbuser
--

CREATE SEQUENCE public.production_companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.production_companies_id_seq OWNER TO imdbuser;

--
-- Name: production_companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: imdbuser
--

ALTER SEQUENCE public.production_companies_id_seq OWNED BY public.production_companies.id;


--
-- Name: readlist; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.readlist (
    username text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.readlist OWNER TO imdbuser;

--
-- Name: seasons; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.seasons (
    show_id integer,
    id integer NOT NULL,
    name text,
    overview text,
    air_date date,
    season_number integer NOT NULL,
    episode_count integer NOT NULL,
    poster_path text,
    vote_average numeric
);


ALTER TABLE public.seasons OWNER TO imdbuser;

--
-- Name: seasons_id_seq; Type: SEQUENCE; Schema: public; Owner: imdbuser
--

CREATE SEQUENCE public.seasons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seasons_id_seq OWNER TO imdbuser;

--
-- Name: seasons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: imdbuser
--

ALTER SEQUENCE public.seasons_id_seq OWNED BY public.seasons.id;


--
-- Name: seasons_videos; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.seasons_videos (
    id integer NOT NULL,
    video_path text NOT NULL,
    type text
);


ALTER TABLE public.seasons_videos OWNER TO imdbuser;

--
-- Name: shows_details; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.shows_details (
    id integer NOT NULL,
    number_of_episodes integer DEFAULT 0,
    number_of_seasons integer DEFAULT 0
);


ALTER TABLE public.shows_details OWNER TO imdbuser;

--
-- Name: users; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.users (
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    is_critic boolean DEFAULT false NOT NULL,
    is_authenticated boolean DEFAULT false,
    registration_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO imdbuser;

--
-- Name: wanttoreadlist; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.wanttoreadlist (
    username text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.wanttoreadlist OWNER TO imdbuser;

--
-- Name: watchedlist; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.watchedlist (
    username text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.watchedlist OWNER TO imdbuser;

--
-- Name: watchlist; Type: TABLE; Schema: public; Owner: imdbuser
--

CREATE TABLE public.watchlist (
    username text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.watchlist OWNER TO imdbuser;

--
-- Name: books id; Type: DEFAULT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- Name: collections id; Type: DEFAULT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.collections ALTER COLUMN id SET DEFAULT nextval('public.collections_id_seq'::regclass);


--
-- Name: episodes id; Type: DEFAULT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.episodes ALTER COLUMN id SET DEFAULT nextval('public.episodes_id_seq'::regclass);


--
-- Name: movies_shows id; Type: DEFAULT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows ALTER COLUMN id SET DEFAULT nextval('public.movies_shows_id_seq'::regclass);


--
-- Name: person id; Type: DEFAULT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- Name: production_companies id; Type: DEFAULT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.production_companies ALTER COLUMN id SET DEFAULT nextval('public.production_companies_id_seq'::regclass);


--
-- Name: seasons id; Type: DEFAULT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.seasons ALTER COLUMN id SET DEFAULT nextval('public.seasons_id_seq'::regclass);


--
-- Name: authors_books authors_books_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.authors_books
    ADD CONSTRAINT authors_books_pkey PRIMARY KEY (id, author_id);


--
-- Name: books_favourites books_favourites_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.books_favourites
    ADD CONSTRAINT books_favourites_pkey PRIMARY KEY (username, id);


--
-- Name: books_genres books_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.books_genres
    ADD CONSTRAINT books_genres_pkey PRIMARY KEY (id, genre_id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: books_reviews_ratings books_reviews_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.books_reviews_ratings
    ADD CONSTRAINT books_reviews_ratings_pkey PRIMARY KEY (username, id);


--
-- Name: cast_movies_shows cast_movies_shows_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.cast_movies_shows
    ADD CONSTRAINT cast_movies_shows_pkey PRIMARY KEY (id, person_id, "character");


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (iso_3166_1, certificate);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (iso_3166_1);


--
-- Name: crew_movies_shows crew_movies_shows_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.crew_movies_shows
    ADD CONSTRAINT crew_movies_shows_pkey PRIMARY KEY (id, person_id, department_name, job_title);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (name);


--
-- Name: episodes episodes_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_pkey PRIMARY KEY (id);


--
-- Name: episodes_shows_reviews_ratings episodes_shows_reviews_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.episodes_shows_reviews_ratings
    ADD CONSTRAINT episodes_shows_reviews_ratings_pkey PRIMARY KEY (username, id);


--
-- Name: favourites favourites_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.favourites
    ADD CONSTRAINT favourites_pkey PRIMARY KEY (username, id);


--
-- Name: following following_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.following
    ADD CONSTRAINT following_pkey PRIMARY KEY (username, followed_username);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (department_name, title);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (iso_639_1);


--
-- Name: movies_details movies_details_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_details
    ADD CONSTRAINT movies_details_pkey PRIMARY KEY (id);


--
-- Name: movies_shows_genres movies_shows_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_genres
    ADD CONSTRAINT movies_shows_genres_pkey PRIMARY KEY (id, genre_id);


--
-- Name: movies_shows movies_shows_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows
    ADD CONSTRAINT movies_shows_pkey PRIMARY KEY (id);


--
-- Name: movies_shows_production_company movies_shows_production_company_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_production_company
    ADD CONSTRAINT movies_shows_production_company_pkey PRIMARY KEY (id, production_company_id);


--
-- Name: movies_shows_reviews_ratings movies_shows_reviews_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_reviews_ratings
    ADD CONSTRAINT movies_shows_reviews_ratings_pkey PRIMARY KEY (username, id);


--
-- Name: movies_shows_spoken_languages movies_shows_spoken_languages_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_spoken_languages
    ADD CONSTRAINT movies_shows_spoken_languages_pkey PRIMARY KEY (id, iso_639_1);


--
-- Name: movies_shows_videos movies_shows_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_videos
    ADD CONSTRAINT movies_shows_videos_pkey PRIMARY KEY (id, video_path);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: users pk_users_username; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users_username PRIMARY KEY (username);


--
-- Name: production_companies production_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.production_companies
    ADD CONSTRAINT production_companies_pkey PRIMARY KEY (id);


--
-- Name: readlist readlist_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.readlist
    ADD CONSTRAINT readlist_pkey PRIMARY KEY (username, id);


--
-- Name: seasons seasons_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.seasons
    ADD CONSTRAINT seasons_pkey PRIMARY KEY (id);


--
-- Name: seasons_videos seasons_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.seasons_videos
    ADD CONSTRAINT seasons_videos_pkey PRIMARY KEY (id, video_path);


--
-- Name: shows_details shows_details_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.shows_details
    ADD CONSTRAINT shows_details_pkey PRIMARY KEY (id);


--
-- Name: movies_shows unique_cert_per_region; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows
    ADD CONSTRAINT unique_cert_per_region UNIQUE (id, iso_3166_1);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: wanttoreadlist wanttoreadlist_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.wanttoreadlist
    ADD CONSTRAINT wanttoreadlist_pkey PRIMARY KEY (username, id);


--
-- Name: watchedlist watchedlist_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.watchedlist
    ADD CONSTRAINT watchedlist_pkey PRIMARY KEY (username, id);


--
-- Name: watchlist watchlist_pkey; Type: CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_pkey PRIMARY KEY (username, id);


--
-- Name: books_favourites books_favourites_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.books_favourites
    ADD CONSTRAINT books_favourites_id_fkey FOREIGN KEY (id) REFERENCES public.books(id) ON DELETE CASCADE;


--
-- Name: books_favourites books_favourites_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.books_favourites
    ADD CONSTRAINT books_favourites_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- Name: books_genres books_genres_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.books_genres
    ADD CONSTRAINT books_genres_id_fkey FOREIGN KEY (id) REFERENCES public.books(id);


--
-- Name: books_reviews_ratings books_reviews_ratings_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.books_reviews_ratings
    ADD CONSTRAINT books_reviews_ratings_id_fkey FOREIGN KEY (id) REFERENCES public.books(id);


--
-- Name: books_reviews_ratings books_reviews_ratings_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.books_reviews_ratings
    ADD CONSTRAINT books_reviews_ratings_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- Name: cast_movies_shows cast_movies_shows_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.cast_movies_shows
    ADD CONSTRAINT cast_movies_shows_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: cast_movies_shows cast_movies_shows_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.cast_movies_shows
    ADD CONSTRAINT cast_movies_shows_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: certifications certifications_iso_3166_1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_iso_3166_1_fkey FOREIGN KEY (iso_3166_1) REFERENCES public.countries(iso_3166_1) ON DELETE CASCADE;


--
-- Name: crew_movies_shows crew_movies_shows_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.crew_movies_shows
    ADD CONSTRAINT crew_movies_shows_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: crew_movies_shows crew_movies_shows_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.crew_movies_shows
    ADD CONSTRAINT crew_movies_shows_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: episodes episodes_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE;


--
-- Name: episodes episodes_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: episodes_shows_reviews_ratings episodes_shows_reviews_ratings_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.episodes_shows_reviews_ratings
    ADD CONSTRAINT episodes_shows_reviews_ratings_id_fkey FOREIGN KEY (id) REFERENCES public.episodes(id);


--
-- Name: episodes_shows_reviews_ratings episodes_shows_reviews_ratings_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.episodes_shows_reviews_ratings
    ADD CONSTRAINT episodes_shows_reviews_ratings_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- Name: favourites favourites_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.favourites
    ADD CONSTRAINT favourites_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: favourites favourites_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.favourites
    ADD CONSTRAINT favourites_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- Name: movies_shows fk_movies_shows_certificates; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows
    ADD CONSTRAINT fk_movies_shows_certificates FOREIGN KEY (iso_3166_1, certificate) REFERENCES public.certifications(iso_3166_1, certificate);


--
-- Name: following following_followed_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.following
    ADD CONSTRAINT following_followed_username_fkey FOREIGN KEY (followed_username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- Name: following following_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.following
    ADD CONSTRAINT following_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- Name: jobs jobs_department_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_department_name_fkey FOREIGN KEY (department_name) REFERENCES public.departments(name) ON DELETE CASCADE;


--
-- Name: movies_details movies_details_belongs_to_collection_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_details
    ADD CONSTRAINT movies_details_belongs_to_collection_fkey FOREIGN KEY (belongs_to_collection) REFERENCES public.collections(id) ON DELETE SET NULL;


--
-- Name: movies_details movies_details_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_details
    ADD CONSTRAINT movies_details_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: movies_shows_genres movies_shows_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_genres
    ADD CONSTRAINT movies_shows_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;


--
-- Name: movies_shows_genres movies_shows_genres_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_genres
    ADD CONSTRAINT movies_shows_genres_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: movies_shows movies_shows_origin_country_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows
    ADD CONSTRAINT movies_shows_origin_country_fkey FOREIGN KEY (origin_country) REFERENCES public.countries(iso_3166_1) ON DELETE SET NULL;


--
-- Name: movies_shows movies_shows_original_language_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows
    ADD CONSTRAINT movies_shows_original_language_fkey FOREIGN KEY (original_language) REFERENCES public.languages(iso_639_1) ON DELETE SET NULL;


--
-- Name: movies_shows_production_company movies_shows_production_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_production_company
    ADD CONSTRAINT movies_shows_production_company_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: movies_shows_production_company movies_shows_production_company_production_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_production_company
    ADD CONSTRAINT movies_shows_production_company_production_company_id_fkey FOREIGN KEY (production_company_id) REFERENCES public.production_companies(id) ON DELETE CASCADE;


--
-- Name: movies_shows_reviews_ratings movies_shows_reviews_ratings_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_reviews_ratings
    ADD CONSTRAINT movies_shows_reviews_ratings_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id);


--
-- Name: movies_shows_reviews_ratings movies_shows_reviews_ratings_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_reviews_ratings
    ADD CONSTRAINT movies_shows_reviews_ratings_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- Name: movies_shows_spoken_languages movies_shows_spoken_languages_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_spoken_languages
    ADD CONSTRAINT movies_shows_spoken_languages_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: movies_shows_spoken_languages movies_shows_spoken_languages_iso_639_1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_spoken_languages
    ADD CONSTRAINT movies_shows_spoken_languages_iso_639_1_fkey FOREIGN KEY (iso_639_1) REFERENCES public.languages(iso_639_1) ON DELETE CASCADE;


--
-- Name: movies_shows_videos movies_shows_videos_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.movies_shows_videos
    ADD CONSTRAINT movies_shows_videos_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: production_companies production_companies_origin_country_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.production_companies
    ADD CONSTRAINT production_companies_origin_country_fkey FOREIGN KEY (origin_country) REFERENCES public.countries(iso_3166_1) ON DELETE SET NULL;


--
-- Name: readlist readlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.readlist
    ADD CONSTRAINT readlist_id_fkey FOREIGN KEY (id) REFERENCES public.books(id) ON DELETE CASCADE;


--
-- Name: readlist readlist_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.readlist
    ADD CONSTRAINT readlist_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- Name: seasons seasons_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.seasons
    ADD CONSTRAINT seasons_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: seasons_videos seasons_videos_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.seasons_videos
    ADD CONSTRAINT seasons_videos_id_fkey FOREIGN KEY (id) REFERENCES public.seasons(id) ON DELETE CASCADE;


--
-- Name: shows_details shows_details_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.shows_details
    ADD CONSTRAINT shows_details_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: wanttoreadlist wanttoreadlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.wanttoreadlist
    ADD CONSTRAINT wanttoreadlist_id_fkey FOREIGN KEY (id) REFERENCES public.books(id) ON DELETE CASCADE;


--
-- Name: wanttoreadlist wanttoreadlist_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.wanttoreadlist
    ADD CONSTRAINT wanttoreadlist_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- Name: watchedlist watchedlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.watchedlist
    ADD CONSTRAINT watchedlist_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: watchedlist watchedlist_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.watchedlist
    ADD CONSTRAINT watchedlist_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- Name: watchlist watchlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_id_fkey FOREIGN KEY (id) REFERENCES public.movies_shows(id) ON DELETE CASCADE;


--
-- Name: watchlist watchlist_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: imdbuser
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

