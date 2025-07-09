import sqlite3
import re

DB_PATH = "alive_then.db"

def clean_date(raw_date):
    if not raw_date:
        return None

    raw_date = raw_date.strip().lower()

    if 'n.d' in raw_date or 'unknown' in raw_date:
        return None

    # Temizleme: parantez içi, model gibi açıklamalar
    raw_date = re.sub(r'\(.*?\)', '', raw_date)
    raw_date = re.sub(r'designed|this example|model', '', raw_date)
    raw_date = re.sub(r'\b(ca\.?|circa|after|before|early|late)\b', '', raw_date)

    # Tüm çizgi türlerini normalize et
    raw_date = raw_date.replace('—', '-').replace('–', '-')

    # Gereksiz karakterleri temizle
    raw_date = re.sub(r'[^0-9a-zA-Z\s\/\-]', '', raw_date)

    raw_date = raw_date.strip()

    # 1973/1994 → ilk yılı al
    if '/' in raw_date:
        parts = raw_date.split('/')
        for part in parts:
            match = re.search(r'\b(18|19|20)\d{2}\b', part)
            if match:
                return match.group(0)

    # 1930-35, 1927-1929 → ilk yılı al
    match_range = re.match(r'(\d{4})-(\d{2,4})', raw_date)
    if match_range:
        return match_range.group(1)

    # 1930s → 1930
    match_decade = re.match(r'(\d{4})s', raw_date)
    if match_decade:
        return match_decade.group(1)

    # c.2003 gibi durumlar (önceden "c." silinmişti)
    match_single_year = re.search(r'\b(18|19|20)\d{2}\b', raw_date)
    if match_single_year:
        return match_single_year.group(0)

    return None


def update_cleaned_dates():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT id, date FROM works")
    rows = cursor.fetchall()

    for work_id, date_str in rows:
        cleaned = clean_date(date_str)
        if cleaned:
            cursor.execute("UPDATE works SET created_date = ? WHERE id = ?", (int(cleaned), work_id))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    update_cleaned_dates()
