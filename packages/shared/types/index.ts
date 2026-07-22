// Shared TypeScript type definitions for CanopyML API and Frontend

export interface ClassificationResult {
  predicted_class:  string;
  predicted_index:  number;
  confidence:       number;
  probabilities:    Record<string, number>;
  annotated_image?: string;  // base64 PNG
  is_stub_model:    boolean;
  processing_ms:    number;
}

export interface ChangeDetectionResult {
  n_deforested:          number;
  area_km2:              number;
  forest_coverage_2018:  number;
  forest_coverage_2024:  number;
  percent_change:        number;
  change_by_class:       Record<string, number>;
  heatmap_png?:          string;  // base64 PNG
  processing_ms:         number;
}

export interface ModelInfo {
  model_version:    string;
  dataset_version:  string;
  accuracy?:        number;
  precision?:       number;
  recall?:          number;
  f1_score?:        number;
  class_names:      string[];
  num_classes:      number;
  is_trained:       boolean;
  is_stub:          boolean;
  training_date?:   string;
  device:           string;
}

export interface TrainingHistory {
  stage_a_loss:     number[];
  stage_a_val_acc:  number[];
  stage_b_loss:     number[];
  stage_b_val_acc:  number[];
}

export interface ModelMetrics {
  accuracy?:             number;
  precision?:            number;
  recall?:               number;
  f1?:                   number;
  per_class?:            Record<string, any>;
  training_history?:     TrainingHistory;
  confusion_matrix_png?: string;
  training_curves_png?:  string;
}

export interface UploadResponse {
  file_id:      string;
  filename:     string;
  size_bytes:   number;
  content_type: string;
}

export interface ReportResponse {
  report_id:    string;
  download_url: string;
  filename:     string;
  size_bytes:   number;
  created_at:   string;
}

export interface HealthStatus {
  status:       string;
  version:      string;
  device:       string;
  model_loaded: boolean;
}
