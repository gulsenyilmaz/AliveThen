import sqlite3

source_db = "works.db"
target_db = "alive_then.db"

def transfer_works():
    source_conn = sqlite3.connect(source_db)
    target_conn = sqlite3.connect(target_db)

    source_cursor = source_conn.cursor()
    target_cursor = target_conn.cursor()

    source_cursor.execute("SELECT ObjectID, Title, ConstituentID, Date, Medium, ImageURL, URL FROM works")
    rows = source_cursor.fetchall()

    count = 0
    for row in rows:
        target_cursor.execute("""
            INSERT OR IGNORE INTO works (id, title, creator_id, date, description, image_url, url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, row)
        count += 1

    target_conn.commit()
    print(f"✅ {count} works transferred.")

    source_conn.close()
    target_conn.close()

if __name__ == "__main__":
    transfer_works()