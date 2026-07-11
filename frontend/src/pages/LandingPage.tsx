import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain, GitCompare, BarChart3, Globe, Shield, Zap,
  ArrowRight, Leaf, Satellite, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    color: '#22c55e',
    title: 'AI Land Cover Classification',
    desc: 'ResNet50 trained on 27,000 EuroSAT satellite patches achieves 95%+ accuracy across 10 land cover classes.',
  },
  {
    icon: GitCompare,
    color: '#f97316',
    title: 'Deforestation Detection',
    desc: 'Upload before & after satellite images. The model automatically detects forest loss and quantifies the affected area.',
  },
  {
    icon: BarChart3,
    color: '#06b6d4',
    title: 'Detailed Analytics',
    desc: 'Class probability distributions, confusion matrices, training curves, and downloadable PDF reports.',
  },
  {
    icon: Globe,
    color: '#a78bfa',
    title: 'Any Satellite Image',
    desc: 'Works with Sentinel-2, Landsat, or any RGB satellite image. Supports PNG, JPG, JPEG, and GeoTIFF.',
  },
  {
    icon: Shield,
    color: '#f59e0b',
    title: 'Validated Against GFW',
    desc: 'Model performance benchmarked against Global Forest Watch data with reported Precision, Recall, and F1.',
  },
  {
    icon: Zap,
    color: '#4ade80',
    title: 'Real-Time Inference',
    desc: 'GPU-accelerated inference returns results in seconds, with patch-level processing for large satellite images.',
  },
];

const CLASS_CHIPS = [
  { name: 'AnnualCrop',            color: '#f59e0b' },
  { name: 'Forest',                color: '#22c55e' },
  { name: 'HerbaceousVegetation',  color: '#84cc16' },
  { name: 'Highway',               color: '#94a3b8' },
  { name: 'Industrial',            color: '#f97316' },
  { name: 'Pasture',               color: '#a3e635' },
  { name: 'PermanentCrop',         color: '#eab308' },
  { name: 'Residential',           color: '#ef4444' },
  { name: 'River',                 color: '#3b82f6' },
  { name: 'SeaLake',               color: '#06b6d4' },
];

const STATS = [
  { value: '27K', label: 'Training Images' },
  { value: '95%+', label: 'Test Accuracy' },
  { value: '10', label: 'Land Classes' },
  { value: '<1s', label: 'Inference Time' },
];

const STEPS = [
  { n: '01', label: 'Upload Image', sub: 'Any satellite imagery' },
  { n: '02', label: 'AI Inference', sub: 'ResNet50 classification' },
  { n: '03', label: 'Land Cover Map', sub: 'Patch-level grid' },
  { n: '04', label: 'Change Detection', sub: 'Forest loss analysis' },
  { n: '05', label: 'PDF Report', sub: 'Download results' },
];

export const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px',
        overflow: 'hidden',
      }}>

        {/* Background particles / grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)',
        }} />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%', pointerEvents: 'none', zIndex: 0,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%', pointerEvents: 'none', zIndex: 0,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', width: '100%', textAlign: 'center' }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '7px 16px',
              borderRadius: '20px',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              backdropFilter: 'blur(12px)',
            }}>
              <Satellite size={13} color="#4ade80" />
              <span style={{
                fontSize: '12px', fontWeight: 600,
                color: '#4ade80', letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                Research-Grade AI Satellite Platform
              </span>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#4ade80', marginLeft: '4px',
                boxShadow: '0 0 6px rgba(74, 222, 128, 0.8)',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.0,
              marginBottom: '28px',
              color: '#eef2ec',
            }}
          >
            Monitor&nbsp;
            <span style={{
              background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 40%, #86efac 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Canopy Loss
            </span>
            <br />
            From Space
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#a8b4a0',
              maxWidth: '640px',
              margin: '0 auto 48px',
              lineHeight: 1.75,
              fontWeight: 400,
            }}
          >
            CanopyML uses deep learning (ResNet50 + Transfer Learning) to classify
            satellite imagery into 10 land cover classes and automatically detect
            forest loss between two time periods.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}
          >
            <Link
              to="/classify"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px',
                borderRadius: '14px',
                fontSize: '15px', fontWeight: 700,
                color: '#fff',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #1a7a4a 0%, #22c55e 100%)',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3), 0 1px 0 rgba(255,255,255,0.1) inset',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 32px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.3)';
              }}
            >
              Classify Image <ArrowRight size={17} />
            </Link>
            <Link
              to="/deforestation"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px',
                borderRadius: '14px',
                fontSize: '15px', fontWeight: 600,
                color: '#eef2ec',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(34, 197, 94, 0.25)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              <GitCompare size={17} /> Detect Deforestation
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.07)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
                style={{
                  padding: '20px 16px', textAlign: 'center',
                  background: 'rgba(8, 14, 11, 0.6)',
                }}
              >
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '22px', fontWeight: 800,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #4ade80, #86efac)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '2px',
                }}>
                  {value}
                </div>
                <div style={{ fontSize: '11px', color: '#687268', fontWeight: 500, letterSpacing: '0.05em' }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CLASS CHIPS ───────────────────────────────────── */}
      <section style={{
        padding: '64px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(8, 14, 11, 0.4)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <p className="label-caps" style={{ marginBottom: '24px' }}>
            10 EuroSAT Land Cover Classes Supported
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {CLASS_CHIPS.map(({ name, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: `${color}0D`,
                  border: `1px solid ${color}28`,
                  cursor: 'default',
                }}
              >
                <div style={{
                  width: 9, height: 9, borderRadius: '50%',
                  background: color, flexShrink: 0,
                  boxShadow: `0 0 6px ${color}60`,
                }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#a8b4a0' }}>{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="content-band" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="content-inner">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="label-caps" style={{ marginBottom: '12px', color: '#4ade80' }}>Capabilities</p>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 800, letterSpacing: '-0.03em',
                color: '#eef2ec', marginBottom: '16px',
              }}>
                Everything You Need
              </h2>
              <p style={{ color: '#687268', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
                Research-grade AI tools for satellite imagery analysis and environmental monitoring.
              </p>
            </motion.div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="surface surface-hover"
                style={{ padding: '32px' }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: '14px', marginBottom: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}12`,
                  border: `1px solid ${color}22`,
                }}>
                  <Icon size={24} color={color} />
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '17px', fontWeight: 700,
                  letterSpacing: '-0.015em',
                  color: '#eef2ec', marginBottom: '10px',
                }}>
                  {title}
                </h3>
                <p style={{ fontSize: '14px', color: '#687268', lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="content-band" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,14,11,0.3)' }}>
        <div className="content-inner" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '56px' }}
          >
            <p className="label-caps" style={{ marginBottom: '12px', color: '#4ade80' }}>Pipeline</p>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800, letterSpacing: '-0.03em',
              color: '#eef2ec', marginBottom: '14px',
            }}>
              How It Works
            </h2>
            <p style={{ color: '#687268', fontSize: '15px' }}>End-to-end pipeline from image to insight</p>
          </motion.div>

          {/* Steps */}
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'flex-start', justifyContent: 'center',
            gap: '8px',
          }}>
            {STEPS.map(({ n, label, sub }, i) => (
              <React.Fragment key={n}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '120px' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    style={{
                      width: 56, height: 56, borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, #1a7a4a 0%, #22c55e 100%)',
                      fontFamily: "'Syne', sans-serif",
                      fontSize: '15px', fontWeight: 800, color: '#fff',
                      boxShadow: '0 8px 20px rgba(34, 197, 94, 0.25)',
                    }}
                  >
                    {n}
                  </motion.div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#eef2ec', marginBottom: '2px' }}>{label}</p>
                    <p style={{ fontSize: '11px', color: '#687268' }}>{sub}</p>
                  </div>
                </motion.div>

                {i < STEPS.length - 1 && (
                  <div style={{
                    display: 'flex', alignItems: 'center', paddingTop: '20px',
                    color: '#1a7a4a',
                  }}>
                    <ChevronRight size={18} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="surface"
            style={{
              padding: '64px 48px',
              textAlign: 'center',
              background: 'linear-gradient(160deg, rgba(26, 122, 74, 0.15) 0%, rgba(8, 14, 11, 0.9) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Background glow */}
            <div style={{
              position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
              width: '300px', height: '200px',
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                className="animate-float"
                style={{ display: 'inline-block', marginBottom: '24px' }}
              >
                <Leaf size={52} color="#4ade80" />
              </motion.div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 800, letterSpacing: '-0.03em',
                color: '#eef2ec', marginBottom: '16px',
              }}>
                Ready to Monitor Canopy Loss?
              </h2>
              <p style={{
                color: '#687268', fontSize: '15px', maxWidth: '480px',
                margin: '0 auto 36px', lineHeight: 1.7,
              }}>
                Upload a satellite image and get AI-powered land cover classification and change detection maps in seconds.
              </p>
              <Link
                to="/classify"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '14px 32px',
                  borderRadius: '14px',
                  fontSize: '15px', fontWeight: 700,
                  color: '#fff', textDecoration: 'none',
                  background: 'linear-gradient(135deg, #1a7a4a 0%, #22c55e 100%)',
                  boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 32px rgba(34, 197, 94, 0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.3)';
                }}
              >
                Get Started Free <ArrowRight size={17} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
