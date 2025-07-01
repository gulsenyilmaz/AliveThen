FROM python:3.10-slim

WORKDIR /app

# Gerekli dosyaları kopyala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Ana uygulama dosyalarını ve veritabanını kopyala
COPY . .

# .db dosyasını WORKDIR altına kopyala (bu adım önemli!)
# Eğer .db dosyası üst klasördeyse, `COPY ../alive_then.db .` gibi olabilir
COPY alive_then.db ./alive_then.db

# Ortam değişkeni ile kullanılacak yol: /app/alive_then.db
ENV DB_PATH=/app/alive_then.db

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]