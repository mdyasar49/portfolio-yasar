/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders a floating "System Status" HUD in the corner of the screen.
 * It provides a high-tech "MERN Architecture" vibe by showing real-time metrics,
 * versioning, and environment telemetry.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Activity, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusHUD = () => {
  const [metrics, setMetrics] = useState({
    ram: 0,
    latency: 0,
    uptime: '0:00:00',
    status: 'SYNCING',
  });

  useEffect(() => {
    // Simulated real-time metrics update
    const interval = setInterval(() => {
      setMetrics({
        ram: Math.floor(Math.random() * (128 - 64) + 64),
        latency: Math.floor(Math.random() * (45 - 15) + 15),
        uptime: new Date(Date.now() - performance.timing.navigationStart)
          .toISOString()
          .substr(11, 8),
        status: 'ONLINE',
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 30,
        right: 30,
        zIndex: 3000,
        display: { xs: 'none', md: 'block' },
        pointerEvents: 'none',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: 'rgba(1, 4, 9, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(51, 204, 255, 0.15)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}
        >
          <Stack spacing={1.5}>
            {/* Header Status */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#00ffcc',
                  boxShadow: '0 0 10px #00ffcc',
                }}
              />
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  fontFamily: 'Syncopate',
                  fontSize: '0.6rem',
                  letterSpacing: 1,
                }}
              >
                SYSTEM_STATUS_{metrics.status}
              </Typography>
            </Stack>

            {/* Metrics Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Cpu size={12} color="#444" />
                <Box>
                  <Typography
                    sx={{
                      color: '#ff3366',
                      fontWeight: 900,
                      fontSize: '0.6rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {metrics.ram}MB
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: '#222', fontSize: '0.5rem', display: 'block' }}
                  >
                    HEAP_ALLOC
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Activity size={12} color="#444" />
                <Box>
                  <Typography
                    sx={{
                      color: '#33ccff',
                      fontWeight: 900,
                      fontSize: '0.6rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {metrics.latency}MS
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: '#222', fontSize: '0.5rem', display: 'block' }}
                  >
                    API_LATENCY
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Versioning & Region */}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <Typography
                sx={{ color: '#444', fontSize: '0.5rem', fontWeight: 900, fontFamily: 'monospace' }}
              >
                MERN_NODE_20_X
              </Typography>
              <Typography
                sx={{ color: '#444', fontSize: '0.5rem', fontWeight: 900, fontFamily: 'monospace' }}
              >
                UPTIME: {metrics.uptime}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </motion.div>
    </Box>
  );
};

export default StatusHUD;
