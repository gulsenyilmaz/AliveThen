import sqlite3

DB_PATH = "humans.db"

def normalize_name(city):
    if not city:
        return city

    c = city.lower()

    if "paris" in c:
        return "Paris"
    if "liverpool" in c:
        return "Liverpool"
    if "palmira" in c:
        return "Palmira"
    if "brussels" in c:
        return "Brussels"
    if "manhattan" in c:
        return "New York"
    if "london" in c:
        return "London"
    if "vienna" in c:
        return "Vienna"
    if "milan" in c:
        return "Milan"
    if "tokyo" in c:
        return "Tokyo"
    if "berlin" in c:
        return "Berlin"
    if "hawaii" in c:
        return "Hawaii"
    if "hyōgo" in c:
        return "Hyōgo"
    if "lyon" in c:
        return "Lyon"
    if "bayern" in c:
        return "Bavaria"
    if "habsburg" in c or "monarchy" in c or "austro-hungarian" in c:
        return None
    if "area" in c or "region" in c:
        return None

    return city.strip().title()  # Varsayılan temizlik

def normalize_birth_cities():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT ConstituentID, BirthCity FROM humans WHERE BirthCity IS NOT NULL")
    rows = cursor.fetchall()

    updated = 0
    for human_id, raw_city in rows:
        new_city = normalize_name(raw_city)
        if new_city != raw_city:
            cursor.execute("UPDATE humans SET BirthCity = ? WHERE ConstituentID = ?", (new_city, human_id))
            updated += 1

    conn.commit()
    conn.close()
    print(f"✅ {updated} birth_city entries normalized.")

if __name__ == "__main__":
    normalize_birth_cities()
