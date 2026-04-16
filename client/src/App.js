/**
 * [React.js Frontend Architecture]
 * Technologies: React.js (Suspense, Lazy), Material UI (ThemeProvider, CssBaseline), Framer Motion (AnimatePresence)
 * Purpose: This is the Root Application Component. It orchestrates the entire frontend lifecycle, 
 * including global state fetching, theme application, and dynamic route management.
 */
import React, { useEffect, lazy, Suspense } from 'react';
import { ThemeProvider, CssBaseline, Box, keyframes, Typography, Stack } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import theme from './theme/index';
import useProfile from './hooks/useProfile';
import Header from './components/Header';
import Portfolio from './pages/Portfolio';
import NetworkErrorScreen from './components/NetworkErrorScreen';
import SystemInterfaceHUD from './components/SystemInterfaceHUD';
import ProtectedRoute from './components/ProtectedRoute';
import MaintenancePage from './pages/MaintenancePage';
import DynamicBackground from './components/DynamicBackground';

// ─── Lazy Loaded Modules (Optimization) ──────────────────────────────────
// These modules are loaded only when navigated to, reducing the initial bundle size.
const Resume = lazy(() => import('./pages/Resume'));
const Documentation = lazy(() => import('./pages/Documentation'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdministrativeTerminal = lazy(() => import('./pages/AdministrativeTerminal'));

// ─── Animations (CSS-in-JS) ───────────────────────────────────────────
const spin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseGlow = keyframes`
  0%   { transform: scale(0.9); opacity: 0.5; box-shadow: 0 0 5px #33ccff; }
  50%  { transform: scale(1.1); opacity: 1; box-shadow: 0 0 20px #33ccff; }
  100% { transform: scale(0.9); opacity: 0.5; box-shadow: 0 0 5px #33ccff; }
`;

/**
 * ScrollToTop Helper
 * Resets the window scroll position to zero on route changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

/**
 * ScrollToHash Helper
 * Enables smooth scrolling to specific ID targets when a hash is present in the URL.
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
 * PublicApp Component
 * Manages the data state for the public-facing portfolio.
 */
const PublicApp = () => {
  const location = useLocation();
  // useProfile hook handles the asynchronous fetch from the Node.js/MongoDB backend
  const { profile, loading, error, errorType, maintenanceMode, retry } = useProfile();

  // ── [Elite System Boot Sequence] ──
  // Displayed while the frontend is fetching initial profile data from the server.
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          height: '100vh',
          bgcolor: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(51, 204, 255, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }
        }}>
          {/* Holographic Logo Core with CSS Animations */}
          <Box sx={{ position: 'relative', mb: 8 }}>
            <Box sx={{
              position: 'absolute', inset: -20,
              border: '1px solid rgba(51, 204, 255, 0.1)',
              borderRadius: '50%',
              animation: `${spin} 10s linear infinite`
            }} />
            <Box sx={{
              position: 'absolute', inset: -40,
              border: '1px dashed rgba(255, 51, 102, 0.1)',
              borderRadius: '50%',
              animation: `${spin} 15s linear infinite reverse`
            }} />
            <Box component="img" src="/logo.png" alt="Logo" sx={{ height: 100, width: 'auto', filter: 'drop-shadow(0 0 30px rgba(51, 204, 255, 0.3))', zIndex: 2, position: 'relative' }} />
          </Box>

          {/* Detailed Diagnosis Feed (Simulated Boot Log) */}
          <Stack spacing={2} alignItems="center" sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ width: '100%', px: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                   <Typography variant="overline" sx={{ color: '#00F2FE', fontWeight: 900, letterSpacing: 2 }}>RESOURCES_LOADING</Typography>
                </Box>
                <Box sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
                   <Box sx={{ position: 'absolute', height: '100%', width: '100%', background: 'linear-gradient(90deg, #FF7A00, #FF0000, #E2127A, #00F2FE)', animation: 'loadingProgress 3s infinite' }} />
                </Box>
            </Box>
          </Stack>
          <style>
            {`
              @keyframes loadingProgress { 0% { left: -100%; } 100% { left: 100%; } }
            `}
          </style>
        </Box>
      </ThemeProvider>
    );
  }

  // ── Maintenance state Check ──
  if (maintenanceMode) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MaintenancePage />
      </ThemeProvider>
    );
  }

  // ── Error Handling Check ──
  if (error || !profile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NetworkErrorScreen errorType={errorType || 'unknown'} onRetry={retry} />
      </ThemeProvider>
    );
  }

  // ── [Main Portfolio Layout] ──
  return (
    <>
      <Header />
      <DynamicBackground />
      <SystemInterfaceHUD />
      <Box sx={{ pt: 10 }}>
        {/* AnimatePresence enables exit-animations when switching routes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Suspense handles the loading state of the lazy-loaded components */}
            <Suspense fallback={<Box sx={{ py: 20, textAlign: 'center' }}><Typography>MODULE_LOADING...</Typography></Box>}>
              <Routes location={location}>
                <Route path="/"             element={<Portfolio profile={profile} loading={loading} />} />
                <Route path="/resume"       element={<Resume profile={profile} />} />
                <Route path="/architecture" element={<Documentation profile={profile} />} />
                <Route path="/terminal"     element={<AdministrativeTerminal publicView={true} />} />
                <Route path="*"             element={<Portfolio profile={profile} loading={loading} />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </Box>
    </>
  );
};

/**
 * AppRoutes Component
 * Determines whether to render Administrative views or the Public views based on current path.
 */
const AppRoutes = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Suspense fallback={<Typography>SECURE_AUTH_LOADING...</Typography>}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/management" element={<ProtectedRoute><AdministrativeTerminal /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    );
  }
  return <PublicApp />;
};

/**
 * App Component (Global Entry Point)
 * Initializes global listeners and removes the static HTML loader once React is ready.
 */
const App = () => {
  useEffect(() => {
    // Phase 1: Clean up initial-loader from index.html
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => { loader.remove(); document.body.style.overflow = 'auto'; }, 800); 
    } else {
      document.body.style.overflow = 'auto';
    }

    // Phase 2: Global Spotlight Cursor Tracking
    // Updates CSS variables --x and --y for the glow effect following the cursor
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="spotlight" />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <ScrollToHash />
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
