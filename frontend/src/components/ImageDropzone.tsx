import React from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, FileImage, CheckCircle2, Maximize2 } from 'lucide-react';

interface ImageDropzoneProps {
  onFile: (file: File) => void;
  file: File | null;
  onClear: () => void;
  label?: string;
  accept?: string[];
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onFile, file, onClear,
  label = 'Drop satellite image here',
  accept = ['.png', '.jpg', '.jpeg', '.tif', '.tiff'],
}) => {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [showLightbox, setShowLightbox] = React.useState(false);

  React.useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png':  ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/tiff': ['.tif', '.tiff'],
    },
    maxFiles: 1,
    onDrop: (accepted) => { if (accepted[0]) onFile(accepted[0]); },
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <AnimatePresence mode="wait">
        {file && preview ? (
          /* ── File preview state ── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            style={{
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              background: 'rgba(10, 25, 16, 0.6)',
            }}
          >
            {/* Image preview with hover zoom effect */}
            <div 
              onClick={() => setShowLightbox(true)}
              style={{ 
                position: 'relative', 
                paddingTop: '56%', 
                overflow: 'hidden', 
                cursor: 'zoom-in',
              }}
              className="group"
            >
              <img
                src={preview}
                alt="Preview"
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
                className="group-hover:scale-105"
              />
              
              {/* Hover overlay with Eye icon */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(8, 14, 11, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px',
                opacity: 0,
                transition: 'opacity 0.2s ease',
              }}
              className="group-hover:opacity-100"
              >
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '20px',
                  background: 'rgba(10, 20, 13, 0.9)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '11px', fontWeight: 600, color: '#4ade80',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}>
                  <Maximize2 size={12} />
                  Preview Image
                </div>
              </div>

              {/* Success gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 50%, rgba(8,14,11,0.9) 100%)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* File info bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 14px',
              background: 'rgba(8,14,11,0.8)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '8px', flexShrink: 0,
                background: 'rgba(34, 197, 94, 0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileImage size={16} color="#4ade80" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '13px', fontWeight: 600, color: '#eef2ec',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {file.name}
                </p>
                <p style={{ fontSize: '11px', color: '#687268' }}>{formatSize(file.size)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#4ade80" />
                <button
                  onClick={e => { e.stopPropagation(); onClear(); }}
                  style={{
                    width: 28, height: 28, borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  aria-label="Remove file"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* File type chips */}
            <div style={{
              position: 'absolute', top: '10px', left: '10px',
              display: 'flex', gap: '4px',
            }}>
              {accept.map(ext => (
                <span key={ext} style={{
                  fontSize: '10px', fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '20px',
                  background: 'rgba(8,14,11,0.85)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  letterSpacing: '0.05em',
                }}>
                  {ext.replace('.', '').toUpperCase()}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ── Drop zone state ── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
          <div
            {...getRootProps()}
            style={{
              position: 'relative',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '16px',
              minHeight: '200px',
              padding: '40px 20px',
              borderRadius: '14px',
              border: isDragActive
                ? '2px dashed #4ade80'
                : '2px dashed rgba(255,255,255,0.1)',
              background: isDragActive
                ? 'rgba(34, 197, 94, 0.04)'
                : 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isDragActive ? '0 0 0 4px rgba(34, 197, 94, 0.08), inset 0 0 20px rgba(34, 197, 94, 0.04)' : 'none',
            }}
          >
            <input {...getInputProps()} />

            {/* Icon */}
            <motion.div
              animate={isDragActive ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                width: 64, height: 64, borderRadius: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDragActive
                  ? 'rgba(34, 197, 94, 0.15)'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isDragActive ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <UploadCloud size={28} color={isDragActive ? '#4ade80' : '#687268'} />
            </motion.div>

            {/* Text */}
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '14px', fontWeight: 600,
                color: isDragActive ? '#4ade80' : '#a8b4a0',
                marginBottom: '4px',
                transition: 'color 0.2s ease',
              }}>
                {isDragActive ? 'Release to upload' : label}
              </p>
              <p style={{ fontSize: '12px', color: '#687268' }}>
                or <span style={{ color: '#4ade80', fontWeight: 600 }}>browse files</span>
              </p>
            </div>

            {/* File types */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {accept.map(ext => (
                <span key={ext} style={{
                  fontSize: '10px', fontWeight: 600,
                  padding: '3px 8px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#687268',
                  letterSpacing: '0.06em',
                }}>
                  {ext.replace('.', '').toUpperCase()}
                </span>
              ))}
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLightbox(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(5, 10, 7, 0.92)',
              backdropFilter: 'blur(16px)',
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
                boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={preview || ''}
                alt="Full resolution preview"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
              
              {/* Close Button & File Name Info */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(8,14,11,0.95) 0%, transparent 100%)',
                padding: '24px 20px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#eef2ec' }}>
                  {file?.name}
                </span>
                <button
                  onClick={() => setShowLightbox(false)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <X size={14} /> Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
