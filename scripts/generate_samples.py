#!/usr/bin/env python3
"""
Generate realistic 256x256 synthetic satellite sample image pairs for Deforestation Detection.
Produces 5 sample pairs in apps/frontend/public/samples/deforestation/
"""
import os
import numpy as np
from PIL import Image, ImageDraw

OUTPUT_DIR = "apps/frontend/public/samples/deforestation"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_base_forest(size=256, noise_scale=20):
    """Create a baseline dense forest satellite image."""
    np.random.seed(42)
    # Base forest color: RGB ~(40, 130, 60)
    base = np.zeros((size, size, 3), dtype=np.uint8)
    base[:, :, 0] = np.clip(35 + np.random.randint(-15, 15, (size, size)), 0, 255)
    base[:, :, 1] = np.clip(130 + np.random.randint(-25, 25, (size, size)), 0, 255)
    base[:, :, 2] = np.clip(55 + np.random.randint(-15, 15, (size, size)), 0, 255)
    return Image.fromarray(base)

# ── Sample 1: Amazon Rainforest Loss (Forest -> Agriculture/Pasture) ──────────
img1_b = create_base_forest()
img1_a = img1_b.copy()
draw = ImageDraw.Draw(img1_a)
# Deforested polygon area
draw.rectangle([40, 40, 200, 180], fill=(235, 200, 110)) # Annual crop gold
# Add field rows
for y in range(50, 175, 12):
    draw.line([(45, y), (195, y)], fill=(210, 175, 85), width=2)
img1_b.save(f"{OUTPUT_DIR}/sample1_before.png")
img1_a.save(f"{OUTPUT_DIR}/sample1_after.png")

# ── Sample 2: Industrial Expansion (Forest -> Industrial) ─────────────────────
img2_b = create_base_forest()
img2_a = img2_b.copy()
draw = ImageDraw.Draw(img2_a)
# Clear forest for industrial complex
draw.rectangle([60, 60, 210, 210], fill=(160, 160, 165)) # Concrete grey
draw.rectangle([80, 80, 140, 130], fill=(215, 80, 50))   # Warehouse red roof
draw.rectangle([155, 140, 195, 195], fill=(225, 95, 60))  # Factory building
draw.line([(60, 135), (210, 135)], fill=(90, 90, 90), width=4) # Access road
img2_b.save(f"{OUTPUT_DIR}/sample2_before.png")
img2_a.save(f"{OUTPUT_DIR}/sample2_after.png")

# ── Sample 3: Agricultural Clearing (Forest -> Crop & Pasture) ────────────────
img3_b = create_base_forest()
img3_a = img3_b.copy()
draw = ImageDraw.Draw(img3_a)
# Circular pivot irrigation & rectangular crop fields
draw.ellipse([20, 20, 130, 130], fill=(240, 210, 90)) # Pivot crop
draw.rectangle([130, 30, 230, 140], fill=(185, 220, 160)) # Pasture
draw.rectangle([50, 140, 210, 230], fill=(230, 190, 80)) # Crop field
img3_b.save(f"{OUTPUT_DIR}/sample3_before.png")
img3_a.save(f"{OUTPUT_DIR}/sample3_after.png")

# ── Sample 4: Urban Sprawl (Forest -> Residential & Highway) ──────────────────
img4_b = create_base_forest()
img4_a = img4_b.copy()
draw = ImageDraw.Draw(img4_a)
# Diagonal highway
draw.line([(0, 40), (256, 200)], fill=(120, 120, 120), width=16)
# Residential neighborhood grid along highway
for x in range(30, 220, 35):
    for y in range(60, 220, 35):
        draw.rectangle([x, y, x+24, y+24], fill=(235, 85, 80)) # Roofs
        draw.rectangle([x-4, y-4, x+28, y+28], outline=(180, 180, 180), width=1)
img4_b.save(f"{OUTPUT_DIR}/sample4_before.png")
img4_a.save(f"{OUTPUT_DIR}/sample4_after.png")

# ── Sample 5: River Basin Clearing (Riparian Forest Loss) ─────────────────────
img5_b = create_base_forest()
# Add blue river flowing through forest
draw_b = ImageDraw.Draw(img5_b)
draw_b.line([(0, 128), (256, 128)], fill=(25, 100, 190), width=24)

img5_a = img5_b.copy()
draw_a = ImageDraw.Draw(img5_a)
# River intact, but riverbanks cleared for pasture and cropland
draw_a.rectangle([20, 30, 236, 110], fill=(175, 215, 155)) # North bank pasture
draw_a.rectangle([20, 146, 236, 226], fill=(240, 200, 100)) # South bank crops
draw_a.line([(0, 128), (256, 128)], fill=(25, 100, 190), width=24) # River remains
img5_b.save(f"{OUTPUT_DIR}/sample5_before.png")
img5_a.save(f"{OUTPUT_DIR}/sample5_after.png")

print("Successfully generated 5 sample pairs in apps/frontend/public/samples/deforestation/")
