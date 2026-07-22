"""
Report Service — generates PDF reports using reportlab.
"""
from __future__ import annotations

import base64
import io
import logging
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image as RLImage, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
)
from reportlab.lib.enums import TA_CENTER

try:
    from apps.backend.src.config.config import settings
except ImportError:
    try:
        from backend.config import settings
    except ImportError:
        from src.config.config import settings

logger = logging.getLogger(__name__)

W, H = A4


class ReportService:
    """Generates professional PDF reports for classification and deforestation results."""

    def __init__(self, reports_dir: Path = settings.reports_dir):
        self.reports_dir = Path(reports_dir)
        self.reports_dir.mkdir(parents=True, exist_ok=True)
        self.styles = getSampleStyleSheet()

    # ── Public: Classification Report ─────────────────────────────────────────

    def generate_classification_report(
        self,
        predicted_class: str,
        confidence: float,
        probabilities: Dict[str, float],
        annotated_image_b64: Optional[str] = None,
        title: str = "CanopyML Classification Report",
    ) -> Path:
        report_id = uuid.uuid4().hex[:8]
        filename  = f"classification_{report_id}.pdf"
        out_path  = self.reports_dir / filename

        doc = SimpleDocTemplate(str(out_path), pagesize=A4,
                                topMargin=2*cm, bottomMargin=2*cm,
                                leftMargin=2*cm, rightMargin=2*cm)
        story = []
        self._add_header(story, title)

        # Image
        if annotated_image_b64:
            self._add_b64_image(story, annotated_image_b64, max_width=14*cm)

        # Results table
        story.append(Spacer(1, 0.5*cm))
        story.append(Paragraph("Classification Results", self.styles["Heading2"]))
        table_data = [
            ["Predicted Class", predicted_class],
            ["Confidence",      f"{confidence*100:.2f}%"],
            ["Timestamp",       datetime.now().strftime("%Y-%m-%d %H:%M:%S")],
        ]
        story.append(self._make_table(table_data))

        # Probabilities
        story.append(Spacer(1, 0.5*cm))
        story.append(Paragraph("Class Probabilities", self.styles["Heading2"]))
        prob_data = [["Class", "Probability (%)"]]
        sorted_probs = sorted(probabilities.items(), key=lambda x: x[1], reverse=True)
        for cls, prob in sorted_probs:
            prob_data.append([cls, f"{prob*100:.2f}%"])
        story.append(self._make_table(prob_data, header=True))

        self._add_footer(story)
        doc.build(story)
        logger.info("Classification report saved: %s", out_path)
        return out_path

    # ── Public: Deforestation Report ──────────────────────────────────────────

    def generate_deforestation_report(
        self,
        n_deforested: int,
        area_km2: float,
        forest_coverage_2018: float,
        forest_coverage_2024: float,
        percent_change: float,
        change_by_class: Dict[str, int],
        heatmap_b64: Optional[str] = None,
        title: str = "CanopyML Deforestation Report",
    ) -> Path:
        report_id = uuid.uuid4().hex[:8]
        filename  = f"deforestation_{report_id}.pdf"
        out_path  = self.reports_dir / filename

        doc = SimpleDocTemplate(str(out_path), pagesize=A4,
                                topMargin=2*cm, bottomMargin=2*cm,
                                leftMargin=2*cm, rightMargin=2*cm)
        story = []
        self._add_header(story, title)

        if heatmap_b64:
            self._add_b64_image(story, heatmap_b64, max_width=15*cm)

        story.append(Spacer(1, 0.5*cm))
        story.append(Paragraph("Deforestation Summary", self.styles["Heading2"]))
        table_data = [
            ["Deforestation Events",  f"{n_deforested:,} patches"],
            ["Estimated Area",        f"{area_km2:.2f} km²"],
            ["Forest Coverage (Y1)",  f"{forest_coverage_2018*100:.1f}%"],
            ["Forest Coverage (Y2)",  f"{forest_coverage_2024*100:.1f}%"],
            ["Net Change",            f"{percent_change:+.1f}%"],
            ["Timestamp",             datetime.now().strftime("%Y-%m-%d %H:%M:%S")],
        ]
        story.append(self._make_table(table_data))

        if change_by_class:
            story.append(Spacer(1, 0.5*cm))
            story.append(Paragraph("Transitions by Destination Class",
                                   self.styles["Heading2"]))
            cls_data = [["Destination Class", "Patches"]]
            for cls, cnt in sorted(change_by_class.items(), key=lambda x: x[1], reverse=True):
                cls_data.append([cls, str(cnt)])
            story.append(self._make_table(cls_data, header=True))

        self._add_footer(story)
        doc.build(story)
        logger.info("Deforestation report saved: %s", out_path)
        return out_path

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _add_header(self, story: list, title: str) -> None:
        title_style = ParagraphStyle(
            "Title", parent=self.styles["Title"],
            fontSize=18, spaceAfter=6, alignment=TA_CENTER,
            textColor=colors.HexColor("#2d8c4e"),
        )
        story.append(Paragraph("🌍 CanopyML", title_style))
        story.append(Paragraph(title, self.styles["Heading1"]))
        story.append(Spacer(1, 0.4*cm))

    def _add_footer(self, story: list) -> None:
        story.append(Spacer(1, 1*cm))
        footer_style = ParagraphStyle(
            "Footer", parent=self.styles["Normal"],
            fontSize=8, textColor=colors.grey, alignment=TA_CENTER,
        )
        story.append(Paragraph(
            f"Generated by CanopyML v1.0 | {datetime.now().strftime('%Y-%m-%d')} | "
            "AI-Powered Satellite Image Analysis",
            footer_style,
        ))

    def _add_b64_image(self, story: list, b64: str, max_width: float) -> None:
        try:
            img_bytes = base64.b64decode(b64)
            buf = io.BytesIO(img_bytes)
            from PIL import Image as PILImage
            pil = PILImage.open(buf)
            aspect = pil.height / pil.width
            rl_img = RLImage(io.BytesIO(img_bytes),
                             width=max_width, height=max_width * aspect)
            story.append(rl_img)
        except Exception as exc:
            logger.warning("Could not embed image in report: %s", exc)

    def _make_table(self, data: list, header: bool = False) -> Table:
        col_widths = [8*cm, 8*cm]
        t = Table(data, colWidths=col_widths)
        style = [
            ("GRID",        (0, 0), (-1, -1), 0.5, colors.grey),
            ("FONTSIZE",    (0, 0), (-1, -1), 10),
            ("ROWBACKGROUNDS", (0, 0), (-1, -1),
             [colors.HexColor("#f5f5f5"), colors.white]),
            ("FONTNAME",    (0, 0), (0, -1),  "Helvetica-Bold"),
            ("PADDING",     (0, 0), (-1, -1), 6),
        ]
        if header:
            style += [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2d8c4e")),
                ("FONTNAME",   (0, 0), (-1, 0), "Helvetica-Bold"),
                ("TEXTCOLOR",  (0, 0), (-1, 0), colors.white),
            ]
        t.setStyle(TableStyle(style))
        return t


report_service = ReportService()
