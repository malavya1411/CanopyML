import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Brain, FileText, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { classifyImage, requestClassificationReport, getReportDownloadUrl } from '../api';
import { ImageDropzone } from '../components/ImageDropzone';
import { ConfidenceChart } from '../components/ConfidenceChart';
import { CLASS_COLORS } from '../types';

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
  const color = data ? (CLASS_COLORS[data.predicted_class] || '#2d8c4e') : '#2d8c4e';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#2d8c4e]/20 flex items-center justify-center">
              <Brain size={20} className="text-[#3aad63]" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Image Classification</h1>
          </div>
          <p className="text-[#8b949e] ml-13">
            Upload a satellite patch and get AI-powered land cover classification.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: upload */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold text-[#e6edf3] mb-4">Upload Satellite Image</h2>
              <ImageDropzone
                onFile={setFile}
                file={file}
                onClear={handleClear}
                label="Drop a satellite patch here"
              />

              {data?.is_stub_model && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
                  <p className="text-amber-400 text-xs">
                    Using untrained stub model — predictions are random. Run{' '}
                    <code className="font-mono">python scripts/train.py</code> to train.
                  </p>
                </div>
              )}

              <button
                onClick={handleRun}
                disabled={!file || isPending}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#2d8c4e] to-[#00b4a6] text-white font-semibold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <><Loader2 size={18} className="animate-spin" /> Classifying…</>
                ) : (
                  <><Brain size={18} /> Classify Image</>
                )}
              </button>

              {isError && (
                <p className="mt-3 text-red-400 text-sm text-center">
                  Error: {(error as any)?.message || 'Unknown error'}
                </p>
              )}
            </div>

            {/* Result card */}
            <AnimatePresence>
              {data && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle size={18} className="text-[#3aad63]" />
                    <h2 className="font-semibold text-[#e6edf3]">Result</h2>
                    <span className="ml-auto text-[#8b949e] text-xs">{data.processing_ms.toFixed(0)}ms</span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-2xl font-bold text-[#e6edf3]">{data.predicted_class}</span>
                    <span
                      className="ml-auto px-3 py-1 rounded-lg text-sm font-bold"
                      style={{ background: `${color}25`, color }}
                    >
                      {confidence_pct}%
                    </span>
                  </div>

                  {/* Confidence bar */}
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence_pct}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${color}, #00b4a6)` }}
                    />
                  </div>

                  {/* Download report */}
                  <button
                    onClick={() => file && reportMut.mutate(file)}
                    disabled={reportMut.isPending || !file}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass hover:border-white/25 text-[#e6edf3] text-sm font-medium transition-all disabled:opacity-40"
                  >
                    {reportMut.isPending ? (
                      <><Loader2 size={16} className="animate-spin" /> Generating PDF…</>
                    ) : (
                      <><FileText size={16} /> Download PDF Report</>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: annotated image + charts */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <AnimatePresence>
              {data?.annotated_image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-2xl p-6"
                >
                  <h2 className="font-semibold text-[#e6edf3] mb-4">Annotated Result</h2>
                  <img
                    src={`data:image/png;base64,${data.annotated_image}`}
                    alt="annotated"
                    className="w-full rounded-xl"
                  />
                </motion.div>
              )}

              {data && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <h2 className="font-semibold text-[#e6edf3] mb-4">Class Probabilities</h2>
                  <ConfidenceChart
                    probabilities={data.probabilities}
                    predicted={data.predicted_class}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!data && !isPending && (
              <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <Brain size={48} className="text-[#8b949e] mb-4" />
                <p className="text-[#8b949e]">Upload an image and click Classify to see results here.</p>
              </div>
            )}

            {isPending && (
              <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#2d8c4e] border-t-transparent animate-spin mb-4" />
                <p className="text-[#8b949e]">Running inference…</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
