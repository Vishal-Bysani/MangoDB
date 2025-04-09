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

def get_critics_score(vote_average):
    """
    This function simulates the generation of a critic score
    by using the vote_average multiplied by 10 and adding a
    Gaussian noise (mean=7, stddev=3). The result is clamped
    between 0 and 100 and rounded to the nearest integer.
    """
    noise = random.gauss(mu=7, sigma=3)
    score = float(vote_average) * 10 + float(noise)
    score = max(0, min(100, round(score)))  # Clamp between 0 and 100 and round
    return score

# Example usage
if __name__ == "__main__":
    cursor.execute("SELECT id,rotten_mangoes, vote_average FROM movies_shows")
    movies_shows = cursor.fetchall()

    for movie_show in movies_shows:
        id, rotten_mangoes, vote_average = movie_show
        if rotten_mangoes is None and vote_average is not None:
            new_score = get_critics_score(vote_average)
            if new_score is not None:
                cursor.execute(
                    "UPDATE movies_shows SET rotten_mangoes = %s WHERE id = %s ",
                    (new_score, id)
                )
                print(f"Updated '{id}' with rotten_mangoes = {new_score}")

    conn.commit()
    cursor.close()
    conn.close()

# Example usage
# if __name__ == "__main__":
#     cursor.execute("SELECT title,category,rotten_mangoes,vote_average FROM movies_shows")
#     movies_shows = cursor.fetchall()
#     for movie_show in movies_shows:
#         title, category,rotten_mangoes,vote_average = movie_show
#         if rotten_mangoes == None and vote_average != None:
#             get_critics_score(title,category)
