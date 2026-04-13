import React, { useState, useEffect, useCallback, memo } from 'react';
import { Box, Typography, Button, Stack, Container, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WifiOff, 
  ServerCrash, 
  SearchX, 
  AlertOctagon, 
  RefreshCcw, 
  Home, 
  Terminal,
  Activity,
  ShieldAlert,
  Unplug
} from 'lucide-react';

// ─── Constants & Config ──────────────────────────────────────

const ERROR_CONFIG = {
  network: {
    icon: WifiOff,
    color: '#ff3366',
    title: 'NEURAL LINK SEVERED',
    subtitle: 'System is currently detached from the global matrix.',
    code: 'ERR_CONNECTION_OFFLINE',
    diagnostics: [
      'IP_STACK_UNREACHABLE',
      'DNS_RESOLUTION_FAILURE',
      'LOCAL_ADAPTER_INACTIVE'
    ]
  },
  server: {
    icon: ServerCrash,
    color: '#ff9933',
    title: 'REACTOR CORE OFFLINE',
    subtitle: 'The central processing cluster is not responding to pings.',
    code: 'ERR_BACKEND_UNAVAILABLE',
    diagnostics: [
      'CLUSTER_PROTOCOL_HANG',
      'DB_GATEWAY_TIMEOUT',
      'RESOURCE_SLEEP_DETECTION'
    ]
  },
  notfound: {
    icon: SearchX,
    color: '#cc33ff',
    title: 'DATA SECTOR CORRUPTED',
    subtitle: 'The requested memory address is no longer in the registry.',
    code: 'ERR_ENTRY_NOT_FOUND',
    diagnostics: [
      'NODE_ADDR_MISMATCH',
      'MANIFEST_ENTRY_VOID',
      'URI_DECODE_EXCEPTION'
    ]
  },
  unknown: {
    icon: AlertOctagon,
    color: '#33ccff',
    title: 'SYSTEM ANOMALY DETECTED',
    subtitle: 'An unhandled exception has breached the primary firewall.',
    code: 'ERR_UNKNOWN_OVERFLOW',
    diagnostics: [
      'STACK_OVERFLOW_RISK',
      'KERNEL_SYNC_ERROR',
      'BUFFER_FLOW_INTERRUPT'
    ]
  }
};

// ─── Micro-Components ────────────────────────────────────────

const DiagnosticLine = ({ text, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      marginBottom: '4px' 
    }}
  >
    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 8px ${color}` }} />
    <Typography sx={{ 
      fontFamily: '"JetBrains Mono", monospace', 
      fontSize: '0.65rem', 
      color: `${color}cc`,
      letterSpacing: 1
    }}>
      {text}
    </Typography>
  </motion.div>
);

const GlitchText = ({ children, color }) => (
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    <Typography
      variant="h3"
      sx={{
        fontFamily: 'Syncopate',
        fontWeight: 900,
        color: '#fff',
        letterSpacing: { xs: 4, md: 8 },
        fontSize: { xs: '1.5rem', md: '2.5rem' },
        textShadow: `0 0 20px ${color}66`,
        position: 'relative',
        zIndex: 2,
      }}
    >
      {children}
    </Typography>
    <motion.div
      animate={{ 
        clipPath: [
          'inset(80% 0 0 0)', 
          'inset(10% 0 80% 0)', 
          'inset(80% 0 0 0)'
        ],
        x: [-2, 2, -2]
      }}
      transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
      style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%',
        color: color, opacity: 0.5,
        zIndex: 1,
        fontFamily: 'Syncopate',
        fontWeight: 900,
        letterSpacing: 8,
        fontSize: '2.5rem',
      }}
    >
      {children}
    </motion.div>
  </Box>
);

// ─── Main Component ──────────────────────────────────────────

const NetworkErrorScreen = ({ errorType = 'unknown', onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const config = ERROR_CONFIG[errorType] || ERROR_CONFIG.unknown;
  const ErrorIcon = config.icon;

  // Simulate terminal output
  useEffect(() => {
    const lines = [
      `INITIALIZING RECOVERY PROTOCOL [${config.code}]...`,
      `SCANNING LOCAL NODES... COMPLETE.`,
      `PINGING GATEWAY... TIMEOUT.`,
      `DETERRING SUBTLE PACKET LOSS... FAILURE.`,
      `SYSTEM STATUS: ${errorType.toUpperCase()}_HALT`
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setTerminalLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [config.code, errorType]);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    // Visual delay for "Cyber" feel
    await new Promise(r => setTimeout(r, 1200));
    onRetry?.();
    setIsRetrying(false);
  }, [onRetry]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#020205',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {/* Background Animated Elements */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* Dynamic Scanlines */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 3px 100%',
          pointerEvents: 'none',
          opacity: 0.3
        }} />
        
        {/* Pulsing Radial Gradient */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: '800px', height: '800px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${config.color}33 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Floating Particles (Simple CSS) */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [-20, -120], 
              x: Math.random() * 100 - 50,
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 2 + Math.random() * 4, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: `${Math.random() * 100}%`,
              width: '2px', height: '2px',
              backgroundColor: config.color,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${config.color}`,
            }}
          />
        ))}
      </Box>

      {/* Main Container */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={6} alignItems="center" textAlign="center">
          
          {/* Header Section */}
          <Box>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <Box sx={{ position: 'relative', mb: 4 }}>
                <Box 
                  sx={{ 
                    width: 120, height: 120, 
                    borderRadius: '30%', 
                    border: `1px solid ${config.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: `${config.color}05`,
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    mx: 'auto',
                    boxShadow: `inset 0 0 20px ${config.color}22, 0 0 40px ${config.color}11`
                  }}
                >
                  <ErrorIcon size={64} color={config.color} strokeWidth={1.5} />
                  
                  {/* Decorative corner accents */}
                  {[0, 90, 180, 270].map((angle) => (
                    <Box key={angle} sx={{
                      position: 'absolute',
                      width: 15, height: 15,
                      borderTop: `2px solid ${config.color}`,
                      borderLeft: `2px solid ${config.color}`,
                      top: -2, left: -2,
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '61px 61px'
                    }} />
                  ))}
                </Box>
              </Box>
            </motion.div>

            <GlitchText color={config.color}>{config.title}</GlitchText>
            
            <Typography variant="h6" sx={{ 
              mt: 2, 
              color: 'rgba(255,255,255,0.7)', 
              fontWeight: 300, 
              maxWidth: 600, 
              mx: 'auto',
              letterSpacing: 1
            }}>
              {config.subtitle}
            </Typography>
          </Box>

          {/* Diagnostics Panel */}
          <Box sx={{ 
            width: '100%', 
            maxWidth: 500,
            p: 3, 
            bgcolor: 'rgba(10, 12, 18, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Terminal size={14} color={config.color} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: 2, color: config.color }}>DIAG_LOG_v7.2</Typography>
              </Stack>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#27c93f' }} />
              </Box>
            </Box>

            <Stack spacing={1} textAlign="left">
              {terminalLines.map((line, idx) => (
                <Typography key={idx} sx={{ 
                  fontFamily: '"JetBrains Mono", monospace', 
                  fontSize: '0.75rem', 
                  color: idx === terminalLines.length - 1 ? config.color : 'rgba(255,255,255,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <span style={{ opacity: 0.3 }}>&gt;</span> {line}
                  {idx === terminalLines.length - 1 && (
                    <motion.span 
                      animate={{ opacity: [0, 1, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      style={{ width: 6, height: 12, backgroundColor: config.color }}
                    />
                  )}
                </Typography>
              ))}
            </Stack>

            {/* Error Code Tag */}
            <Box sx={{ 
              mt: 3, 
              p: '4px 12px', 
              bgcolor: `${config.color}11`, 
              border: `1px solid ${config.color}33`,
              borderRadius: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1
            }}>
              <ShieldAlert size={12} color={config.color} />
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, color: config.color, letterSpacing: 1 }}>{config.code}</Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Button
              variant="contained"
              onClick={handleRetry}
              disabled={isRetrying}
              startIcon={isRetrying ? null : <RefreshCcw size={18} />}
              sx={{
                bgcolor: config.color,
                color: '#fff',
                px: 6, py: 1.5,
                borderRadius: '50px',
                fontFamily: 'Syncopate',
                fontSize: '0.8rem',
                fontWeight: 900,
                letterSpacing: 2,
                boxShadow: `0 10px 30px ${config.color}44`,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': {
                  bgcolor: config.color,
                  transform: 'translateY(-5px) scale(1.05)',
                  boxShadow: `0 20px 40px ${config.color}66`,
                },
                '&:disabled': {
                  bgcolor: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              {isRetrying ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <RefreshCcw size={18} />
                  </motion.div>
                  <span>RECONNECTING</span>
                </Stack>
              ) : 'FORCE_REBOOT'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => window.location.href = '/'}
              startIcon={<Home size={18} />}
              sx={{
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                px: 4, py: 1.5,
                borderRadius: '50px',
                fontFamily: 'Syncopate',
                fontSize: '0.8rem',
                fontWeight: 900,
                letterSpacing: 2,
                backdropFilter: 'blur(5px)',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: '#fff',
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              RETURN_HOME
            </Button>
          </Stack>

          {/* Footer Branding */}
          <Stack direction="row" spacing={4} sx={{ opacity: 0.3, mt: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Activity size={14} />
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: 2 }}>LATENCY: --ms</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Unplug size={14} />
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: 2 }}>UPLINK: FAILED</Typography>
            </Stack>
          </Stack>

        </Stack>
      </Container>

      {/* Extreme border accents */}
      <Box sx={{ position: 'absolute', top: 40, left: 40, width: 100, height: 100, borderLeft: '1px solid rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.05)', opacity: 0.5 }} />
      <Box sx={{ position: 'absolute', bottom: 40, right: 40, width: 100, height: 100, borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: 0.5 }} />
      
    </Box>
  );
};

export default memo(NetworkErrorScreen);

