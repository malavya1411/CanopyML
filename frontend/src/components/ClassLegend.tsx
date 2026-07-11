import React from 'react';
import { motion } from 'framer-motion';

export const CLASS_NAMES = [
  'AnnualCrop', 'Forest', 'HerbaceousVegetation', 'Highway',
  'Industrial', 'Pasture', 'PermanentCrop', 'Residential',
  'River', 'SeaLake',
];

export const CLASS_COLORS: Record<string, string> = {
  AnnualCrop:            '#f59e0b',
  Forest:                '#22c55e',
  HerbaceousVegetation:  '#84cc16',
  Highway:               '#94a3b8',
  Industrial:            '#f97316',
  Pasture:               '#a3e635',
  PermanentCrop:         '#eab308',
  Residential:           '#ef4444',
  River:                 '#3b82f6',
  SeaLake:               '#06b6d4',
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
            background: isHighlighted ? `${color}15` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isHighlighted ? color + '40' : 'rgba(255,255,255,0.06)'}`,
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
            background: color,
            boxShadow: isHighlighted ? `0 0 8px ${color}60` : 'none',
          }} />
          <span style={{
            fontSize: compact ? '11px' : '12px',
            fontWeight: isHighlighted ? 600 : 500,
            color: isHighlighted ? '#eef2ec' : '#a8b4a0',
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
