import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, BarChart3, GitCompare, Brain, Info, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/dashboard',     label: 'Dashboard',    icon: BarChart3 },
  { to: '/classify',      label: 'Classify',     icon: Brain },
  { to: '/deforestation', label: 'Deforestation', icon: GitCompare },
  { to: '/model',         label: 'Model',        icon: BarChart3 },
  { to: '/about',         label: 'About',        icon: Info },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2d8c4e] to-[#00b4a6] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">CanopyML</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2d8c4e]/20 text-[#3aad63]'
                      : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/5'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/classify"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#2d8c4e] to-[#00b4a6] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Try Demo
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden text-[#8b949e] hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden glass border-t border-white/10 px-4 pb-4"
        >
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium mt-1 ${
                  isActive ? 'bg-[#2d8c4e]/20 text-[#3aad63]' : 'text-[#8b949e]'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};
