import sqlite3

SOURCE_DB = "humans.db"
TARGET_DB = "alive_then.db"

def copy_city_names():
    source_conn = sqlite3.connect(SOURCE_DB)
    target_conn = sqlite3.connect(TARGET_DB)

    source_cursor = source_conn.cursor()
    target_cursor = target_conn.cursor()

    source_cursor.execute("SELECT DISTINCT BirthCity FROM humans WHERE BirthCity IS NOT NULL")
    cities = [row[0].strip() for row in source_cursor.fetchall() if row[0] and row[0].strip()]

    added = 0
    for city in cities:
        try:
            target_cursor.execute("INSERT OR IGNORE INTO cities (name) VALUES (?)", (city,))
            added += 1
        except Exception as e:
            print(f"⚠️ Error inserting {city}: {e}")

    target_conn.commit()
    print(f"✅ {added} unique cities inserted into alive_then.db")

    source_conn.close()
    target_conn.close()

if __name__ == "__main__":
    copy_city_names()