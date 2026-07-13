import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  delay?: number;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  label, value, suffix = '', subtitle, icon: Icon,
  color = '#16a34a', delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    className="surface surface-hover"
    style={{ padding: '24px', position: 'relative' }}
  >
    {/* Subtle corner glow */}
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: 80, height: 80,
      background: `radial-gradient(circle at 100% 0%, ${color}10 0%, transparent 70%)`,
      borderRadius: 'inherit',
      pointerEvents: 'none',
    }} />

    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
      {/* Icon tile */}
      <div style={{
        width: 42, height: 42, borderRadius: '11px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}12`,
        border: `1px solid ${color}22`,
      }}>
        <Icon size={20} color={color} />
      </div>
      {/* Label */}
      <span style={{
        fontSize: '11px', fontWeight: 700,
        color: '#6b7280', letterSpacing: '0.1em',
        textTransform: 'uppercase',
        textAlign: 'right',
      }}>
        {label}
      </span>
    </div>

    {/* Value */}
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '32px', fontWeight: 800,
        letterSpacing: '-0.03em', lineHeight: 1,
        color: '#0f172a',
      }}>
        {value}
      </span>
      {suffix && (
        <span style={{ fontSize: '16px', fontWeight: 600, color: color, letterSpacing: '-0.01em' }}>
          {suffix}
        </span>
      )}
    </div>

    {subtitle && (
      <p style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280', fontWeight: 400 }}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

export const MetricsCardSkeleton: React.FC = () => (
  <div className="surface" style={{ padding: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div className="skeleton" style={{ width: 42, height: 42, borderRadius: '11px' }} />
      <div className="skeleton" style={{ width: 80, height: 14, borderRadius: '6px' }} />
    </div>
    <div className="skeleton" style={{ width: '60%', height: 32, borderRadius: '8px', marginBottom: '8px' }} />
    <div className="skeleton" style={{ width: '40%', height: 12, borderRadius: '4px' }} />
  </div>
);
