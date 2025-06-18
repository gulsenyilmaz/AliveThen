from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from collections import Counter
from fastapi.responses import JSONResponse
from routes import nationality_trend


app = FastAPI()



# CORS ayarı – Frontend'e veri göndermek için gerekli
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # sadece frontend adresinle sınırlandırabilirsin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "alive_then.db"

app.include_router(nationality_trend.router)

@app.get("/humans")
def get_humans_by_year(year: int = Query(..., description="Selected year")):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    query = """
        SELECT humans.id, humans.name, humans.birth_date, humans.death_date,
        humans.nationality, humans.gender,
        cities.lat AS lat, cities.lon AS lon, cities.name AS city
        FROM humans
        INNER JOIN cities ON humans.birth_city_id = cities.id
        WHERE
        humans.birth_date IS NOT NULL
        AND humans.birth_date != 0
        AND humans.birth_date <= ?
        AND (humans.death_date IS NULL OR humans.death_date >= ?)
        AND (? - humans.birth_date) >= 21
        AND (? - humans.birth_date) <= 100
        ORDER BY humans.birth_date ASC;
    """
    results = cur.execute(query, (year, year, year,year)).fetchall()
    conn.close()

    nationality_counter = Counter()
    city_counter = Counter()
    gender_counter = Counter()

    humans = [dict(row) for row in results]

    for h in humans:
        if h["nationality"]:
            nationality_counter[h["nationality"]] += 1
        if h["city"]:
            city_counter[h["city"]] += 1
            h["city_index"] = city_counter[h["city"]]
        if h["gender"]:
            gender_counter[h["gender"]] += 1

    return JSONResponse({
        "humans": humans,
        "summary": {
            "nationalities": nationality_counter.most_common(),
            "cities": city_counter.most_common(10),
            "genders": gender_counter
        }
    })


@app.get("/nationalities")
def get_nationalities_by_year(year: int = Query(..., description="Selected year")):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    query = """
        SELECT COUNT(id), nationality
        FROM humans
        GROUP BY nationality
        WHERE
        humans.birth_date IS NOT NULL
        AND humans.birth_date != 0
        AND humans.birth_date <= ?
        AND (humans.death_date IS NULL OR humans.death_date >= ?)
        AND (? - humans.birth_date) >= 21
        ORDER BY humans.birth_date ASC;
    """
    results = cur.execute(query, (year, year, year)).fetchall()
    conn.close()

    return [dict(row) for row in results]


@app.get("/works/{creator_id}")
def get_works(creator_id: int, year: int = Query(..., description="Selected year")):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT id, title, date, description, image_url, url
        FROM works
        WHERE creator_id = ?
        AND CAST(Date AS INTEGER) <= ?
        ORDER BY CAST(Date AS INTEGER) ASC
    """, (creator_id, year))

    results = [dict(row) for row in cur.fetchall()]
    conn.close()
    return results
