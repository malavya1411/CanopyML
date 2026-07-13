import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getModelInfo, getModelMetrics } from '../api';
import { MetricsCard, MetricsCardSkeleton } from '../components/MetricsCard';
import { PageHeader } from '../components/PageHeader';

export const ModelPage: React.FC = () => {
  const { data: info, isLoading: infoLoading } = useQuery({
    queryKey: ['model-info'],
    queryFn: getModelInfo,
    refetchInterval: 30_000,
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['model-metrics'],
    queryFn: getModelMetrics,
    refetchInterval: 60_000,
  });

  const curveData = React.useMemo(() => {
    const h = metrics?.training_history;
    if (!h) return [];
    const aLen = h.stage_a_loss?.length || 0;
    return [
      ...(h.stage_a_loss || []).map((loss: number, i: number) => ({
        epoch: i + 1, loss, val_acc: (h.stage_a_val_acc?.[i] || 0) * 100, stage: 'A',
      })),
      ...(h.stage_b_loss || []).map((loss: number, i: number) => ({
        epoch: aLen + i + 1, loss, val_acc: (h.stage_b_val_acc?.[i] || 0) * 100, stage: 'B',
      })),
    ];
  }, [metrics]);

  const INFO_PANELS = [
    {
      title: 'Architecture',
      rows: [
        ['Backbone',  'ResNet50 (ImageNet)'],
        ['Head',      'Dropout(0.3) + Linear(2048, 10)'],
        ['Classes',   String(info?.num_classes ?? 10)],
        ['Device',    info?.device ?? '—'],
      ],
    },
    {
      title: 'Training Config',
      rows: [
        ['Stage A lr',  '0.001'],
        ['Stage B lr',  '0.0001'],
        ['Optimizer',   'Adam + ReduceLROnPlateau'],
        ['Early Stop',  'Patience = 5'],
      ],
    },
    {
      title: 'Dataset',
      rows: [
        ['Name',          'EuroSAT RGB'],
        ['Total Images',  '27,000'],
        ['Split',         '80 / 10 / 10'],
        ['Version',       info?.dataset_version ?? 'EuroSAT-RGB-v2'],
      ],
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-container">
        <PageHeader
          icon={BarChart3}
          iconColor="#0891b2"
          iconBg="rgba(8,145,178,0.1)"
          title="Analytics & Model"
          subtitle="ResNet50 training metrics, evaluation results, and architecture details."
        />

        {/* ── Status Banner ──────────────────────────────── */}
        {info && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '14px 18px', borderRadius: '12px', marginBottom: '24px',
              background: info.is_stub ? 'rgba(217,119,6,0.06)' : 'rgba(22,163,74,0.06)',
              border: info.is_stub ? '1px solid rgba(217,119,6,0.2)' : '1px solid rgba(22,163,74,0.2)',
            }}
          >
            {info.is_stub
              ? <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              : <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            }
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px', color: info.is_stub ? '#d97706' : '#16a34a' }}>
                {info.is_stub ? 'Stub Model (Untrained)' : 'Trained Model Loaded'}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                {info.is_stub
                  ? 'Run python scripts/train.py to train the model. Predictions are random until trained.'
                  : `Running on ${info.device} | Trained on ${info.dataset_version}`
                }
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Metrics Card ───────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
          {infoLoading || metricsLoading ? (
            <MetricsCardSkeleton />
          ) : (
            <MetricsCard
              label="Overall Model Accuracy"
              value={info?.accuracy ? `${(info.accuracy * 100).toFixed(1)}` : 'N/A'}
              suffix={info?.accuracy ? '%' : ''}
              icon={Target} color="#16a34a" delay={0}
              subtitle={info?.is_stub ? 'Untrained stub model' : 'Average accuracy score evaluated across a held-out test set of 2,700 sentinel patches.'}
            />
          )}
        </div>

        {/* ── Info Panels ────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {INFO_PANELS.map(({ title, rows }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="surface" style={{ padding: '24px' }}
            >
              <p className="label-caps" style={{ marginBottom: '16px' }}>{title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rows.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{k}</span>
                    <span style={{
                      fontSize: k === 'Head' ? '11px' : '13px',
                      fontWeight: 600, color: '#0f172a',
                      textAlign: 'right',
                      fontFamily: k === 'Backbone' || k === 'Head' || k === 'Device' || k === 'Version' ? "'JetBrains Mono', monospace" : 'inherit',
                    } as React.CSSProperties}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Training Curves ────────────────────────────── */}
        {curveData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="surface" style={{ padding: '28px', marginBottom: '24px' }}
          >
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>
              Training Curves
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={curveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="epoch" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: 'rgba(0,0,0,0.06)' }} tickLine={false} label={{ value: 'Epoch', position: 'insideBottom', offset: -4, fill: '#6b7280', fontSize: 11 }} />
                <YAxis yAxisId="left"  tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Loss', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Val Acc %', angle: 90, position: 'insideRight', fill: '#6b7280', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                  labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Legend formatter={(v) => <span style={{ color: '#374151', fontSize: '12px' }}>{v}</span>} />
                <Line yAxisId="left"  type="monotone" dataKey="loss"    stroke="#dc2626" name="Train Loss"   dot={false} strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="val_acc" stroke="#16a34a" name="Val Acc (%)" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* ── Confusion Matrix ───────────────────────────── */}
        {metrics?.confusion_matrix_png && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="surface" style={{ padding: '28px' }}
          >
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              Confusion Matrix
            </h2>
            <img src={`data:image/png;base64,${metrics.confusion_matrix_png}`} alt="Confusion matrix" style={{ width: '100%', borderRadius: '10px', display: 'block' }} />
          </motion.div>
        )}

        {/* No data state */}
        {!metricsLoading && !metrics?.confusion_matrix_png && curveData.length === 0 && (
          <div className="surface" style={{ padding: '48px', textAlign: 'center' }}>
            <BarChart3 size={48} color="#16a34a" style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <p style={{ color: '#374151', fontWeight: 600, marginBottom: '6px' }}>No evaluation data yet</p>
            <p style={{ color: '#6b7280', fontSize: '13px' }}>
              Run{' '}
              <code style={{ color: '#16a34a', fontFamily: 'monospace' }}>python scripts/train.py</code>
              {' '}then{' '}
              <code style={{ color: '#16a34a', fontFamily: 'monospace' }}>python scripts/evaluate.py</code>
              {' '}to generate metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
