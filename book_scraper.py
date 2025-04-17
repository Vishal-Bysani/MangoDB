import requests
import psycopg2

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

if __name__ == "__main__":
    search_terms = ["Suspense", "Philosophy", "Fantasy", "Psychology" , "Adventure", "Romantic" ,"Thriller"]
    all_books = []
    for term in search_terms:
        all_books.extend(search_books(term))

    print(f"Fetched {len(all_books)} books.")
    save_to_postgres(all_books)
