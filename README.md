# The Tree Health Project

Reach-based forest health monitoring platform with ML-powered disease, pest, and soil analysis.

## Architecture

```
├── frontend/     React + TypeScript + Tailwind CSS + React Query + Zustand
├── backend/      NestJS API (JWT/OAuth, Firebase, PDF/Excel exports)
└── ml-service/   Python FastAPI (disease, pest, soil models)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Tailwind CSS, React Query, Zustand |
| Maps | React Leaflet / Mapbox (planned) |
| Backend | NestJS, Node.js |
| Database | Firebase |
| Auth | JWT / OAuth |
| Reports | PDF / Excel export service |
| ML | Python FastAPI |

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+ (for ML service)
- Firebase credentials (to be configured)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

API runs at [http://localhost:3000](http://localhost:3000)

### ML Service

```bash
cd ml-service
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

ML API runs at [http://localhost:8000](http://localhost:8000)

## Pages

- **/** — Landing page with platform overview
- **/login** — Authentication (JWT/OAuth ready)

## Environment Variables

See `.env.example` files in each service directory.

## Deployment (Netlify + Render)

### 1. Backend on Render

1. Push this repo to GitHub.
2. In [Render](https://render.com), create a **Blueprint** from `render.yaml`, or add a **Web Service** manually:
   - **Root directory:** `backend`
   - **Build:** `npm install --include=dev && npm run build`
   - **Start:** `npm run start:prod`
   - **Health check:** `/api/health`
3. Set environment variables on Render:
   - `FRONTEND_URL` — your Netlify site URL, e.g. `https://your-app.netlify.app`
   - `JWT_SECRET` — strong random string (auto-generated if using Blueprint)
4. Note the service URL, e.g. `https://tthp-api.onrender.com`.

### 2. Frontend on Netlify

1. In [Netlify](https://netlify.com), connect the same GitHub repo.
2. Netlify reads `netlify.toml` automatically (`base = frontend`, publish `dist`).
3. Set **Environment variables** (Site settings → Environment):
   - `VITE_API_URL` — Render backend URL, e.g. `https://tthp-api.onrender.com`
   - `VITE_FIREBASE_*` — optional, for Firestore cloud sync
4. Deploy. SPA routing and API calls are handled via `VITE_API_URL`.

### 3. Post-deploy checklist

- Confirm `https://your-app.netlify.app` loads and login works (demo credentials).
- Confirm Reports → **Generate PDF** hits Render (`VITE_API_URL` + CORS `FRONTEND_URL`).
- Enable **Anonymous Auth** in Firebase if using Firestore sync.

### Local development

Leave `VITE_API_URL` empty. Vite proxies `/api` to `http://localhost:3000`.
