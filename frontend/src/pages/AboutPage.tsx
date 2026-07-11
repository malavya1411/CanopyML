import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Globe, Brain, Database, GitCompare, Shield, ExternalLink, ChevronDown } from 'lucide-react';

const SECTIONS = [
  {
    id: 'transfer',
    icon: Brain, color: '#22c55e',
    title: 'Transfer Learning',
    content: `Transfer learning reuses a model pre-trained on a large dataset (ImageNet — 1.2M images, 1000 classes) as a starting point. The pretrained ResNet50 already knows how to detect textures, edges, and shapes. We only need to teach it the difference between forest and industrial land, not how to see edges from scratch.

Stage A: We freeze all backbone layers and train only the new classification head (10 classes).
Stage B: We unfreeze all layers and fine-tune at a much lower learning rate (1e-4) with early stopping.`,
  },
  {
    id: 'eurosat',
    icon: Globe, color: '#06b6d4',
    title: 'EuroSAT Dataset',
    content: `EuroSAT is a benchmark land use and land cover classification dataset based on Sentinel-2 satellite imagery. It contains 27,000 labelled images across 10 classes, each image being a 64×64 pixel patch at 10m ground resolution.

Classes: AnnualCrop, Forest, HerbaceousVegetation, Highway, Industrial, Pasture, PermanentCrop, Residential, River, SeaLake.

The dataset is split 80/10/10 into train/validation/test sets with a fixed random seed for reproducibility.`,
  },
  {
    id: 'resnet',
    icon: Database, color: '#f59e0b',
    title: 'ResNet50 Architecture',
    content: `ResNet50 is a 50-layer deep convolutional neural network from the ResNet family (2015). The key innovation is residual connections (skip connections) that allow gradients to flow directly through the network, solving the vanishing gradient problem in very deep networks.

The network has ~25M parameters. We replace the final 1000-class linear layer with a two-layer head: Dropout(0.3) → Linear(2048, 10). Training on ImageNet provides a strong feature backbone for satellite imagery.`,
  },
  {
    id: 'detection',
    icon: GitCompare, color: '#f87171',
    title: 'Deforestation Detection',
    content: `The detection pipeline works in three steps:

1. Patchify: Both images (Year 1 and Year 2) are divided into non-overlapping 64×64 pixel patches.
2. Classify: Each patch is independently classified into one of the 10 land cover classes.
3. Compare: Patches where Year 1 = Forest and Year 2 = any non-forest class are flagged as deforestation events.

Forest-loss transitions tracked: Forest → AnnualCrop, Industrial, Pasture, Residential, PermanentCrop, HerbaceousVegetation. Area is estimated assuming 10m resolution (each 64×64 patch = 0.4096 km² at Sentinel-2 native resolution).`,
  },
  {
    id: 'validation',
    icon: Shield, color: '#a78bfa',
    title: 'Validation & Metrics',
    content: `The model is evaluated on a held-out test set (2,700 images) never seen during training. We report Accuracy, Precision, Recall, and F1-Score (weighted average across all 10 classes). A full per-class classification report and confusion matrix are generated automatically.

For deforestation, results can be validated against Global Forest Watch (GFW) binary loss masks using Precision, Recall, F1, and Intersection over Union (IoU) metrics.`,
  },
  {
    id: 'architecture',
    icon: Leaf, color: '#4ade80',
    title: 'Project Architecture',
    content: `CanopyML is organized as a full-stack ML platform:

ml/ — PyTorch training pipeline (dataset, trainer, evaluator, inference)
backend/ — FastAPI REST API (classify, compare, model info, PDF reports)
frontend/ — React + Vite + TypeScript + Tailwind SPA
scripts/ — One-command automation (download, train, evaluate)
docker/ — Docker + Docker Compose for containerized deployment

The backend uses a singleton ML service for thread-safe inference. The frontend uses React Query for data fetching with proper loading and error states.`,
  },
];

const REFERENCES = [
  { label: 'EuroSAT Paper (Helber et al., 2019)', url: 'https://arxiv.org/abs/1709.00029' },
  { label: 'ResNet Paper (He et al., 2015)',       url: 'https://arxiv.org/abs/1512.03385' },
  { label: 'EuroSAT Dataset on Zenodo',            url: 'https://zenodo.org/records/7711810' },
  { label: 'Global Forest Watch',                  url: 'https://www.globalforestwatch.org' },
];

const formatContent = (content: string) =>
  content.trim().split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, ' ').trim());

interface AccordionItemProps {
  section: typeof SECTIONS[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ section, isOpen, onToggle, index }) => {
  const { icon: Icon, color, title, content } = section;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="surface"
      style={{ overflow: 'hidden' }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '22px 24px',
          display: 'flex', alignItems: 'center', gap: '14px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
          borderBottom: isOpen ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'border-color 0.2s ease',
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${color}12`,
          border: `1px solid ${color}22`,
        }}>
          <Icon size={18} color={color} />
        </div>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '16px', fontWeight: 700,
          letterSpacing: '-0.015em', color: '#eef2ec', flex: 1,
        }}>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} color="#687268" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '20px 24px 24px' }}>
              {formatContent(content).map((para, i) => (
                <p key={i} style={{
                  fontSize: '14px', color: '#a8b4a0', lineHeight: 1.75,
                  marginBottom: i < formatContent(content).length - 1 ? '14px' : 0,
                }}>
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const AboutPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('transfer');

  return (
    <div style={{ minHeight: '100vh', padding: '108px 24px 80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(26, 122, 74, 0.3) 0%, rgba(34, 197, 94, 0.15) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.1)',
          }}>
            <Leaf size={36} color="#4ade80" />
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 800, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #4ade80, #86efac)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '14px',
          }}>
            About CanopyML
          </h1>
          <p style={{ fontSize: '16px', color: '#687268', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            An end-to-end AI platform for satellite imagery analysis, built with PyTorch, FastAPI, and React.
          </p>
        </motion.div>

        {/* ── Accordion ──────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
          {SECTIONS.map((section, i) => (
            <AccordionItem
              key={section.id}
              section={section}
              isOpen={openId === section.id}
              onToggle={() => setOpenId(openId === section.id ? null : section.id)}
              index={i}
            />
          ))}
        </div>

        {/* ── References ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface"
          style={{ padding: '28px' }}
        >
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '15px', fontWeight: 700,
            color: '#eef2ec', marginBottom: '16px',
          }}>
            References & Resources
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '8px',
          }}>
            {REFERENCES.map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(34, 197, 94, 0.05)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(34, 197, 94, 0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <ExternalLink size={14} color="#4ade80" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#a8b4a0', fontWeight: 500 }}>
                  {label}
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
