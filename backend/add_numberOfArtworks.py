import sqlite3

# DB bağlantıları
conn_art = sqlite3.connect("artworks.db")
conn_hum = sqlite3.connect("humans.db")

cur_art = conn_art.cursor()
cur_hum = conn_hum.cursor()

# Eğer humans tablosunda sütun yoksa önce ekle
cur_hum.execute("ALTER TABLE humans ADD COLUMN numberOfArtworks INTEGER")

# artworks'ten tüm ConstituentID'leri say
cur_art.execute("""
    SELECT ConstituentID, COUNT(*) 
    FROM artworks 
    GROUP BY ConstituentID
""")
art_counts = cur_art.fetchall()

# Her sanatçıya ilgili sayıyı yaz
for constituent_id, count in art_counts:
    # Bazı ConstituentID'ler list gibi olabilir, düz sayı mı kontrol et
    if isinstance(constituent_id, int):
        cur_hum.execute("""
            UPDATE humans 
            SET numberOfArtworks = ? 
            WHERE ConstituentID = ?
        """, (count, constituent_id))

# Kaydet ve kapat
conn_hum.commit()
conn_art.close()
conn_hum.close()

print("Sanatçılara numberOfArtworks alanı başarıyla eklendi.")