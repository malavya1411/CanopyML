"""
Backward compatibility module shim for uvicorn backend.main:app
"""
from apps.backend.src.main import app, lifespan

__all__ = ["app", "lifespan"]
