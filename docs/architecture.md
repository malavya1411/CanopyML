# CanopyML System Architecture

CanopyML is an AI-powered platform for satellite image land cover classification and deforestation detection. It is organized as a clean, production-ready monorepo.

## Monorepo Layout

```
CanopyML/
├── apps/
│   ├── frontend/         # React + Vite + Tailwind CSS SPA
│   ├── backend/          # FastAPI application & controllers
│   └── ml/               # PyTorch transfer learning engine
│
├── packages/
│   └── shared/           # Cross-cutting constants, types, utils
│
├── models/
│   └── saved_models/     # Trained PyTorch checkpoints (.pth)
│
├── data/
│   ├── logs/             # Training logs & evaluation outputs
│   ├── uploads/          # Temporary file storage
│   └── temp/             # Transient computation files
│
├── docs/                 # System documentation
├── scripts/              # Automation and execution scripts
├── Dockerfile.backend    # Container definition for backend API
├── Dockerfile.frontend   # Container definition for frontend SPA
├── docker-compose.yml    # Multi-container orchestration
├── render.yaml           # Cloud deployment config for Render
├── vercel.json           # Cloud deployment config for Vercel
└── README.md
```

## Component Overview

### 1. Frontend (`apps/frontend`)
- **Framework**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, TanStack Query.
- **Path Aliases**: `@/` maps to `apps/frontend/src/`, `@shared/` maps to `packages/shared/`.
- **Feature Structure**: Grouped by feature (`classification`, `deforestation`, `model`, `upload`).

### 2. Backend (`apps/backend`)
- **Framework**: FastAPI, Uvicorn, Pydantic v2.
- **Architecture**: Separated into controllers, routes, services, schemas, and utils.
- **Controllers**: Handle HTTP validation and error formatting.
- **Services**: Encapsulate core logic (`ml_service`, `report_service`).

### 3. Machine Learning Engine (`apps/ml`)
- **Backbone**: ResNet50 pre-trained on ImageNet.
- **Dataset**: EuroSAT RGB (10 land cover classes, 27,000 satellite image patches).
- **Inference**: Patch-based sliding window classifier for large satellite images.
- **Change Detection**: Matrix comparison between temporal image grids to identify deforested patches.

---

## Data Flow Diagram

```
[ User Browser / Client ]
           │
           │ HTTP POST /api/classify or /api/compare
           ▼
[ Frontend (Nginx / Vite) ]
           │
           │ Proxy to Backend Port 8000
           ▼
[ FastAPI Router ]
           │
           ▼
[ Controller (Validation) ]
           │
           ▼
[ ML Service (Inference) ] ──► [ PyTorch ResNet50 Model ]
           │
           ▼
[ Response JSON / PDF Report ]
```
