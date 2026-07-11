import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, GitCompare, BarChart3, Leaf, Globe, Shield, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,    color: '#2d8c4e',
    title: 'AI Land Cover Classification',
    desc:  'ResNet50 trained on 27,000 EuroSAT satellite patches achieves 95%+ accuracy across 10 land cover classes.',
  },
  {
    icon: GitCompare, color: '#00b4a6',
    title: 'Deforestation Detection',
    desc:  'Upload before & after satellite images. Our model automatically detects forest loss and quantifies the affected area.',
  },
  {
    icon: BarChart3, color: '#f9a825',
    title: 'Detailed Analytics',
    desc:  'Class probability distributions, confusion matrices, training curves, and downloadable PDF reports.',
  },
  {
    icon: Globe,    color: '#1565c0',
    title: 'Any Satellite Image',
    desc:  'Works with Sentinel-2, Landsat, or any RGB satellite image. Supports PNG, JPG, JPEG, and GeoTIFF.',
  },
  {
    icon: Shield,   color: '#ef5350',
    title: 'Validated Against GFW',
    desc:  'Model performance benchmarked against Global Forest Watch data with reported Precision, Recall, and F1.',
  },
  {
    icon: Zap,      color: '#f5c242',
    title: 'Real-Time Inference',
    desc:  'GPU-accelerated inference returns results in seconds, with batch processing for large satellite images.',
  },
];

const CLASSES = [
  { name: 'AnnualCrop',            color: '#f5c242' },
  { name: 'Forest',                color: '#2d8c4e' },
  { name: 'HerbaceousVegetation',  color: '#a8d5a2' },
  { name: 'Highway',               color: '#8c8c8c' },
  { name: 'Industrial',            color: '#e05c2e' },
  { name: 'Pasture',               color: '#c8e6c9' },
  { name: 'PermanentCrop',         color: '#f9a825' },
  { name: 'Residential',           color: '#ef5350' },
  { name: 'River',                 color: '#1565c0' },
  { name: 'SeaLake',               color: '#29b6f6' },
];

export const LandingPage: React.FC = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative pt-32 pb-24 px-4 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#2d8c4e]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#00b4a6]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[#3aad63] text-sm font-medium mb-6"
        >
          <Leaf size={14} className="animate-float" />
          AI-Powered Environmental Monitoring
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight"
        >
          Detect{' '}
          <span className="gradient-text">Deforestation</span>
          {' '}From Space
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-xl text-[#8b949e] max-w-2xl mx-auto leading-relaxed"
        >
          CanopyML uses deep learning (ResNet50 + Transfer Learning) to classify
          satellite imagery into 10 land cover classes and automatically detect
          forest loss between two time periods.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/classify"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2d8c4e] to-[#00b4a6] text-white font-semibold hover:opacity-90 transition-opacity text-base"
          >
            Try Demo — Classify Image <ArrowRight size={18} />
          </Link>
          <Link
            to="/deforestation"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-[#e6edf3] font-semibold hover:border-white/25 transition-all text-base"
          >
            Detect Deforestation <GitCompare size={18} />
          </Link>
        </motion.div>
      </div>
    </section>

    {/* Class pills */}
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-[#8b949e] text-sm mb-6 uppercase tracking-widest font-semibold">
          10 Land Cover Classes
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {CLASSES.map(({ name, color }, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm glass"
            >
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[#e6edf3]">{name}</span>
            </motion.span>
          ))}
        </div>
      </div>
    </section>

    {/* Features grid */}
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold gradient-text">Everything You Need</h2>
          <p className="text-[#8b949e] mt-3 max-w-xl mx-auto">
            A complete research platform from raw satellite imagery to validated deforestation reports.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ background: `${color}20` }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="font-semibold text-[#e6edf3] mb-2">{title}</h3>
              <p className="text-[#8b949e] text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Pipeline diagram */}
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-[#8b949e] mb-12">End-to-end pipeline from image to insight</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {[
            { step: '01', label: 'Upload Image', sub: 'Any satellite imagery' },
            { step: '02', label: 'AI Inference', sub: 'ResNet50 classification' },
            { step: '03', label: 'Land Cover Map', sub: 'Patch-level grid' },
            { step: '04', label: 'Change Detection', sub: 'Forest loss analysis' },
            { step: '05', label: 'PDF Report', sub: 'Download results' },
          ].map(({ step, label, sub }, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2d8c4e] to-[#00b4a6] flex items-center justify-center text-white font-bold text-sm">
                  {step}
                </div>
                <p className="font-semibold text-[#e6edf3] text-sm">{label}</p>
                <p className="text-[#8b949e] text-xs">{sub}</p>
              </div>
              {i < 4 && (
                <ArrowRight size={20} className="text-[#8b949e] hidden sm:block flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center glass rounded-3xl p-12">
        <Leaf size={40} className="text-[#2d8c4e] mx-auto mb-4 animate-float" />
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-[#8b949e] mb-8">
          Upload a satellite image and get AI-powered land cover classification in seconds.
        </p>
        <Link
          to="/classify"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#2d8c4e] to-[#00b4a6] text-white font-bold hover:opacity-90 transition-opacity"
        >
          Get Started Free <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  </div>
);
