import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { GitCompare, Loader2, FileText, TreePine, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';

import { compareImages, requestDeforestationReport, getReportDownloadUrl } from '../api';
import { ImageDropzone } from '../components/ImageDropzone';
import { CLASS_COLORS } from '../types';

export const DeforestationPage: React.FC = () => {
  const [before, setBefore] = useState<File | null>(null);
  const [after,  setAfter]  = useState<File | null>(null);

  const { data, isPending, isError, mutate, reset } = useMutation({
    mutationFn: ([b, a]: [File, File]) => compareImages(b, a),
    onError: () => toast.error('Comparison failed. Is the backend running?'),
  });

  const reportMut = useMutation({
    mutationFn: ([b, a]: [File, File]) => requestDeforestationReport(b, a),
    onSuccess: (r) => {
      const link = document.createElement('a');
      link.href = getReportDownloadUrl(r.download_url);
      link.download = r.filename;
      link.click();
      toast.success('Report downloaded!');
    },
    onError: () => toast.error('Report failed.'),
  });

  const handleRun  = () => { if (before && after) mutate([before, after]); };
  const handleClear = () => { setBefore(null); setAfter(null); reset(); };

  const pctChange = data ? data.percent_change : null;
  const changeColor = pctChange !== null ? (pctChange < 0 ? '#ef5350' : '#2d8c4e') : '#8b949e';

  const barData = data
    ? Object.entries(data.change_by_class)
        .sort(([, a], [, b]) => b - a)
        .map(([cls, cnt]) => ({ name: cls, value: cnt, fill: CLASS_COLORS[cls] || '#888' }))
    : [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
              <GitCompare size={20} className="text-red-400" />
            </div>
            <h1 className="text-3xl font-bold">Deforestation <span className="gradient-text">Detection</span></h1>
          </div>
          <p className="text-[#8b949e]">
            Upload satellite images from two different dates. CanopyML detects where forest was lost.
          </p>
        </motion.div>

        {/* Upload row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#8b949e] mb-3">
              📅 Year 1 — Baseline (Before)
            </p>
            <ImageDropzone
              onFile={setBefore} file={before}
              onClear={() => { setBefore(null); reset(); }}
              label="Upload earlier satellite image"
            />
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#8b949e] mb-3">
              📅 Year 2 — Current (After)
            </p>
            <ImageDropzone
              onFile={setAfter} file={after}
              onClear={() => { setAfter(null); reset(); }}
              label="Upload later satellite image"
            />
          </div>
        </div>

        {/* Action row */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleRun}
            disabled={!before || !after || isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-[#e05c2e] text-white font-semibold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? <><Loader2 size={18} className="animate-spin" /> Analysing…</> : <><GitCompare size={18} /> Detect Deforestation</>}
          </button>
          {data && before && after && (
            <button
              onClick={() => reportMut.mutate([before, after])}
              disabled={reportMut.isPending}
              className="flex items-center gap-2 px-5 py-3 rounded-xl glass text-[#e6edf3] font-medium hover:border-white/25 transition-all disabled:opacity-40"
            >
              {reportMut.isPending ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
              PDF Report
            </button>
          )}
          {data && (
            <button onClick={handleClear} className="px-5 py-3 rounded-xl glass text-[#8b949e] hover:text-white transition-colors">
              Clear
            </button>
          )}
        </div>

        {isError && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <AlertTriangle size={16} className="text-red-400" />
            <p className="text-red-400 text-sm">Detection failed. Check that the backend is running.</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Deforestation Events', value: data.n_deforested.toLocaleString(), color: '#ef5350' },
                  { label: 'Estimated Area',       value: `${data.area_km2.toFixed(2)} km²`, color: '#f9a825' },
                  { label: 'Forest Coverage Y1',   value: `${(data.forest_coverage_2018*100).toFixed(1)}%`, color: '#2d8c4e' },
                  { label: 'Net Forest Change',    value: `${data.percent_change.toFixed(1)}%`, color: changeColor },
                ].map(({ label, value, color }) => (
                  <div key={label} className="glass rounded-2xl p-4 text-center">
                    <p className="text-[#8b949e] text-xs uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-xl font-bold" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Heatmap */}
              {data.heatmap_png && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold text-[#e6edf3] mb-4">Change Detection Map</h2>
                  <img
                    src={`data:image/png;base64,${data.heatmap_png}`}
                    alt="change heatmap"
                    className="w-full rounded-xl"
                  />
                </div>
              )}

              {/* Change by class bar chart */}
              {barData.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold text-[#e6edf3] mb-4">
                    Forest Loss by Destination Class
                  </h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData} margin={{ left: 0, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: '#8b949e', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                        labelStyle={{ color: '#e6edf3' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Patches">
                        {barData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!data && !isPending && (
          <div className="glass rounded-2xl p-16 flex flex-col items-center text-center">
            <TreePine size={56} className="text-[#8b949e] mb-4" />
            <p className="text-[#8b949e] text-lg font-medium">Upload both images to begin analysis</p>
            <p className="text-[#8b949e] text-sm mt-2">Both images must cover the same geographic area.</p>
          </div>
        )}
      </div>
    </div>
  );
};
