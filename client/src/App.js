/**
 * Main App component.
 * Handles routing, theme management, and global data fetching.
 */

import React, { useEffect, useState, lazy, Suspense } from 'react';

// Material UI components for styling and layout
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
// React Router components for multi-page navigation
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// Framer Motion for smooth page transition animations
import { motion, AnimatePresence } from 'framer-motion';
// Global theme configuration (colors, typography, etc.)
import theme from './theme/index';
// Custom hook to fetch the portfolio profile data from the backend
import useProfile from './hooks/useProfile';
// Navigation bar component
import Header from './components/Header';
// Main landing page component
import Portfolio from './pages/Portfolio';
// Error screen component if the backend is unreachable
import NetworkErrorScreen from './components/NetworkErrorScreen';
// Background with dynamic particles/effects
import DynamicBackground from './components/DynamicBackground';
// Feature components
import CustomCursor from './components/CustomCursor';
import RecruiterHUD from './components/RecruiterHUD';
import LoadingScreen from './components/LoadingScreen';
import DocumentationHUD from './components/DocumentationHUD';
import { Toaster, toast } from 'react-hot-toast';
import socket from './services/socket';

// ─── Lazy Loaded Modules (Optimization) ──────────────────────────────────
// These pages are only downloaded when the user actually navigates to them,
// which makes the initial website loading much faster.
const Services = lazy(() => import('./pages/Services'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const Resume = lazy(() => import('./pages/Resume'));
const Documentation = lazy(() => import('./pages/Documentation'));

/**
 * Resets scroll position on route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * Handles scrolling to hash links (e.g. #contact).
 */
const ScrollToHash = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    let attempts = 0;
    const maxAttempts = 20;

    const tryScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 150);
      }
    };
    setTimeout(tryScroll, 100);
  }, [hash, pathname]);
  return null;
};

/**
 * Main container for public-facing pages.
 */
const PublicApp = () => {
  const location = useLocation();
  const {
    profile,
    loading: profileLoading,
    error,
    errorType,
    retry,
  } = useProfile();

  if (error || !profile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NetworkErrorScreen errorType={errorType || 'unknown'} onRetry={retry} />
      </ThemeProvider>
    );
  }

  return (
    <>
      <Header profile={profile} />
      <DynamicBackground />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Main Content Area */}
        <Box
          id="main-scroll-container"
          sx={{
            flexGrow: 1,
            width: '100%',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <Suspense
                fallback={
                  <Box sx={{ py: 25, textAlign: 'center' }}>
                    <Typography sx={{ color: 'white', fontWeight: 700, fontFamily: 'Outfit' }}>
                      Loading Experience...
                    </Typography>
                  </Box>
                }
              >
                <Routes location={location}>
                  <Route
                    path="/"
                    element={<Portfolio profile={profile} loading={profileLoading} />}
                  />
                  <Route path="/services" element={<Services profile={profile} />} />
                  <Route path="/projects" element={<ProjectsPage profile={profile} />} />
                  <Route path="/resume" element={<Resume profile={profile} />} />
                  <Route path="/documentation" element={<Documentation profile={profile} />} />
                  <Route
                    path="*"
                    element={<Portfolio profile={profile} loading={profileLoading} />}
                  />
                </Routes>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Side Navigation Dots */}
      <Box
        sx={{
          position: 'fixed',
          right: 32,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 9999,
          display: { xs: 'none', xl: 'flex' },
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {['hero', 'services', 'projects', 'testimonials', 'skills', 'about', 'contact'].map((section) => (
          <Box
            key={section}
            component="a"
            href={`#${section}`}
            sx={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
              bgcolor: location.hash === `#${section}` ? '#e11d48' : 'transparent',
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
              '&:hover': {
                scale: 1.6,
                borderColor: '#e11d48',
                bgcolor: 'rgba(225, 29, 72, 0.4)',
              },
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>

      {/* Global Components */}
      <CustomCursor />
      <RecruiterHUD profile={profile} />
      <DocumentationHUD profile={profile} />
    </>
  );
};

/**
 * Main routes for the application.
 */
const AppRoutes = () => {
  return <PublicApp />;
};

/**
 * Global entry point for the App.
 */
const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
        document.body.style.overflow = 'auto';
      }, 600);
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    socket.on('connect', () => {
      if (socket.recovered || (window.sc_count > 0)) {
        toast.success('System reconnected', {
          style: { background: '#0f172a', color: '#00ffcc', border: '1px solid #00ffcc33' },
          iconTheme: { primary: '#00ffcc', secondary: '#0f172a' }
        });
      }
      window.sc_count = (window.sc_count || 0) + 1;
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="bottom-right" reverseOrder={false} />
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <Box key="content" sx={{ position: 'relative' }}>
            <div id="spotlight" />
            <div id="noise-overlay" />

            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <>
                <ScrollToTop />
                <ScrollToHash />
                <AppRoutes />
              </>
            </Router>
          </Box>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default App;
