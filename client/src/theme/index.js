/**
 * [Material UI Design System]
 * This file defines all colors, typography, and styling tokens for your app.
 */
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
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
    h1: {
      fontFamily: '"Syncopate", sans-serif',
      fontWeight: 900,
      letterSpacing: '-2px',
    },
    h2: {
      fontFamily: '"Syncopate", sans-serif',
      fontWeight: 900,
      letterSpacing: '-1px',
    },
    h3: {
      fontFamily: '"Syncopate", sans-serif',
      fontWeight: 800,
    },
    h4: {
      fontFamily: '"Syncopate", sans-serif',
      fontWeight: 800,
    },
    button: {
      fontFamily: '"Syncopate", sans-serif',
      fontWeight: 900,
      letterSpacing: '1px',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
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
