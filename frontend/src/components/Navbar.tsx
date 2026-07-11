import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, LayoutDashboard, Brain, TreePine, BarChart3, BookOpen, Menu, X, Satellite } from 'lucide-react';

const NAV_LINKS = [
  { to: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/classify',      label: 'Classify',        icon: Brain },
  { to: '/deforestation', label: 'Deforestation',   icon: TreePine },
  { to: '/model',         label: 'Analytics',       icon: BarChart3 },
  { to: '/about',         label: 'About',           icon: BookOpen },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        borderBottom: scrolled ? '1px solid rgba(34, 197, 94, 0.12)' : '1px solid rgba(255,255,255,0.06)',
        background: scrolled
          ? 'rgba(8, 14, 11, 0.92)'
          : 'rgba(8, 14, 11, 0.75)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Subtle top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(74, 222, 128, 0.4) 50%, transparent 100%)',
        opacity: scrolled ? 1 : 0, transition: 'opacity 0.3s ease',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'linear-gradient(135deg, #1a7a4a 0%, #4ade80 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)',
                flexShrink: 0,
              }}
            >
              <Leaf size={18} color="#fff" />
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '17px',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #4ade80, #86efac)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                CanopyML
              </span>
              <span style={{ fontSize: '9px', color: '#687268', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                Satellite AI
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ─────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="hidden md:flex">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  color: isActive ? '#4ade80' : '#a8b4a0',
                  background: isActive ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(34, 197, 94, 0.16)' : '1px solid transparent',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={14} />
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        style={{
                          position: 'absolute', bottom: -1, left: 0, right: 0,
                          height: 2, background: '#4ade80', borderRadius: 2,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ── Desktop CTA ─────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden md:flex">
            <Link
              to="/classify"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#fff',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #1a7a4a 0%, #22c55e 100%)',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.35)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(34, 197, 94, 0.25)';
              }}
            >
              <Satellite size={14} />
              Analyse Image
            </Link>
          </div>

          {/* ── Mobile Burger ────────────────────────────── */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#a8b4a0',
              cursor: 'pointer',
            }}
            className="md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(34, 197, 94, 0.1)',
              background: 'rgba(8, 14, 11, 0.97)',
              backdropFilter: 'blur(28px)',
            }}
            className="md:hidden"
          >
            <div style={{ padding: '12px 16px 20px' }}>
              {NAV_LINKS.map(({ to, label, icon: Icon }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={to}
                    onClick={() => setOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      marginBottom: '4px',
                      transition: 'all 0.15s ease',
                      color: isActive ? '#4ade80' : '#a8b4a0',
                      background: isActive ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                    })}
                  >
                    <Icon size={16} />
                    {label}
                  </NavLink>
                </motion.div>
              ))}
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Link
                  to="/classify"
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#fff',
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #1a7a4a 0%, #22c55e 100%)',
                  }}
                >
                  <Satellite size={16} /> Analyse Image
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
