import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Brain, FileText, AlertTriangle, CheckCircle2, Loader2, Sparkles, Crop, ScanSearch, X, Maximize2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { classifyImage, requestClassificationReport, getReportDownloadUrl } from '../api';
import { ImageDropzone } from '../components/ImageDropzone';
import { ConfidenceChart } from '../components/ConfidenceChart';
import { PageHeader } from '../components/PageHeader';
import { ImageGridCropper } from '../components/ImageGridCropper';



/* ══════════════════════════════════════════════════════════════ */

export const ClassifyPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [fileDimensions, setFileDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [showResultLightbox, setShowResultLightbox] = useState(false);

  const { data, isPending, isError, error, mutate, reset } = useMutation({
    mutationFn: (f: File) => classifyImage(f),
    onSuccess: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        const sx = Math.max(0, Math.floor((img.naturalWidth - 64) / 2));
        const sy = Math.max(0, Math.floor((img.naturalHeight - 64) / 2));
        ctx.drawImage(img, sx, sy, 64, 64, 0, 0, 64, 64);
        canvas.toBlob((blob) => {
          if (blob) {
            setFile(new File([blob], `center_crop_${file.name}`, { type: 'image/png' }));
            setFileDimensions({ width: 64, height: 64 });
            toast.success('Auto-cropped center 64×64 patch!');
          }
        }, 'image/png');
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const confidence_pct = data ? (data.confidence * 100).toFixed(1) : null;

  /* ── Cropper full-screen overlay ─────────────────────────── */
  if (isCropping && rawFile) {
    return (
      <div className="page-shell">
        <div className="page-container-wide">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <ImageGridCropper
              imageFile={rawFile}
              onCropConfirmed={(f) => { setFile(f); setRawFile(null); setIsCropping(false); }}
              onCancel={() => { setRawFile(null); setIsCropping(false); }}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Main Vertical workflow layout ───────────────────────── */
  return (
    <div className="page-shell">
      <div className="page-container-wide" style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>

        {/* Header */}
        <PageHeader
          icon={Brain}
          iconColor="#16a34a"
          iconBg="rgba(22,163,74,0.1)"
          title="Image Classification"
          subtitle="Upload a satellite patch and get AI-powered land cover classification."
          right={data ? (
            <button
              onClick={handleClear}
              className="btn btn-secondary animate-fade-in"
              style={{
                borderColor: '#cbd5e1',
                color: '#334155',
                padding: '8px 16px',
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              Classify Another Image
            </button>
          ) : null}
        />

        {data ? (
          <>
            {/* ══ STEP 2: Results (Rendered at top once data is available) ══ */}
            <div style={{ textAlign: 'left', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
                Classification Results
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              alignItems: 'start',
              marginBottom: '40px',
            }}>
              {/* Annotated Result Panel */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="surface" style={{ padding: '24px', minHeight: '420px', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <h3 style={{ fontFamily: "var(--font-body)", fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                    Annotated Result
                  </h3>
                  <div
                    onClick={() => setShowResultLightbox(true)}
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      cursor: 'zoom-in',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: '4/3',
                      position: 'relative',
                    }}
                    className="group"
                  >
                    <img
                      src={`data:image/png;base64,${data.annotated_image}`}
                      alt="Annotated satellite image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.3s ease',
                      }}
                      className="group-hover:scale-105"
                    />
                    
                    {/* Hover eye overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(15, 23, 42, 0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                    }}
                    className="group-hover:opacity-100"
                    >
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '20px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '12px', fontWeight: 600, color: '#0f172a',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}>
                        <Maximize2 size={12} />
                        Zoom Image
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '24px',
                      background: '#ecfdf5',
                      border: '1.5px solid #a7f3d0',
                      color: '#065f46',
                      fontSize: '14px',
                      fontWeight: 700,
                    }}>
                      <CheckCircle2 size={16} color="#059669" />
                      <span>Prediction: <strong>{data.predicted_class}</strong></span>
                      <span style={{ color: '#047857', opacity: 0.5 }}>|</span>
                      <span>Confidence: <strong>{confidence_pct}%</strong></span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Class Probabilities Panel */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="surface" style={{ padding: '24px', minHeight: '420px', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <h3 style={{ fontFamily: "var(--font-body)", fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                    Class Probabilities
                  </h3>
                  <div style={{ marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Confidence Score
                    </span>
                    <div style={{ fontSize: '48px', fontWeight: 800, color: '#10b981', fontFamily: "var(--font-body)", lineHeight: 1.1, marginTop: '4px' }}>
                      {confidence_pct}%
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <ConfidenceChart probabilities={data.probabilities} predicted={data.predicted_class} />
                  </div>

                  <div style={{ marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                    <button
                      onClick={() => file && reportMut.mutate(file)}
                      disabled={reportMut.isPending || !file}
                      className="btn btn-secondary"
                      style={{
                        width: '100%',
                        height: '42px',
                        fontSize: '13.5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        borderColor: '#cbd5e1',
                        color: '#334155',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {reportMut.isPending ? (
                        <>
                          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                          Generating PDF Report…
                        </>
                      ) : (
                        <>
                          <FileText size={16} />
                          Download PDF Report
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Subtle divider */}
            <div style={{ margin: '40px 0', borderTop: '1px solid #e2e8f0' }} />

            {/* ══ STEP 1: Upload & Preview/Edit (Shifted to bottom as secondary action) ══ */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: '40px' }}
            >
              <div className="surface" style={{ padding: '24px', textAlign: 'left' }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Classify Another Image
                </h2>
                <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '20px' }}>
                  Need to process another land cover classification? Upload a new satellite patch below.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
                  <div>
                    <button
                      onClick={handleClear}
                      className="btn btn-secondary"
                      style={{
                        width: '100%',
                        height: '160px',
                        border: '2px dashed #cbd5e1',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <Brain size={32} className="text-slate-400" />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>
                        Click to reset and upload another image
                      </span>
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
                      This will reset the current prediction session. Download your PDF report before resetting if you want to keep a record of the class probabilities.
                    </p>
                    <button
                      onClick={handleClear}
                      className="btn btn-secondary"
                      style={{ height: '42px', fontSize: '13.5px', borderColor: '#cbd5e1', color: '#334155' }}
                    >
                      Reset & Upload New
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* ══ STEP 1: Upload & Preview/Edit (Default top state when empty/loading) ══ */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="surface" style={{ padding: '24px', textAlign: 'left' }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Upload Satellite Image
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                  Supported formats: PNG, JPG, JPEG, TIF, TIFF
                </p>

                {file ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
                    <div>
                      <ImageDropzone onFile={handleFileSelect} file={file} onClear={handleClear} label="Drop a satellite patch here" />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <button
                        type="button"
                        onClick={() => { setRawFile(file); setIsCropping(true); }}
                        className="btn btn-secondary"
                        style={{ width: '100%', height: '42px', fontSize: '13.5px', display: 'flex', gap: '7px', alignItems: 'center', justifyContent: 'center', borderColor: '#cbd5e1', color: '#334155' }}
                      >
                        <Crop size={14} /> Crop 64×64 Patch (Optional)
                      </button>

                      {fileDimensions && (fileDimensions.width > 64 || fileDimensions.height > 64) && (
                        <div style={{
                          padding: '16px 20px',
                          borderRadius: '12px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderLeft: '4px solid #d97706',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div style={{ flex: 1 }}>
                              <p style={{ color: '#d97706', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                                Large Image Detected ({fileDimensions.width}×{fileDimensions.height})
                              </p>
                              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                                The model is trained on 64×64 patches. Resizing this large image directly causes scaling distortion.
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                <button
                                  type="button"
                                  onClick={() => { setRawFile(file); setIsCropping(true); }}
                                  className="btn btn-secondary"
                                  style={{ width: '100%', fontSize: '13px', height: '38px', borderColor: '#cbd5e1', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                >
                                  <Crop size={14} /> Manual Crop
                                </button>
                                <button
                                  type="button"
                                  onClick={handleAutoCropCenter}
                                  className="btn btn-secondary"
                                  style={{ width: '100%', fontSize: '13px', height: '38px', borderColor: '#cbd5e1', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                >
                                  Auto-Crop Center
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}



                      <button
                        onClick={handleRun}
                        disabled={!file || isPending}
                        className="btn btn-primary"
                        style={{
                          width: '100%',
                          marginTop: '8px',
                          height: '46px',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                      >
                        {isPending ? (
                          <>
                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                            Classifying…
                          </>
                        ) : (
                          <>
                            <Brain size={16} />
                            Classify Image
                          </>
                        )}
                      </button>

                      {isError && (
                        <p style={{ marginTop: '8px', color: '#dc2626', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}>
                          Error: {(error as Error)?.message || 'Unknown error'}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <ImageDropzone onFile={handleFileSelect} file={file} onClear={handleClear} label="Drop a satellite patch here" />
                )}
              </div>
            </motion.div>

            {/* Subtle divider */}
            <div style={{ margin: '40px 0', borderTop: '1px solid #e2e8f0' }} />

            {/* ══ STEP 2: Results (Placeholder at bottom when empty/loading) ══ */}
            <div style={{ textAlign: 'left', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
                Classification Results
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              alignItems: 'start',
              marginBottom: '40px',
            }}>
              {/* Empty Annotated Result */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="surface" style={{ padding: '24px', minHeight: '420px', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <h3 style={{ fontFamily: "var(--font-body)", fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                    Annotated Result
                  </h3>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '14px',
                      color: '#9ca3af',
                    }}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: '18px', background: 'rgba(22,163,74,0.04)', border: '1.5px dashed rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ScanSearch size={28} color="#16a34a" style={{ opacity: 0.5 }} />
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#9ca3af', textAlign: 'center', lineHeight: 1.6 }}>
                      Annotated output<br />appears here after classification
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Empty Class Probabilities */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="surface" style={{ padding: '24px', minHeight: '420px', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <h3 style={{ fontFamily: "var(--font-body)", fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                    Class Probabilities
                  </h3>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '14px',
                      color: '#9ca3af',
                    }}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: '18px', background: 'rgba(22,163,74,0.04)', border: '1.5px dashed rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={28} color="#16a34a" style={{ opacity: 0.5 }} />
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#9ca3af', textAlign: 'center', lineHeight: 1.6 }}>
                      Probability scores<br />appear here after classification
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal for Result Image */}
      <AnimatePresence>
        {showResultLightbox && data?.annotated_image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResultLightbox(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              cursor: 'zoom-out',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              style={{
                position: 'relative',
                maxWidth: '90%',
                maxHeight: '90%',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`data:image/png;base64,${data.annotated_image}`}
                alt="Full resolution result"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
              
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, transparent 100%)',
                padding: '24px 20px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#ffffff' }}>
                  Prediction: <span style={{ textTransform: 'capitalize' }}>{data.predicted_class}</span> ({confidence_pct}%)
                </span>
                <button
                  onClick={() => setShowResultLightbox(false)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    borderColor: 'rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                  }}
                >
                  <X size={14} /> Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
