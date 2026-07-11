import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  title: React.ReactNode;
  subtitle?: string;
  right?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon, iconColor = '#4ade80', iconBg = 'rgba(34, 197, 94, 0.1)',
  title, subtitle, right,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    style={{ marginBottom: '40px' }}
  >
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '14px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: iconBg,
          border: `1px solid ${iconColor}25`,
          boxShadow: `0 4px 12px ${iconColor}15`,
        }}>
          <Icon size={22} color={iconColor} />
        </div>
        <div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(22px, 3vw, 30px)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#eef2ec',
            marginBottom: '2px',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '14px', color: '#687268', fontWeight: 400 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  </motion.div>
);
