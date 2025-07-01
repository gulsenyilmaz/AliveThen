

# Base image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of the app
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run with uvicorn (host 0.0.0.0 = container dışına açılır)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
