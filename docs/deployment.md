# CanopyML Deployment Guide

This document explains how to deploy CanopyML locally, with Docker Compose, and on cloud platforms (Render for backend, Vercel for frontend).

---

## 1. Local Development Setup

### Prerequisites
- Node.js >= 20
- Python >= 3.10
- npm >= 9

### Steps
```bash
# 1. Run automated setup script
bash scripts/setup.sh

# 2. Start dev environment (Frontend on :5173, Backend on :8000)
bash scripts/run_dev.sh
```

---

## 2. Docker Compose Deployment

To build and run all services in containerized production mode:

```bash
docker-compose up --build -d
```

### Accessing Services
- **Frontend App**: `http://localhost` (Port 80)
- **Backend API**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/api/docs`

---

## 3. Cloud Deployment: Backend on Render

The repository includes `render.yaml` pre-configured for Render Web Services using Docker.

- **Docker File**: `Dockerfile.backend`
- **Health Check Path**: `/api/health`
- **Disk Mount**: `/app/models` (1 GB persistent storage for trained checkpoints)

---

## 4. Cloud Deployment: Frontend on Vercel

The repository includes `vercel.json` pre-configured for Vercel deployment.

- **Build Command**: `cd apps/frontend && npm install && npm run build`
- **Output Directory**: `apps/frontend/dist`
- **API Rewrite**: `/api/(.*)` -> `https://canopyml-backend.onrender.com/api/$1`
