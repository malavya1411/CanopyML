import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CLASS_COLORS } from '../types';

interface ConfidenceChartProps {
  probabilities: Record<string, number>;
  predicted:     string;
}

export const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ probabilities, predicted }) => {
  const sorted = Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a);

  const pieData = sorted.slice(0, 5).map(([name, value]) => ({
    name, value: +(value * 100).toFixed(2),
    fill: CLASS_COLORS[name] || '#888',
  }));

  const barData = sorted.map(([name, value]) => ({
    name: name.replace('Herbaceous', 'Herb.').replace('Permanent', 'Perm.'),
    value: +(value * 100).toFixed(2),
    fill: CLASS_COLORS[name] || '#888',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass px-3 py-2 rounded-lg text-sm">
        <p className="text-[#e6edf3] font-medium">{payload[0]?.name || payload[0]?.payload?.name}</p>
        <p className="text-[#3aad63]">{payload[0]?.value?.toFixed(2)}%</p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie chart — top 5 */}
      <div>
        <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-4">
          Top 5 Classes
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData} cx="50%" cy="50%" outerRadius={85}
              dataKey="value" nameKey="name" label={({ name, value }) => `${value}%`}
              labelLine={false}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span className="text-[#8b949e] text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart — all classes */}
      <div>
        <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-4">
          All Class Probabilities
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" tick={{ fill: '#8b949e', fontSize: 11 }} unit="%" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#8b949e', fontSize: 10 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {barData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.fill}
                  opacity={entry.name.replace('Herb.', 'Herbaceous').replace('Perm.', 'Permanent') === predicted ? 1 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
