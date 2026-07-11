import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Brain, Cpu, Database, Activity, Image, Upload, TrendingDown } from 'lucide-react';
import { getModelInfo, getHealth } from '../api';
import { MetricsCard, MetricsCardSkeleton } from '../components/MetricsCard';
import { CLASS_NAMES, CLASS_COLORS } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { data: info,   isLoading: infoLoading  } = useQuery({ queryKey: ['model-info'],   queryFn: getModelInfo,  refetchInterval: 30_000 });
  const { data: health, isLoading: healthLoading } = useQuery({ queryKey: ['health'],       queryFn: getHealth,     refetchInterval: 10_000 });

  const isOnline = health?.status === 'ok';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
              <p className="text-[#8b949e] mt-1">CanopyML platform overview and quick actions</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl glass ${isOnline ? 'border-[#2d8c4e]/40' : 'border-red-500/40'}`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#2d8c4e] animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${isOnline ? 'text-[#3aad63]' : 'text-red-400'}`}>
                {healthLoading ? 'Connecting…' : isOnline ? 'API Online' : 'API Offline'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/classify">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="glass rounded-2xl p-6 cursor-pointer hover:border-[#2d8c4e]/40 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2d8c4e]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={26} className="text-[#3aad63]" />
                </div>
                <div>
                  <p className="font-semibold text-[#e6edf3] text-lg">Classify Image</p>
                  <p className="text-[#8b949e] text-sm">Upload a satellite patch for land cover classification</p>
                </div>
              </div>
            </motion.div>
          </Link>
          <Link to="/deforestation">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="glass rounded-2xl p-6 cursor-pointer hover:border-red-500/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingDown size={26} className="text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-[#e6edf3] text-lg">Detect Deforestation</p>
                  <p className="text-[#8b949e] text-sm">Compare before & after images to find forest loss</p>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {infoLoading ? (
            Array.from({ length: 4 }).map((_, i) => <MetricsCardSkeleton key={i} />)
          ) : (
            <>
              <MetricsCard
                label="Model Accuracy" icon={Brain} color="#2d8c4e" delay={0}
                value={info?.accuracy ? `${(info.accuracy * 100).toFixed(1)}` : '—'}
                suffix={info?.accuracy ? '%' : ''}
                subtitle={info?.is_stub ? 'Not trained yet' : 'On test set'}
              />
              <MetricsCard label="Land Cover Classes" icon={Database} color="#00b4a6" delay={0.1} value={info?.num_classes ?? 10} />
              <MetricsCard
                label="Device"  icon={Cpu}      color="#f9a825" delay={0.2}
                value={health?.device?.includes('mps') ? 'MPS' : health?.device?.includes('cuda') ? 'CUDA' : 'CPU'}
                subtitle={health?.device}
              />
              <MetricsCard
                label="Model Status" icon={Activity} color={info?.is_stub ? '#f9a825' : '#2d8c4e'} delay={0.3}
                value={info?.is_stub ? 'Stub' : 'Trained'}
                subtitle={info?.is_trained ? 'checkpoint loaded' : 'run train.py'}
              />
            </>
          )}
        </div>

        {/* Classes grid */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-[#e6edf3] mb-5">EuroSAT Land Cover Classes</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CLASS_NAMES.map((name) => (
              <div key={name} className="flex items-center gap-2 p-2 rounded-lg bg-white/3 hover:bg-white/6 transition-colors">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: CLASS_COLORS[name] }} />
                <span className="text-[#e6edf3] text-xs font-medium truncate">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System info */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-[#e6edf3] mb-4">System Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 text-sm">
            {[
              ['API Version',    health?.version      ?? '—'],
              ['Model Version',  info?.model_version  ?? '—'],
              ['Dataset',        info?.dataset_version ?? '—'],
              ['Device',         health?.device        ?? '—'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[#8b949e] text-xs uppercase tracking-wide">{k}</p>
                <p className="text-[#e6edf3] font-medium mt-0.5">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
