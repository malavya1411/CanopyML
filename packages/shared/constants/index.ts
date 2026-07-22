// EuroSAT land cover class names (alphabetical order matching ImageFolder default)
export const CLASS_NAMES = [
  'AnnualCrop',
  'Forest',
  'HerbaceousVegetation',
  'Highway',
  'Industrial',
  'Pasture',
  'PermanentCrop',
  'Residential',
  'River',
  'SeaLake',
] as const;

export type ClassName = typeof CLASS_NAMES[number];

// Visual colormap for land cover classes
export const CLASS_COLORS: Record<string, string> = {
  AnnualCrop:           '#f5c242',
  Forest:               '#2d8c4e',
  HerbaceousVegetation: '#a8d5a2',
  Highway:              '#8c8c8c',
  Industrial:           '#e05c2e',
  Pasture:              '#c8e6c9',
  PermanentCrop:        '#f9a825',
  Residential:          '#ef5350',
  River:                '#1565c0',
  SeaLake:              '#29b6f6',
};

export const FOREST_INDEX = 1;
export const NON_FOREST_TARGETS = [0, 2, 4, 5, 6, 7];

export const MODEL_VERSION = '1.0.0';
export const DATASET_VERSION = 'EuroSAT-RGB-v2';
