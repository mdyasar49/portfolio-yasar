import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, keyframes } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import SignalWifiConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiConnectedNoInternet4';

// ─── Animations ───────────────────────────────────────────
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.95); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
`;

const scanLine = keyframes`
  0%   { top: 0%; opacity: 0.6; }
  100% { top: 100%; opacity: 0; }
`;

// ─── Error Config by Type ─────────────────────────────────
const ERROR_CONFIG = {
  network: {
    icon: WifiOffIcon,
    iconColor: '#ff6b6b',
    glowColor: 'rgba(255, 107, 107, 0.3)',
    title: 'NO NETWORK CONNECTION',
    subtitle: 'You appear to be offline.',
    description: 'Check your Wi-Fi or mobile data and try again.',
    chipLabel: 'ERR_NETWORK',
    chipColor: '#ff6b6b',
    dots: ['#ff6b6b', '#ff9999', '#ffcccc'],
  },
  server: {
    icon: CloudOffIcon,
    iconColor: '#f39c12',
    glowColor: 'rgba(243, 156, 18, 0.3)',
    title: 'SERVER UNAVAILABLE',
    subtitle: 'The backend server is not responding.',
    description: 'The server may be starting up (Render free tier sleeps after inactivity). Please wait a moment and retry.',
    chipLabel: 'ERR_SERVER_500',
    chipColor: '#f39c12',
    dots: ['#f39c12', '#f5b942', '#f8d07a'],
  },
  notfound: {
    icon: SignalWifiConnectedNoInternet4Icon,
    iconColor: '#9b59b6',
    glowColor: 'rgba(155, 89, 182, 0.3)',
    title: 'ENDPOINT NOT FOUND',
    subtitle: 'API route returned 404.',
    description: 'The API endpoint could not be found. The base URL or route may be misconfigured.',
    chipLabel: 'ERR_404',
    chipColor: '#9b59b6',
    dots: ['#9b59b6', '#b07cc6', '#c9a0d6'],
  },
  unknown: {
    icon: ErrorOutlineIcon,
    iconColor: '#5dade2',
    glowColor: 'rgba(93, 173, 226, 0.3)',
    title: 'CONNECTION FAILED',
    subtitle: 'An unexpected error occurred.',
    description: 'Something went wrong while loading the portfolio. Please try again.',
    chipLabel: 'ERR_UNKNOWN',
    chipColor: '#5dade2',
    dots: ['#5dade2', '#82bce8', '#a8d4f0'],
  },
};

// ─── Component ────────────────────────────────────────────
const NetworkErrorScreen = ({ errorType = 'unknown', onRetry }) => {
  const [retrying, setRetrying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const config = ERROR_CONFIG[errorType] || ERROR_CONFIG.unknown;
  const IconComponent = config.icon;

  // Listen for browser online/offline events
  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-retry when internet comes back
  useEffect(() => {
    if (isOnline && errorType === 'network') {
      handleRetry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  // Auto-retry countdown for server errors (Render cold start)
  useEffect(() => {
    if (errorType === 'server') {
      setCountdown(30);
    }
  }, [errorType]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      handleRetry();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const handleRetry = async () => {
    setRetrying(true);
    setCountdown(null);
    await new Promise(r => setTimeout(r, 800)); // small delay for UX
    onRetry();
    setRetrying(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#010409',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 3,
      }}
    >
      {/* Background grid */}
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(#33ccff 1px, transparent 1px), linear-gradient(90deg, #33ccff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Scan line effect */}
      <Box sx={{
        position: 'absolute', left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${config.iconColor}, transparent)`,
        animation: `${scanLine} 3s linear infinite`,
        pointerEvents: 'none',
        opacity: 0.5,
      }} />

      {/* Radial glow behind icon */}
      <Box sx={{
        position: 'absolute',
        width: 300, height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Main content card */}
      <Box sx={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${config.iconColor}33`,
        borderRadius: 3,
        p: { xs: 4, md: 6 },
        maxWidth: 520,
        width: '100%',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        boxShadow: `0 0 60px ${config.glowColor}`,
      }}>

        {/* Status dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          {config.dots.map((color, i) => (
            <Box key={i} sx={{
              width: 8, height: 8, borderRadius: '50%', bgcolor: color,
              animation: `${pulse} 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </Box>

        {/* Icon */}
        <Box sx={{
          animation: `${float} 3s ease-in-out infinite`,
          mb: 3,
        }}>
          <IconComponent sx={{
            fontSize: 80,
            color: config.iconColor,
            filter: `drop-shadow(0 0 20px ${config.iconColor})`,
          }} />
        </Box>

        {/* Error chip */}
        <Chip
          label={config.chipLabel}
          size="small"
          sx={{
            mb: 2,
            bgcolor: `${config.chipColor}18`,
            color: config.chipColor,
            border: `1px solid ${config.chipColor}44`,
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            letterSpacing: 2,
          }}
        />

        {/* Title */}
        <Typography variant="h5" sx={{
          fontWeight: 800,
          color: '#e2e8f0',
          letterSpacing: 3,
          fontFamily: 'monospace',
          mb: 1,
          fontSize: { xs: '1.1rem', md: '1.4rem' },
        }}>
          {config.title}
        </Typography>

        {/* Subtitle */}
        <Typography variant="body1" sx={{
          color: config.iconColor,
          fontWeight: 600,
          mb: 1.5,
          fontSize: '0.95rem',
        }}>
          {config.subtitle}
        </Typography>

        {/* Description */}
        <Typography variant="body2" sx={{
          color: '#64748b',
          lineHeight: 1.7,
          mb: 4,
          fontSize: '0.875rem',
        }}>
          {config.description}
        </Typography>

        {/* Online status badge */}
        {errorType === 'network' && (
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 1, mb: 3,
            p: '6px 16px',
            borderRadius: 2,
            bgcolor: isOnline ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 107, 107, 0.1)',
            border: `1px solid ${isOnline ? '#2ed573' : '#ff6b6b'}44`,
            display: 'inline-flex', mx: 'auto',
          }}>
            <Box sx={{
              width: 8, height: 8, borderRadius: '50%',
              bgcolor: isOnline ? '#2ed573' : '#ff6b6b',
              animation: `${pulse} 1.5s ease-in-out infinite`,
            }} />
            <Typography sx={{
              color: isOnline ? '#2ed573' : '#ff6b6b',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              letterSpacing: 1,
            }}>
              {isOnline ? 'INTERNET RESTORED — Reconnecting...' : 'NO INTERNET DETECTED'}
            </Typography>
          </Box>
        )}

        {/* Countdown for server errors */}
        {errorType === 'server' && countdown !== null && (
          <Typography sx={{
            color: '#64748b', fontSize: '0.8rem',
            fontFamily: 'monospace', mb: 2,
          }}>
            Auto-retry in {countdown}s (server may be waking up)
          </Typography>
        )}

        {/* Retry button */}
        <Button
          variant="outlined"
          size="large"
          startIcon={<RefreshIcon sx={{ animation: retrying ? `${pulse} 0.6s linear infinite` : 'none' }} />}
          onClick={handleRetry}
          disabled={retrying}
          sx={{
            color: config.iconColor,
            borderColor: `${config.iconColor}66`,
            px: 4, py: 1.2,
            fontFamily: 'monospace',
            letterSpacing: 2,
            fontSize: '0.85rem',
            fontWeight: 700,
            borderRadius: 2,
            '&:hover': {
              borderColor: config.iconColor,
              bgcolor: `${config.iconColor}18`,
              boxShadow: `0 0 20px ${config.glowColor}`,
            },
            '&:disabled': {
              color: '#64748b',
              borderColor: '#33333366',
            },
          }}
        >
          {retrying ? 'CONNECTING...' : 'RETRY CONNECTION'}
        </Button>

        {/* Divider */}
        <Box sx={{
          mt: 4, pt: 3,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Typography sx={{
            color: '#334155', fontSize: '0.7rem',
            fontFamily: 'monospace', letterSpacing: 1,
          }}>
            MERN PORTFOLIO — A. MOHAMED YASAR
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NetworkErrorScreen;
