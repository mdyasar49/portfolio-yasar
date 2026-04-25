import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Stack, Container, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Server, Database, Globe } from 'lucide-react';

/**
 * SystemLogStream Component
 * Visualizes real-time technical telemetry and system logs.
 * Highlights the "SYSTEM_STATUS: ONLINE" state through a live data feed.
 */

// Map icon strings from backend to Lucide components
const ICON_MAP = {
  Globe: <Globe size={14} />,
  Database: <Database size={14} />,
  Server: <Server size={14} />,
  Activity: <Activity size={14} />
};

const SystemLogStream = ({ profile }) => {
  const [logs, setLogs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Determine which configuration object to use for log templates
    const templates = profile?.engineeringObjective?.telemetryConfig?.logTemplates || profile?.telemetryConfig?.logTemplates || [];
    const version = profile?.resumeConfig?.version || 'v1.0.0';

    if (templates.length === 0) return;

    const interval = setInterval(() => {
      const randomLog = templates[Math.floor(Math.random() * templates.length)];

      // Dynamic Version Injection into log messages
      const message = randomLog.message.replace('{{VERSION}}', version);

      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: randomLog.type,
        message: message,
        icon: ICON_MAP[randomLog.icon] || <Activity size={14} />,
        color: randomLog.color
      };
      // Keep only the most recent 10 logs in the stream
      setLogs(prev => [...prev.slice(-9), newLog]);
    }, 4000);

    return () => clearInterval(interval);
  }, [profile]);

  // Auto-scroll logic for the log container
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Box id="systemlog" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 900, letterSpacing: 5, mb: 2, display: 'block', textAlign: 'center', fontFamily: 'Syncopate', fontSize: '0.65rem' }}>
          REALTIME_TELEMETRY_ENGINE
        </Typography>

        <Paper
          sx={{
            bgcolor: 'rgba(2, 4, 10, 0.8)',
            border: '1px solid rgba(0, 255, 204, 0.2)',
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 40px rgba(0, 255, 204, 0.05)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Header with High-Fidelity Online Status Design */}
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
            <Terminal size={20} color="#00ffcc" />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: 2, fontSize: '0.75rem' }}>
              SYSTEM_LIVE_FEED
            </Typography>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 0.8, borderRadius: 10, bgcolor: 'rgba(0, 255, 204, 0.05)', border: '1px solid rgba(0, 255, 204, 0.2)' }}>
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00ffcc' }} />
                <Box sx={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', bgcolor: '#00ffcc', animation: 'pulse-neon-small 2s infinite' }} />
              </Box>
              <Typography sx={{ color: '#00ffcc', fontSize: '0.65rem', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: 1 }}>SYSTEM_ONLINE</Typography>
            </Box>
          </Box>

          {/* Logs Container with smooth scroll interactions */}
          <Box
            ref={scrollRef}
            sx={{
              p: 4,
              height: 280,
              overflowY: 'auto',
              fontFamily: 'monospace',
              '&::-webkit-scrollbar': { width: 5 },
              '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.02)' },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0, 255, 204, 0.2)', borderRadius: 10, '&:hover': { bgcolor: 'rgba(0, 255, 204, 0.4)' } }
            }}
          >
            <AnimatePresence mode="popLayout">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Stack direction="row" spacing={3} sx={{ mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography sx={{ color: '#444', fontSize: '0.75rem', fontWeight: 900, fontFamily: 'monospace' }}>[{log.time}]</Typography>
                    <Box sx={{ color: log.color, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {log.icon}
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: 1.5, fontFamily: 'Syncopate' }}>{log.type}:</Typography>
                    </Box>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'Outfit' }}>{log.message}</Typography>
                  </Stack>
                </motion.div>
              ))}
            </AnimatePresence>
            {/* Fallback state when no logs are present */}
            {logs.length === 0 && (
              <Typography sx={{ color: '#444', fontSize: '0.85rem', textAlign: 'center', mt: 10, fontFamily: 'monospace', letterSpacing: 2 }}>
                WAITING_FOR_DATA_STREAM...
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Internal Animation Keyframes for the neon status pulse */}
      <style>
        {`
          @keyframes pulse-neon-small {
            0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0px rgba(0,255,204,0.4); }
            100% { transform: scale(2.5); opacity: 0; box-shadow: 0 0 0 10px rgba(0,255,204,0); }
          }
        `}
      </style>
    </Box>
  );
};

export default SystemLogStream;
