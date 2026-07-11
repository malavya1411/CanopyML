import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Brain, Target, Cpu, CheckCircle, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getModelInfo, getModelMetrics } from '../api';
import { MetricsCard, MetricsCardSkeleton } from '../components/MetricsCard';

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

  // Build training curve data from history
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

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#00b4a6]/15 flex items-center justify-center">
              <BarChart3 size={20} className="text-[#00b4a6]" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Model Information</h1>
          </div>
          <p className="text-[#8b949e]">ResNet50 training metrics, evaluation results, and architecture details.</p>
        </motion.div>

        {/* Status banner */}
        {info && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-8 flex items-center gap-3 p-4 rounded-xl border ${
              info.is_stub
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-[#2d8c4e]/10 border-[#2d8c4e]/30'
            }`}
          >
            {info.is_stub
              ? <AlertTriangle size={18} className="text-amber-400" />
              : <CheckCircle size={18} className="text-[#3aad63]" />}
            <div>
              <p className={`font-medium ${info.is_stub ? 'text-amber-400' : 'text-[#3aad63]'}`}>
                {info.is_stub ? 'Stub Model (Untrained)' : 'Trained Model Loaded'}
              </p>
              <p className="text-[#8b949e] text-sm">
                {info.is_stub
                  ? 'Run python scripts/train.py to train the model. Predictions are random until trained.'
                  : `Running on ${info.device} | Trained on ${info.dataset_version}`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Metrics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {infoLoading || metricsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <MetricsCardSkeleton key={i} />)
          ) : (
            <>
              <MetricsCard label="Test Accuracy"   value={info?.accuracy  ? `${(info.accuracy  * 100).toFixed(1)}` : 'N/A'} suffix={info?.accuracy ? '%' : ''} icon={Target}   color="#2d8c4e" delay={0}   />
              <MetricsCard label="Precision"       value={info?.precision ? `${(info.precision * 100).toFixed(1)}` : 'N/A'} suffix={info?.precision ? '%' : ''} icon={Brain}    color="#00b4a6" delay={0.1} />
              <MetricsCard label="Recall"          value={info?.recall    ? `${(info.recall    * 100).toFixed(1)}` : 'N/A'} suffix={info?.recall ? '%' : ''}    icon={BarChart3} color="#f9a825" delay={0.2} />
              <MetricsCard label="F1-Score"        value={info?.f1_score  ? `${(info.f1_score  * 100).toFixed(1)}` : 'N/A'} suffix={info?.f1_score ? '%' : ''} icon={Cpu}      color="#ef5350" delay={0.3} />
            </>
          )}
        </div>

        {/* Info cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-2xl p-5">
            <p className="text-[#8b949e] text-xs uppercase tracking-widest mb-3">Architecture</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#8b949e]">Backbone</span><span className="text-[#e6edf3] font-medium">ResNet50 (ImageNet)</span></div>
              <div className="flex justify-between"><span className="text-[#8b949e]">Head</span><span className="text-[#e6edf3] font-medium">Dropout(0.3) + Linear(2048,10)</span></div>
              <div className="flex justify-between"><span className="text-[#8b949e]">Classes</span><span className="text-[#e6edf3] font-medium">{info?.num_classes ?? 10}</span></div>
              <div className="flex justify-between"><span className="text-[#8b949e]">Device</span><span className="text-[#e6edf3] font-medium">{info?.device ?? '—'}</span></div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-[#8b949e] text-xs uppercase tracking-widest mb-3">Training Config</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#8b949e]">Stage A lr</span><span className="text-[#e6edf3] font-medium">0.001</span></div>
              <div className="flex justify-between"><span className="text-[#8b949e]">Stage B lr</span><span className="text-[#e6edf3] font-medium">0.0001</span></div>
              <div className="flex justify-between"><span className="text-[#8b949e]">Optimizer</span><span className="text-[#e6edf3] font-medium">Adam + ReduceLROnPlateau</span></div>
              <div className="flex justify-between"><span className="text-[#8b949e]">Early Stop</span><span className="text-[#e6edf3] font-medium">Patience = 5</span></div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-[#8b949e] text-xs uppercase tracking-widest mb-3">Dataset</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#8b949e]">Name</span><span className="text-[#e6edf3] font-medium">EuroSAT RGB</span></div>
              <div className="flex justify-between"><span className="text-[#8b949e]">Total Images</span><span className="text-[#e6edf3] font-medium">27,000</span></div>
              <div className="flex justify-between"><span className="text-[#8b949e]">Split</span><span className="text-[#e6edf3] font-medium">80 / 10 / 10</span></div>
              <div className="flex justify-between"><span className="text-[#8b949e]">Version</span><span className="text-[#e6edf3] font-medium">{info?.dataset_version ?? 'EuroSAT-RGB-v2'}</span></div>
            </div>
          </div>
        </div>

        {/* Training curves */}
        {curveData.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="font-semibold text-[#e6edf3] mb-6">Training Curves</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={curveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="epoch" tick={{ fill: '#8b949e', fontSize: 11 }} label={{ value: 'Epoch', position: 'insideBottom', offset: -2, fill: '#8b949e' }} />
                <YAxis yAxisId="left"  tick={{ fill: '#8b949e', fontSize: 11 }} label={{ value: 'Loss', angle: -90, position: 'insideLeft', fill: '#8b949e' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#8b949e', fontSize: 11 }} domain={[0, 100]} label={{ value: 'Val Acc %', angle: 90, position: 'insideRight', fill: '#8b949e' }} />
                <Tooltip contentStyle={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: '#e6edf3' }} />
                <Legend formatter={(v) => <span className="text-[#8b949e] text-xs">{v}</span>} />
                <Line yAxisId="left"  type="monotone" dataKey="loss"    stroke="#ef5350" name="Train Loss"   dot={false} strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="val_acc" stroke="#2d8c4e" name="Val Acc (%)" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Confusion matrix */}
        {metrics?.confusion_matrix_png && (
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-[#e6edf3] mb-4">Confusion Matrix</h2>
            <img
              src={`data:image/png;base64,${metrics.confusion_matrix_png}`}
              alt="confusion matrix"
              className="w-full rounded-xl"
            />
          </div>
        )}

        {/* No data state */}
        {!metricsLoading && !metrics?.confusion_matrix_png && curveData.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <BarChart3 size={48} className="text-[#8b949e] mx-auto mb-4" />
            <p className="text-[#8b949e]">
              No evaluation data yet. Run{' '}
              <code className="text-[#3aad63] font-mono">python scripts/train.py</code> then{' '}
              <code className="text-[#3aad63] font-mono">python scripts/evaluate.py</code> to generate metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
