import React, { useState, useEffect, memo } from 'react';
import { Box, Typography, Stack, Fade } from '@mui/material';
import { Cpu, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useLiveAnalytics from '../hooks/useLiveAnalytics';
import { useCodeLive } from '../context/CodeLiveContext';


const SystemInterfaceHUD = () => {
  const [uptime, setUptime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { activeSessions } = useLiveAnalytics();
  const { isCodeLive } = useCodeLive();


  useEffect(() => {
    let isThrottled = false;
    const handleScroll = (e) => {
      if (isThrottled) return;
      isThrottled = true;

      requestAnimationFrame(() => {
        const target = e.target;
        let totalScroll, currentScroll;

        if (target === document || target === window) {
          totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          currentScroll = window.scrollY;
        } else {
          totalScroll = target.scrollHeight - target.clientHeight;
          currentScroll = target.scrollTop;
        }

        if (totalScroll > 0) {
          setScrollProgress((currentScroll / totalScroll) * 100);
        }
        isThrottled = false;
      });
    };


    // Attach listener to the specific UI container if it exists
    const container = document.getElementById('main-scroll-container');
    if (container) container.addEventListener('scroll', handleScroll);

    // Fallback for global window scroll
    window.addEventListener('scroll', handleScroll);

    const timer = setInterval(() => setUptime(u => u + 1), 1000);
    const showTimer = setTimeout(() => setIsVisible(true), 1500);

    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
      clearTimeout(showTimer);
    };
  }, [isCodeLive]);

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
          {/* Main Status Block with Holographic Scan Line */}
          <Box sx={{
            p: 2,
            background: 'rgba(5, 7, 10, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(51, 204, 255, 0.2)',
            borderRadius: '20px 20px 20px 4px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0, left: 0, right: 0, height: '100%',
                background: 'linear-gradient(to bottom, transparent, rgba(51, 204, 255, 0.05), transparent)',
                animation: 'hudScan 4s linear infinite',
                pointerEvents: 'none'
            }
          }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Box sx={{ position: 'relative' }}>
                <Box sx={{
                  width: 12, height: 12, borderRadius: '50%', bgcolor: '#00ffcc',
                  animation: 'pulse 2s infinite', boxShadow: '0 0 15px #00ffcc'
                }} />
                <Box sx={{
                  position: 'absolute', inset: -4, border: '1px solid #00ffcc',
                  borderRadius: '50%', opacity: 0.3, animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(51, 204, 255, 0.6)', fontWeight: 900, fontSize: '0.6rem', display: 'block', letterSpacing: 3, fontFamily: 'Syncopate', mb: 0.5 }}>ACTIVE_SESSION_RUNTIME</Typography>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace', fontSize: '1rem', letterSpacing: 2, textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>{formatUptime(uptime)}</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Real-time Telemetry Widgets */}
          <Stack direction="row" spacing={1.5} sx={{ pointerEvents: 'auto' }}>
            {[
              { icon: <Cpu size={14} />, label: 'SERVER_LOAD', value: '4.2%', color: '#ff3366' },
              { icon: <Zap size={14} />, label: 'LIVE_SESSIONS', value: activeSessions, color: '#33ccff', active: true }
            ].map((item, i) => {
              const content = (
                <Box key={i} sx={{
                  p: 1.5, px: 2, borderRadius: '12px',
                  bgcolor: 'rgba(5, 7, 10, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${item.active ? item.color + '33' : 'rgba(255,255,255,0.05)'}`,
                  display: 'flex', flexDirection: 'column', gap: 0.5,
                  minWidth: 100,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: item.link ? 'pointer' : 'default',
                  '&:hover': item.link ? {
                    transform: 'translateY(-5px)',
                    borderColor: item.color,
                    boxShadow: `0 10px 20px -5px ${item.color}33`,
                    bgcolor: `${item.color}08`
                  } : {}
                }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ color: item.color, mb: 0.5 }}>
                    {item.icon}
                    <Typography variant="caption" sx={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: 1, fontFamily: 'Syncopate' }}>{item.label}</Typography>
                  </Stack>
                  {item.value && (
                    <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 900, fontFamily: 'monospace', pl: 3.5 }}>{item.value}</Typography>
                  )}
                </Box>
              );

              return item.link ? (
                <Link key={i} to={item.link} style={{ textDecoration: 'none' }}>
                  {content}
                </Link>
              ) : content;
            })}
          </Stack>
        </Stack>
      </Fade>

      {/* Vertical Scroll Progress HUD */}
      <Box sx={{
        position: 'fixed', right: 40, top: '50%', transform: 'translateY(-50%)',
        zIndex: 9999, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', gap: 4
      }}>
        <Typography variant="overline" sx={{
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          color: 'rgba(51, 204, 255, 0.4)', fontWeight: 900, letterSpacing: 4, fontSize: '0.6rem'
        }}>
          SCROLL_PERCENTAGE
        </Typography>
        <Box sx={{ width: 2, height: 100, bgcolor: 'rgba(255,255,255,0.05)', position: 'relative', borderRadius: 10 }}>
          <motion.div
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%',
              background: 'linear-gradient(to bottom, #33ccff, #ff3366)',
              borderRadius: 10,
              boxShadow: '0 0 10px rgba(51, 204, 255, 0.5)'
            }}
            animate={{
               height: `${scrollProgress}%`
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.7rem' }}>
          {Math.round(scrollProgress)}%
        </Typography>
      </Box>

      <style>
        {`
          @keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
          @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
          @keyframes hudScan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        `}
      </style>
    </Box>
  );
};

export default memo(SystemInterfaceHUD);
