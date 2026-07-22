# CanopyML REST API Documentation

The CanopyML backend exposes RESTful endpoints for land cover classification, deforestation change detection, report generation, and system health checks.

Base URL: `/api` (or `http://localhost:8000/api`)

---

## Endpoints

### 1. Classification

#### `POST /api/classify`
Classifies a single satellite image into one of 10 EuroSAT land cover classes.

**Request Payload**: `multipart/form-data`
- `file`: Image file (`PNG`, `JPG`, `JPEG`, `TIFF`)
- `return_annotated`: `boolean` (optional, default: `true`)

**Response**:
```json
{
  "predicted_class": "Forest",
  "predicted_index": 1,
  "confidence": 0.9845,
  "probabilities": {
    "AnnualCrop": 0.001,
    "Forest": 0.9845,
    "HerbaceousVegetation": 0.005,
    "Highway": 0.001,
    "Industrial": 0.001,
    "Pasture": 0.002,
    "PermanentCrop": 0.001,
    "Residential": 0.001,
    "River": 0.002,
    "SeaLake": 0.0015
  },
  "annotated_image": "data:image/png;base64,...",
  "is_stub_model": false,
  "processing_ms": 42.8
}
```

---

### 2. Deforestation Change Detection

#### `POST /api/compare`
Compares two satellite images (baseline vs. current) patch-by-patch to compute forest loss.

**Request Payload**: `multipart/form-data`
- `image_before`: Baseline satellite image file
- `image_after`: Current satellite image file
- `return_heatmap`: `boolean` (optional, default: `true`)

**Response**:
```json
{
  "n_deforested": 4,
  "area_km2": 0.16,
  "forest_coverage_2018": 65.2,
  "forest_coverage_2024": 52.1,
  "percent_change": -13.1,
  "change_by_class": {
    "AnnualCrop": 2,
    "Residential": 2
  },
  "heatmap_png": "data:image/png;base64,...",
  "processing_ms": 128.4
}
```

---

### 3. Model Information & Metrics

#### `GET /api/model`
Returns current model metadata and training parameters.

#### `GET /api/model/metrics`
Returns evaluation metrics (accuracy, precision, recall, F1 score, confusion matrix, training curves).

---

### 4. PDF Reports

#### `POST /api/reports/classification`
Generates a downloadable PDF report for a single image classification result.

#### `POST /api/reports/deforestation`
Generates a downloadable PDF report for a deforestation detection analysis.

#### `GET /api/reports/download/{filename}`
Serves the generated PDF file for download.

---

### 5. System Health

#### `GET /api/health`
Returns backend service status, version, compute device (`cuda`, `mps`, or `cpu`), and model load state.
