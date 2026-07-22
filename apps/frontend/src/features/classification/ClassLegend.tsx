import React from 'react';
import { motion } from 'framer-motion';

export const CLASS_NAMES = [
  'AnnualCrop', 'Forest', 'HerbaceousVegetation', 'Highway',
  'Industrial', 'Pasture', 'PermanentCrop', 'Residential',
  'River', 'SeaLake',
];

export const CLASS_COLORS: Record<string, string> = {
  AnnualCrop:            '#d97706',
  Forest:                '#16a34a',
  HerbaceousVegetation:  '#65a30d',
  Highway:               '#64748b',
  Industrial:            '#ea580c',
  Pasture:               '#84cc16',
  PermanentCrop:         '#ca8a04',
  Residential:           '#dc2626',
  River:                 '#2563eb',
  SeaLake:               '#0891b2',
};

interface ClassLegendProps {
  compact?: boolean;
  highlightedClass?: string;
}

export const ClassLegend: React.FC<ClassLegendProps> = ({ compact = false, highlightedClass }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: compact
      ? 'repeat(auto-fill, minmax(140px, 1fr))'
      : 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: compact ? '6px' : '8px',
  }}>
    {CLASS_NAMES.map((name, i) => {
      const color = CLASS_COLORS[name];
      const isHighlighted = name === highlightedClass;
      return (
        <motion.div
          key={name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: compact ? '6px 10px' : '8px 12px',
            borderRadius: '8px',
            background: isHighlighted ? `${color}12` : 'rgba(0,0,0,0.02)',
            border: `1px solid ${isHighlighted ? color + '35' : 'rgba(0,0,0,0.07)'}`,
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
            background: color,
            boxShadow: isHighlighted ? `0 0 6px ${color}50` : 'none',
          }} />
          <span style={{
            fontSize: compact ? '11px' : '12px',
            fontWeight: isHighlighted ? 600 : 500,
            color: isHighlighted ? '#0f172a' : '#374151',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {name}
          </span>
        </motion.div>
      );
    })}
  </div>
);
