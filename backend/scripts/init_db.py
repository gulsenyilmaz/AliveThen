import sqlite3

DB_PATH = "alive_then.db"

def create_tables():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS humans (
        id INTEGER PRIMARY KEY,
        name TEXT,
        birth_date INTEGER,
        death_date INTEGER,
        nationality TEXT,
        gender TEXT,
        birth_city_id INTEGER
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        lat REAL,
        lon REAL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS works (
        id INTEGER PRIMARY KEY,
        title TEXT,
        creator_id INTEGER,
        date INTEGER,
        description TEXT,
        image_url TEXT,
        url TEXT
    );
    """)

    conn.commit()
    conn.close()
    print("✅ Tables created in", DB_PATH)

if __name__ == "__main__":
    create_tables()