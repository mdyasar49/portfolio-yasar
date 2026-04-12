import React, { useState, useEffect, memo } from 'react';
import { Box, Typography, Stack, Fade } from '@mui/material';
import { Shield, Cpu, Zap } from 'lucide-react';
import useLiveAnalytics from '../hooks/useLiveAnalytics';

const GlobalHUD = () => {
  const [uptime, setUptime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { activeSessions } = useLiveAnalytics();

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
          {/* Main Status Block */}
          <Box sx={{ 
            p: 1.5, px: 2, 
            background: 'rgba(1, 4, 9, 0.75)', 
            backdropFilter: 'blur(15px)', 
            border: '1px solid rgba(51, 204, 255, 0.15)', 
            borderRadius: 2,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ 
                width: 10, height: 10, borderRadius: '50%', bgcolor: '#00ffcc', 
                animation: 'pulse 2s infinite', boxShadow: '0 0 10px #00ffcc' 
              }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#00ffcc', fontWeight: 900, fontSize: '0.62rem', display: 'block', letterSpacing: 2, fontFamily: 'Syncopate' }}>CORE_UPTIME</Typography>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.9 }}>{formatUptime(uptime)}</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Real-time Telemetry Widgets */}
          <Stack direction="row" spacing={1.5}>
            {[
              { icon: <Cpu size={12} color="#ff3366" />, label: '98%_CORES', color: '#ff3366' },
              { icon: <Zap size={12} color="#33ccff" />, label: `${activeSessions}_NODES_LIVE`, color: '#33ccff', active: true },
              { icon: <Shield size={12} color="#888" />, label: 'V_SECURED', color: '#888' }
            ].map((item, i) => (
              <Box key={i} sx={{ 
                p: 1, px: 1.5, borderRadius: 1.5, 
                bgcolor: 'rgba(255,255,255,0.02)', 
                border: `1px solid ${item.active ? item.color + '44' : 'rgba(255,255,255,0.05)'}`,
                display: 'flex', alignItems: 'center', gap: 1, 
                color: item.active ? item.color : '#555',
                boxShadow: item.active ? `0 0 15px ${item.color}11` : 'none',
                transition: '0.3s ease'
              }}>
                {item.icon}
                <Typography variant="caption" sx={{ fontSize: '0.58rem', fontWeight: 900, letterSpacing: 1.5, fontFamily: 'Syncopate' }}>{item.label}</Typography>
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
