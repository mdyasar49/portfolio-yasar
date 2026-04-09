/**
 * [React.js Frontend Architecture]
 * This is the main presentation layer. It uses React.js to manage the state
 * of the application and high-quality Material UI components for the design.
 */
import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress, Typography, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import theme from './theme/index';
import useProfile from './hooks/useProfile';
import Header from './components/Header';
import Portfolio from './pages/Portfolio';
import Resume from './pages/Resume';

import Documentation from './pages/Documentation';

// Helper component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Helper component to handle scrolling to hash on navigation
const ScrollToHash = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash, pathname]);

  return null;
};

const App = () => {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
          <CircularProgress color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  if (error || !profile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', textAlign: 'center', p: 4 }}>
          <Typography variant="h3" color="error" gutterBottom> Connection Error</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {error ? 'The backend server could not be reached.' : 'The backend server is running but data has not been seeded.'}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>Retry Connection</Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <ScrollToHash />
        <Header />
        <Box sx={{ pt: 10 }}>
          <Routes>
            <Route path="/" element={<Portfolio profile={profile} loading={loading} />} />
            <Route path="/resume" element={<Resume profile={profile} />} />
            <Route path="/architecture" element={<Documentation profile={profile} />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
