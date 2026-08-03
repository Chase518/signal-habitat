# Build context is the repo root (see docker-compose.yml) so this can
# COPY from analysis-python/ without needing files outside its own tree.
FROM python:3.12-slim

WORKDIR /app

COPY analysis-python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY analysis-python/app ./app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
