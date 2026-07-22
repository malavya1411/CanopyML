import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceChartProps {
  probabilities: Record<string, number>;
  predicted: string;
}

export const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ probabilities, predicted }) => {
  // Sort classes by probability descending (ranked list)
  const sorted = Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {sorted.map(([className, probability]) => {
        const isTop = className === predicted;
        const percent = (probability * 100).toFixed(1);
        
        return (
          <div key={className} style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
            {/* Class Label */}
            <span style={{
              width: '150px',
              fontSize: '14px',
              fontWeight: isTop ? 700 : 500,
              color: isTop ? '#10b981' : '#64748b',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'left',
            }}>
              {className}
            </span>
            
            {/* Progress Track */}
            <div style={{
              flex: 1,
              height: '8px',
              borderRadius: '4px',
              background: '#f1f5f9',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  borderRadius: '4px',
                  background: isTop ? '#10b981' : '#cbd5e1',
                }}
              />
            </div>

            {/* Percentage Label */}
            <span style={{
              width: '50px',
              textAlign: 'right',
              fontSize: '14px',
              fontWeight: isTop ? 700 : 500,
              color: isTop ? '#10b981' : '#64748b',
            }}>
              {percent}%
            </span>
          </div>
        );
      })}
    </div>
  );
};
