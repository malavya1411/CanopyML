import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ClassifyPage } from './pages/ClassifyPage';
import { DeforestationPage } from './pages/DeforestationPage';
import { ModelPage } from './pages/ModelPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      
      {/* Framer motion page transitions wrapper */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"              element={<LandingPage />} />
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/classify"      element={<ClassifyPage />} />
          <Route path="/deforestation" element={<DeforestationPage />} />
          <Route path="/model"         element={<ModelPage />} />
          <Route path="/about"         element={<AboutPage />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'glass text-sm text-[#e6edf3]',
          style: {
            background: '#161b22',
            color: '#e6edf3',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
          },
          success: { iconTheme: { primary: '#2d8c4e', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef5350', secondary: '#fff' } },
        }}
      />
    </>
  );
};
