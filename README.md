# CanopyML 🌿

**AI-Powered Satellite Image Classification & Deforestation Detection Platform**

CanopyML is an end-to-end Machine Learning platform that uses Deep Learning (ResNet50 + Transfer Learning) to classify satellite imagery into 10 land cover classes and automatically detect forest loss between two time periods.

## Features

- **Transfer Learning ML Pipeline:** Custom PyTorch implementation using ResNet50 trained on the EuroSAT dataset.
- **Deforestation Detection:** Compares before/after satellite images to flag forest loss and estimate affected area.
- **FastAPI Backend:** Robust, thread-safe asynchronous API with singleton ML model loading.
- **React Frontend:** Beautiful, responsive SPA built with React, Vite, Tailwind CSS, Framer Motion, and React Query.
- **Automated PDF Reports:** Generates downloadable reports for both classification and deforestation detection.
- **Production Ready:** Dockerized with NGINX, CI/CD GitHub Actions, and Render/Vercel deployment configs.

## Project Structure

```text
CanopyML/
├── ml/               # PyTorch training, evaluation, and inference pipeline
├── backend/          # FastAPI REST API, schemas, and PDF report generation
├── frontend/         # React SPA (Vite + TypeScript + Tailwind)
├── scripts/          # Automation scripts (setup, run_dev, train, evaluate)
├── docker/           # Docker Compose and Dockerfiles
├── models/           # Saved PyTorch model checkpoints
└── reports/          # Generated PDF reports
```

## Quick Start (Development)

### 1. Prerequisites
- Python 3.13+
- Node.js 20+

### 2. Setup
Run the automated setup script to create the Python virtual environment and install all dependencies:
```bash
./scripts/setup.sh
```

### 3. Run the Platform
Start both the FastAPI backend and Vite React frontend concurrently:
```bash
./scripts/run_dev.sh
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend Docs: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

## Machine Learning Pipeline

### Downloading the Dataset
Downloads the EuroSAT dataset (27,000 images, 10 classes) from Zenodo and splits it (80/10/10):
```bash
python scripts/download_dataset.py
```

### Training the Model
Trains the ResNet50 model using a two-stage approach (head fine-tuning, then full unfreezing):
```bash
python scripts/train.py
```
*(Note: A stub model is loaded automatically if you run the app without training first).*

### Evaluating the Model
Evaluates the trained model on the test set and generates confusion matrices and learning curves:
```bash
python scripts/evaluate.py
```

## Deployment

The project is fully dockerized. To run the production build locally using Docker Compose:

```bash
docker-compose up --build -d
```
- The frontend is served via NGINX on `http://localhost:80`.
- The backend is available at `http://localhost:8000`.

Deployment configurations are included for:
- **Render** (`render.yaml` for FastAPI backend)
- **Vercel** (`vercel.json` for React frontend)

## License
MIT License