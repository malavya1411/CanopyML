import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { Navbar } from '@/layouts/Navbar';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { ClassifyPage } from '@/pages/ClassifyPage';
import { DeforestationPage } from '@/pages/DeforestationPage';
import { ModelPage } from '@/pages/ModelPage';
import { AboutPage } from '@/pages/AboutPage';

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />

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
          style: {
            background: 'rgba(10, 20, 13, 0.95)',
            color: '#eef2ec',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            fontSize: '14px',
            fontFamily: "'Inter', system-ui, sans-serif",
          },
          success: {
            iconTheme: { primary: '#4ade80', secondary: '#052e16' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#1a0000' },
          },
          duration: 3500,
        }}
      />
    </>
  );
};
