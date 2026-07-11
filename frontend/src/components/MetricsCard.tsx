import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

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
    className="surface p-6 hover:border-white/20 transition-all duration-300 group max-sm:p-5"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-[#8b949e] text-[11px] font-semibold uppercase tracking-wider leading-snug">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold mt-1 text-[#e6edf3] truncate">
          {value}{suffix}
        </p>
        {subtitle && <p className="text-[#8b949e] text-xs mt-1 truncate">{subtitle}</p>}
      </div>
      <div
        className="icon-tile w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 transition-transform group-hover:scale-105"
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
  <div className="surface p-6 max-sm:p-5">
    <div className="skeleton h-3 w-24 mb-3" />
    <div className="skeleton h-9 w-32 mb-2" />
    <div className="skeleton h-0.5 w-full mt-3" />
  </div>
);
