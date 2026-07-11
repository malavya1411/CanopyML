// All TypeScript types shared across the frontend

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

export interface TrainingHistory {
  stage_a_loss:     number[];
  stage_a_val_acc:  number[];
  stage_b_loss:     number[];
  stage_b_val_acc:  number[];
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

// Land cover class info
export const CLASS_NAMES = [
  'AnnualCrop', 'Forest', 'HerbaceousVegetation', 'Highway',
  'Industrial', 'Pasture', 'PermanentCrop', 'Residential',
  'River', 'SeaLake',
] as const;

export const CLASS_COLORS: Record<string, string> = {
  AnnualCrop:             '#f5c242',
  Forest:                 '#2d8c4e',
  HerbaceousVegetation:   '#a8d5a2',
  Highway:                '#8c8c8c',
  Industrial:             '#e05c2e',
  Pasture:                '#c8e6c9',
  PermanentCrop:          '#f9a825',
  Residential:            '#ef5350',
  River:                  '#1565c0',
  SeaLake:                '#29b6f6',
};
