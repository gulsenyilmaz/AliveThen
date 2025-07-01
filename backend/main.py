from fastapi import FastAPI, Query
from fastapi import Request
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
        SELECT 
            h.id, h.name, h.birth_date, h.death_date,
            n.name AS nationality, g.name AS gender,
            l.lat AS lat, l.lon AS lon, l.name AS city,
            h.num_of_identifiers
        FROM humans h
        INNER JOIN human_location hl ON hl.human_id = h.id
        INNER JOIN locations l ON hl.location_id = l.id
        INNER JOIN genders g ON g.id = h.gender_id
        INNER JOIN nationalities n ON n.id = h.nationality_id
        WHERE
            hl.relationship_type_id = 4
            AND h.birth_date IS NOT NULL
            AND h.birth_date != 0
            AND h.birth_date <= ?
            AND (h.death_date IS NULL OR h.death_date >= ?)
            AND (? - h.birth_date) >= 21
            AND (? - h.birth_date) <= 100
        ORDER BY h.birth_date ASC;
    """
    results = cur.execute(query, (year, year, year,year)).fetchall()
    conn.close()

    nationality_counter = Counter()
    city_counter = Counter()
    gender_counter = Counter()

    humans = [dict(row) for row in results]

    for h in humans:
        h["entity_type"] = "human"
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

@app.get("/allhumans")
def get_humans(
    request: Request
):
    qp = request.query_params

    occupation_id = qp.get("occupation_id")
    gender_id = qp.get("gender_id")
    nationality_id = qp.get("nationality_id")
    location_id = qp.get("location_id")
    relationship_type_id = qp.get("relationship_type_id")  # optional

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    base_query = """
        SELECT 
            h.id, h.name, h.birth_date, h.death_date,
            n.name AS nationality, g.name AS gender,
            l.lat AS lat, l.lon AS lon, l.name AS city,
            h.num_of_identifiers
        FROM humans h
        INNER JOIN human_location hl ON hl.human_id = h.id
        INNER JOIN locations l ON hl.location_id = l.id
        INNER JOIN genders g ON g.id = h.gender_id
        INNER JOIN nationalities n ON n.id = h.nationality_id
        WHERE 
            h.birth_date IS NOT NULL
            AND h.birth_date != 0
            AND hl.relationship_type_id = 4
    """

    params = []

    if location_id:
        base_query += """
            AND h.id IN (
                SELECT human_id FROM human_location AS filtered_hl WHERE filtered_hl.location_id = ?
        """
        params.append(location_id)

        if relationship_type_id:
            base_query += " AND filtered_hl.relationship_type_id = ?"
            params.append(relationship_type_id)
        
        base_query += """
            )
        """

    if occupation_id:
        base_query += """
            AND h.id IN (
                SELECT human_id FROM human_occupation WHERE occupation_id = ?
            )
        """
        params.append(occupation_id)

    if gender_id:
        base_query += " AND h.gender_id = ?"
        params.append(gender_id)

    if nationality_id:
        base_query += " AND h.nationality_id = ?"
        params.append(nationality_id)

    base_query += " ORDER BY h.birth_date ASC"

    results = cur.execute(base_query, params).fetchall()
    conn.close()

    humans = [dict(row) for row in results]
    city_counter = Counter()
    for h in humans:
        h["entity_type"] = "human"
        if h["city"]:
            city_counter[h["city"]] += 1
            h["city_index"] = city_counter[h["city"]]

    return JSONResponse({"humans": humans})


# @app.get("/nationalities")
# def get_nationalities_by_year(year: int = Query(..., description="Selected year")):
#     conn = sqlite3.connect(DB_PATH)
#     conn.row_factory = sqlite3.Row
#     cur = conn.cursor()

#     query = """
#         SELECT COUNT(id), nationality
#         FROM humans
#         GROUP BY nationality
#         WHERE
#         humans.birth_date IS NOT NULL
#         AND humans.birth_date != 0
#         AND humans.birth_date <= ?
#         AND (humans.death_date IS NULL OR humans.death_date >= ?)
#         AND (? - humans.birth_date) >= 21
#         ORDER BY humans.birth_date ASC;
#     """
#     results = cur.execute(query, (year, year, year)).fetchall()
#     conn.close()

#     return [dict(row) for row in results]


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

@app.get("/person/{human_id}")
def get_person_details(human_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("SELECT description, img_url, signature_url FROM humans WHERE id = ?", (human_id,))
    row = cur.fetchone()
    if not row:
        return {"error": "person not found"}

    description, img_url, signature_url = row

    cur.execute("""
        SELECT l.id, l.name, hlt.name AS relationship_type_name, hl.start_date, hl.end_date, l.lat, l.lon
        FROM human_location AS hl
        JOIN locations AS l ON l.id = hl.location_id
        JOIN human_location_types AS hlt ON hlt.id = hl.relationship_type_id
        WHERE hl.human_id = ?
    """, (human_id,))
    locs = [{
        "id": id,
        "name": name,
        "relationship_type_name": relationship_type_name,
        "start_date": start,
        "end_date": end,
        "lat":lat,
        "lon":lon,
        "entity_type": "location",
        "tooltip_text":name
    } for id, name, relationship_type_name, start, end, lat, lon in cur.fetchall()]

    cur.execute("""
        SELECT o.name AS name
        FROM human_occupation AS ho
        JOIN occupations AS o ON o.id = ho.occupation_id
        WHERE ho.human_id = ?
    """, (human_id,))

    occs = [row["name"] for row in cur.fetchall()] 
    conn.close()

    return {
        "description": description,
        "img_url": img_url,
        "signature_url":signature_url,
        "locations": locs,
        "occupations":occs
    }


@app.get("/location/{location_id}")
def get_location_details(location_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

   
    cur.execute("SELECT description, image_url FROM locations WHERE id = ?", (location_id,))
    row = cur.fetchone()
    if not row:
        return {"error": "location not found"}
    description, img_url = row

    # # 2. relationship_type_id lookup
    # cur.execute("SELECT id FROM human_location_types WHERE name = ?", (relationship_type_name,))
    # rel_type_row = cur.fetchone()
    # if not rel_type_row:
    #     return {"error": f"relationship_type_name '{relationship_type_name}' not found"}
    # relationship_type_id = rel_type_row["id"]

    # # 3. humans at this location with given relationship
    # query = """
    #      SELECT 
    #         h.id, h.name, h.birth_date, h.death_date,
    #         n.name AS nationality, g.name AS gender,
    #         l.lat AS lat, l.lon AS lon, l.name AS city,
    #         h.num_of_identifiers, h.signature_url
    #     FROM humans h
    #     INNER JOIN human_location hl ON hl.human_id = h.id
    #     INNER JOIN locations l ON hl.location_id = l.id
    #     INNER JOIN genders g ON g.id = h.gender_id
    #     INNER JOIN nationalities n ON n.id = h.nationality_id
    #     WHERE
    #         hl.relationship_type_id = 4
    #         AND h.birth_date IS NOT NULL
    #         AND h.birth_date != 0
    #         AND h.id IN (SELECT hu.id
    #                             FROM human_location AS hul
    #                             INNER JOIN humans AS hu ON hu.id = hul.human_id
    #                             WHERE hul.location_id = ? AND hul.relationship_type_id = ?)
    #         ORDER BY h.birth_date ASC;
    # """

    # results = cur.execute(query, (location_id, relationship_type_id)).fetchall()
    conn.close()
       
    return JSONResponse({
        "details":{
            "description": description,
            "img_url": img_url
        }
    }) 


@app.get("/occupations")
def get_occupations():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    query = """
        SELECT 
           o.id, o.name, COUNT(ho.human_id) AS co
        FROM human_occupation ho
        INNER JOIN occupations o ON ho.occupation_id = o.id
        GROUP BY ho.occupation_id
        ORDER BY co DESC
        LIMIT 45;
    """

    results = cur.execute(query).fetchall()
    conn.close()

    occupations = [dict(row) for row in results]
    
       
    return JSONResponse({
        "occupations": occupations
    }) 

@app.get("/genders")
def get_genders():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    query = """
        SELECT 
           g.id, g.name, COUNT(h.gender_id) AS cg
        FROM genders g
        INNER JOIN humans h ON h.gender_id = g.id
        GROUP BY h.gender_id
        ORDER BY cg DESC
    """

    results = cur.execute(query).fetchall()
    conn.close()

    genders = [dict(row) for row in results]
    
       
    return JSONResponse({
        "genders": genders
    }) 


@app.get("/nationalities")
def get_nationalities():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    query = """
        SELECT 
           n.id, n.name, COUNT(h.id) AS cn
        FROM nationalities n
        INNER JOIN humans h ON h.nationality_id = n.id
        WHERE h.nationality_id IS NOT NULL
        GROUP BY n.id
        ORDER BY cn DESC
    """

    results = cur.execute(query).fetchall()
    conn.close()

    nationalities = [dict(row) for row in results]
    
    return JSONResponse({"nationalities": nationalities})