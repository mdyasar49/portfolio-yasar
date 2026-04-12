/**
 * [React.js Frontend Architecture]
 * This is the main presentation layer. It uses React.js to manage the state
 * of the application and high-quality Material UI components for the design.
 */
import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, keyframes } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import theme from './theme/index';
import useProfile from './hooks/useProfile';
import Header from './components/Header';
import Portfolio from './pages/Portfolio';
import Resume from './pages/Resume';
import Documentation from './pages/Documentation';
import NetworkErrorScreen from './components/NetworkErrorScreen';
import GlobalHUD from './components/GlobalHUD';

// ─── Animations ───────────────────────────────────────────
const spin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [hash, pathname]);
  return null;
};

// ─── App ──────────────────────────────────────────────────
const App = () => {
  const { profile, loading, error, errorType, retry } = useProfile();

  // ── Loading state ──
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
          gap: 3,
        }}>
          {/* Spinning ring loader */}
          <Box sx={{
            width: 56, height: 56,
            border: '3px solid rgba(51, 204, 255, 0.15)',
            borderTop: '3px solid #33ccff',
            borderRadius: '50%',
            animation: `${spin} 0.9s linear infinite`,
          }} />
        </Box>
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <ScrollToHash />
        <Header />
        <GlobalHUD />
        <Box sx={{ pt: 10 }}>
          <Routes>
            <Route path="/"             element={<Portfolio profile={profile} loading={loading} />} />
            <Route path="/resume"       element={<Resume profile={profile} />} />
            <Route path="/architecture" element={<Documentation profile={profile} />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
