import sqlite3

source_db = "humans.db"
target_db = "alive_then.db"

def transfer_humans():
    source_conn = sqlite3.connect(source_db)
    target_conn = sqlite3.connect(target_db)

    source_cursor = source_conn.cursor()
    target_cursor = target_conn.cursor()

    source_cursor.execute("SELECT ConstituentID, DisplayName, BirthYear, DeathYear, Nationality, Gender FROM humans")
    rows = source_cursor.fetchall()

    count = 0
    for row in rows:
        target_cursor.execute("""
            INSERT OR IGNORE INTO humans (id, name, birth_date, death_date, nationality, gender)
            VALUES (?, ?, ?, ?, ?, ?)
        """, row)
        count += 1

    target_conn.commit()
    print(f"✅ {count} humans transferred.")

    source_conn.close()
    target_conn.close()

if __name__ == "__main__":
    transfer_humans()