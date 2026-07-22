# 🌿 CanopyML — Deforestation Detection & Satellite Image Classification Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688.svg?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg?style=flat-square&logo=pytorch)](https://pytorch.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**CanopyML** is a production-grade AI platform for satellite imagery land cover classification and temporal deforestation change detection. Built with ResNet50 transfer learning on EuroSAT Sentinel-2 RGB satellite imagery, FastAPI, React, and Docker.

---

## 📁 Repository Structure

```
CanopyML/
│
├── apps/
│   ├── frontend/         # React 19 + Vite + Tailwind CSS SPA
│   ├── backend/          # FastAPI REST API (Controllers, Routes, Services)
│   └── ml/               # PyTorch ML engine (Preprocessing, Training, Prediction)
│
├── packages/
│   ├── shared/           # Cross-cutting constants, types, and configs
│   └── ui/               # Shared UI component library
│
├── models/
│   └── saved_models/     # Trained PyTorch model checkpoints (.pth)
│
├── data/
│   ├── logs/             # Evaluation metrics & TensorBoard logs
│   ├── uploads/          # Temporary upload storage
│   └── temp/             # Intermediate processing cache
│
├── scripts/              # Setup, dev execution, and training scripts
├── docs/                 # Architecture, API, deployment, & contribution guides
│   ├── architecture.md
│   ├── api.md
│   ├── deployment.md
│   └── contributing.md
│
├── Dockerfile.backend    # Container build definition for backend
├── Dockerfile.frontend   # Container build definition for frontend
├── docker-compose.yml    # Multi-container orchestration
├── render.yaml           # Deployment configuration for Render
├── vercel.json           # Deployment configuration for Vercel
├── README.md
├── requirements.txt
├── package.json
├── .gitignore
└── LICENSE
```

---

## ⚡ Quick Start & Development

### 1. Requirements
- **Node.js**: >= 20.x
- **Python**: >= 3.10
- **Docker** (optional for containerized deployment)

### 2. Installation & Local Setup
```bash
# Clone the repository
git clone https://github.com/malavya1411/CanopyML.git
cd CanopyML

# Run automated setup script (creates python venv & installs node dependencies)
bash scripts/setup.sh
```

### 3. Running in Development Mode
```bash
# Starts FastAPI backend (port 8000) and React frontend (port 5173) concurrently
bash scripts/run_dev.sh
```
- **Frontend App**: `http://localhost:5173`
- **Backend Swagger Docs**: `http://localhost:8000/api/docs`

---

## 🐳 Docker Deployment

<<<<<<< HEAD
### Training the Model
Trains the ResNet50 model using a two-stage approach (head fine-tuning, then full unfreezing):
```bash
python scripts/train.py
```

### Evaluating the Model
Evaluates the trained model on the test set and generates confusion matrices and learning curves:
```bash
python scripts/evaluate.py
```

## License
MIT License
=======
To launch the complete application stack in containerized production mode:

```bash
docker-compose up --build -d
```

- **Frontend Application**: `http://localhost` (Port 80)
- **Backend API**: `http://localhost:8000`

---

## 🤖 ML Engine & Workflow

1. **Dataset**: Uses the EuroSAT RGB dataset (10 land cover classes, 27,000 Sentinel-2 satellite image patches).
2. **Transfer Learning**:
   - **Stage A**: Freeze backbone, train classification head (10 epochs, LR=1e-3).
   - **Stage B**: Unfreeze all layers, full fine-tuning with early stopping (20 epochs, LR=1e-4).
3. **Sliding Window Inference**: Large satellite images are patchified into 64×64 pixel patches with stride=64, classified individually, and reconstructed into land cover grids.
4. **Change Detection**: Matrix comparison between temporal image grids identifies converted forest patches, computing forest coverage percentage, area lost (km²), and change breakdown by class.

### Running ML Scripts
```bash
# Download EuroSAT dataset
python scripts/download_dataset.py

# Train ResNet50 transfer learning model
python scripts/train.py

# Evaluate model and generate performance metrics & confusion matrix
python scripts/evaluate.py
```

---

## 🌐 Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `APP_ENV` | Environment mode (`development`/`production`) | `production` |
| `PORT` | Backend service port | `8000` |
| `CORS_ORIGINS` | JSON list of allowed CORS origins | `["http://localhost:5173"]` |
| `MAX_UPLOAD_SIZE_MB` | Maximum allowed image upload size in MB | `50` |
| `VITE_API_BASE_URL` | Base URL prefix for frontend API requests | `/api` |

---

## 🛰️ API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/classify` | Classify single satellite image into 10 land cover classes |
| `POST` | `/api/compare` | Compare 2 temporal images to detect deforestation & land use change |
| `GET` | `/api/model` | Fetch active model version, accuracy, and metadata |
| `GET` | `/api/model/metrics` | Fetch evaluation metrics, history, and confusion matrix PNG |
| `POST` | `/api/reports/classification` | Generate PDF classification report |
| `POST` | `/api/reports/deforestation` | Generate PDF deforestation report |
| `GET` | `/api/reports/download/{id}` | Download generated PDF report |
| `GET` | `/api/health` | Backend health check & compute device status |

---

## 🛠️ Troubleshooting

- **CORS Errors during local development**: Ensure `backend/.env` has `CORS_ORIGINS=["http://localhost:5173"]`.
- **Model Checkpoint Not Found**: Place trained `best_model.pth` checkpoint inside `models/saved_models/best_model.pth`. If missing, the backend runs gracefully in fallback mode.
- **Port Conflict (8000 or 5173 in use)**: Terminate any process occupying port 8000 or 5173 using `lsof -i :8000` and `kill -9 <PID>`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
>>>>>>> 52209a1 (refactor: restructure backend architecture by migrating API routes to modular controller-based organization and initializing core packages)
