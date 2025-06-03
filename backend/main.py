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
    WHERE BirthYear <= ? AND DeathYear >= ? AND BirthYear != 0
    ORDER BY BirthYear ASC
    """
    results = cur.execute(query, (year, year)).fetchall()
    conn.close()

    return [dict(row) for row in results]
