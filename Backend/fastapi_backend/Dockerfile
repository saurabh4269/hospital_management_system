# Backend Dockerfile for SurgeGuard FastAPI service

# 1) Base image with Python
FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# 2) Install system dependencies (if needed later you can add build tools here)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 3) Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4) Copy application code
COPY app ./app

# 5) Default environment configuration
# These can/should be overridden via docker-compose or deployment platform.
ENV ENVIRONMENT=production \
    TWILIO_DRY_RUN=true \
    OPENAI_DRY_RUN=true

# 6) Expose FastAPI port
EXPOSE 8000

# 7) Run with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
