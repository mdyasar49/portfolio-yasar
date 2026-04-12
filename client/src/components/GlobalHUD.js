import React, { useState, useEffect, memo } from 'react';
import { Box, Typography, Stack, Fade } from '@mui/material';
import { Activity, Shield, Cpu } from 'lucide-react';

const GlobalHUD = () => {
  const [uptime, setUptime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setUptime(u => u + 1), 1000);
    const showTimer = setTimeout(() => setIsVisible(true), 1500);
    return () => {
      clearInterval(timer);
      clearTimeout(showTimer);
    };
  }, []);

  const formatUptime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ 
      position: 'fixed', bottom: 30, left: 30, zIndex: 9999, 
      pointerEvents: 'none', display: { xs: 'none', lg: 'block' } 
    }}>
      <Fade in={isVisible} timeout={2000}>
        <Stack spacing={2}>
          <Box sx={{ 
            p: 1.5, px: 2, 
            background: 'rgba(1, 4, 9, 0.7)', 
            backdropFilter: 'blur(10px)', 
            border: '1px solid rgba(51, 204, 255, 0.1)', 
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ 
                width: 10, height: 10, borderRadius: '50%', bgcolor: '#00ffcc', 
                animation: 'pulse 2s infinite', boxShadow: '0 0 10px #00ffcc' 
              }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#00ffcc', fontWeight: 900, fontSize: '0.6rem', display: 'block', letterSpacing: 1 }}>SYSTEM_STATUS</Typography>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.7rem' }}>UPTIME: {formatUptime(uptime)}</Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.5}>
            {[
              { icon: <Cpu size={12} />, label: '98%_CORES' },
              { icon: <Activity size={12} />, label: 'OPTIMAL_IO' },
              { icon: <Shield size={12} />, label: 'V_SECURED' }
            ].map((item, i) => (
              <Box key={i} sx={{ 
                p: 1, px: 1.5, borderRadius: 1.5, 
                bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', gap: 1, color: '#555' 
              }}>
                {item.icon}
                <Typography variant="caption" sx={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: 1 }}>{item.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Fade>

      <style>
        {`
          @keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
        `}
      </style>
    </Box>
  );
};

export default memo(GlobalHUD);
