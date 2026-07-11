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
    <div className="min-h-screen relative overflow-hidden bg-[#0B1220]">
      {/* Premium Background Visual Depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow blobs */}
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#10B981]/8 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#059669]/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-[#6EE7B7]/5 rounded-full blur-[100px]" />
        
        {/* Faint Grid lines (Tailwind CSS background grid) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        
        {/* ── HERO SECTION ── */}
        <section className="pt-[140px] pb-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[#34D399] text-xs font-semibold uppercase tracking-wider mb-8"
          >
            <Leaf size={12} className="animate-float" />
            Research-Grade AI Satellite Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[40px] md:text-[56px] lg:text-[72px] font-black tracking-tight leading-[1.1] max-w-[900px] text-[#F8FAFC]"
          >
            Detect <span className="bg-gradient-to-r from-[#10B981] to-[#34D399] bg-clip-text text-transparent">Deforestation</span> From Space
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg md:text-xl text-[#94A3B8] max-w-[700px] leading-[1.7] font-medium"
          >
            CanopyML uses deep learning (ResNet50 + Transfer Learning) to classify
            satellite imagery into 10 land cover classes and automatically detect
            forest loss between two time periods.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
          >
            <Link
              to="/classify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#34D399] text-white font-bold hover:shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-base"
            >
              Try Demo — Classify Image <ArrowRight size={18} />
            </Link>
            <Link
              to="/deforestation"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl glass text-[#F8FAFC] font-bold hover:bg-white/5 hover:border-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-base"
            >
              Detect Deforestation <GitCompare size={18} />
            </Link>
          </motion.div>
        </section>

        {/* ── CLASS CHIPS SECTION ── */}
        <section className="py-10">
          <div className="max-w-[800px] mx-auto">
            <p className="text-center text-[#94A3B8]/60 text-[11px] mb-6 uppercase tracking-[0.2em] font-bold">
              10 Land Cover Classes Supported
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {CLASSES.map(({ name, color }, i) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  whileHover={{ y: -2, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold glass text-[#F8FAFC] transition-colors cursor-default"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span>{name}</span>
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES SECTION ── */}
        <section className="mt-[120px] py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-[#F8FAFC]">Everything You Need</h2>
            <p className="text-[#94A3B8] mt-4 text-lg max-w-xl mx-auto font-medium">
              Research-grade AI tools for satellite imagery analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8, borderColor: 'rgba(16, 185, 129, 0.25)', boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.5)' }}
                className="glass rounded-2xl p-8 transition-all duration-300 group flex flex-col items-start border border-white/8"
              >
                <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-6 bg-[#10B981]/10 group-hover:scale-110 transition-transform">
                  <Icon size={26} className="text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">{title}</h3>
                <p className="text-[#94A3B8] text-sm leading-[1.6] font-medium">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PIPELINE DIAGRAM ── */}
        <section className="mt-[120px] py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-[#F8FAFC]">How It Works</h2>
            <p className="text-[#94A3B8] mb-16 text-base font-medium">End-to-end pipeline from image to insight</p>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
              {[
                { step: '01', label: 'Upload Image', sub: 'Any satellite imagery' },
                { step: '02', label: 'AI Inference', sub: 'ResNet50 classification' },
                { step: '03', label: 'Land Cover Map', sub: 'Patch-level grid' },
                { step: '04', label: 'Change Detection', sub: 'Forest loss analysis' },
                { step: '05', label: 'PDF Report', sub: 'Download results' },
              ].map(({ step, label, sub }, i) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center text-center gap-2 group w-full md:w-auto">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10B981] to-[#34D399] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                      {step}
                    </motion.div>
                    <p className="font-bold text-[#F8FAFC] text-sm mt-2">{label}</p>
                    <p className="text-[#94A3B8] text-xs font-medium">{sub}</p>
                  </div>
                  {i < 4 && (
                    <ArrowRight size={20} className="text-[#94A3B8]/30 hidden md:block flex-shrink-0 rotate-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER CTA SECTION ── */}
        <section className="my-[120px] py-10">
          <div className="max-w-[800px] mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden border border-white/8">
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-[#10B981]/5 rounded-full blur-[80px]" />
            </div>
            
            <div className="relative z-10">
              <Leaf size={44} className="text-[#10B981] mx-auto mb-6 animate-float" />
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-[#F8FAFC]">Ready to Monitor Canopy Loss?</h2>
              <p className="text-[#94A3B8] mb-8 text-base font-medium max-w-xl mx-auto">
                Upload a satellite image and get AI-powered land cover classification and change detection maps in seconds.
              </p>
              <Link
                to="/classify"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#34D399] text-white font-bold hover:shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
