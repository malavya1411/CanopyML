import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Globe, Brain, Database, GitCompare, Shield, ExternalLink } from 'lucide-react';

const SECTIONS = [
  {
    icon: Brain, color: '#2d8c4e',
    title: 'Transfer Learning',
    content: `Transfer learning reuses a model pre-trained on a large dataset (ImageNet — 1.2M images, 1000 classes) 
    as a starting point. The pretrained ResNet50 already knows how to detect textures, edges, and shapes. 
    We only need to teach it the difference between forest and industrial land, not how to see edges from scratch.
    
    Stage A: We freeze all backbone layers and train only the new classification head (10 classes). 
    Stage B: We unfreeze all layers and fine-tune at a much lower learning rate (1e-4) with early stopping.`,
  },
  {
    icon: Globe, color: '#00b4a6',
    title: 'EuroSAT Dataset',
    content: `EuroSAT is a benchmark land use and land cover classification dataset based on Sentinel-2 satellite imagery. 
    It contains 27,000 labelled images across 10 classes, each image being a 64×64 pixel patch at 10m ground resolution.
    
    Classes: AnnualCrop, Forest, HerbaceousVegetation, Highway, Industrial, Pasture, PermanentCrop, Residential, River, SeaLake.
    
    The dataset is split 80/10/10 into train/validation/test sets with a fixed random seed for reproducibility.`,
  },
  {
    icon: Database, color: '#f9a825',
    title: 'ResNet50 Architecture',
    content: `ResNet50 is a 50-layer deep convolutional neural network from the ResNet family (2015). 
    The key innovation is residual connections (skip connections) that allow gradients to flow directly 
    through the network, solving the vanishing gradient problem in very deep networks.
    
    The network has ~25M parameters. We replace the final 1000-class linear layer with a two-layer head: 
    Dropout(0.3) → Linear(2048, 10). Training on ImageNet provides a strong feature backbone for satellite imagery.`,
  },
  {
    icon: GitCompare, color: '#ef5350',
    title: 'Deforestation Detection',
    content: `The detection pipeline works in three steps:
    
    1. Patchify: Both images (Year 1 and Year 2) are divided into non-overlapping 64×64 pixel patches.
    2. Classify: Each patch is independently classified into one of the 10 land cover classes.
    3. Compare: Patches where Year 1 = Forest and Year 2 = any non-forest class are flagged as deforestation events.
    
    Forest-loss transitions tracked: Forest → AnnualCrop, Industrial, Pasture, Residential, PermanentCrop, HerbaceousVegetation.
    Area is estimated assuming 10m resolution (each 64×64 patch = 0.4096 km² at Sentinel-2 native resolution).`,
  },
  {
    icon: Shield, color: '#1565c0',
    title: 'Validation & Metrics',
    content: `The model is evaluated on a held-out test set (2,700 images) never seen during training.
    We report Accuracy, Precision, Recall, and F1-Score (weighted average across all 10 classes).
    A full per-class classification report and confusion matrix are generated automatically.
    
    For deforestation, results can be validated against Global Forest Watch (GFW) binary loss masks using 
    Precision, Recall, F1, and Intersection over Union (IoU) metrics.`,
  },
  {
    icon: Leaf, color: '#3aad63',
    title: 'Project Architecture',
    content: `CanopyML is organized as a full-stack ML platform:
    
    ml/ — PyTorch training pipeline (dataset, trainer, evaluator, inference)
    backend/ — FastAPI REST API (classify, compare, model info, PDF reports)
    frontend/ — React + Vite + TypeScript + Tailwind SPA
    scripts/ — One-command automation (download, train, evaluate)
    docker/ — Docker + Docker Compose for containerized deployment
    
    The backend uses a singleton ML service for thread-safe inference. 
    The frontend uses React Query for data fetching with proper loading and error states.`,
  },
];

export const AboutPage: React.FC = () => (
  <div className="page-shell">
    <div className="mx-auto max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <div className="icon-tile mx-auto mb-4 h-16 w-16 bg-gradient-to-br from-[#2d8c4e] to-[#00b4a6]">
          <Leaf size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold gradient-text mb-4">About CanopyML</h1>
        <p className="text-[#8b949e] text-lg max-w-2xl mx-auto">
          An end-to-end AI platform for satellite imagery analysis, built with PyTorch, FastAPI, and React.
        </p>
      </motion.div>

      <div className="space-y-5">
        {SECTIONS.map(({ icon: Icon, color, title, content }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="surface p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="icon-tile h-9 w-9 flex-shrink-0" style={{ background: `${color}20` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <h2 className="font-bold text-[#e6edf3] text-lg">{title}</h2>
            </div>
            <div className="text-[#8b949e] text-sm leading-relaxed whitespace-pre-line">
              {content}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Links */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="surface p-6 mt-8"
      >
        <h2 className="font-bold text-[#e6edf3] mb-4">References & Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: 'EuroSAT Paper (Helber et al., 2019)', url: 'https://arxiv.org/abs/1709.00029' },
            { label: 'ResNet Paper (He et al., 2015)',       url: 'https://arxiv.org/abs/1512.03385' },
            { label: 'EuroSAT Dataset on Zenodo',           url: 'https://zenodo.org/records/7711810' },
            { label: 'Global Forest Watch',                  url: 'https://www.globalforestwatch.org' },
          ].map(({ label, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 rounded-lg bg-white/3 p-3 text-sm text-[#8b949e] transition-all hover:bg-white/6 hover:text-[#e6edf3] group">
              <ExternalLink size={14} className="text-[#2d8c4e] group-hover:scale-110 transition-transform" />
              {label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);
