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
// "Head-Up Display" UI elements for a futuristic look
import SystemInterfaceHUD from './components/SystemInterfaceHUD';
// Page shown when the site is under maintenance
import MaintenancePage from './pages/MaintenancePage';
// Background with dynamic particles/effects
import DynamicBackground from './components/DynamicBackground';
// Feature components
import StatusHUD from './components/StatusHUD';
import CustomCursor from './components/CustomCursor';
import RecruiterHUD from './components/RecruiterHUD';
import LoadingScreen from './components/LoadingScreen';
import DocumentationHUD from './components/DocumentationHUD';

// ─── Lazy Loaded Modules (Optimization) ──────────────────────────────────
// These pages are only downloaded when the user actually navigates to them,
// which makes the initial website loading much faster.
const Resume = lazy(() => import('./pages/Resume'));

// ─── Animations (CSS-in-JS) ───────────────────────────────────────────

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
  const { profile, loading: profileLoading, error, errorType, maintenanceMode, retry } = useProfile();

  // ── [Elite System Boot Sequence Check] ──
  // If data is still loading, show a high-end futuristic loading screen
  // This is handled in the root App component now

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
      <Header profile={profile} />

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
                  <Route path="/"             element={<Portfolio profile={profile} loading={profileLoading} />} />
                  <Route path="/resume"       element={<Resume profile={profile} />} />
                  <Route path="*"             element={<Portfolio profile={profile} loading={profileLoading} />} />
                </Routes>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Global Interface HUDs */}
      <StatusHUD />
      <CustomCursor />
      <RecruiterHUD profile={profile} />
      <DocumentationHUD profile={profile} />
    </>
  );
};

/**
 * [AppRoutes]
 * Function purpose: Simply renders the Public Portfolio UI.
 * Admin routes have been removed as per USER request.
 */
const AppRoutes = () => {
  return <PublicApp />;
};

/**
 * [App] (Global Entry Point)
 * Function purpose: Initializes the main application, handles theme injection,
 * removes the initial HTML loader, and tracks global mouse movements for visual effects.
 */
const App = () => {
  const [loading, setLoading] = useState(true);

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
      <CssBaseline />
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <Box key="content" sx={{ position: 'relative' }}>
            <div id="spotlight" />
            <div id="noise-overlay" />
            <div id="vignette" />

            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

        <>
          {/* Reset scroll on page change */}
          <ScrollToTop />
          {/* Handle hash links (like #contact) */}
          <ScrollToHash />
          {/* Global Cinematic Frame */}
          <Box sx={{
            position: 'fixed', inset: { xs: 8, md: 20 },
            border: '1px solid rgba(51, 204, 255, 0.1)',
            pointerEvents: 'none', zIndex: 9999,
            '&::before': { content: '""', position: 'absolute', top: -1, left: -1, width: 20, height: 20, borderTop: '2px solid #33ccff', borderLeft: '2px solid #33ccff' },
            '&::after': { content: '""', position: 'absolute', bottom: -1, right: -1, width: 20, height: 20, borderBottom: '2px solid #ff3366', borderRight: '2px solid #ff3366' },
            display: { xs: 'none', lg: 'block' }
          }} />

          {/* Floating Section Navigation HUD (Right Side) */}
          <Box sx={{
            position: 'fixed', right: 40, top: '50%', transform: 'translateY(-50%)',
            zIndex: 9999, display: { xs: 'none', xl: 'flex' }, flexDirection: 'column', gap: 3
          }}>
            {['hero', 'about', 'skills', 'projects', 'contact'].map((section) => (
              <Box
                key={section}
                component="a"
                href={`#${section}`}
                sx={{
                  width: 12, height: 12, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.3)',
                  transition: '0.3s',
                  '&:hover': { scale: 1.5, borderColor: '#33ccff', boxShadow: '0 0 10px #33ccff' }
                }}
              />
            ))}
          </Box>

          {/* Floating Technical Status HUD */}
          {/* StatusHUD, CustomCursor, RecruiterHUD, and DocumentationHUD
              are now handled inside PublicApp to receive live data */}

          {/* Render the actual page routes */}
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
