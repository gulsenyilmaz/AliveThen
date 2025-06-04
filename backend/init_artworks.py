import sqlite3
import json
from pathlib import Path

# Dosya yolları
DATA_PATH = Path("../src/data/Artworks.json")  # JSON dosyanın yolu
DB_PATH = Path("artworks.db")  # Oluşturulacak veritabanı

# JSON verisini yükle
with open(DATA_PATH, encoding="utf-8") as f:
    raw_data = json.load(f)

# SQLite bağlantısı
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Eğer tablo varsa sil
cur.execute("DROP TABLE IF EXISTS artworks")

# Yeni tabloyu oluştur
cur.execute("""
CREATE TABLE artworks (
    ObjectID INTEGER PRIMARY KEY,
    Title TEXT,
    ConstituentID INTEGER,
    Date TEXT,
    Medium TEXT,
    ImageURL TEXT,
    URL TEXT
);
""")

# Veriyi ekle
for artwork in raw_data:
    constituent_ids = artwork.get("ConstituentID")
    if constituent_ids and isinstance(constituent_ids, list) and len(constituent_ids) > 0:
        constituent_id = constituent_ids[0]
    else:
        constituent_id = None
    cur.execute("""
        INSERT INTO artworks (ObjectID, Title, ConstituentID, Date, Medium, ImageURL, URL)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        artwork.get("ObjectID"),
        artwork.get("Title"),
        constituent_id,
        artwork.get("Date"),
        artwork.get("Medium"),
        artwork.get("ImageURL"),
        artwork.get("URL")
    ))

conn.commit()
conn.close()

print("artworks.db successfully created with", len(raw_data), "entries.")
