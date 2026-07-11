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
            className="relative rounded-xl overflow-hidden border border-white/10 bg-[#161b22]"
          >
            <img src={preview} alt="preview" className="w-full h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image size={14} className="text-white" />
                <span className="text-white text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-white/60 text-xs">
                  ({(file.size / 1e6).toFixed(1)} MB)
                </span>
              </div>
              {onClear && (
                <button
                  onClick={onClear}
                  className="w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
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
                border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                transition-all duration-200 select-none
                ${isDragActive
                  ? 'border-[#2d8c4e] bg-[#2d8c4e]/10 dropzone-active'
                  : 'border-white/15 hover:border-[#2d8c4e]/60 hover:bg-white/2 bg-[#161b22]'
                }
              `}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={{ y: isDragActive ? -4 : 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
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
