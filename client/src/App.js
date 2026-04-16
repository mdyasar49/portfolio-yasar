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

  // ── Initializing Operations ──
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          height: '100vh',
          bgcolor: '#010409',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}>
          {/* Orbital Loader Structure */}
          <Box sx={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Spinning ring outer */}
            <Box sx={{
              position: 'absolute',
              width: 100, height: 100,
              border: '2px solid rgba(51, 204, 255, 0.05)',
              borderTop: '2px solid #33ccff',
              borderRadius: '50%',
              animation: `${spin} 0.8s linear infinite`,
            }} />
            
            {/* Inner signature core */}
            <Box sx={{ zIndex: 1 }}>
              <Box 
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{ 
                  height: 40,
                  width: 'auto',
                  filter: 'drop-shadow(0 0 10px rgba(51, 204, 255, 0.4))',
                  animation: `${pulseGlow} 2s infinite ease-in-out`
                }}
              />
            </Box>
          </Box>
          <Typography variant="overline" sx={{ color: '#444', letterSpacing: 4, fontWeight: 900 }}>INITIALIZING_OPERATIONS</Typography>
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
