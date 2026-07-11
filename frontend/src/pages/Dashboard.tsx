import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Brain, Cpu, Database, Activity, Upload, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getModelInfo, getHealth } from '../api';
import { MetricsCard, MetricsCardSkeleton } from '../components/MetricsCard';
import { ClassLegend } from '../components/ClassLegend';
import { PageHeader } from '../components/PageHeader';

export const Dashboard: React.FC = () => {
  const { data: info,   isLoading: infoLoading }   = useQuery({ queryKey: ['model-info'],   queryFn: getModelInfo,  refetchInterval: 30_000 });
  const { data: health }  = useQuery({ queryKey: ['health'],       queryFn: getHealth,     refetchInterval: 10_000 });

  const SYSTEM_INFO = [
    ['API Version',    health?.version        ?? '—'],
    ['Model Version',  info?.model_version    ?? '—'],
    ['Dataset',        info?.dataset_version  ?? '—'],
    ['Device',         health?.device         ?? '—'],
  ];

  return (
    <div className="page-shell">
      <div className="page-container-wide">

        {/* Header */}
        <PageHeader
          icon={Activity}
          iconColor="#4ade80"
          iconBg="rgba(34, 197, 94, 0.1)"
          title="Dashboard"
          subtitle="CanopyML platform overview and quick actions"
        />

        {/* ── Quick Actions ────────────────────────────────── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px', marginBottom: '24px',
        }}>
          <Link to="/classify" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ y: -3, borderColor: 'rgba(34, 197, 94, 0.25)' }}
              className="surface"
              style={{ padding: '28px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '16px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)',
                }}>
                  <Upload size={26} color="#4ade80" />
                </div>
                <div>
                  <p style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '17px', fontWeight: 700,
                    letterSpacing: '-0.015em',
                    color: '#eef2ec', marginBottom: '4px',
                  }}>
                    Classify Image
                  </p>
                  <p style={{ fontSize: '13px', color: '#687268' }}>
                    Upload a satellite patch for land cover classification
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link to="/deforestation" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ y: -3, borderColor: 'rgba(249, 115, 22, 0.25)' }}
              className="surface"
              style={{ padding: '28px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '16px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(249, 115, 22, 0.1)',
                  border: '1px solid rgba(249, 115, 22, 0.2)',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.1)',
                }}>
                  <TrendingDown size={26} color="#fb923c" />
                </div>
                <div>
                  <p style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '17px', fontWeight: 700,
                    letterSpacing: '-0.015em',
                    color: '#eef2ec', marginBottom: '4px',
                  }}>
                    Detect Deforestation
                  </p>
                  <p style={{ fontSize: '13px', color: '#687268' }}>
                    Compare before & after images to find forest loss
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* ── Metrics ──────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginBottom: '24px',
        }}>
          {infoLoading ? (
            Array.from({ length: 4 }).map((_, i) => <MetricsCardSkeleton key={i} />)
          ) : (
            <>
              <MetricsCard
                label="Model Accuracy"
                icon={Brain} color="#22c55e" delay={0}
                value={info?.accuracy ? `${(info.accuracy * 100).toFixed(1)}` : '—'}
                suffix={info?.accuracy ? '%' : ''}
                subtitle={info?.is_stub ? 'Not trained yet' : 'On test set'}
              />
              <MetricsCard
                label="Land Cover Classes"
                icon={Database} color="#06b6d4" delay={0.08}
                value={info?.num_classes ?? 10}
                subtitle="EuroSAT RGB"
              />
              <MetricsCard
                label="Device"
                icon={Cpu} color="#f59e0b" delay={0.16}
                value={
                  health?.device?.includes('mps') ? 'MPS' :
                  health?.device?.includes('cuda') ? 'CUDA' : 'CPU'
                }
                subtitle={health?.device}
              />
              <MetricsCard
                label="Model Status"
                icon={Activity}
                color={info?.is_stub ? '#f59e0b' : '#22c55e'} delay={0.24}
                value={info?.is_stub ? 'Stub' : 'Trained'}
                subtitle={info?.is_trained ? 'checkpoint loaded' : 'run train.py'}
              />
            </>
          )}
        </div>

        {/* ── EuroSAT Classes ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="surface"
          style={{ padding: '28px', marginBottom: '24px' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #4ade80)',
            }} />
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '15px', fontWeight: 700,
              color: '#eef2ec', letterSpacing: '-0.01em',
            }}>
              EuroSAT Land Cover Classes
            </h2>
          </div>
          <ClassLegend />
        </motion.div>

        {/* ── System Info ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="surface"
          style={{ padding: '28px' }}
        >
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '15px', fontWeight: 700,
            color: '#eef2ec', marginBottom: '20px',
          }}>
            System Information
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
          }}>
            {SYSTEM_INFO.map(([k, v]) => (
              <div key={k}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#687268', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {k}
                </p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#eef2ec', fontFamily: "'JetBrains Mono', monospace" }}>
                  {v}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
