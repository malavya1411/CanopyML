import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { TreePine, Loader2, FileText, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import toast from 'react-hot-toast';

import { compareImages, requestDeforestationReport, getReportDownloadUrl } from '@/api';
import { ImageDropzone } from '@/features/upload/ImageDropzone';
import { PageHeader } from '@/layouts/PageHeader';

const CLASS_COLORS: Record<string, string> = {
  AnnualCrop: '#d97706', Forest: '#16a34a', HerbaceousVegetation: '#65a30d',
  Highway: '#64748b', Industrial: '#ea580c', Pasture: '#84cc16',
  PermanentCrop: '#ca8a04', Residential: '#dc2626', River: '#2563eb', SeaLake: '#0891b2',
};

const SAMPLES = [
  {
    id: 1,
    title: 'Amazon Rainforest Loss',
    description: 'Dense tropical forest converted to agriculture & crop fields.',
    tag: 'Agricultural',
    color: '#16a34a',
    beforeUrl: '/samples/deforestation/sample1_before.png',
    afterUrl: '/samples/deforestation/sample1_after.png',
  },
  {
    id: 2,
    title: 'Industrial Expansion',
    description: 'Forest clearing for industrial complex & warehouse development.',
    tag: 'Industrial',
    color: '#ea580c',
    beforeUrl: '/samples/deforestation/sample2_before.png',
    afterUrl: '/samples/deforestation/sample2_after.png',
  },
  {
    id: 3,
    title: 'Agricultural Clearing',
    description: 'Forest replaced by pivot irrigation crop fields & pasture.',
    tag: 'Cropland',
    color: '#ca8a04',
    beforeUrl: '/samples/deforestation/sample3_before.png',
    afterUrl: '/samples/deforestation/sample3_after.png',
  },
  {
    id: 4,
    title: 'Urban Sprawl',
    description: 'Forest converted to highway infrastructure & housing units.',
    tag: 'Urbanization',
    color: '#dc2626',
    beforeUrl: '/samples/deforestation/sample4_before.png',
    afterUrl: '/samples/deforestation/sample4_after.png',
  },
  {
    id: 5,
    title: 'River Basin Clearing',
    description: 'Riparian forest loss along active river banks.',
    tag: 'Riparian Loss',
    color: '#2563eb',
    beforeUrl: '/samples/deforestation/sample5_before.png',
    afterUrl: '/samples/deforestation/sample5_after.png',
  },
];

interface StatCardProps { label: string; value: string; color: string; }
const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <div className="surface" style={{ padding: '20px 24px', textAlign: 'center' }}>
    <p style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
      {label}
    </p>
    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 800, letterSpacing: '-0.025em', color }}>
      {value}
    </p>
  </div>
);

export const DeforestationPage: React.FC = () => {
  const [before, setBefore] = useState<File | null>(null);
  const [after,  setAfter]  = useState<File | null>(null);
  const [loadingSampleId, setLoadingSampleId] = useState<number | null>(null);

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

  const handleRun   = () => { if (before && after) mutate([before, after]); };
  const handleClear = () => { setBefore(null); setAfter(null); reset(); };

  const handleLoadSample = async (sample: typeof SAMPLES[0]) => {
    try {
      setLoadingSampleId(sample.id);
      const [resB, resA] = await Promise.all([
        fetch(sample.beforeUrl),
        fetch(sample.afterUrl),
      ]);
      const [blobB, blobA] = await Promise.all([
        resB.blob(),
        resA.blob(),
      ]);
      const fileB = new File([blobB], `${sample.title.toLowerCase().replace(/\s+/g, '_')}_baseline.png`, { type: 'image/png' });
      const fileA = new File([blobA], `${sample.title.toLowerCase().replace(/\s+/g, '_')}_current.png`, { type: 'image/png' });

      setBefore(fileB);
      setAfter(fileA);
      mutate([fileB, fileA]);
      toast.success(`Loaded "${sample.title}" sample!`);
    } catch (err) {
      toast.error('Failed to load sample images.');
    } finally {
      setLoadingSampleId(null);
    }
  };

  const pctChange  = data ? data.percent_change : null;
  const changeColor = pctChange !== null ? (pctChange < 0 ? '#dc2626' : '#16a34a') : '#6b7280';

  const barData = data
    ? Object.entries(data.change_by_class)
        .sort(([, a], [, b]) => b - a)
        .map(([cls, cnt]) => ({ name: cls, value: cnt, fill: CLASS_COLORS[cls] || '#888' }))
    : [];

  return (
    <div className="page-shell">
      <div className="page-container">
        <PageHeader
          icon={TreePine}
          iconColor="#ea580c"
          iconBg="rgba(234,88,12,0.1)"
          title={<>Deforestation <span style={{ color: '#16a34a' }}>Detection</span></>}
          subtitle="Upload satellite images from two different dates. CanopyML detects where forest was lost."
        />

        {/* ── Sample Presets Section ─────────────────────── */}
        <div className="surface" style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={16} color="#16a34a" />
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Test with 5 Preset Satellite Samples
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '18px' }}>
            Select any of the 5 sample satellite image pairs below to run instant change detection and deforestation analysis.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {SAMPLES.map((sample) => (
              <div
                key={sample.id}
                onClick={() => !isPending && loadingSampleId === null && handleLoadSample(sample)}
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  padding: '14px',
                  background: '#ffffff',
                  cursor: isPending || loadingSampleId !== null ? 'wait' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                className="sample-card"
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', background: `${sample.color}15`, color: sample.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {sample.tag}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Sample #{sample.id}</span>
                  </div>

                  {/* Dual image preview thumbnail */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', background: '#f8fafc' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={sample.beforeUrl} alt={`${sample.title} before`} style={{ width: '100%', height: '64px', objectFit: 'cover', display: 'block' }} />
                      <span style={{ position: 'absolute', bottom: 2, left: 4, fontSize: '9px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '1px 4px', borderRadius: '3px' }}>Y1</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <img src={sample.afterUrl} alt={`${sample.title} after`} style={{ width: '100%', height: '64px', objectFit: 'cover', display: 'block' }} />
                      <span style={{ position: 'absolute', bottom: 2, left: 4, fontSize: '9px', background: 'rgba(234,88,12,0.85)', color: '#fff', padding: '1px 4px', borderRadius: '3px' }}>Y2</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                    {sample.title}
                  </p>
                  <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4, marginBottom: '12px' }}>
                    {sample.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 600, color: '#16a34a' }}>
                  {loadingSampleId === sample.id ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c' }}>
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Loading...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Load & Analyze <ArrowRight size={13} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upload Row ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div className="surface" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed' }} />
              <p className="label-caps">Year 1 / Baseline</p>
            </div>
            <ImageDropzone onFile={setBefore} file={before} onClear={() => { setBefore(null); reset(); }} label="Upload earlier satellite image" />
          </div>

          <div className="surface" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ea580c' }} />
              <p className="label-caps">Year 2 / Current</p>
            </div>
            <ImageDropzone onFile={setAfter} file={after} onClear={() => { setAfter(null); reset(); }} label="Upload later satellite image" />
          </div>
        </div>

        {/* ── Action Row ─────────────────────────────── */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={handleRun}
            disabled={!before || !after || isPending}
            className="btn btn-danger btn-lg"
            style={{ flex: 1, minWidth: '200px' }}
          >
            {isPending
              ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analysing…</>
              : <><TreePine size={18} /> Detect Deforestation</>
            }
          </button>

          {data && before && after && (
            <button onClick={() => reportMut.mutate([before, after])} disabled={reportMut.isPending} className="btn btn-secondary" style={{ height: '52px', padding: '0 24px' }}>
              {reportMut.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <FileText size={16} />}
              PDF Report
            </button>
          )}

          {data && (
            <button onClick={handleClear} className="btn btn-secondary" style={{ height: '52px', padding: '0 20px', color: '#6b7280' }}>
              Clear
            </button>
          )}
        </div>

        {/* Error */}
        {isError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', marginBottom: '20px' }}>
            <AlertTriangle size={16} color="#dc2626" />
            <p style={{ fontSize: '13px', color: '#dc2626' }}>Detection failed. Check that the backend is running.</p>
          </div>
        )}

        {/* ── Results ──────────────────────────────────── */}
        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <StatCard label="Deforestation Events" value={data.n_deforested.toLocaleString()} color="#dc2626" />
                <StatCard label="Estimated Area"       value={`${data.area_km2.toFixed(2)} km²`} color="#d97706" />
                <StatCard label="Forest Coverage Y1"   value={`${(data.forest_coverage_2018 * 100).toFixed(1)}%`} color="#16a34a" />
                <StatCard label="Net Forest Change"    value={`${data.percent_change.toFixed(1)}%`} color={changeColor} />
              </div>

              {/* Heatmap */}
              {data.heatmap_png && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="surface" style={{ padding: '28px' }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
                    Change Detection Map
                  </h2>
                  <img src={`data:image/png;base64,${data.heatmap_png}`} alt="Change detection heatmap" style={{ width: '100%', borderRadius: '10px', display: 'block' }} />
                </motion.div>
              )}

              {/* Bar chart */}
              {barData.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="surface" style={{ padding: '28px' }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
                    Forest Loss by Destination Class
                  </h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                        labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                        itemStyle={{ color: '#374151' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Patches">
                        {barData.map((entry, i) => <Cell key={i} fill={entry.fill} opacity={0.85} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!data && !isPending && (
          <div className="surface" style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(234,88,12,0.06)', border: '1px solid rgba(234,88,12,0.1)' }}>
              <TreePine size={32} color="#ea580c" />
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Upload both images or pick a sample above</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Both images must cover the same geographic area.</p>
          </div>
        )}

        {/* Loading state */}
        {isPending && (
          <div className="surface" style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(234,88,12,0.15)', borderTop: '2px solid #ea580c', animation: 'spin 1s linear infinite' }} />
            </div>
            <p style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>Analysing satellite images…</p>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Patchifying and comparing land cover</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .sample-card:hover {
          transform: translateY(-2px);
          border-color: rgba(22, 163, 74, 0.4) !important;
          box-shadow: 0 8px 24px rgba(22, 163, 74, 0.08) !important;
        }
      `}</style>
    </div>
  );
};
