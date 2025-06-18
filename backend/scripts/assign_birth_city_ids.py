import sqlite3

SOURCE_DB = "humans.db"
TARGET_DB = "alive_then.db"

def assign_birth_city_ids():
    source_conn = sqlite3.connect(SOURCE_DB)
    target_conn = sqlite3.connect(TARGET_DB)

    source_cursor = source_conn.cursor()
    target_cursor = target_conn.cursor()

    # humans.db'den tüm sanatçıları ve şehir isimlerini çek
    source_cursor.execute("SELECT ConstituentID, BirthCity FROM humans")
    rows = source_cursor.fetchall()

    updated = 0
    for human_id, city_name in rows:
        if not city_name:
            continue
        city_name = city_name.strip()

        # cities tablosunda bu şehir adı için id'yi al
        target_cursor.execute("SELECT id FROM cities WHERE name = ?", (city_name,))
        result = target_cursor.fetchone()
        if result:
            city_id = result[0]
            # alive_then.db'deki humans tablosunda eşleşen id'yi güncelle
            target_cursor.execute(
                "UPDATE humans SET birth_city_id = ? WHERE id = ?",
                (city_id, human_id)
            )
            updated += 1

    target_conn.commit()
    print(f"✅ {updated} humans updated with birth_city_id.")

    source_conn.close()
    target_conn.close()

if __name__ == "__main__":
    assign_birth_city_ids()