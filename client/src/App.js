/**
 * [React.js Frontend Architecture]
 * This is the main presentation layer. It uses React.js to manage the state
 * of the application and high-quality Material UI components for the design.
 */
import React, { useEffect, lazy, Suspense } from 'react';
import { ThemeProvider, CssBaseline, Box, keyframes, Typography, Stack } from '@mui/material';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import theme from './theme/index';
import useProfile from './hooks/useProfile';
import Header from './components/Header';
import Portfolio from './pages/Portfolio';
import NetworkErrorScreen from './components/NetworkErrorScreen';
import GlobalHUD from './components/GlobalHUD';
import ProtectedRoute from './components/ProtectedRoute';
import MaintenancePage from './pages/MaintenancePage';

// ─── Lazy Loaded Modules ──────────────────────────────────
const Resume = lazy(() => import('./pages/Resume'));
const Documentation = lazy(() => import('./pages/Documentation'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ManagementHub = lazy(() => import('./pages/ManagementHub'));

// ─── Animations ───────────────────────────────────────────
const spin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseGlow = keyframes`
  0%   { transform: scale(0.9); opacity: 0.5; box-shadow: 0 0 5px #33ccff; }
  50%  { transform: scale(1.1); opacity: 1; box-shadow: 0 0 20px #33ccff; }
  100% { transform: scale(0.9); opacity: 0.5; box-shadow: 0 0 5px #33ccff; }
`;

// ─── Scroll Helpers ────────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

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

const PublicApp = () => {
  const { profile, loading, error, errorType, maintenanceMode, retry } = useProfile();

  // ── Elite System Boot Sequence ──
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
          {/* Holographic Logo Core */}
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

            <Box 
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{ 
                height: 100,
                width: 'auto',
                filter: 'drop-shadow(0 0 30px rgba(51, 204, 255, 0.3))',
                zIndex: 2,
                position: 'relative'
              }}
            />

            {/* Scanning Line Animation */}
            <Box sx={{
              position: 'absolute',
              top: 0, left: -20, right: -20,
              height: '2px',
              bgcolor: '#00F2FE',
              boxShadow: '0 0 15px #00F2FE',
              zIndex: 3,
              opacity: 0.6,
              animation: 'hologramScan 2s infinite ease-in-out'
            }} />
          </Box>

          {/* Detailed Diagnosis Feed */}
          <Stack spacing={2} alignItems="center" sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ width: '100%', px: 4 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="overline" sx={{ color: '#00F2FE', fontWeight: 900, letterSpacing: 2 }}>BOOT_INIT</Typography>
                  <Typography variant="overline" sx={{ color: '#444', fontWeight: 900 }}>99.9%_STABLE</Typography>
               </Box>
               <Box sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ 
                    position: 'absolute', height: '100%', width: '100%', 
                    background: 'linear-gradient(90deg, #FF7A00, #FF0000, #E2127A, #00F2FE)',
                    animation: 'loadingProgress 3s infinite' 
                  }} />
               </Box>
            </Box>

            <Box sx={{ mt: 4, px: 2, py: 1, bgcolor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 2 }}>
               <Typography variant="caption" sx={{ color: '#666', fontFamily: 'monospace', fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
                 >_ INITIALIZING_ENGINE_CORES... [OK]
               </Typography>
               <Typography variant="caption" sx={{ color: '#666', fontFamily: 'monospace', fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
                 >_ CALIBRATING_UI_MANIFEST... [OK]
               </Typography>
               <Typography variant="caption" sx={{ color: '#00F2FE', fontFamily: 'monospace', fontSize: '0.65rem', display: 'block', animation: 'blink 0.5s infinite' }}>
                 >_ DEPLOYING_VISUAL_INTERFACE...
               </Typography>
            </Box>
          </Stack>

          <style>
            {`
              @keyframes hologramScan {
                0% { top: 0%; opacity: 0; }
                50% { top: 50%; opacity: 0.8; }
                100% { top: 100%; opacity: 0; }
              }
              @keyframes loadingProgress {
                0% { left: -100%; }
                50% { left: -30%; }
                100% { left: 100%; }
              }
              @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            `}
          </style>
        </Box>
      </ThemeProvider>
    );
  }

  // ── Maintenance state ──
  if (maintenanceMode) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MaintenancePage />
      </ThemeProvider>
    );
  }

  // ── Error / No data state ──
  if (error || !profile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NetworkErrorScreen errorType={errorType || 'unknown'} onRetry={retry} />
      </ThemeProvider>
    );
  }

  // ── Main app ──
  return (
    <>
      <Header />
      <GlobalHUD />
      <Box sx={{ pt: 10 }}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 20 }}>
            <Box 
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{ 
                height: 60,
                width: 'auto',
                mb: 2,
                filter: 'drop-shadow(0 0 15px rgba(51, 204, 255, 0.3))',
                animation: `${pulseGlow} 2s infinite ease-in-out`
              }}
            />
            <Typography variant="overline" sx={{ color: '#444', letterSpacing: 4, fontWeight: 900 }}>INITIALIZING_MODULE</Typography>
          </Box>
        }>
          <Routes>
            <Route path="/"             element={<Portfolio profile={profile} loading={loading} />} />
            <Route path="/resume"       element={<Resume profile={profile} />} />
            <Route path="/architecture" element={<Documentation profile={profile} />} />
            <Route path="/terminal"     element={<ManagementHub publicView={true} />} />
            <Route path="*"             element={<Portfolio profile={profile} loading={loading} />} />

          </Routes>
        </Suspense>
      </Box>
    </>
  );
};

const AppRoutes = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Suspense fallback={
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#010409' }}>
          <Box 
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{ 
              height: 60,
              width: 'auto',
              mb: 2,
              filter: 'drop-shadow(0 0 15px rgba(51, 204, 255, 0.3))',
              animation: `${pulseGlow} 2s infinite ease-in-out`
            }}
          />
          <Typography variant="overline" sx={{ color: '#444', letterSpacing: 4, fontWeight: 900 }}>SECURE_AUTH_INIT</Typography>
        </Box>
      }>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/management"
            element={
              <ProtectedRoute>
                <ManagementHub />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    );
  }

  return <PublicApp />;
};

// ─── App ──────────────────────────────────────────────────
const App = () => {
  useEffect(() => {
    // Remove the initial splash loader from index.html once React mounts
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
        document.body.style.overflow = 'auto'; // Re-enable scrolling
      }, 800); // Match transition duration in branding.css
    } else {
      document.body.style.overflow = 'auto';
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <ScrollToHash />
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
