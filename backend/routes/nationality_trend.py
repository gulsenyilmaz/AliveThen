from fastapi import APIRouter, Query
import sqlite3
from collections import defaultdict, Counter
from typing import Dict

router = APIRouter()

DB_PATH = "alive_then.db"


def get_nationality_trend(humans, start_year, end_year, step=10, top_n=8):
    from collections import defaultdict, Counter

    decade_to_nationality = defaultdict(Counter)
    nationality_counts = Counter()

    for h in humans:
        birth = h.get("birth_date")
        nat = h.get("nationality")
        if not birth or birth == 0 or not nat:
            continue

        decade = (birth // step) * step
        if decade > end_year or decade < start_year:
            continue

        nationality_counts[nat] += 1
        decade_to_nationality[decade][nat] += 1

    top_nationalities = [nat for nat, _ in nationality_counts.most_common(top_n)]

    all_decades = list(range(start_year, end_year + 1, step))
    result = defaultdict(dict)

    for nat in top_nationalities:
        for decade in all_decades:
            result[nat][str(decade)] = decade_to_nationality[decade].get(nat, 0)

    return dict(result)


@router.get("/nationality-trend")
def nationality_trend(
    start_year: int = Query(..., description="Start year for analysis"),
    end_year: int = Query(..., description="End year for analysis"),
    step: int = 10
):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT birth_date, nationality
        FROM humans
        WHERE birth_date IS NOT NULL AND birth_date != 0
        AND birth_date BETWEEN ? AND ?
    """, (start_year, end_year))

    rows = [dict(row) for row in cur.fetchall()]
    conn.close()

    return get_nationality_trend(rows, start_year, end_year, step)