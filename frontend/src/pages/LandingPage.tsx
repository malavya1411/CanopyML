import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, GitCompare, BarChart3, Leaf, Globe, Shield, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Land Cover Classification',
    desc: 'ResNet50 trained on 27,000 EuroSAT satellite patches achieves 95%+ accuracy across 10 land cover classes.',
  },
  {
    icon: GitCompare,
    title: 'Deforestation Detection',
    desc: 'Upload before & after satellite images. Our model automatically detects forest loss and quantifies the affected area.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    desc: 'Class probability distributions, confusion matrices, training curves, and downloadable PDF reports.',
  },
  {
    icon: Globe,
    title: 'Any Satellite Image',
    desc: 'Works with Sentinel-2, Landsat, or any RGB satellite image. Supports PNG, JPG, JPEG, and GeoTIFF.',
  },
  {
    icon: Shield,
    title: 'Validated Against GFW',
    desc: 'Model performance benchmarked against Global Forest Watch data with reported Precision, Recall, and F1.',
  },
  {
    icon: Zap,
    title: 'Real-Time Inference',
    desc: 'GPU-accelerated inference returns results in seconds, with batch processing for large satellite images.',
  },
];

const CLASSES = [
  { name: 'AnnualCrop',            color: '#f5c242' },
  { name: 'Forest',                color: '#10B981' },
  { name: 'HerbaceousVegetation',  color: '#a8d5a2' },
  { name: 'Highway',               color: '#8c8c8c' },
  { name: 'Industrial',            color: '#e05c2e' },
  { name: 'Pasture',               color: '#c8e6c9' },
  { name: 'PermanentCrop',         color: '#f9a825' },
  { name: 'Residential',           color: '#ef5350' },
  { name: 'River',                 color: '#1565c0' },
  { name: 'SeaLake',               color: '#29b6f6' },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F8FAFC]">
      {/* ── BACKGROUND GRID (Backdrop, no layout interference) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,#000_0%,#000_58%,transparent_100%)]" />
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 w-full min-h-[90vh] flex flex-col justify-center items-center pt-[140px] pb-[120px] px-6">

        {/* Inner centered container, constrains content width */}
        <div className="w-full max-w-[900px] mx-auto flex flex-col items-center text-center">

          {/* Leaf Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#34D399]/20 bg-[#10B981]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#34D399] mb-8"
          >
            <Leaf size={12} className="animate-float" />
            Research-Grade AI Satellite Platform
          </motion.div>

          {/* Heading - constrained to avoid overflow */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-center w-full"
          >
            Detect <span className="bg-gradient-to-r from-[#10B981] to-[#34D399] bg-clip-text text-transparent">Deforestation</span> From Space
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-base md:text-lg text-[#94A3B8] text-center max-w-[680px] leading-[1.75] font-medium"
          >
            CanopyML uses deep learning (ResNet50 + Transfer Learning) to classify
            satellite imagery into 10 land cover classes and automatically detect
            forest loss between two time periods.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/classify"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#34D399] px-8 py-3.5 text-base font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(16,185,129,0.35)] active:translate-y-0"
            >
              Try Demo — Classify Image <ArrowRight size={18} />
            </Link>
            <Link
              to="/deforestation"
              className="glass inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-base font-bold text-[#F8FAFC] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 active:translate-y-0"
            >
              Detect Deforestation <GitCompare size={18} />
            </Link>
          </motion.div>

          {/* Class Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 w-full"
          >
            <p className="text-center text-[#94A3B8]/50 text-[10px] mb-7 uppercase tracking-[0.25em] font-bold">
              10 Land Cover Classes Supported
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {CLASSES.map(({ name, color }, i) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.04 }}
                  whileHover={{ y: -2, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  className="glass inline-flex cursor-default items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold text-[#F8FAFC] transition-colors"
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span>{name}</span>
                </motion.span>
              ))}
            </div>
          </motion.div>

        </div>{/* end inner container */}
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="relative z-10 w-full border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 py-[120px]">
          <div className="text-center mb-5">
            <h2 className="text-4xl font-bold tracking-tight text-[#F8FAFC]">Everything You Need</h2>
          </div>
          <div className="text-center mb-16">
            <p className="text-[#94A3B8] text-lg max-w-xl mx-auto font-medium">
              Research-grade AI tools for satellite imagery analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, borderColor: 'rgba(16, 185, 129, 0.25)', boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.5)' }}
                className="surface group flex flex-col items-start p-8 transition-all duration-300"
              >
                <div className="icon-tile mb-6 h-[52px] w-[52px] bg-[#10B981]/10 transition-transform group-hover:scale-105">
                  <Icon size={26} className="text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">{title}</h3>
                <p className="text-[#94A3B8] text-sm leading-[1.6] font-medium">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PIPELINE DIAGRAM ── */}
      <section className="relative z-10 w-full border-t border-white/5">
        <div className="max-w-[900px] mx-auto px-6 py-[120px] text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-[#F8FAFC]">How It Works</h2>
          <p className="text-[#94A3B8] mb-16 text-base font-medium">End-to-end pipeline from image to insight</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
            {[
              { step: '01', label: 'Upload Image', sub: 'Any satellite imagery' },
              { step: '02', label: 'AI Inference', sub: 'ResNet50 classification' },
              { step: '03', label: 'Land Cover Map', sub: 'Patch-level grid' },
              { step: '04', label: 'Change Detection', sub: 'Forest loss analysis' },
              { step: '05', label: 'PDF Report', sub: 'Download results' },
            ].map(({ step, label, sub }, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center text-center gap-2 group">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#10B981] to-[#34D399] text-sm font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    {step}
                  </motion.div>
                  <p className="font-bold text-[#F8FAFC] text-sm mt-2">{label}</p>
                  <p className="text-[#94A3B8] text-xs font-medium">{sub}</p>
                </div>
                {i < 4 && (
                  <ArrowRight size={20} className="text-[#94A3B8]/30 hidden md:block flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA SECTION ── */}
      <section className="relative z-10 w-full">
        <div className="max-w-[900px] mx-auto px-6 py-[120px]">
          <div className="surface relative overflow-hidden p-8 text-center sm:p-12">
            <div className="relative z-10 flex flex-col items-center">
              <Leaf size={44} className="text-[#10B981] mb-6 animate-float" />
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-[#F8FAFC] text-center">Ready to Monitor Canopy Loss?</h2>
              <p className="text-[#94A3B8] mb-8 text-base font-medium max-w-xl text-center">
                Upload a satellite image and get AI-powered land cover classification and change detection maps in seconds.
              </p>
              <Link
                to="/classify"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#34D399] px-8 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(16,185,129,0.35)] active:translate-y-0"
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
