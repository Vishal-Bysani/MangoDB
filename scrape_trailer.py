import requests
import psycopg2
from psycopg2.extras import execute_values

API_URL = "https://api.themoviedb.org/3"
HEADERS = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZTBlYzhhYTVhNTI5ZWYzOTZlNjJlNDVmMWFkMzUyNiIsIm5iZiI6MTc0MzY3MTc5My4yMzIsInN1YiI6IjY3ZWU1MWYxYjViMWM1YTRjM2E3YjNiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L7p7LuruZEI_sJ3SnckfyjuftCfKL6rxdGTRarkVQsg"
}

# Database Connection
DB_PARAMS = {
    "dbname": "imdb",
    "user": "imdbuser",
    "password": "123",
    "host": "localhost",
    "port": "5432"
}

def checkEmptyString(obj):
    if obj:
        return obj
    else:
        return None
def insert_countries():
    '''
    Inserts countries into PostgreSQL database.
    '''

    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()
    countries = []
    response = requests.get(API_URL+"/configuration/countries", headers=HEADERS)
    if response.status_code == 200:
        countries = response.json()
    else:
        print("Error fetching countries:", response.text)
        return
    
    for country in countries:
        cursor.execute("""
            INSERT INTO countries (iso_3166_1, english_name, native_name) VALUES (%s, %s, %s)
            ON CONFLICT (iso_3166_1) DO NOTHING;
        """, (country["iso_3166_1"], country["english_name"], country["native_name"]))

    conn.commit()
    cursor.close()
    conn.close()
    print("Countries inserted successfully!")

def insert_departments():
    """
    Inserts departments and related jobs into PostgreSQL.
    """
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()
    response = requests.get(API_URL+"/configuration/jobs", headers=HEADERS)
    departments = []
    if response.status_code == 200:
        departments = response.json()
    else:
        print("Error fetching departments:", response.text)
        return
    for department_data in departments:
        department_name = department_data["department"]
        jobs = department_data["jobs"]

        # Insert department (if not exists)
        cursor.execute("""
            INSERT INTO departments (name) VALUES (%s)
            ON CONFLICT (name) DO NOTHING
            RETURNING name;
        """, (department_name,))
        conn.commit()
        dept_name = cursor.fetchone()

        if not dept_name:
            cursor.execute("SELECT name FROM departments WHERE name = %s;", (department_name,))
            dept_name = cursor.fetchone()[0]
            conn.commit()
        # Insert jobs
        for job in jobs:
            cursor.execute("""
                INSERT INTO jobs (department_name, title) VALUES (%s, %s)
                ON CONFLICT DO NOTHING;
            """, (dept_name, job))
    cursor.execute("""
        INSERT INTO departments (name) VALUES (%s)
        ON CONFLICT (name) DO NOTHING;
    """, ("Creator",))
    cursor.execute("""
        INSERT INTO jobs (department_name, title) VALUES (%s, %s)
        ON CONFLICT DO NOTHING;
    """, ("Creator", "Creator"))

    conn.commit()
    cursor.close()
    conn.close()
    print("Departments and jobs inserted successfully!")

def insert_languages():
    '''
    Inserts languages into PostgreSQL database.
    '''

    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()

    languages = []
    response = requests.get(API_URL+"/configuration/languages", headers=HEADERS)
    if response.status_code == 200:
        languages = response.json()
    else:
        print("Error fetching languages:", response.text)
        return
    
    for language in languages:
        cursor.execute("""
            INSERT INTO languages (iso_639_1, english_name, name) VALUES (%s, %s, %s)
            ON CONFLICT (iso_639_1) DO NOTHING;
        """, (language["iso_639_1"], language["english_name"], language["name"]))

    conn.commit()
    cursor.close()
    conn.close()
    print("Languages inserted successfully!")

def insert_genres():
    """Inserts genres into PostgreSQL database."""
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()

    genres = []
    response = requests.get(API_URL+"/genre/movie/list?language=en", headers=HEADERS)
    if response.status_code == 200:
        genres.extend(response.json()["genres"])
    else:
        print("Error fetching genres:", response.text)
        return
    
    response = requests.get(API_URL+"/genre/tv/list?language=en", headers=HEADERS)
    if response.status_code == 200:
        genres.extend(response.json()["genres"])
    else:
        print("Error fetching genres:", response.text)
        return
        
    # Insert genres into the database
    for genre in genres:
        cursor.execute("""
            INSERT INTO genres (id, name) VALUES (%s, %s)
            ON CONFLICT (id) DO NOTHING;
        """, (genre["id"], genre["name"]))

    conn.commit()
    cursor.close()
    conn.close()
    print("Genres inserted successfully!")

def insert_movies_shows():
    '''
    Inserts movies and shows into PostgreSQL database.
    '''
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()

    for page in range(3, 6):
        if page%2 == 1:
            page = page + 100
        print("Page:", page)
        movies = []
        response = requests.get(API_URL+"/discover/movie?language=en-US&page="+str(page)+"&with_original_language=en", headers=HEADERS)
        if response.status_code == 200:
            movies = response.json()["results"]
        else:
            print("Error fetching movies:", response.text)
            return
        
        for movie in movies:
            print("Movie ID:", movie["id"])
            cursor.execute("SELECT 1 FROM movies_shows WHERE tmdb_id = %s", (movie["id"],))
            exists = cursor.fetchone()
            if exists:
                continue
            response2 = requests.get(API_URL+"/movie/"+str(movie["id"])+"?language=en-US", headers=HEADERS)
            
            if response2.status_code == 200:
                movie2 = response2.json()
                adult_value = 1 if movie["adult"] else 0
                full_backdrop_url = "https://image.tmdb.org/t/p/original" + movie["backdrop_path"] if movie["backdrop_path"] else None
                full_poster_url = "https://image.tmdb.org/t/p/original" + movie["poster_path"] if movie["poster_path"] else None
                release_date = checkEmptyString(movie["release_date"])
                cursor.execute("""
                    INSERT INTO movies_shows (tmdb_id, title, original_title, original_language, overview, release_date, category, popularity, vote_average, vote_count, adult, backdrop_path, poster_path, tagline, status, origin_country) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING RETURNING id""", (movie["id"], movie["title"], movie["original_title"], movie["original_language"], movie["overview"], release_date, "movie", movie["popularity"], movie["vote_average"], movie["vote_count"], adult_value, full_backdrop_url, full_poster_url, movie2["tagline"], movie2["status"], movie2["origin_country"][0]))
                id = cursor.fetchone()[0]
                collection = movie2["belongs_to_collection"]
                if collection:
                    collection_id = collection["id"]
                    collection_get = requests.get(API_URL+"/collection/"+str(collection_id)+"?language=en-US", headers=HEADERS)
                    collection_get = collection_get.json()
                    full_poster_url = "https://image.tmdb.org/t/p/original" + collection_get["poster_path"] if collection_get["poster_path"] else None
                    full_backdrop_url = "https://image.tmdb.org/t/p/original" + collection_get["backdrop_path"] if collection_get["backdrop_path"] else None
                    cursor.execute("""
                        INSERT INTO collections (id, name, overview, poster_path, backdrop_path) VALUES (%s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING; """, (collection_get["id"], collection_get["name"], collection_get["overview"], full_poster_url, full_backdrop_url))
                cursor.execute("""
                INSERT INTO movies_details (id, belongs_to_collection, budget, revenue, runtime) VALUES (%s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING; """, (id, movie2["belongs_to_collection"]["id"] if movie2["belongs_to_collection"] else None, movie2["budget"], movie2["revenue"], movie2["runtime"]))

                for genre in movie2["genres"]:
                    cursor.execute("""
                        INSERT INTO movies_shows_genres (id, genre_id) VALUES (%s, %s) ON CONFLICT (id,genre_id) DO NOTHING """, (id, genre["id"]))
                    
                for production_company in movie2["production_companies"]:
                    if production_company["origin_country"] == "":    
                        production_company["origin_country"] = None
                    full_logo_url = "https://image.tmdb.org/t/p/original" + production_company["logo_path"] if production_company["logo_path"] else None
                    cursor.execute("""
                        INSERT INTO production_companies (id, name, logo_path, origin_country) VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO NOTHING; """, (production_company["id"], production_company["name"], full_logo_url, production_company["origin_country"]))
                    # conn.commit()
                for language in movie2["spoken_languages"]:
                    cursor.execute("""
                        INSERT INTO movies_shows_spoken_languages (id, iso_639_1) VALUES (%s, %s) ON CONFLICT DO NOTHING; """, (id, language["iso_639_1"]))
                    # conn.commit()
                for production_company in movie2["production_companies"]:
                    cursor.execute("""
                        INSERT INTO movies_shows_production_company (id, production_company_id) VALUES (%s, %s) ON CONFLICT DO NOTHING; """, (id, production_company["id"]))
                    # conn.commit()
                
                    
                response3 = requests.get(API_URL+"/movie/"+str(movie["id"])+"/credits?language=en-US", headers=HEADERS)
                if response3.status_code == 200:
                    credits = response3.json()
                    for cast_member in credits["cast"]:
                        full_profile_url = "https://image.tmdb.org/t/p/original" + cast_member["profile_path"] if cast_member["profile_path"] else None
                        adult_value = 1 if cast_member["adult"] else 0
                        cursor.execute("SELECT 1 FROM person WHERE id = %s", (cast_member["id"],))
                        exists = cursor.fetchone()
                        if not exists:
                            cast_member_details = requests.get(API_URL+"/person/"+str(cast_member["id"])+"?language=en-US", headers=HEADERS)
                            if cast_member_details.status_code == 200:
                                cast_member_details = cast_member_details.json()
                                birthday = checkEmptyString(cast_member_details["birthday"])
                                deathday = checkEmptyString(cast_member_details["deathday"])
                                cursor.execute("""
                                        INSERT INTO person (adult, biography, birthday, deathday, gender, id, name, place_of_birth, original_name, popularity, profile_path, known_for_department) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING""", (adult_value, cast_member_details["biography"], birthday, deathday, cast_member["gender"], cast_member["id"], cast_member["name"], cast_member_details["place_of_birth"], cast_member["original_name"], cast_member["popularity"], full_profile_url, cast_member["known_for_department"]))
                        cursor.execute("""
                            INSERT INTO cast_movies_shows (id, person_id, character) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING ; """, (id, cast_member["id"], cast_member["character"]))


                    for crew_member in credits["crew"]:
                        adult_value = 1 if cast_member["adult"] else 0
                        full_profile_url = "https://image.tmdb.org/t/p/original" + crew_member["profile_path"] if crew_member["profile_path"] else None
                        cursor.execute("SELECT 1 FROM person WHERE id = %s", (crew_member["id"],))
                        exists = cursor.fetchone()
                        if not exists:
                            crew_member_details = requests.get(API_URL+"/person/"+str(crew_member["id"])+"?language=en-US", headers=HEADERS)
                            if crew_member_details.status_code == 200:
                                crew_member_details = crew_member_details.json()
                                birthday = checkEmptyString(crew_member_details["birthday"])
                                deathday = checkEmptyString(crew_member_details["deathday"])
                                cursor.execute("""
                                    INSERT INTO person (adult, biography, birthday, deathday, gender, id, name, place_of_birth, original_name, popularity, profile_path, known_for_department) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING""", (adult_value, crew_member_details["biography"], birthday, deathday, crew_member["gender"], crew_member["id"], crew_member["name"], crew_member_details["place_of_birth"], crew_member["original_name"], crew_member["popularity"], full_profile_url, crew_member_details["known_for_department"]))
                        cursor.execute("""
                            INSERT INTO crew_movies_shows (id, person_id, department_name, job_title) VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING; """, (id, crew_member["id"], crew_member["department"], crew_member["job"]))
                            
                conn.commit()
            else:
                print("Error fetching movie details:", response.text)
            

    for page in range(4,7):
        if page%2 == 1:
            page = page + 100
        print("Page:", page)
        response = requests.get(API_URL+"/discover/tv?language=en-US&page="+str(page)+"&with_original_language=en", headers=HEADERS)
        if response.status_code == 200:
            shows = response.json()["results"]
        else:
            print("Error fetching tv shows:", response.text)
            return
        
        for show in shows:
            print("Show ID:", show["id"])
            response2 = requests.get(API_URL+"/tv/"+str(show["id"])+"?language=en-US", headers=HEADERS)
            cursor.execute("SELECT 1 FROM movies_shows WHERE tmdb_id = %s", (show["id"],))
            exists = cursor.fetchone()
            if exists:
                continue
            if response2.status_code == 200:
                show2 = response2.json()
                full_poster_url = "https://image.tmdb.org/t/p/original" + show["poster_path"] if show["poster_path"] else None
                full_backdrop_url = "https://image.tmdb.org/t/p/original" + show["backdrop_path"] if show["backdrop_path"] else None
                first_air_date = checkEmptyString(show["first_air_date"])
                last_air_date = checkEmptyString(show2["last_air_date"])
                adult_value = 1 if show["adult"] else 0
                cursor.execute("""
                    INSERT INTO movies_shows (tmdb_id, title, original_title, original_language, overview, release_date, category, popularity, vote_average, vote_count, adult, backdrop_path, poster_path, tagline, status, origin_country, end_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s) ON CONFLICT DO NOTHING RETURNING id""", (show["id"], show["name"], show["original_name"], show["original_language"], show["overview"], first_air_date, "tv", show["popularity"], show["vote_average"], show["vote_count"], adult_value, full_backdrop_url,full_poster_url, show2["tagline"], show2["status"], show["origin_country"][0], last_air_date))
                id = cursor.fetchone()[0]
                for genre in show2["genres"]:
                    cursor.execute("""
                        INSERT INTO movies_shows_genres (id, genre_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""", (id, genre["id"]))
                for creator in show2["created_by"]:
                    full_profile_url = "https://image.tmdb.org/t/p/original" + creator["profile_path"] if creator["profile_path"] else None
                    cursor.execute("SELECT 1 FROM person WHERE id = %s", (creator["id"],))
                    exists = cursor.fetchone()
                    if not exists:
                        creator_details = requests.get(API_URL+"/person/"+str(creator["id"])+"?language=en-US", headers=HEADERS)
                        if creator_details.status_code == 200:
                            creator_details = creator_details.json()
                            adult_value = 1 if creator_details["adult"] else 0
                            birthday = checkEmptyString(creator_details["birthday"])
                            deathday = checkEmptyString(creator_details["deathday"])
                            cursor.execute("""
                                        INSERT INTO person (adult, biography, birthday, deathday, id, name, gender, place_of_birth, original_name, popularity, profile_path, known_for_department) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING""", (adult_value, creator_details["biography"], birthday, deathday, creator["id"], creator["name"], creator_details["gender"], creator_details["place_of_birth"], creator["name"], creator_details["popularity"], full_profile_url, creator_details["known_for_department"] ))
                    cursor.execute("""
                                INSERT INTO crew_movies_shows(id, person_id, department_name, job_title) VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING""", (id, creator["id"], "Creator", "Creator"))
                cursor.execute("""
                    INSERT INTO shows_details (id, number_of_episodes, number_of_seasons) VALUES (%s, %s, %s) ON CONFLICT (id) DO NOTHING; """, (id, show2["number_of_episodes"], show2["number_of_seasons"]))
                for production_company in show2["production_companies"]:
                    if production_company["origin_country"] == "":    
                        production_company["origin_country"] = None
                    full_logo_url = "https://image.tmdb.org/t/p/original" + production_company["logo_path"] if production_company["logo_path"] else None
                    cursor.execute("""
                        INSERT INTO production_companies (id, name, logo_path, origin_country) VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO NOTHING; """, (production_company["id"], production_company["name"], full_logo_url, production_company["origin_country"]))
                for language in show2["spoken_languages"]:
                    cursor.execute("""
                        INSERT INTO movies_shows_spoken_languages (id, iso_639_1) VALUES (%s, %s) ON CONFLICT DO NOTHING; """, (id, language["iso_639_1"]))
                for production_company in show2["production_companies"]:
                    cursor.execute("""
                        INSERT INTO movies_shows_production_company (id, production_company_id) VALUES (%s, %s) ON CONFLICT DO NOTHING; """, (id, production_company["id"]))
                for season in show2["seasons"]:
                    full_poster_url = "https://image.tmdb.org/t/p/original" + season["poster_path"] if season["poster_path"] else None
                    cursor.execute("""
                        INSERT INTO seasons (show_id, id, name, overview, air_date, season_number, episode_count, poster_path, vote_average) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING""", (id, season["id"], season["name"], season["overview"], season["air_date"], season["season_number"], season["episode_count"], full_poster_url, season["vote_average"]))
                    response3 = requests.get(API_URL+"/tv/"+str(show["id"])+"/season/"+str(season["season_number"])+"?language=en-US", headers=HEADERS)
                    if response3.status_code == 200:
                        season_data = response3.json()
                        for episode in season_data["episodes"]:
                            full_still_url = "https://image.tmdb.org/t/p/original" + episode["still_path"] if episode["still_path"] else None
                            cursor.execute("""
                                INSERT INTO episodes (show_id, season_id, id, name, overview, air_date, episode_number, vote_average, vote_count, still_path, runtime, season_number) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING""", (id, season["id"], episode["id"], episode["name"], episode["overview"], episode["air_date"], episode["episode_number"], episode["vote_average"], episode["vote_count"], full_still_url, episode["runtime"], episode["season_number"]))
                response3 = requests.get(API_URL+"/tv/"+str(show["id"])+"/credits?language=en-US", headers=HEADERS)
                if response3.status_code == 200:
                    credits = response3.json()
                    for cast_member in credits["cast"]:
                        adult_value = 1 if cast_member["adult"] else 0
                        full_profile_url = "https://image.tmdb.org/t/p/original" + cast_member["profile_path"] if cast_member["profile_path"] else None
                        cursor.execute("SELECT 1 FROM person WHERE id = %s", (cast_member["id"],))
                        exists = cursor.fetchone()
                        if not exists:
                            cast_member_details = requests.get(API_URL+"/person/"+str(cast_member["id"])+"?language=en-US", headers=HEADERS)
                            if cast_member_details.status_code == 200:
                                cast_member_details = cast_member_details.json()
                                birthday = checkEmptyString(cast_member_details["birthday"])
                                deathday = checkEmptyString(cast_member_details["deathday"])
                                cursor.execute("""
                                    INSERT INTO person (adult, biography, birthday, deathday, gender, id, name, place_of_birth, original_name, popularity, profile_path, known_for_department) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING""", (adult_value, cast_member_details["biography"], birthday, deathday, cast_member["gender"], cast_member["id"], cast_member["name"], cast_member_details["place_of_birth"], cast_member["original_name"], cast_member["popularity"], full_profile_url, cast_member_details["known_for_department"]))
                        cursor.execute("""
                            INSERT INTO cast_movies_shows (id, person_id, character) VALUES (%s, %s, %s) ON CONFLICT (id, person_id, character) DO NOTHING; """, (id, cast_member["id"], cast_member["character"]))
                        
                    for crew_member in credits["crew"]:
                        adult_value = 1 if crew_member["adult"] else 0
                        full_profile_url = "https://image.tmdb.org/t/p/original" + crew_member["profile_path"] if crew_member["profile_path"] else None
                        cursor.execute("SELECT 1 FROM person WHERE id = %s", (crew_member["id"],))
                        exists = cursor.fetchone()
                        if not exists:
                            crew_member_details = requests.get(API_URL+"/person/"+str(crew_member["id"])+"?language=en-US", headers=HEADERS)
                            if crew_member_details.status_code == 200:
                                crew_member_details = crew_member_details.json()
                                birthday = checkEmptyString(crew_member_details["birthday"])
                                deathday = checkEmptyString(crew_member_details["deathday"])
                                cursor.execute("""
                                    INSERT INTO person (adult, biography, birthday, deathday, gender, id, name, place_of_birth, original_name, popularity, profile_path, known_for_department) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING""", (adult_value, crew_member_details["biography"], birthday, deathday, crew_member["gender"], crew_member["id"], crew_member["name"], crew_member_details["place_of_birth"], crew_member["original_name"], crew_member["popularity"], full_profile_url, crew_member_details["known_for_department"]))
                        cursor.execute("""
                            INSERT INTO crew_movies_shows (id, person_id, department_name, job_title) VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING; """, (id, crew_member["id"], crew_member["department"], crew_member["job"]))
                conn.commit()
            else:
                print("Error fetching show details:", response.text)
                        
    conn.commit()
    cursor.close()
    conn.close()
    print("Movies and shows inserted successfully!")

def insert_movies_shows_trailers():
    """
    Inserts movies and shows trailers into PostgreSQL database.
    """
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()

    # cursor.execute("SELECT id, tmdb_id, category FROM movies_shows")
    # movies_shows = cursor.fetchall()
    # for movie_show in movies_shows:
    #     id, tmdb_id, category = movie_show
    #     print("Movie/Show ID:", id)
    #     print("TMDB ID:", tmdb_id)
    #     print("Category:", category)
    #     response = requests.get(API_URL + f"/{category}/{tmdb_id}/videos?language=en-US", headers=HEADERS)
    #     if response.status_code == 200:
    #         trailers = response.json()["results"]
    #         for trailer in trailers:
    #             cursor.execute("""
    #                 INSERT INTO movies_shows_videos (id, video_path, type) VALUES (%s, %s, %s)
    #                 ON CONFLICT (id, video_path) DO NOTHING;
    #             """, (id, "https://www." + trailer["site"] + ".com/watch?v="+trailer["key"], trailer["type"]))
                               

    # conn.commit()

    cursor.execute("SELECT show_id, id, season_number FROM seasons")
    seasons = cursor.fetchall()
    for season in seasons:
        show_id, id, season_number = season
        print("Show ID:", show_id)
        print("Season ID:", id)
        print("Season Number:", season_number)
        response = requests.get(API_URL + f"/tv/{show_id}/season/{season_number}/videos?language=en-US", headers=HEADERS)
        if response.status_code == 200:
            trailers = response.json()["results"]
            for trailer in trailers:
                cursor.execute("""
                    INSERT INTO seasons_videos (id, video_path, type) VALUES (%s, %s, %s)
                    ON CONFLICT (id, video_path) DO NOTHING;
                """, (id, "https://www." + trailer["site"] + ".com/watch?v="+trailer["key"], trailer["type"]))

            conn.commit()

    cursor.close()
    conn.close()
    print("Trailers inserted successfully!")

def insert_certifications():
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()
    response= requests.get("https://api.themoviedb.org/3/certification/movie/list",headers= HEADERS)
    if response.status_code == 200:
        certifications = response.json()
    else:
        print("Error fetching certifications:", response.text)
        return
    for country in certifications["certifications"]:
        for certification in certifications["certifications"][country]:
            cursor.execute("""
                INSERT INTO certifications (iso_3166_1, certificate,meaning) VALUES (%s, %s,%s)
                ON CONFLICT (iso_3166_1, certificate) DO NOTHING;
            """, (country[0:2], certification["certification"], certification["meaning"]))
    conn.commit()
    response= requests.get("https://api.themoviedb.org/3/certification/tv/list",headers= HEADERS)
    if response.status_code == 200:
        certifications = response.json()
    else:
        print("Error fetching certifications:", response.text)
        return
    for country in certifications["certifications"]:
        for certification in certifications["certifications"][country]:
            cursor.execute("""
                INSERT INTO certifications (iso_3166_1, certificate,meaning) VALUES (%s, %s,%s)
                ON CONFLICT (iso_3166_1, certificate) DO NOTHING;
            """, (country[0:2], certification["certification"], certification["meaning"]))
    conn.commit()
    cursor.close()
    conn.close()
    print("Certifications inserted successfully!")
# Main function
def insert_movies_shows_certifications():
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()

    cursor.execute("SELECT id, tmdb_id, category FROM movies_shows")
    movies_shows = cursor.fetchall()

    for id, tmdb_id, category in movies_shows:
        if category == "movie":
            continue

        print("Movie/Show ID:", id)
        print("TMDB ID:", tmdb_id)
        print("Category:", category)

        response = requests.get(
            f"{API_URL}/tv/{tmdb_id}/content_ratings",
            headers=HEADERS
        )

        if response.status_code != 200:
            print(f"Error fetching certifications for ID {id}: {response.text}")
            continue

        results = response.json().get("results", [])
        chosen_cert = None

        # Priority: IN > US > any other
        for country in ["IN", "US"]:
            for trailer in results:
                if trailer.get("iso_3166_1") == country and trailer.get("rating"):
                    chosen_cert = (trailer["iso_3166_1"], trailer["rating"])
                    break
            if chosen_cert:
                break

        # If no IN or US, pick any available one
        if not chosen_cert:
            for trailer in results:
                if trailer.get("rating"):
                    chosen_cert = (trailer["iso_3166_1"], trailer["rating"])
                    break

        # Update the selected certification
        if chosen_cert:
            iso_code, cert = chosen_cert
            cursor.execute("""
                UPDATE movies_shows
                SET iso_3166_1 = %s,
                    certificate = %s
                WHERE id = %s;
            """, (iso_code[0:2], cert.strip(), id))

            print(f"Updated certification for ID {id}: {chosen_cert}")

    conn.commit()
    cursor.close()
    conn.close()


def main():
    # insert_countries()
    # insert_departments()
    # insert_languages()
    # insert_genres()
    # insert_movies_shows()
    insert_movies_shows_trailers()
    # insert_certifications()
    # insert_movies_shows_certifications/()

if __name__ == "__main__":
    main()
