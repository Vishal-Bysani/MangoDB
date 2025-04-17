import psycopg2
from psycopg2.extras import execute_values
import time
import random
DB_PARAMS = {
    "dbname": "imdb",
    "user": "imdbuser",
    "password": "123",
    "host": "localhost",
    "port": "5432"
}
conn = psycopg2.connect(**DB_PARAMS)
cursor = conn.cursor()

def get_critics_score():
    """
    This function simulates the generation of a critic score
    by using the vote_average multiplied by 10 and adding a
    Gaussian noise (mean=7, stddev=3). The result is clamped
    between 0 and 100 and rounded to the nearest integer.
    """
    noise = random.gauss(mu=7, sigma=3)
    score = float(0.3) * 10 + float(noise)
    score = max(0, min(9.5, round(score)))  # Clamp between 0 and 10 and round
    return score

if __name__ == "__main__":
    cursor.execute("SELECT id, average_rating,ratings_count FROM books")
    movies_shows = cursor.fetchall()

    for movie_show in movies_shows:
        id, vote_average,ratings_count = movie_show
        # if vote_average is None :
        new_score = get_critics_score()
        if new_score is not None:
            cursor.execute(
                "UPDATE books SET average_rating = %s WHERE id = %s ",
                (new_score, id)
            )
            print(f"Updated '{id}' with average_rating = {new_score}")
        if ratings_count is None:
            cursor.execute(
                "UPDATE books SET ratings_count = %s WHERE id = %s ",
                (round(random.randrange(10,50),2), id)
            )
        # else:
        #     cursor.execute(
        #         "UPDATE books SET average_rating = %s WHERE id = %s ",
        #         (vote_average*2, id)
        #     )


    conn.commit()
    cursor.close()
    conn.close()