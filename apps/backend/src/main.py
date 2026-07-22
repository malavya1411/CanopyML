"""
CanopyML FastAPI Application Entry Point
"""
from __future__ import annotations

import logging
import sys
from contextlib import asynccontextmanager
from pathlib import Path

# Add project root and apps to python path
_root = str(Path(__file__).parent.parent.parent.parent.resolve())
_apps = str(Path(__file__).parent.parent.parent.resolve())
if _root not in sys.path:
    sys.path.insert(0, _root)
if _apps not in sys.path:
    sys.path.insert(0, _apps)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from apps.backend.src.api.routes import classify, compare, model, reports, upload
    from apps.backend.src.config.config import settings
    from apps.backend.src.schemas.schemas import HealthResponse
    from apps.backend.src.services.ml_service import ml_service
except ImportError:
    from src.api.routes import classify, compare, model, reports, upload
    from src.config.config import settings
    from src.schemas.schemas import HealthResponse
    from src.services.ml_service import ml_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("canopyml")


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML model on startup; release on shutdown."""
    logger.info("Starting CanopyML backend…")
    ml_service.load()
    logger.info("Backend ready.")
    yield
    logger.info("Shutting down CanopyML backend.")


# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title       = settings.app_name,
    version     = settings.app_version,
    description = "AI-powered satellite image classification and deforestation detection API.",
    docs_url    = "/api/docs",
    redoc_url   = "/api/redoc",
    lifespan    = lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins     = settings.cors_origins,
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(upload.router)
app.include_router(classify.router)
app.include_router(compare.router)
app.include_router(model.router)
app.include_router(reports.router)


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/api/health", response_model=HealthResponse, tags=["health"])
def health() -> HealthResponse:
    try:
        from apps.ml.config import DEVICE
    except ImportError:
        from ml.config import DEVICE

    return HealthResponse(
        status       = "ok",
        version      = settings.app_version,
        device       = str(DEVICE),
        model_loaded = ml_service._loaded,
    )


@app.get("/", tags=["root"])
def root():
    return {
        "name":    settings.app_name,
        "version": settings.app_version,
        "docs":    "/api/docs",
        "health":  "/api/health",
    }
