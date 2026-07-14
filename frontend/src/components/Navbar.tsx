import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, LayoutDashboard, Brain, TreePine, BarChart3, BookOpen, Satellite } from 'lucide-react';

const NAV_LINKS = [
  { to: '/dashboard',     label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/classify',      label: 'Classify',      icon: Brain },
  { to: '/deforestation', label: 'Deforestation', icon: TreePine },
  { to: '/model',         label: 'Analytics',     icon: BarChart3 },
  { to: '/about',         label: 'About',         icon: BookOpen },
];

export const Navbar: React.FC = () => {
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
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.09)' : '1px solid rgba(0,0,0,0.06)',
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.07)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 34, height: 34, borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                flexShrink: 0,
              }}
            >
              <img src="/logo.svg" alt="CanopyML Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800, fontSize: '22px', letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #166534, #16a34a)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                CanopyML
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ─────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
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
                  color: isActive ? '#16a34a' : '#374151',
                  background: isActive ? 'rgba(22,163,74,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(22,163,74,0.18)' : '1px solid transparent',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={14} color={isActive ? '#16a34a' : '#6b7280'} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ── Desktop CTA ─────────────────────────────── */}
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
              background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
              boxShadow: '0 4px 14px rgba(22,163,74,0.28)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(22,163,74,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(22,163,74,0.28)';
            }}
          >
            <Satellite size={14} />
            Analyse Image
          </Link>

        </div>
      </div>
    </motion.nav>
  );
};
