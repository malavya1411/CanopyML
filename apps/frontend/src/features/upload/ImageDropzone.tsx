import React from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, FileImage, Maximize2 } from 'lucide-react';

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
            style={{ width: '100%' }}
          >
            {/* Image container */}
            <div
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
              }}
            >
              {/* Image preview with hover zoom effect */}
              <div 
                onClick={() => setShowLightbox(true)}
                style={{ 
                  position: 'relative', 
                  paddingTop: '64%', 
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
                  background: 'rgba(15, 23, 42, 0.3)',
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}>
                    <Maximize2 size={12} />
                    Preview Image
                  </div>
                </div>
              </div>
            </div>

            {/* Clean File Row below image */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginTop: '16px',
            }}>
              <FileImage size={18} className="text-emerald-600" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#334155',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  margin: 0,
                }}>
                  {file.name}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{formatSize(file.size)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); onClear(); }}
                  style={{
                    width: 28, height: 28, borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fee2e2',
                    color: '#ef4444',
                    border: '1px solid #fca5a5',
                    transition: 'all 0.15s ease',
                  }}
                  aria-label="Remove file"
                >
                  <X size={14} />
                </button>
              </div>
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
                  ? '2px dashed #10b981'
                  : '2px dashed #cbd5e1',
                background: isDragActive
                  ? 'rgba(16, 185, 129, 0.05)'
                  : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isDragActive ? '0 0 0 4px rgba(16, 185, 129, 0.08), inset 0 0 20px rgba(16, 185, 129, 0.04)' : 'none',
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
                    ? 'rgba(16, 185, 129, 0.15)'
                    : '#f1f5f9',
                  border: `1px solid ${isDragActive ? 'rgba(16,185,129,0.3)' : '#e2e8f0'}`,
                }}
              >
                <UploadCloud size={28} color={isDragActive ? '#10b981' : '#64748b'} />
              </motion.div>

              {/* Text */}
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  fontSize: '14px', fontWeight: 600,
                  color: isDragActive ? '#10b981' : '#475569',
                  marginBottom: '4px',
                  transition: 'color 0.2s ease',
                }}>
                  {isDragActive ? 'Release to upload' : label}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  or <span style={{ color: '#10b981', fontWeight: 600 }}>browse files</span>
                </p>
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
