import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const CLASS_COLORS: Record<string, string> = {
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

interface ConfidenceChartProps {
  probabilities: Record<string, number>;
  predicted: string;
}

interface TooltipPayload {
  value: number;
  name: string;
  payload: { name: string; value: number; fill: string };
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div style={{
      background: 'rgba(8, 14, 11, 0.97)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#eef2ec', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{name}</p>
      <p style={{ color: '#4ade80', fontSize: '14px', fontWeight: 700 }}>
        {((value as number) * 100).toFixed(2)}%
      </p>
    </div>
  );
};

export const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ probabilities, predicted }) => {
  const data = Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({
      name,
      value,
      fill: CLASS_COLORS[name] || '#4ade80',
      isPredicted: name === predicted,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
          barCategoryGap="30%"
        >
          <XAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={v => `${(v * 100).toFixed(0)}%`}
            tick={{ fill: '#687268', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={({ x, y, payload }: { x: string | number; y: string | number; payload: { value: string } }) => (
              <text
                x={Number(x) - 6}
                y={Number(y)}
                textAnchor="end"
                dominantBaseline="middle"
                fill={payload.value === predicted ? '#4ade80' : '#a8b4a0'}
                fontSize={11}
                fontWeight={payload.value === predicted ? 700 : 400}
                fontFamily="Inter, sans-serif"
              >
                {payload.value}
              </text>
            )}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isPredicted ? entry.fill : 'rgba(255,255,255,0.08)'}
                opacity={entry.isPredicted ? 1 : 0.6}
                stroke={entry.isPredicted ? entry.fill : 'transparent'}
                strokeWidth={entry.isPredicted ? 1 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
