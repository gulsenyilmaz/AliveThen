import sqlite3
import requests
import time

DB_PATH = "alive_then.db"
USER_AGENT = "AliveThen-CityLookup/1.0 (gulsenyilmaz9@egmail.com)"

def get_coordinates(city_name):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": city_name,
        "format": "json",
        "limit": 1
    }
    headers = {
        "User-Agent": USER_AGENT
    }

    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"⚠️ Error fetching {city_name}: {e}")
    return None, None

def update_city_coordinates():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT id, name FROM cities WHERE lat IS NULL OR lon IS NULL")
    cities = cursor.fetchall()

    print(f"🔍 {len(cities)} cities need coordinates.\n")

    updated = 0
    for city_id, name in cities:
        if not name:
            continue
        print(f"📍 Fetching: {name}...")
        lat, lon = get_coordinates(name)
        if lat is not None and lon is not None:
            cursor.execute("UPDATE cities SET lat = ?, lon = ? WHERE id = ?", (lat, lon, city_id))
            conn.commit()
            print(f"  ✅ {name} → ({lat:.4f}, {lon:.4f})")
            updated += 1
        else:
            print(f"  ❌ Not found: {name}")
        time.sleep(1)  # 🕒 Nominatim rate limit

    conn.close()
    print(f"\n✅ Done. {updated} cities updated with coordinates.")

if __name__ == "__main__":
    update_city_coordinates()