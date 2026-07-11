"""
CanopyML FastAPI Application
Entry point: uvicorn backend.main:app --reload --port 8000
"""
from __future__ import annotations

import logging
import sys
from contextlib import asynccontextmanager
from pathlib import Path

# Allow `import ml.*` from project root
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.config import settings
from backend.models.schemas import HealthResponse
from backend.routers import classify, compare, model, reports, upload
from backend.services.ml_service import ml_service

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
    return HealthResponse(
        status       = "ok",
        version      = settings.app_version,
        device       = str(__import__("ml.config", fromlist=["DEVICE"]).DEVICE),
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
