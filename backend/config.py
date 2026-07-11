"""
CanopyML Backend Configuration
All settings loaded from environment variables with sensible defaults.
"""
from __future__ import annotations

from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # ── App ───────────────────────────────────────────────────────────────────
    app_name:    str = "CanopyML API"
    app_version: str = "1.0.0"
    debug:       bool = False

    # ── CORS ──────────────────────────────────────────────────────────────────
    cors_origins: List[str] = [
        "http://localhost:5173",   # Vite dev
        "http://localhost:3000",
        "http://localhost:80",
        "https://canopyml.vercel.app",
    ]

    # ── Paths (resolved relative to project root) ─────────────────────────────
    project_root:     Path = Path(__file__).parent.parent
    saved_models_dir: Path = Path(__file__).parent.parent / "saved_models"
    reports_dir:      Path = Path(__file__).parent.parent / "reports"
    eval_dir:         Path = Path(__file__).parent.parent / "logs" / "evaluation"
    logs_dir:         Path = Path(__file__).parent.parent / "logs"
    upload_dir:       Path = Path("/tmp/canopyml_uploads")

    # ── Upload limits ─────────────────────────────────────────────────────────
    max_upload_size_mb: int = 50

    # ── Model ─────────────────────────────────────────────────────────────────
    model_version:   str = "1.0.0"
    dataset_version: str = "EuroSAT-RGB-v2"

    def model_post_init(self, __context) -> None:
        """Create required directories on startup."""
        for d in [self.saved_models_dir, self.reports_dir,
                  self.eval_dir, self.upload_dir]:
            Path(d).mkdir(parents=True, exist_ok=True)


settings = Settings()
