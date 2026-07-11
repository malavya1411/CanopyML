import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageDropzoneProps {
  onFile:     (file: File) => void;
  file?:      File | null;
  onClear?:   () => void;
  label?:     string;
  accept?:    Record<string, string[]>;
  className?: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onFile, file, onClear, label = 'Drop satellite image here',
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.tif', '.tiff'] },
  className = '',
}) => {
  const preview = file ? URL.createObjectURL(file) : null;

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept, maxFiles: 1, maxSize: 50 * 1024 * 1024,
  });

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {file && preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-lg border border-white/10 bg-[#111827]"
          >
            <img src={preview} alt="preview" className="h-56 w-full object-cover sm:h-64" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Image size={14} className="text-white" />
                <span className="truncate text-sm text-white">{file.name}</span>
                <span className="hidden text-xs text-white/60 sm:inline">
                  ({(file.size / 1e6).toFixed(1)} MB)
                </span>
              </div>
              {onClear && (
                <button
                  onClick={onClear}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/85 transition-colors hover:bg-red-500"
                  aria-label="Remove selected image"
                >
                  <X size={13} className="text-white" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`
                min-h-64 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-all duration-200 select-none
                ${isDragActive
                  ? 'border-[#2d8c4e] bg-[#2d8c4e]/10 dropzone-active'
                  : 'border-white/15 hover:border-[#2d8c4e]/60 hover:bg-white/2 bg-[#111827]'
                }
              `}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={{ y: isDragActive ? -4 : 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={`icon-tile h-14 w-14 transition-colors ${
                  isDragActive ? 'bg-[#2d8c4e]/30' : 'bg-white/5'
                }`}>
                  <Upload size={26} className={isDragActive ? 'text-[#3aad63]' : 'text-[#8b949e]'} />
                </div>
                <div>
                  <p className="text-[#e6edf3] font-medium">{label}</p>
                  <p className="text-[#8b949e] text-sm mt-1">
                    PNG, JPG, JPEG, TIFF · Max 50 MB
                  </p>
                  <p className="text-[#2d8c4e] text-sm mt-2 font-medium">
                    {isDragActive ? 'Release to upload' : 'Click to browse'}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
