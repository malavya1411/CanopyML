import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Globe, Brain, Database, GitCompare, Shield, ExternalLink, ChevronDown } from 'lucide-react';

const SECTIONS = [
  {
    id: 'transfer',
    icon: Brain, color: '#16a34a',
    title: 'Transfer Learning',
    content: `Transfer learning reuses a model pre-trained on a large dataset (ImageNet — 1.2M images, 1000 classes) as a starting point. The pretrained ResNet50 already knows how to detect textures, edges, and shapes. We only need to teach it the difference between forest and industrial land, not how to see edges from scratch.

Stage A: We freeze all backbone layers and train only the new classification head (10 classes).
Stage B: We unfreeze all layers and fine-tune at a much lower learning rate (1e-4) with early stopping.`,
  },
  {
    id: 'eurosat',
    icon: Globe, color: '#0891b2',
    title: 'EuroSAT Dataset',
    content: `EuroSAT is a benchmark land use and land cover classification dataset based on Sentinel-2 satellite imagery. It contains 27,000 labelled images across 10 classes, each image being a 64×64 pixel patch at 10m ground resolution.

Classes: AnnualCrop, Forest, HerbaceousVegetation, Highway, Industrial, Pasture, PermanentCrop, Residential, River, SeaLake.

The dataset is split 80/10/10 into train/validation/test sets with a fixed random seed for reproducibility.`,
  },
  {
    id: 'resnet',
    icon: Database, color: '#d97706',
    title: 'ResNet50 Architecture',
    content: `ResNet50 is a 50-layer deep convolutional neural network from the ResNet family (2015). The key innovation is residual connections (skip connections) that allow gradients to flow directly through the network, solving the vanishing gradient problem in very deep networks.

The network has ~25M parameters. We replace the final 1000-class linear layer with a two-layer head: Dropout(0.3) → Linear(2048, 10). Training on ImageNet provides a strong feature backbone for satellite imagery.`,
  },
  {
    id: 'detection',
    icon: GitCompare, color: '#dc2626',
    title: 'Deforestation Detection',
    content: `The detection pipeline works in three steps:

1. Patchify: Both images (Year 1 and Year 2) are divided into non-overlapping 64×64 pixel patches.
2. Classify: Each patch is independently classified into one of the 10 land cover classes.
3. Compare: Patches where Year 1 = Forest and Year 2 = any non-forest class are flagged as deforestation events.

Forest-loss transitions tracked: Forest → AnnualCrop, Industrial, Pasture, Residential, PermanentCrop, HerbaceousVegetation. Area is estimated assuming 10m resolution (each 64×64 patch = 0.4096 km² at Sentinel-2 native resolution).`,
  },
  {
    id: 'validation',
    icon: Shield, color: '#7c3aed',
    title: 'Validation & Metrics',
    content: `The model is evaluated on a held-out test set (2,700 images) never seen during training. We report Accuracy, Precision, Recall, and F1-Score (weighted average across all 10 classes). A full per-class classification report and confusion matrix are generated automatically.

For deforestation, results can be validated against Global Forest Watch (GFW) binary loss masks using Precision, Recall, F1, and Intersection over Union (IoU) metrics.`,
  },
  {
    id: 'architecture',
    icon: Leaf, color: '#16a34a',
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
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '22px 24px',
          display: 'flex', alignItems: 'center', gap: '14px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
          borderBottom: isOpen ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
          transition: 'border-color 0.2s ease',
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${color}10`, border: `1px solid ${color}20`,
        }}>
          <Icon size={18} color={color} />
        </div>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '16px', fontWeight: 700,
          letterSpacing: '-0.015em', color: '#0f172a', flex: 1,
        }}>
          {title}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} color="#6b7280" />
        </motion.div>
      </button>

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
                  fontSize: '14px', color: '#374151', lineHeight: 1.75,
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
    <div style={{ minHeight: '100vh', padding: '108px 24px 80px', background: '#f8fdf9', position: 'relative' }}>
      {/* Subtle leaf accents */}
      <div style={{ position: 'fixed', top: 60, right: -60, width: 300, height: 300, background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cellipse cx=\'100\' cy=\'130\' rx=\'70\' ry=\'95\' fill=\'%2316a34a\' fill-opacity=\'0.055\' transform=\'rotate(-20 100 100)\'/%3E%3C/svg%3E") center/contain no-repeat', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: 0, left: -40, width: 220, height: 220, background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cellipse cx=\'100\' cy=\'130\' rx=\'70\' ry=\'95\' fill=\'%2316a34a\' fill-opacity=\'0.045\' transform=\'rotate(15 100 100)\'/%3E%3C/svg%3E") center/contain no-repeat', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(22,163,74,0.08) 100%)',
            border: '1px solid rgba(22,163,74,0.2)',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(22,163,74,0.12)',
          }}>
            <Leaf size={36} color="#16a34a" />
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#0f172a', marginBottom: '14px',
          }}>
            About <span style={{ color: '#16a34a' }}>CanopyML</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
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
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            References & Resources
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
            {REFERENCES.map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 14px', borderRadius: '10px',
                  background: 'rgba(22,163,74,0.03)', border: '1px solid rgba(22,163,74,0.1)',
                  textDecoration: 'none', transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(22,163,74,0.07)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(22,163,74,0.22)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(22,163,74,0.03)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(22,163,74,0.1)';
                }}
              >
                <ExternalLink size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{label}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
