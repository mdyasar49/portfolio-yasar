/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders a high-fidelity "System Initializing" loading screen.
 * It uses a combination of circular scanners, technical progress bars,
 * and terminal log text to create an immersive start-up experience.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('BOOT_SEQUENCE_INIT');

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);

        const statusTimer = setInterval(() => {
            const statuses = [
                'UPLOADING_KERNEL...',
                'MAPPING_DOM_NODES...',
                'CALIBRATING_QUANTUM_AURORA...',
                'ESTABLISHING_SECURE_LINK...',
                'SYSTEM_READY'
            ];
            setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
        }, 800);

        return () => {
            clearInterval(timer);
            clearInterval(statusTimer);
        };
    }, [onComplete]);

    return (
        <Box sx={{
            position: 'fixed', inset: 0, zIndex: 20000,
            bgcolor: '#000', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center'
        }}>
            {/* Main Scanner Circle */}
            <Box sx={{ position: 'relative', mb: 8 }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{
                        width: 150, height: 150,
                        border: '2px solid rgba(51, 204, 255, 0.1)',
                        borderTop: '2px solid #33ccff',
                        borderRadius: '50%'
                    }}
                />
                <Typography sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '1.2rem'
                }}>
                    {progress}%
                </Typography>
            </Box>

            {/* Status & Progress Bar */}
            <Stack spacing={2} alignItems="center" sx={{ width: 300 }}>
                <Typography variant="caption" sx={{ color: '#00ffcc', fontFamily: 'Syncopate', letterSpacing: 4, fontSize: '0.6rem' }}>
                    {status}
                </Typography>

                <Box sx={{ width: '100%', height: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{ height: '100%', bgcolor: '#33ccff', boxShadow: '0 0 20px #33ccff' }}
                    />
                </Box>

                <Typography variant="caption" sx={{ color: '#444', fontFamily: 'monospace' }}>
                    [ ARCHITECT_V4.2.0_INITIALIZATION ]
                </Typography>
            </Stack>

            {/* Background Data Flow */}
            <Box sx={{ position: 'absolute', bottom: 40, left: 40, opacity: 0.1 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Typography key={i} sx={{ color: '#00ffcc', fontSize: '0.6rem', fontFamily: 'monospace' }}>
                        &gt; 0x{Math.random().toString(16).slice(2, 10).toUpperCase()} ... [OK]
                    </Typography>
                ))}
            </Box>
        </Box>
    );
};

export default LoadingScreen;
