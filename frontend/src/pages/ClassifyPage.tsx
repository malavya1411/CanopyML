import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Brain, FileText, AlertTriangle, CheckCircle2, Loader2, Sparkles, Crop } from 'lucide-react';
import toast from 'react-hot-toast';

import { classifyImage, requestClassificationReport, getReportDownloadUrl } from '../api';
import { ImageDropzone } from '../components/ImageDropzone';
import { ConfidenceChart } from '../components/ConfidenceChart';
import { PageHeader } from '../components/PageHeader';
import { ImageGridCropper } from '../components/ImageGridCropper';

const CLASS_COLORS: Record<string, string> = {
  AnnualCrop: '#d97706', Forest: '#16a34a', HerbaceousVegetation: '#65a30d',
  Highway: '#64748b', Industrial: '#ea580c', Pasture: '#84cc16',
  PermanentCrop: '#ca8a04', Residential: '#dc2626', River: '#2563eb', SeaLake: '#0891b2',
};

export const ClassifyPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [fileDimensions, setFileDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isCropping, setIsCropping] = useState(false);

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

  const handleClear = () => {
    setFile(null); setRawFile(null); setFileDimensions(null); setIsCropping(false); reset();
  };

  const handleRun = () => { if (file) mutate(file); };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile); setRawFile(selectedFile);
    const img = new Image();
    img.onload = () => setFileDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = URL.createObjectURL(selectedFile);
  };

  const handleAutoCropCenter = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const startX = Math.max(0, Math.floor((img.naturalWidth - 64) / 2));
        const startY = Math.max(0, Math.floor((img.naturalHeight - 64) / 2));
        ctx.drawImage(img, startX, startY, 64, 64, 0, 0, 64, 64);
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], `center_crop_${file.name}`, { type: 'image/png' });
            setFile(croppedFile); setFileDimensions({ width: 64, height: 64 });
            toast.success('Successfully auto-cropped center 64×64 patch!');
          }
        }, 'image/png');
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const confidence_pct = data ? (data.confidence * 100).toFixed(1) : null;
  const classColor = data ? (CLASS_COLORS[data.predicted_class] || '#16a34a') : '#16a34a';

  return (
    <div className="page-shell">
      <div className="page-container">
        <PageHeader
          icon={Brain}
          iconColor="#16a34a"
          iconBg="rgba(22,163,74,0.1)"
          title="Image Classification"
          subtitle="Upload a satellite patch and get AI-powered land cover classification."
        />

        {isCropping && rawFile ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ImageGridCropper
              imageFile={rawFile}
              onCropConfirmed={(croppedFile) => { setFile(croppedFile); setRawFile(null); setIsCropping(false); }}
              onCancel={() => { setRawFile(null); setIsCropping(false); }}
            />
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

            {/* ── LEFT: Upload Panel ─────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Drop zone card */}
              <div className="surface" style={{ padding: '28px' }}>
                <h2 style={{
                  fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700,
                  color: '#0f172a', marginBottom: '16px',
                }}>
                  Upload Satellite Image
                </h2>

                <ImageDropzone onFile={handleFileSelect} file={file} onClear={handleClear} label="Drop a satellite patch here" />

                {file && (
                  <button
                    type="button"
                    onClick={() => { setRawFile(file); setIsCropping(true); }}
                    className="btn btn-secondary"
                    style={{ width: '100%', marginTop: '12px', height: '40px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Crop size={15} /> Crop 64×64 Patch (Optional)
                  </button>
                )}

                {fileDimensions && (fileDimensions.width > 64 || fileDimensions.height > 64) && (
                  <div style={{
                    marginTop: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '12px 14px', borderRadius: '10px',
                    background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)',
                  }}>
                    <AlertTriangle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>
                      <p style={{ color: '#d97706', fontWeight: 600, marginBottom: '2px' }}>
                        Large Image Detected ({fileDimensions.width}×{fileDimensions.height})
                      </p>
                      <p style={{ marginBottom: '8px' }}>
                        The model is trained on 64×64 patches. Resizing this large image directly causes scaling distortion.
                      </p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button
                          type="button"
                          onClick={() => { setRawFile(file); setIsCropping(true); }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '11px', height: '28px', padding: '0 12px', borderColor: 'rgba(22,163,74,0.4)', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Crop size={11} /> Manual Crop Grid
                        </button>
                        <button type="button" onClick={handleAutoCropCenter} className="btn btn-secondary btn-sm" style={{ fontSize: '11px', height: '28px', padding: '0 12px' }}>
                          Auto-Crop Center
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {data?.is_stub_model && (
                  <div style={{
                    marginTop: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '12px 14px', borderRadius: '10px',
                    background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)',
                  }}>
                    <AlertTriangle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ fontSize: '12px', color: '#d97706', lineHeight: 1.5 }}>
                      Using untrained stub model — predictions are random. Run{' '}
                      <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>python scripts/train.py</code> to train.
                    </p>
                  </div>
                )}

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
                  <p style={{ marginTop: '10px', color: '#dc2626', fontSize: '13px', textAlign: 'center' }}>
                    Error: {(error as Error)?.message || 'Unknown error'}
                  </p>
                )}
              </div>

              {/* ── Result Card ───────────────────────── */}
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
                      <CheckCircle2 size={16} color="#16a34a" />
                      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                        Classification Result
                      </h2>
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}>
                        {data.processing_ms.toFixed(0)}ms
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, background: classColor, boxShadow: `0 0 10px ${classColor}50` }} />
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
                        {data.predicted_class}
                      </span>
                      <span style={{
                        marginLeft: 'auto', padding: '4px 12px', borderRadius: '20px',
                        fontSize: '14px', fontWeight: 700,
                        background: `${classColor}12`, border: `1px solid ${classColor}28`, color: classColor,
                      }}>
                        {confidence_pct}%
                      </span>
                    </div>

                    {/* Confidence bar */}
                    <div style={{ height: '6px', borderRadius: '6px', background: 'rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '20px' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidence_pct}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: '100%', borderRadius: '6px', background: `linear-gradient(90deg, ${classColor}, ${classColor}bb)` }}
                      />
                    </div>

                    <button
                      onClick={() => file && reportMut.mutate(file)}
                      disabled={reportMut.isPending || !file}
                      className="btn btn-secondary"
                      style={{ width: '100%', height: '44px' }}
                    >
                      {reportMut.isPending
                        ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating PDF…</>
                        : <><FileText size={16} /> Download PDF Report</>
                      }
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── RIGHT: Annotated + Chart ─────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <AnimatePresence>
                {data?.annotated_image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="surface" style={{ padding: '28px' }}
                  >
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
                      Annotated Result
                    </h2>
                    <img src={`data:image/png;base64,${data.annotated_image}`} alt="Annotated satellite image" style={{ width: '100%', borderRadius: '10px', display: 'block' }} />
                  </motion.div>
                )}

                {data && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: 0.1 }}
                    className="surface" style={{ padding: '28px' }}
                  >
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
                      Class Probabilities
                    </h2>
                    <ConfidenceChart probabilities={data.probabilities} predicted={data.predicted_class} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state */}
              {!data && !isPending && (
                <div className="surface" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.1)' }}>
                    <Sparkles size={32} color="#16a34a" />
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Results appear here</p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>Upload an image and click Classify to see predictions.</p>
                </div>
              )}

              {/* Loading state */}
              {isPending && (
                <div className="surface" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', textAlign: 'center' }}>
                  <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(22,163,74,0.15)', borderTop: '2px solid #16a34a', animation: 'spin 1s linear infinite' }} />
                    <Brain size={20} color="#16a34a" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                  </div>
                  <p style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>Running inference…</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>ResNet50 classification in progress</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
