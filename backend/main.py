"""
Root-level backward compatibility shim for backend.main
"""
import sys
from pathlib import Path

_root = str(Path(__file__).parent.resolve())
if _root not in sys.path:
    sys.path.insert(0, _root)

from apps.backend.src.main import app, lifespan

__all__ = ["app", "lifespan"]
