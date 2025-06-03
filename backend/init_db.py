import sqlite3
import json
from pathlib import Path

# Dosya yolları
DATA_PATH = Path("../src/data/Artists.json")  # JSON dosyanın yolu
DB_PATH = Path("humans.db")  # Oluşturulacak veritabanı

# JSON verisini yükle
with open(DATA_PATH, encoding="utf-8") as f:
    raw_data = json.load(f)

# SQLite bağlantısı
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Eğer tablo varsa sil
cur.execute("DROP TABLE IF EXISTS humans")

# Yeni tabloyu oluştur
cur.execute("""
CREATE TABLE humans (
    ConstituentID INTEGER PRIMARY KEY,
    DisplayName TEXT,
    BirthYear INTEGER,
    DeathYear INTEGER,
    Nationality TEXT,
    City TEXT,
    Gender TEXT,
    Type TEXT
)
""")

# Veriyi ekle
for person in raw_data:
    cur.execute("""
        INSERT INTO humans (ConstituentID, DisplayName, BirthYear, DeathYear, Nationality, City, Gender, Type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        person.get("ConstituentID"),
        person.get("DisplayName"),
        person.get("BeginDate"),
        person.get("EndDate") if person.get("EndDate") != 0 else None,
        person.get("Nationality"),
        person.get("City", None),
        person.get("Gender"),
        "Artist"
    ))

conn.commit()
conn.close()

print("humans.db successfully created with", len(raw_data), "entries.")
