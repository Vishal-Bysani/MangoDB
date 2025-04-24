import requests
import psycopg2
from urllib.parse import quote
import json


def search_books(query, max_results=20):
    base_url = "https://www.googleapis.com/books/v1/volumes"
    params = {
        "q": query,
        "maxResults": max_results
    }

    response = requests.get(base_url, params=params)
    if response.status_code != 200:
        raise Exception(f"API Error: {response.status_code}")

    data = response.json()
    books = []

    for item in data.get("items", []):
        info = item.get("volumeInfo", {})
        books.append({
            "title": info.get("title"),
            "authors": info.get("authors", []),
            "publisher": info.get("publisher"),
            "published_date": info.get("publishedDate"),
            "page_count": info.get("pageCount"),
            "categories": info.get("categories", []),
            "average_rating": info.get("averageRating"),
            "ratings_count": info.get("ratingsCount"),
            "overview": info.get("description"),
            "preview_link": info.get("previewLink")
        })
    return books

def save_to_postgres(books):
    conn = psycopg2.connect(dbname="imdb", user="imdbuser", password="123", host="localhost")
    cur = conn.cursor()

    for book in books:
        # Insert book
        cur.execute("""
            INSERT INTO books (title, publisher, published_date, page_count, average_rating, ratings_count, overview, preview_link)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            book["title"],
            book["publisher"],
            book["published_date"],
            book["page_count"],
            book["average_rating"],
            book["ratings_count"],
            book["overview"],
            book["preview_link"]
        ))
        book_id = cur.fetchone()[0]

        # Insert authors and link
        for author in book["authors"]:
            cur.execute("SELECT author_id FROM authors WHERE name = %s", (author,))
            result = cur.fetchone()
            if result:
                author_id = result[0]
            else:
                cur.execute("INSERT INTO authors (name) VALUES (%s) RETURNING author_id", (author,))
                author_id = cur.fetchone()[0]
            cur.execute("INSERT INTO authors_books (id, author_id) VALUES (%s, %s)", (book_id, author_id))

        # Insert categories
        for category in book["categories"]:
            cur.execute("SELECT id FROM book_categories WHERE name = %s", (category,))
            if not cur.fetchone():
                cur.execute("INSERT INTO book_categories (name) VALUES (%s)", (category,))

    conn.commit()
    cur.close()
    conn.close()
    print(f"✅ Inserted {len(books)} books into the database.")

def update_cover_urls():
    conn = psycopg2.connect(dbname="imdb", user="imdbuser", password="123", host="localhost")
    cur = conn.cursor()

    # Get all book titles
    cur.execute("SELECT id, title FROM books WHERE cover_url IS NULL")
    rows = cur.fetchall()

    for book_id, title in rows:
        # Fetch cover image from Google Books API
        api_url = f"https://www.googleapis.com/books/v1/volumes?q=intitle:{quote(title)}"
        response = requests.get(api_url)

        if response.status_code == 200:
            data = response.json()
            items = data.get("items", [])
            if items:
                image_links = items[0].get("volumeInfo", {}).get("imageLinks", {})
                thumbnail = image_links.get("thumbnail")
                if thumbnail:
                    #Update the book with cover_url
                    cur.execute(
                        "UPDATE books SET cover_url = %s WHERE id = %s",
                        (thumbnail, book_id)
                    )
                    # print(thumbnail)

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Cover URLs updated successfully.")

def extract_and_map_genres():
    conn = psycopg2.connect(dbname="imdb", user="imdbuser", password="123", host="localhost")
    cur = conn.cursor()

    # Step 1: Fetch all book IDs and categories (assuming 'categories' is stored as JSON or text array)
    cur.execute("SELECT id, categories FROM books WHERE categories IS NOT NULL")
    books = cur.fetchall()

    for book_id, categories in books:
        # Parse if stored as stringified JSON
        if isinstance(categories, str):
            try:
                categories = json.loads(categories)
            except json.JSONDecodeError:
                categories = [categories]

        for category in categories:
            # Insert genre if not exists
            cur.execute("SELECT id FROM genres WHERE name = %s", (category,))
            result = cur.fetchone()
            if result:
                genre_id = result[0]
            else:
                cur.execute("INSERT INTO genres (name) VALUES (%s) RETURNING id", (category,))
                genre_id = cur.fetchone()[0]

            # Insert mapping
            cur.execute(
                "INSERT INTO books_genres (book_id, genre_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                (book_id, genre_id)
            )

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Genres extracted and mapped successfully.")

def fetch_and_map_genres_from_api():
    conn = psycopg2.connect(dbname="imdb", user="imdbuser", password="123", host="localhost")
    cur = conn.cursor()

    # Fetch all books (id and title)
    cur.execute("SELECT id, title FROM books")
    books = cur.fetchall()

    for book_id, title in books:
        # Query Google Books API
        api_url = f"https://www.googleapis.com/books/v1/volumes?q=intitle:{quote(title)}"
        response = requests.get(api_url)

        if response.status_code != 200:
            continue

        data = response.json()
        items = data.get("items", [])
        if not items:
            continue

        volume_info = items[0].get("volumeInfo", {})
        categories = volume_info.get("categories", [])

        for category in categories:
            # Insert into genres table (if not already exists)
            cur.execute("SELECT id FROM books_categories WHERE name = %s", (category,))
            result = cur.fetchone()

            if result:
                genre_id = result[0]
            else:
                cur.execute("INSERT INTO books_categories (name) VALUES (%s) RETURNING id", (category,))
                genre_id = cur.fetchone()[0]

            # Insert into books_genres (if not already exists)
            cur.execute("""
                INSERT INTO books_genres (id, genre_id)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
            """, (book_id, genre_id))

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Genres fetched from API and mapped successfully.")

def fetch_maturity_ratings():
    conn = psycopg2.connect(dbname="imdb", user="imdbuser", password="123", host="localhost")
    cur = conn.cursor()

    # Get all books
    cur.execute("SELECT id, title FROM books")
    books = cur.fetchall()

    for book_id, title in books:
        api_url = f"https://www.googleapis.com/books/v1/volumes?q=intitle:{quote(title)}"
        response = requests.get(api_url)

        if response.status_code != 200:
            continue

        data = response.json()
        items = data.get("items", [])
        if not items:
            continue

        volume_info = items[0].get("volumeInfo", {})
        maturity = volume_info.get("maturityRating", None)

        if maturity:
            cur.execute("UPDATE books SET maturity_rating = %s WHERE id = %s", (maturity, book_id))

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Maturity ratings updated for books.")

if __name__ == "__main__":
    # search_terms = ["Suspense", "Philosophy", "Fantasy", "Psychology" , "Adventure", "Romantic" ,"Thriller"]
    # all_books = []
    # for term in search_terms:
    #     all_books.extend(search_books(term))

    # print(f"Fetched {len(all_books)} books.")
    # save_to_postgres(all_books)
    fetch_maturity_ratings()