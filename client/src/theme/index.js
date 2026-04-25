/**
 * [Material UI Design System - UHD/16K Enhancement]
 * This file defines all colors, typography, and styling tokens for your app.
 * Scaled and optimized for Ultra-High-Definition (16K) viewing experiences.
 */
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // ── [Ultra-High-Resolution Breakpoints] ──
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,   // Standard Desktop
      '2xl': 2560, // 2K/4K Monitors
      '3xl': 3840, // 8K/16K Extreme Displays
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#33ccff', // Engineering Cyan
      light: '#70e0ff',
      dark: '#0099cc',
    },
    secondary: {
      main: '#ff3366', // Crimson Accent
    },
    background: {
      default: '#010409', // Deepest Obsidian
      paper: 'rgba(13, 17, 23, 0.7)',
    },
    text: {
      primary: '#f0f6fc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    // FLUID TYPOGRAPHY: Scaling fonts proportionally for massive resolutions
    h1: {
      fontFamily: '"Syncopate", sans-serif',
      fontWeight: 900,
      letterSpacing: '-2px',
      fontSize: 'clamp(3rem, 8vw, 12rem)',
    },
    h2: {
      fontFamily: '"Syncopate", sans-serif',
      fontWeight: 900,
      letterSpacing: '-1px',
      fontSize: 'clamp(2rem, 5vw, 6rem)',
    },
    h3: {
      fontFamily: '"Syncopate", sans-serif',
      fontWeight: 800,
      fontSize: 'clamp(1.5rem, 3vw, 4rem)',
    },
    h4: {
      fontFamily: '"Syncopate", sans-serif',
      fontWeight: 800,
      fontSize: 'clamp(1.2rem, 2.5vw, 3rem)',
    },
    body1: {
      fontSize: 'clamp(1rem, 1.2vw, 1.5rem)',
      lineHeight: 1.8,
    },
    button: {
      fontFamily: '"Syncopate", sans-serif',
      fontWeight: 900,
      letterSpacing: '1px',
      fontSize: 'clamp(0.7rem, 0.9vw, 1rem)',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          // Allowing containers to expand for extreme widths while maintaining center alignment
          '@media (min-width: 1921px)': {
            maxWidth: '1800px !important',
          },
          '@media (min-width: 2561px)': {
            maxWidth: '2400px !important',
          },
          '@media (min-width: 3841px)': {
            maxWidth: '3200px !important',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          padding: '12px 28px',
          borderRadius: 12,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #00F2FE 0%, #4FACFE 100%)',
          boxShadow: '0 10px 20px -10px rgba(0, 242, 254, 0.5)',
          '&:hover': {
            boxShadow: '0 15px 30px -10px rgba(0, 242, 254, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

export default theme;
