/**
 * [React.js & Material UI Frontend]
 * This is your main presentation layer.
 * Using React hooks for dynamic data fetching and Material UI for styling.
 */
import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress, Typography, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import theme from './theme';
import Header from './components/Header';
import Portfolio from './pages/Portfolio';
import Resume from './pages/Resume';

const App = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/profile');
        if (response.data) {
          setProfile(response.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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

  if (!profile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', textAlign: 'center', p: 4 }}>
          <Typography variant="h3" color="error" gutterBottom>Database Connection Error</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The backend server is running but cannot connect to MongoDB, or the data has not been seeded.
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
        <Header />
        <Box sx={{ pt: 10 }}>
          <Routes>
            <Route path="/" element={<Portfolio profile={profile} loading={loading} />} />
            <Route path="/resume" element={<Resume profile={profile} />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
