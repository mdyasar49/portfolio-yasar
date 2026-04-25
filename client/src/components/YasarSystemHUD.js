import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * YasarSystemHUD Component
 * A personalized, futuristic system interface for A. Mohamed Yasar.
 * Features real-time telemetry, system status indicators, and coordinate tracking.
 */
const YasarSystemHUD = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [systemLoad, setSystemLoad] = useState(12);
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        const interval = setInterval(() => {
            setSystemLoad(prev => {
                const change = (Math.random() - 0.5) * 2;
                return Math.max(5, Math.min(45, prev + change));
            });
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(interval);
        };
    }, []);

    return (
        <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000, overflow: 'hidden' }}>
            {/* Top Left: User ID & Core Status (SYSTEM_STATUS: ONLINE) */}
            <Box sx={{ position: 'absolute', top: { xs: 90, md: 140 }, left: 30 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Syncopate', fontSize: '0.65rem', fontWeight: 900, letterSpacing: 2, mb: 1.5 }}>
                    ID: A_MOHAMED_YASAR
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {/* Glowing pulse rings for the Online indicator */}
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#00ffcc', position: 'relative', zIndex: 2 }} />
                        <motion.div
                            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                            style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#00ffcc' }}
                        />
                        <motion.div
                            animate={{ scale: [1, 3.5], opacity: [0.3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                            style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#00ffcc' }}
                        />
                    </Box>
                    <Box>
                        <Typography sx={{ color: '#00ffcc', fontFamily: 'Syncopate', fontSize: '0.75rem', fontWeight: 900, letterSpacing: 2, textShadow: '0 0 10px rgba(0, 255, 204, 0.5)' }}>
                            SYSTEM_STATUS: ONLINE
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '0.55rem', fontWeight: 700, mt: 0.2 }}>
                            ENCRYPTION_LAYER_SECURED
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Top Right: System Clock & Engine Version */}
            <Box sx={{ position: 'absolute', top: { xs: 90, md: 140 }, right: 30, textAlign: 'right' }}>
                <Typography sx={{ color: '#33ccff', fontFamily: 'Syncopate', fontSize: '0.65rem', fontWeight: 900, letterSpacing: 2 }}>
                    RUNTIME: {time}
                </Typography>
                <Typography sx={{ color: '#444', fontFamily: 'monospace', fontSize: '0.55rem', fontWeight: 700 }}>
                    ENGINE_V4.2.0_STABLE
                </Typography>
            </Box>

            {/* Bottom Left: Navigation Hints / Status */}
            <Box sx={{ position: 'absolute', bottom: 30, left: 30 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: 2 }}>
                    &gt; SCROLL_TO_HYDRATE_MODULES
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '0.5rem' }}>
                    GATEWAY_SECURE: SSL_ENCRYPTED
                </Typography>
            </Box>

            {/* Bottom Right: Real-time Telemetry (YASAR_SYSTEM) */}
            <Box sx={{ position: 'absolute', bottom: 30, right: { xs: 30, md: 380 } }}>
                <Stack spacing={1} alignItems="flex-end">
                    <Stack direction="row" spacing={2} alignItems="center">
                         <Typography sx={{ color: '#ff3366', fontFamily: 'Syncopate', fontSize: '0.55rem', fontWeight: 900 }}>YASAR_SYSTEM_LOAD</Typography>
                         <Box sx={{ width: 100, height: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
                             <motion.div 
                                animate={{ width: `${systemLoad}%` }}
                                style={{ height: '100%', background: '#ff3366', boxShadow: '0 0 10px #ff3366' }} 
                             />
                         </Box>
                         <Typography sx={{ color: 'white', fontFamily: 'monospace', fontSize: '0.7rem', width: 40 }}>{systemLoad.toFixed(1)}%</Typography>
                    </Stack>
                    <Typography sx={{ color: '#444', fontFamily: 'monospace', fontSize: '0.55rem' }}>
                        COORD: {mousePos.x} : {mousePos.y}
                    </Typography>
                </Stack>
            </Box>

            {/* Global Brackets */}
            <Box sx={{ position: 'absolute', top: { xs: 80, md: 100 }, left: 20, width: 40, height: 40, borderTop: '1px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }} />
        </Box>
    );
};

export default YasarSystemHUD;
