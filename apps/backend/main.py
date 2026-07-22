"""
Compatibility module shim for backend.main
"""
from apps.backend.src.main import app, lifespan

__all__ = ["app", "lifespan"]
