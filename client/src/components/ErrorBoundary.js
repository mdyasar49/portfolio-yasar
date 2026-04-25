import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

/**
 * [React Error Boundary]
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Critical UI Failure:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box
          sx={{
            height: '100vh',
            bgcolor: '#020205',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            p: 4,
            textAlign: 'center',
          }}
        >
          <ShieldAlert size={64} color="#ff3366" style={{ marginBottom: '24px' }} />
          <Typography
            variant="h4"
            sx={{ fontFamily: 'Syncopate', fontWeight: 900, mb: 2, letterSpacing: 2 }}
          >
            UI_INTERFACE_CRITICAL_FAILURE
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 500 }}>
            A component has experienced an unhandled exception. The containment protocol has
            isolated the error to prevent a full system shutdown.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            startIcon={<RefreshCcw size={18} />}
            sx={{
              bgcolor: '#ff3366',
              color: '#fff',
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              fontFamily: 'Syncopate',
              fontSize: '0.75rem',
              fontWeight: 900,
              letterSpacing: 1,
              '&:hover': { bgcolor: '#ff3366', transform: 'scale(1.05)' },
            }}
          >
            REBOOT_INTERFACE
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
