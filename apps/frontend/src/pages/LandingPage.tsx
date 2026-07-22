import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain, GitCompare, BarChart3, Globe, Shield, Zap,
  ArrowRight, ChevronRight, TreePine, ScanLine,
  TrendingUp, ShieldCheck,
} from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────────── */

const HERO_STATS = [
  { icon: TreePine,   value: '10',       label: 'Land Cover Classes' },
  { icon: ScanLine,   value: 'High',     label: 'Res Satellite Data' },
  { icon: TrendingUp, value: '95%+',     label: 'Classification Accuracy' },
  { icon: ShieldCheck,value: 'Research', label: 'Grade AI Models' },
];

const FEATURES = [
  {
    icon: Brain,
    color: '#16a34a',
    title: 'AI Land Cover Classification',
    desc: 'ResNet50 trained on 27,000 EuroSAT satellite patches achieves 95%+ accuracy across 10 land cover classes.',
  },
  {
    icon: GitCompare,
    color: '#ea580c',
    title: 'Deforestation Detection',
    desc: 'Upload before & after satellite images. The model automatically detects forest loss and quantifies the affected area.',
  },
  {
    icon: BarChart3,
    color: '#0891b2',
    title: 'Detailed Analytics',
    desc: 'Class probability distributions, confusion matrices, training curves, and downloadable PDF reports.',
  },
  {
    icon: Globe,
    color: '#7c3aed',
    title: 'Any Satellite Image',
    desc: 'Works with Sentinel-2, Landsat, or any RGB satellite image. Supports PNG, JPG, JPEG, and GeoTIFF.',
  },
  {
    icon: Shield,
    color: '#d97706',
    title: 'Validated Against GFW',
    desc: 'Model performance benchmarked against Global Forest Watch data with reported Precision, Recall, and F1.',
  },
  {
    icon: Zap,
    color: '#16a34a',
    title: 'Real-Time Inference',
    desc: 'GPU-accelerated inference returns results in seconds, with patch-level processing for large satellite images.',
  },
];

const CLASS_CHIPS = [
  { name: 'AnnualCrop',           color: '#d97706' },
  { name: 'Forest',               color: '#16a34a' },
  { name: 'HerbaceousVegetation', color: '#65a30d' },
  { name: 'Highway',              color: '#64748b' },
  { name: 'Industrial',           color: '#ea580c' },
  { name: 'Pasture',              color: '#84cc16' },
  { name: 'PermanentCrop',        color: '#ca8a04' },
  { name: 'Residential',          color: '#dc2626' },
  { name: 'River',                color: '#2563eb' },
  { name: 'SeaLake',              color: '#0891b2' },
];

const STEPS = [
  { n: '01', label: 'Upload Image',    sub: 'Any satellite imagery' },
  { n: '02', label: 'AI Inference',    sub: 'ResNet50 classification' },
  { n: '03', label: 'Land Cover Map',  sub: 'Patch-level grid' },
  { n: '04', label: 'Change Detection',sub: 'Forest loss analysis' },
  { n: '05', label: 'PDF Report',      sub: 'Download results' },
];

/* ─── Shared light-theme tokens ─────────────────────────────── */
const LT = {
  bg:         '#f8fdf9',
  bgCard:     '#ffffff',
  border:     'rgba(0,0,0,0.07)',
  borderGreen:'rgba(22,163,74,0.25)',
  textPrimary:'#111827',
  textSec:    '#374151',
  textMuted:  '#6b7280',
  green:      '#16a34a',
  greenLight: '#22c55e',
  greenPale:  'rgba(22,163,74,0.08)',
};

/* ─── Component ─────────────────────────────────────────────── */

export const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: LT.bg, overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════
          HERO — split layout
         ══════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        background: '#ffffff',
      }}>

        {/* ── Left content pane ── */}
        <div style={{
          flex: '0 0 52%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px 56px 60px 64px',
          position: 'relative',
          zIndex: 2,
        }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginBottom: '28px' }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '5px 12px',
              borderRadius: '20px',
              background: LT.greenPale,
              border: `1px solid ${LT.borderGreen}`,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: LT.green,
            }}>
              <ScanLine size={12} />
              Active AI Monitoring
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: LT.greenLight,
                display: 'inline-block',
                boxShadow: `0 0 6px ${LT.greenLight}`,
                animation: 'lp-pulse 2s ease-in-out infinite',
              }} />
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2.6rem, 4.5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              color: '#0f172a',
              marginBottom: '22px',
            }}
          >
            Monitor <span style={{ color: '#22c55e' }}>Canopy</span>
            <br />
            <span style={{ color: '#22c55e' }}>Loss</span> From Space
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            style={{
              fontSize: '15px',
              color: LT.textMuted,
              lineHeight: 1.75,
              maxWidth: '400px',
              marginBottom: '36px',
            }}
          >
            CanopyML uses deep learning (ResNet50 + Transfer Learning) to classify
            satellite imagery into 10 land cover classes and automatically detect
            forest loss between two time periods.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '56px' }}
          >
            <Link
              to="/classify"
              id="hero-classify-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 22px',
                borderRadius: '10px',
                fontSize: '14px', fontWeight: 700,
                color: '#fff',
                textDecoration: 'none',
                background: `linear-gradient(135deg, #166534 0%, ${LT.greenLight} 100%)`,
                boxShadow: '0 6px 20px rgba(22,163,74,0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(22,163,74,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(22,163,74,0.3)';
              }}
            >
              <Brain size={15} />
              Classify Image <ArrowRight size={14} />
            </Link>

            <Link
              to="/deforestation"
              id="hero-deforestation-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 22px',
                borderRadius: '10px',
                fontSize: '14px', fontWeight: 600,
                color: LT.textSec,
                textDecoration: 'none',
                background: '#fff',
                border: `1.5px solid ${LT.border}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = LT.borderGreen;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(22,163,74,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = LT.border;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <GitCompare size={15} />
              Detect Deforestation
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px',
              background: LT.border,
              borderRadius: '14px',
              overflow: 'hidden',
              border: `1px solid ${LT.border}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              maxWidth: '480px',
            }}
          >
            {HERO_STATS.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.36 + i * 0.06 }}
                style={{
                  background: '#fff',
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  textAlign: 'center',
                }}
              >
                <Icon size={18} color={LT.green} strokeWidth={1.8} />
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '17px',
                  fontWeight: 800,
                  color: LT.textPrimary,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}>
                  {value}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: LT.textMuted,
                  letterSpacing: '0.02em',
                  lineHeight: 1.3,
                }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Right image pane ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            flex: '0 0 48%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative leaf accents */}
          <div style={{
            position: 'absolute', top: '15%', left: '-20px', zIndex: 3, pointerEvents: 'none',
            width: 80, height: 80, opacity: 0.85,
          }}>
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="40" cy="50" rx="28" ry="38" fill="#16a34a" fillOpacity="0.9"
                transform="rotate(-20 40 40)" />
            </svg>
          </div>
          <div style={{
            position: 'absolute', bottom: '10%', left: '-30px', zIndex: 3, pointerEvents: 'none',
            width: 110, height: 110, opacity: 0.8,
          }}>
            <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="55" cy="70" rx="38" ry="52" fill="#15803d" fillOpacity="0.85"
                transform="rotate(-15 55 55)" />
            </svg>
          </div>

          {/* Gradient fade on the left edge */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            width: '120px', zIndex: 2, pointerEvents: 'none',
            background: 'linear-gradient(to right, #ffffff 0%, transparent 100%)',
          }} />

          {/* Gradient fade on the top edge */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '100px', zIndex: 2, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, #ffffff 0%, transparent 100%)',
          }} />

          <img
            src="/forest-hero.png"
            alt="Aerial view of dense forest canopy with a winding road"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
        </motion.div>
      </section>

      {/* Pulse animation keyframe */}
      <style>{`
        @keyframes lp-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        .lp-section {
          background: #f8fdf9;
        }
        .lp-feature-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          padding: 28px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .lp-feature-card:hover {
          border-color: rgba(22,163,74,0.25);
          box-shadow: 0 8px 28px rgba(22,163,74,0.12);
          transform: translateY(-3px);
        }
        .lp-step-connector {
          color: #16a34a;
          display: flex;
          align-items: center;
          padding-top: 18px;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════
          CLASS CHIPS
         ══════════════════════════════════════════════════ */}
      <section className="lp-section" style={{
        padding: '64px 24px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: LT.green,
            marginBottom: '24px',
          }}>
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
                  background: `${color}0F`,
                  border: `1px solid ${color}30`,
                  cursor: 'default',
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: color, flexShrink: 0,
                  boxShadow: `0 0 5px ${color}70`,
                }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES
         ══════════════════════════════════════════════════ */}
      <section style={{
        padding: '96px 24px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        background: '#ffffff',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: LT.green, marginBottom: '12px',
              }}>
                Capabilities
              </p>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800, letterSpacing: '-0.03em',
                color: LT.textPrimary, marginBottom: '14px',
              }}>
                Everything You Need
              </h2>
              <p style={{ color: LT.textMuted, fontSize: '15px', maxWidth: '440px', margin: '0 auto' }}>
                Research-grade AI tools for satellite imagery analysis and environmental monitoring.
              </p>
            </motion.div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px',
          }}>
            {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="lp-feature-card"
              >
                <div style={{
                  width: 48, height: 48, borderRadius: '12px', marginBottom: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}12`,
                  border: `1px solid ${color}22`,
                }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '16px', fontWeight: 700,
                  letterSpacing: '-0.015em',
                  color: LT.textPrimary, marginBottom: '10px',
                }}>
                  {title}
                </h3>
                <p style={{ fontSize: '14px', color: LT.textMuted, lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
         ══════════════════════════════════════════════════ */}
      <section style={{
        padding: '96px 24px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        background: '#f8fdf9',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '52px' }}
          >
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: LT.green, marginBottom: '12px',
            }}>
              Pipeline
            </p>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 800, letterSpacing: '-0.03em',
              color: LT.textPrimary, marginBottom: '12px',
            }}>
              How It Works
            </h2>
            <p style={{ color: LT.textMuted, fontSize: '15px' }}>
              End-to-end pipeline from image to insight
            </p>
          </motion.div>

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
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '110px' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    style={{
                      width: 52, height: 52, borderRadius: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `linear-gradient(135deg, #166534 0%, ${LT.greenLight} 100%)`,
                      fontFamily: "'Syne', sans-serif",
                      fontSize: '14px', fontWeight: 800, color: '#fff',
                      boxShadow: '0 6px 18px rgba(22,163,74,0.28)',
                    }}
                  >
                    {n}
                  </motion.div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: LT.textPrimary, marginBottom: '2px' }}>{label}</p>
                    <p style={{ fontSize: '11px', color: LT.textMuted }}>{sub}</p>
                  </div>
                </motion.div>

                {i < STEPS.length - 1 && (
                  <div className="lp-step-connector">
                    <ChevronRight size={18} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BANNER
         ══════════════════════════════════════════════════ */}
      <section style={{
        padding: '80px 24px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        background: '#ffffff',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              padding: '60px 48px',
              textAlign: 'center',
              background: 'linear-gradient(160deg, rgba(22,163,74,0.07) 0%, rgba(248,253,249,0.9) 100%)',
              border: `1px solid ${LT.borderGreen}`,
              borderRadius: '20px',
              boxShadow: '0 4px 24px rgba(22,163,74,0.1)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
              width: '300px', height: '200px',
              background: 'radial-gradient(circle, rgba(22,163,74,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-block',
                width: 64,
                height: 64,
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                animation: 'float 6s ease-in-out infinite'
              }}>
                <img src="/logo.svg" alt="CanopyML Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 800, letterSpacing: '-0.03em',
                color: LT.textPrimary, marginBottom: '14px',
              }}>
                Ready to Monitor Canopy Loss?
              </h2>
              <p style={{
                color: LT.textMuted, fontSize: '15px', maxWidth: '440px',
                margin: '0 auto 32px', lineHeight: 1.7,
              }}>
                Upload a satellite image and get AI-powered land cover classification
                and change detection maps in seconds.
              </p>
              <Link
                to="/classify"
                id="cta-get-started-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 30px',
                  borderRadius: '12px',
                  fontSize: '15px', fontWeight: 700,
                  color: '#fff', textDecoration: 'none',
                  background: `linear-gradient(135deg, #166534 0%, ${LT.greenLight} 100%)`,
                  boxShadow: '0 6px 22px rgba(22,163,74,0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(22,163,74,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 22px rgba(22,163,74,0.3)';
                }}
              >
                Get Started Free <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
