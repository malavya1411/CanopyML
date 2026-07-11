import React from 'react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  isLoading?: boolean;
  isOnline?: boolean;
  loadingText?: string;
  onlineText?: string;
  offlineText?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  isLoading = false,
  isOnline = false,
  loadingText = 'Connecting…',
  onlineText = 'API Online',
  offlineText = 'API Offline',
}) => {
  if (isLoading) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        padding: '6px 12px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#687268',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <span style={{ fontSize: '12px', color: '#687268', fontWeight: 500 }}>{loadingText}</span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '7px',
      padding: '6px 12px',
      borderRadius: '20px',
      background: isOnline ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
      border: isOnline ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
    }}>
      {/* Pulsing dot */}
      <div style={{ position: 'relative', width: 7, height: 7 }}>
        {isOnline && (
          <motion.div
            style={{
              position: 'absolute', inset: -3,
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.3)',
            }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: isOnline ? '#4ade80' : '#f87171',
          position: 'relative', zIndex: 1,
        }} />
      </div>
      <span style={{
        fontSize: '12px', fontWeight: 600,
        color: isOnline ? '#4ade80' : '#f87171',
        letterSpacing: '0.01em',
      }}>
        {isOnline ? onlineText : offlineText}
      </span>
    </div>
  );
};
