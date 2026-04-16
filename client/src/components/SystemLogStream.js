import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Stack, Container, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Server, Database, Globe } from 'lucide-react';

const SystemLogStream = () => {
  const [logs, setLogs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const logTemplates = [
      { type: 'API', message: 'GET /api/profile [200 OK]', icon: <Globe size={14} />, color: '#00ffcc' },
      { type: 'DB', message: 'Handshake with MongoDB Atlas successful', icon: <Database size={14} />, color: '#33ccff' },
      { type: 'SYS', message: 'Engine warm-up complete: V3.0.4', icon: <Server size={14} />, color: '#ff3366' },
      { type: 'NET', message: 'Strict CORS Policy active: Origin Validated', icon: <Activity size={14} />, color: '#ff9933' },
      { type: 'API', message: 'Payload compression enabled (Gzip)', icon: <Globe size={14} />, color: '#00ffcc' },
    ];

    const interval = setInterval(() => {
      const randomLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        ...randomLog
      };
      setLogs(prev => [...prev.slice(-9), newLog]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Box id="systemlog" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="overline" sx={{ color: '#444', fontWeight: 900, letterSpacing: 5, mb: 2, display: 'block', textAlign: 'center' }}>
          REALTIME_TELEMETRY_ENGINE
        </Typography>
        
        <Paper 
          sx={{ 
            bgcolor: '#02040a', 
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.01)' }}>
            <Terminal size={18} color="#00ffcc" />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: 1 }}>
              SYSTEM_LIVE_FEED
            </Typography>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00ffcc', animation: 'blink 1s infinite' }} />
              <Typography sx={{ color: '#00ffcc', fontSize: '0.6rem', fontWeight: 900 }}>LIVE</Typography>
            </Box>
          </Box>

          {/* Logs Container */}
          <Box 
            ref={scrollRef}
            sx={{ 
              p: 3, 
              height: 250, 
              overflowY: 'auto', 
              fontFamily: 'monospace',
              '&::-webkit-scrollbar': { width: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 10 }
            }}
          >
            <AnimatePresence mode="popLayout">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Stack direction="row" spacing={2} sx={{ mb: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography sx={{ color: '#444', fontSize: '0.75rem', fontWeight: 900 }}>[{log.time}]</Typography>
                    <Box sx={{ color: log.color, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {log.icon}
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: 1 }}>{log.type}:</Typography>
                    </Box>
                    <Typography sx={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 500 }}>{log.message}</Typography>
                  </Stack>
                </motion.div>
              ))}
            </AnimatePresence>
            {logs.length === 0 && (
              <Typography sx={{ color: '#444', fontSize: '0.8rem', textAlign: 'center', mt: 8 }}>WAITING_FOR_DATA_STREAM...</Typography>
            )}
          </Box>
        </Paper>
      </Container>
      
      <style>
        {`
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        `}
      </style>
    </Box>
  );
};

export default SystemLogStream;
