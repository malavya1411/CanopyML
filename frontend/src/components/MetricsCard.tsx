import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  label:      string;
  value:      string | number;
  icon:       LucideIcon;
  color?:     string;
  suffix?:    string;
  delay?:     number;
  subtitle?:  string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  label, value, icon: Icon, color = '#2d8c4e', suffix = '', delay = 0, subtitle,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass rounded-2xl p-5 hover:border-white/20 transition-all duration-300 group"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-[#8b949e] text-xs font-semibold uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-bold mt-1 text-[#e6edf3]">
          {value}{suffix}
        </p>
        {subtitle && <p className="text-[#8b949e] text-xs mt-1">{subtitle}</p>}
      </div>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ background: `${color}25` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
    </div>
    <div className="mt-3 h-0.5 rounded-full" style={{ background: `${color}40` }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '60%' }}
        transition={{ delay: delay + 0.3, duration: 0.6 }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  </motion.div>
);

// Skeleton variant
export const MetricsCardSkeleton: React.FC = () => (
  <div className="glass rounded-2xl p-5">
    <div className="skeleton h-3 w-24 mb-3" />
    <div className="skeleton h-9 w-32 mb-2" />
    <div className="skeleton h-0.5 w-full mt-3" />
  </div>
);
