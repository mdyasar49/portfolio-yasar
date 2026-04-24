/**
 * [A. MOHAMED YASAR | MERN PORTFOLIO]
 * Copyright (c) 2026 A. Mohamed Yasar
 * MIT License
 * 
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This is the Root Application Component. It acts as the "brain" of the frontend, 
 * orchestrating the entire lifecycle: fetching global profile data, managing the theme (Material UI),
 * handling navigation (routing), and applying global visual effects like the custom cursor spotlight.
 */


import React, { useEffect, lazy, Suspense } from 'react';
// Material UI components for styling and layout
import { ThemeProvider, CssBaseline, Box, keyframes, Typography, Stack } from '@mui/material';
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
// "Head-Up Display" UI elements for a futuristic look
import SystemInterfaceHUD from './components/SystemInterfaceHUD';
// Wrapper for routes that require admin authentication
import ProtectedRoute from './components/ProtectedRoute';
// Page shown when the site is under maintenance
import MaintenancePage from './pages/MaintenancePage';
// Background with dynamic particles/effects
import DynamicBackground from './components/DynamicBackground';
// [CODE_LIVE] Feature components for live source viewing
import { CodeLiveProvider, useCodeLive } from './context/CodeLiveContext';
import CodeLiveOverlay from './components/CodeLiveOverlay';
import StatusHUD from './components/StatusHUD';




// ─── Lazy Loaded Modules (Optimization) ──────────────────────────────────
// These pages are only downloaded when the user actually navigates to them,
// which makes the initial website loading much faster.
const Resume = lazy(() => import('./pages/Resume'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdministrativeTerminal = lazy(() => import('./pages/AdministrativeTerminal'));

// ─── Animations (CSS-in-JS) ───────────────────────────────────────────
// Define a spinning animation for the loading screen logo
const spin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

/**
 * [ScrollToTop]
 * Function purpose: Resets the window scroll position to the very top 
 * whenever the user changes pages (routes).
 */
const ScrollToTop = () => {
  // Get the current URL path
  const { pathname } = useLocation();
  // Whenever the path changes, scroll to coordinate 0,0
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  // This component doesn't render anything visible
  return null;
};

/**
 * [ScrollToHash]
 * Function purpose: Automatically scrolls the user to a specific section 
 * (like #contact) if the URL contains a "hash" link.
 */
const ScrollToHash = () => {
  // Extract hash (e.g., #contact) and current path from the URL
  const { hash, pathname } = useLocation();
  
  useEffect(() => {
    // If no hash is present, do nothing
    if (!hash) return;
    // Remove the '#' symbol to get the plain ID string
    const id = hash.replace('#', '');
    let attempts = 0;
    const maxAttempts = 20;

    // Retry function because elements might not be fully rendered yet
    const tryScroll = () => {
      // Look for the HTML element with the matching ID
      const element = document.getElementById(id);
      if (element) {
        // Scroll smoothly to that element
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      // If element not found, increment attempt counter
      attempts += 1;
      // Retry every 150ms up to 20 times
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 150);
      }
    };
    // Initial trigger with a small delay
    setTimeout(tryScroll, 100);
  }, [hash, pathname]);
  return null;
};

/**
 * [PublicApp]
 * Function purpose: The main container for all public-facing pages.
 * It manages the "Loading", "Error", and "Maintenance" states before showing the site.
 */
const PublicApp = () => {
  // Get current location for animation tracking
  const location = useLocation();
  // Fetch profile data and status flags from the backend
  const { profile, loading, error, errorType, maintenanceMode, retry } = useProfile();
  // Access global Code Live state
  const { isCodeLive } = useCodeLive();


  // ── [Elite System Boot Sequence] ──
  // If data is still loading, show a high-end futuristic loading screen
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Resets default browser styles */}
        <Box sx={{
          height: '100vh',
          bgcolor: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          // Add a subtle radial gradient glow behind the logo
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(51, 204, 255, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }
        }}>
          {/* Holographic Logo with rotating border rings */}
          <Box sx={{ position: 'relative', mb: 8 }}>
            {/* Outer rotating solid ring */}
            <Box sx={{
              position: 'absolute', inset: -20,
              border: '1px solid rgba(51, 204, 255, 0.1)',
              borderRadius: '50%',
              animation: `${spin} 10s linear infinite`
            }} />
            {/* Inner rotating dashed ring in opposite direction */}
            <Box sx={{
              position: 'absolute', inset: -40,
              border: '1px dashed rgba(255, 51, 102, 0.1)',
              borderRadius: '50%',
              animation: `${spin} 15s linear infinite reverse`
            }} />
            {/* The main logo image with a glow effect */}
            <Box component="img" src="/logo.png" alt="Logo" sx={{ height: 100, width: 'auto', filter: 'drop-shadow(0 0 30px rgba(51, 204, 255, 0.3))', zIndex: 2, position: 'relative' }} />
          </Box>

          {/* Progress Bar Container */}
          <Stack spacing={2} alignItems="center" sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ width: '100%', px: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                   <Typography variant="overline" sx={{ color: '#00F2FE', fontWeight: 900, letterSpacing: 2 }}>RESOURCES_LOADING</Typography>
                </Box>
                {/* Background bar */}
                <Box sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
                   {/* Animated filling bar with a gradient color */}
                   <Box sx={{ position: 'absolute', height: '100%', width: '100%', background: 'linear-gradient(90deg, #FF7A00, #FF0000, #E2127A, #00F2FE)', animation: 'loadingProgress 3s infinite' }} />
                </Box>
            </Box>
          </Stack>
          {/* Custom CSS for the progress bar animation */}
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
  // If the admin has turned on maintenance mode, show the maintenance page only
  if (maintenanceMode) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MaintenancePage />
      </ThemeProvider>
    );
  }

  // ── Error Handling Check ──
  // If there was an error fetching data or the profile is missing, show the error screen
  if (error || !profile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Pass the error type and a retry function to the error screen */}
        <NetworkErrorScreen errorType={errorType || 'unknown'} onRetry={retry} />
      </ThemeProvider>
    );
  }

  // ── [Main Portfolio Layout] ──
  // This is what the user sees once data is loaded successfully
  return (
    <>
      {/* Top navigation header - Always visible for module switching */}
      <Header />

      {/* Animated background particles */}
      <DynamicBackground />
      {/* HUD overlay elements (borders, scanlines, etc.) */}
      <SystemInterfaceHUD />
      
      <Box sx={{ 
        display: 'flex', 
        height: '100vh', 
        pt: 10,
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* ── [UI_STREAM_CONTAINER] ── */}
        {/* Hidden when CODE_LIVE is ON as per USER request */}
        {!isCodeLive && (
          <Box id="main-scroll-container" sx={{ 
            flexGrow: 1, 
            height: '100%', 
            overflowY: 'auto',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%'
          }}>

            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Suspense fallback={<Box sx={{ py: 20, textAlign: 'center' }}><Typography>MODULE_LOADING...</Typography></Box>}>
                  <Routes location={location}>
                    <Route path="/"             element={<Portfolio profile={profile} loading={loading} />} />
                    <Route path="/resume"       element={<Resume profile={profile} />} />
                    <Route path="*"             element={<Portfolio profile={profile} loading={loading} />} />
                  </Routes>
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </Box>
        )}

        {/* ── [CODE_STREAM_PANEL] ── */}
        {/* Takes full screen width when active */}
        <Box sx={{ 
          width: isCodeLive ? '100%' : 0, 
          height: '100%',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          top: 0, right: 0, zIndex: 2000
        }}>
          <CodeLiveOverlay />
        </Box>
      </Box>
    </>
  );
};


/**
 * [AppRoutes]
 * Function purpose: Switches between the Admin Dashboard UI and the Public Portfolio UI
 * based on whether the current URL starts with /admin.
 */
const AppRoutes = () => {
  const { pathname } = useLocation();
  const { isCodeLive } = useCodeLive();
  const isAdminRoute = pathname.startsWith('/admin');

  const renderRoutes = () => (
    <Suspense fallback={<Box sx={{ py: 20, textAlign: 'center' }}><Typography>SECURE_AUTH_LOADING...</Typography></Box>}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/management" element={<ProtectedRoute><AdministrativeTerminal /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );

  if (isAdminRoute) {
    return (
      <Box sx={{ 
        display: 'flex', height: '100vh', pt: 10, overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Hide admin UI if Code Live is ON */}
        {!isCodeLive && (
          <Box sx={{ 
            flexGrow: 1, height: '100%', overflowY: 'auto',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%'
          }}>
            {renderRoutes()}
          </Box>
        )}
        <Box sx={{ 
          width: isCodeLive ? '100%' : 0, height: '100%',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          top: 0, right: 0, zIndex: 2000
        }}>
          <CodeLiveOverlay />
        </Box>
      </Box>
    );
  }

  return <PublicApp />;
};


/**
 * [App] (Global Entry Point)
 * Function purpose: Initializes the main application, handles theme injection,
 * removes the initial HTML loader, and tracks global mouse movements for visual effects.
 */
const App = () => {
  useEffect(() => {
    // Step 1: Remove the static loader from the original index.html file
    // This makes the transition from HTML loading to React rendering feel smooth.
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0'; // Fade out
      // Completely remove it after the fade animation finishes
      setTimeout(() => { loader.remove(); document.body.style.overflow = 'auto'; }, 800); 
    } else {
      document.body.style.overflow = 'auto'; // Ensure scrolling is enabled
    }

    // Step 2: Global Spotlight Cursor Tracking
    // This updates CSS variables --x and --y globally based on mouse position.
    // These variables are used by components to create glow effects that follow the mouse.
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--y', `${e.clientY}px`);
    };
    // Add the listener when the app starts
    window.addEventListener('mousemove', handleMouseMove);
    // Clean up the listener when the app is closed to prevent memory leaks
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    // Wrap the entire app in the Material UI theme provider
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Standardizes CSS across all browsers */}
      {/* Global visual overlay elements */}
      <div id="spotlight" />
      <div id="noise-overlay" />
      
      {/* Initialize the Router with modern v7 compatibility flags */}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CodeLiveProvider>
          {/* Reset scroll on page change */}
          <ScrollToTop />
          {/* Handle hash links (like #contact) */}
          <ScrollToHash />
          {/* Floating Technical Status HUD */}
          <StatusHUD />
          {/* Render the actual page routes */}
          <AppRoutes />

        </CodeLiveProvider>

      </Router>

    </ThemeProvider>
  );
};

export default App;
