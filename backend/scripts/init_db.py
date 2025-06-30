import sqlite3

DB_PATH = "alive_then.db"

def create_tables():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.executescript("""
    CREATE TABLE IF NOT EXISTS humans (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        birth_date INTEGER,
        death_date INTEGER,
        nationality_id INTEGER,
        gender_id INTEGER,
        qid TEXT UNIQUE,
        num_of_identifiers INTEGER,
        description TEXT,
        img_url TEXT,
        FOREIGN KEY (nationality_id) REFERENCES nationality(id) ON DELETE RESTRICT,
        FOREIGN KEY (gender_id) REFERENCES gender(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        lat REAL,
        lon REAL,
        qid TEXT UNIQUE,
        type_id INTEGER,
        description TEXT,
        img_url TEXT,
        FOREIGN KEY (type_id) REFERENCES location_types(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS location_types (
        id INTEGER PRIMARY KEY,
        label TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS human_location (
        id INTEGER PRIMARY KEY,
        human_id INTEGER NOT NULL,
        location_id INTEGER NOT NULL,
        relationship_type_id INTEGER NOT NULL,
        start_time TEXT,
        end_time TEXT,
        FOREIGN KEY (human_id) REFERENCES humans(id) ON DELETE CASCADE,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
        FOREIGN KEY (relationship_type_id) REFERENCES human_location_types(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS human_location_types (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS occupations (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS human_occupation (
        human_id INTEGER NOT NULL,
        occupation_id INTEGER NOT NULL,
        PRIMARY KEY (human_id, occupation_id),
        FOREIGN KEY (human_id) REFERENCES humans(id) ON DELETE CASCADE,
        FOREIGN KEY (occupation_id) REFERENCES occupations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS nationalities (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS genders (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        location_id INTEGER,
        qid TEXT UNIQUE,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS movements (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS human_movement (
        human_id INTEGER,
        movement_id INTEGER,
        PRIMARY KEY (human_id, movement_id),
        FOREIGN KEY (human_id) REFERENCES humans(id) ON DELETE CASCADE,
        FOREIGN KEY (movement_id) REFERENCES movements(id) ON DELETE CASCADE
    );
    """)

    conn.commit()
    conn.close()
    print("✅ All tables created successfully.")

if __name__ == "__main__":
    create_tables()
