import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Brain, FileText, AlertTriangle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { classifyImage, requestClassificationReport, getReportDownloadUrl } from '../api';
import { ImageDropzone } from '../components/ImageDropzone';
import { ConfidenceChart } from '../components/ConfidenceChart';
import { PageHeader } from '../components/PageHeader';

const CLASS_COLORS: Record<string, string> = {
  AnnualCrop: '#f59e0b', Forest: '#22c55e', HerbaceousVegetation: '#84cc16',
  Highway: '#94a3b8', Industrial: '#f97316', Pasture: '#a3e635',
  PermanentCrop: '#eab308', Residential: '#ef4444', River: '#3b82f6', SeaLake: '#06b6d4',
};

export const ClassifyPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const { data, isPending, isError, error, mutate, reset } = useMutation({
    mutationFn: (f: File) => classifyImage(f),
    onError: () => toast.error('Classification failed. Is the backend running?'),
  });

  const reportMut = useMutation({
    mutationFn: (f: File) => requestClassificationReport(f),
    onSuccess: (r) => {
      const a = document.createElement('a');
      a.href = getReportDownloadUrl(r.download_url);
      a.download = r.filename;
      a.click();
      toast.success('Report downloaded!');
    },
    onError: () => toast.error('Report generation failed.'),
  });

  const handleClear = () => { setFile(null); reset(); };
  const handleRun   = () => { if (file) mutate(file); };

  const confidence_pct = data ? (data.confidence * 100).toFixed(1) : null;
  const classColor = data ? (CLASS_COLORS[data.predicted_class] || '#22c55e') : '#22c55e';

  return (
    <div className="page-shell">
      <div className="page-container">
        <PageHeader
          icon={Brain}
          iconColor="#4ade80"
          iconBg="rgba(34, 197, 94, 0.1)"
          title="Image Classification"
          subtitle="Upload a satellite patch and get AI-powered land cover classification."
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
        }}>

          {/* ── LEFT: Upload Panel ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Drop zone card */}
            <div className="surface" style={{ padding: '28px' }}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '15px', fontWeight: 700,
                color: '#eef2ec', marginBottom: '16px',
              }}>
                Upload Satellite Image
              </h2>

              <ImageDropzone onFile={setFile} file={file} onClear={handleClear} label="Drop a satellite patch here" />

              {/* Stub model warning */}
              {data?.is_stub_model && (
                <div style={{
                  marginTop: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '12px 14px', borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                }}>
                  <AlertTriangle size={15} color="#fbbf24" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <p style={{ fontSize: '12px', color: '#fbbf24', lineHeight: 1.5 }}>
                    Using untrained stub model — predictions are random. Run{' '}
                    <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>python scripts/train.py</code> to train.
                  </p>
                </div>
              )}

              {/* Classify button */}
              <button
                onClick={handleRun}
                disabled={!file || isPending}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px', height: '48px', fontSize: '15px' }}
              >
                {isPending ? (
                  <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Classifying…</>
                ) : (
                  <><Brain size={18} /> Classify Image</>
                )}
              </button>

              {isError && (
                <p style={{ marginTop: '10px', color: '#f87171', fontSize: '13px', textAlign: 'center' }}>
                  Error: {(error as Error)?.message || 'Unknown error'}
                </p>
              )}
            </div>

            {/* ── Result Card ──────────────────────────── */}
            <AnimatePresence>
              {data && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="surface"
                  style={{ padding: '28px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <CheckCircle2 size={16} color="#4ade80" />
                    <h2 style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: '15px', fontWeight: 700, color: '#eef2ec',
                    }}>
                      Classification Result
                    </h2>
                    <span style={{
                      marginLeft: 'auto', fontSize: '11px', color: '#687268',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {data.processing_ms.toFixed(0)}ms
                    </span>
                  </div>

                  {/* Predicted class */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    marginBottom: '16px', flexWrap: 'wrap',
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                      background: classColor,
                      boxShadow: `0 0 10px ${classColor}60`,
                    }} />
                    <span style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: '22px', fontWeight: 800,
                      letterSpacing: '-0.02em', color: '#eef2ec',
                    }}>
                      {data.predicted_class}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      padding: '4px 12px', borderRadius: '20px',
                      fontSize: '14px', fontWeight: 700,
                      background: `${classColor}15`,
                      border: `1px solid ${classColor}30`,
                      color: classColor,
                    }}>
                      {confidence_pct}%
                    </span>
                  </div>

                  {/* Confidence bar */}
                  <div style={{
                    height: '6px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.06)',
                    overflow: 'hidden', marginBottom: '20px',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence_pct}%` }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        height: '100%', borderRadius: '6px',
                        background: `linear-gradient(90deg, ${classColor}, ${classColor}bb)`,
                        boxShadow: `0 0 8px ${classColor}50`,
                      }}
                    />
                  </div>

                  {/* PDF Button */}
                  <button
                    onClick={() => file && reportMut.mutate(file)}
                    disabled={reportMut.isPending || !file}
                    className="btn btn-secondary"
                    style={{ width: '100%', height: '44px' }}
                  >
                    {reportMut.isPending ? (
                      <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating PDF…</>
                    ) : (
                      <><FileText size={16} /> Download PDF Report</>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── RIGHT: Annotated + Chart ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <AnimatePresence>
              {/* Annotated image */}
              {data?.annotated_image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="surface"
                  style={{ padding: '28px' }}
                >
                  <h2 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '15px', fontWeight: 700,
                    color: '#eef2ec', marginBottom: '16px',
                  }}>
                    Annotated Result
                  </h2>
                  <img
                    src={`data:image/png;base64,${data.annotated_image}`}
                    alt="Annotated satellite image"
                    style={{ width: '100%', borderRadius: '10px', display: 'block' }}
                  />
                </motion.div>
              )}

              {/* Confidence chart */}
              {data && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                  className="surface"
                  style={{ padding: '28px' }}
                >
                  <h2 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '15px', fontWeight: 700,
                    color: '#eef2ec', marginBottom: '16px',
                  }}>
                    Class Probabilities
                  </h2>
                  <ConfidenceChart
                    probabilities={data.probabilities}
                    predicted={data.predicted_class}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {!data && !isPending && (
              <div className="surface" style={{
                minHeight: '300px', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '48px 24px', textAlign: 'center',
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '20px', marginBottom: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <Sparkles size={32} color="#687268" />
                </div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#a8b4a0', marginBottom: '6px' }}>
                  Results appear here
                </p>
                <p style={{ fontSize: '13px', color: '#687268' }}>
                  Upload an image and click Classify to see predictions.
                </p>
              </div>
            )}

            {/* Loading state */}
            {isPending && (
              <div className="surface" style={{
                minHeight: '300px', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '48px', textAlign: 'center',
              }}>
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    border: '2px solid rgba(34, 197, 94, 0.1)',
                    borderTop: '2px solid #4ade80',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <Brain size={20} color="#4ade80" style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }} />
                </div>
                <p style={{ fontSize: '14px', color: '#a8b4a0', fontWeight: 500 }}>Running inference…</p>
                <p style={{ fontSize: '12px', color: '#687268', marginTop: '4px' }}>
                  ResNet50 classification in progress
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
