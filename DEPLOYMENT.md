# SurgeGuard HMS – Deployment Guide

This document explains how to run the full stack (FastAPI backend + React/Vite frontend) in both local and containerized environments.

---

## 1. Repository layout (relevant parts)

- `Backend/fastapi_backend/`
  - `app/` – FastAPI code, routers, services
  - `requirements.txt` – backend Python deps
  - `Dockerfile` – backend container image
  - `.env.example` – example backend env vars
- `Frontend/`
  - `src/` – React + Vite SPA
  - `Dockerfile` – frontend container image (builds & serves static files with nginx)
  - `.env.example` – example frontend env vars
- `docker-compose.yml` – runs backend + frontend together

---

## 2. Local development (without Docker)

### 2.1 Backend (FastAPI)

```bash
cd Backend/fastapi_backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # optional, then edit values
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`.

Notes:

- CORS is configured to allow `http://localhost:5173` (Vite dev).
- By default, `TWILIO_DRY_RUN=true` and `OPENAI_DRY_RUN=true` (no external calls).

### 2.2 Frontend (Vite dev server)

```bash
cd Frontend
cp .env.example .env.local   # optional, then edit
pnpm install                 # or npm/yarn if you prefer
pnpm dev                     # or npm run dev / yarn dev
```

Key frontend env vars:

- `VITE_DEMO_MODE`:
  - `true` → uses `MockDataService`, no backend required.
  - `false` → uses HTTP-backed `LiveDataService`.
- `VITE_API_BASE_URL`:
  - When `VITE_DEMO_MODE=false`, should be `http://localhost:8000` for local.

Visit `http://localhost:5173` to use the app.

---

## 3. Containerized deployment (Docker)

### 3.1 Build images manually

From repo root:

#### Backend image

```bash
cd Backend/fastapi_backend
docker build -t surgeguard-backend .
```

#### Frontend image

```bash
cd Frontend
docker build -t surgeguard-frontend .
```

Then run them:

```bash
# Backend
docker run --rm -p 8000:8000 --env-file Backend/fastapi_backend/.env surgeguard-backend

# Frontend (serves static app on port 80 inside container)
docker run --rm -p 5173:80 --env-file Frontend/.env surgeguard-frontend
```

Visit `http://localhost:5173`.

> In a real production deployment you would typically:
> - Put the backend behind a reverse proxy (nginx, Traefik, etc.)
> - Serve the frontend from a CDN or static hosting.

---

## 4. Docker Compose (recommended for local stack)

`docker-compose.yml` at the repo root defines two services:

```yaml
version: "3.9"

services:
  backend:
    build:
      context: ./Backend/fastapi_backend
    env_file:
      - ./Backend/fastapi_backend/.env
    ports:
      - "8000:8000"
    restart: unless-stopped

  frontend:
    build:
      context: ./Frontend
    env_file:
      - ./Frontend/.env
    ports:
      - "5173:80"
    restart: unless-stopped
```

### 4.1 Prepare env files

```bash
cp Backend/fastapi_backend/.env.example Backend/fastapi_backend/.env
cp Frontend/.env.example Frontend/.env
```

Adjust them as needed:

- Backend `.env`:
  - `ENVIRONMENT=production`
  - Twilio:
    - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `TWILIO_DRY_RUN`
  - OpenAI:
    - `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_DRY_RUN`
- Frontend `.env`:
  - `VITE_DEMO_MODE=false` to enable live backend.
  - `VITE_API_BASE_URL=http://backend:8000` (note: `backend` is the container name).

### 4.2 Build and run with Compose

From repo root:

```bash
docker-compose up --build
```

- Backend will be available inside the Compose network as `http://backend:8000`.
- Frontend will be exposed on `http://localhost:5173` (nginx serving the built app).

Stop:

```bash
docker-compose down
```

---

## 5. Environment configuration summary

### Backend (`Backend/fastapi_backend/.env`)

- `ENVIRONMENT`: `development` or `production`.
- Twilio:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_FROM_NUMBER`
  - `TWILIO_DRY_RUN=true|false`
- OpenAI:
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL` (e.g. `gpt-4o-mini`)
  - `OPENAI_DRY_RUN=true|false`

If `*_DRY_RUN` is `true` or keys are missing, the service stays in mock/offline mode for that integration.

### Frontend (`Frontend/.env` or `.env.local`)

- `VITE_DEMO_MODE`:
  - `true`: frontend uses mock data only.
  - `false`: frontend calls backend via HTTP.
- `VITE_API_BASE_URL`:
  - Local dev: `http://localhost:8000`.
  - Docker Compose: `http://backend:8000`.
- `VITE_VERBOSE`:
  - `true` to have `MockDataService` log its activity.

---

## 6. Health checks and quick tests

After bringing the stack up:

- Backend health:

  ```bash
  curl http://localhost:8000/health
  ```

  Expected: `{"status":"ok"}`.

- Frontend basic check:

  Visit `http://localhost:5173` and verify:
  - Dashboard metrics load (not in demo mode).
  - Hospital map shows nodes.
  - Action Hub lists pending actions.
  - Approve/reject actions without errors.
  - Advisory generator returns a draft.

If anything fails at the HTTP layer, the `LiveDataService` throws with a message like:

`HTTP 500 INTERNAL SERVER ERROR: ...` which you can see in the browser console.

---

## 7. Notes for production hardening

This repo now includes:

- Dockerfiles for backend and frontend.
- Example env files for both.
- A simple `docker-compose.yml` for running the full stack.

For a real production setup you’ll likely:

- Add:
  - Reverse proxy (nginx/Traefik) with TLS termination.
  - Centralized logging and monitoring.
- Use:
  - Managed DB instead of in-memory state.
  - Secret management for Twilio/OpenAI keys.

But the current setup is sufficient for:

- Local development.
- Demo deployments (e.g. on a single VM or container platform).
- CI builds that run the full integrated stack.</result>
<task_progress>
- [x] Add CORS configuration to FastAPI backend for frontend origins
- [x] Inspect Frontend structure (services, types, context) for DataService & MockDataService
- [x] Implement LiveDataService (HTTP client) in Frontend/src/services/index.ts using backend API + mapping
- [x] Wire env-based switching between MockDataService and LiveDataService
- [x] Add backend Dockerfile for FastAPI service
- [x] Add backend .env.example documenting TWILIO/OPENAI/env vars
- [x] Add frontend .env.example documenting VITE_DEMO_MODE and VITE_API_BASE_URL
- [x] Add frontend Dockerfile for Vite build + nginx static hosting
- [x] Add docker-compose.yml to run backend and frontend together
- [x] Add short deployment README/notes (DEPLOYMENT.md)
</task_progress>
</attempt_completion>
