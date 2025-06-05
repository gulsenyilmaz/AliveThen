from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

# CORS ayarı – Frontend'e veri göndermek için gerekli
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # sadece frontend adresinle sınırlandırabilirsin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "humans.db"

@app.get("/humans")
def get_humans_by_year(year: int = Query(..., description="Selected year")):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    query = """
    SELECT DisplayName, BirthYear, DeathYear, Nationality, City, Gender, ConstituentID
    FROM humans
    WHERE BirthYear + 21 <= ? 
    AND (
        DeathYear >= ? 
        OR (DeathYear = 0 AND (? - BirthYear) < 100)
    )
    AND BirthYear != 0
    ORDER BY BirthYear ASC
    """
    results = cur.execute(query, (year, year, year)).fetchall()
    conn.close()

    return [dict(row) for row in results]


@app.get("/artworks/{constituent_id}")
def get_artworks(constituent_id: int, year: int = Query(..., description="Selected year")):
    conn = sqlite3.connect("artworks.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT ObjectID, Title, Date, Medium, ImageURL, URL
        FROM artworks
        WHERE ConstituentID = ?
        AND CAST(Date AS INTEGER) <= ?
    """, (constituent_id, year))

    results = [dict(row) for row in cur.fetchall()]
    conn.close()
    return results
