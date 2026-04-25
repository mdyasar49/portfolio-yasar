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
        // Increment progress over time
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    // Slight delay before completing to allow "SYSTEM_READY" to be seen
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return prev + 1;
            });
        }, 25);

        // Cycle through technical status messages
        const statusTimer = setInterval(() => {
            const statuses = [
                'UPLOADING_KERNEL...',
                'MAPPING_DOM_NODES...',
                'CALIBRATING_QUANTUM_AURORA...',
                'ESTABLISHING_SECURE_LINK...',
                'SYSTEM_STATUS: ONLINE',
                'INJECTING_NEURAL_INTERFACE...',
                'OPTIMIZING_THROUGHPUT...'
            ];
            setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
        }, 600);

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
            {/* Main Scanner Circle - A focal point for the loading experience */}
            <Box sx={{ position: 'relative', mb: 8 }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{
                        width: 180, height: 180,
                        border: '2px solid rgba(51, 204, 255, 0.1)',
                        borderTop: '2px solid #33ccff',
                        borderRadius: '50%'
                    }}
                />
                {/* Secondary counter-rotating ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    style={{
                        position: 'absolute', inset: 10,
                        border: '1px dashed rgba(255, 51, 102, 0.2)',
                        borderRadius: '50%'
                    }}
                />
                <Typography sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '1.5rem',
                    textShadow: '0 0 20px #33ccff'
                }}>
                    {progress}%
                </Typography>
            </Box>

            {/* Status & Progress Bar Module */}
            <Stack spacing={3} alignItems="center" sx={{ width: 350 }}>
                <Typography variant="caption" sx={{ 
                    color: status.includes('ONLINE') ? '#00ffcc' : '#33ccff', 
                    fontFamily: 'Syncopate', letterSpacing: 4, fontSize: '0.7rem',
                    textShadow: status.includes('ONLINE') ? '0 0 10px #00ffcc' : 'none',
                    transition: '0.3s all'
                }}>
                    {status}
                </Typography>

                <Box sx={{ width: '100%', height: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, #33ccff, #ff3366)', boxShadow: '0 0 20px #33ccff' }}
                    />
                </Box>

                <Typography variant="caption" sx={{ color: '#444', fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: 2 }}>
                    [ ARCHITECT_V4.2.0_INITIALIZATION ]
                </Typography>
            </Stack>

            {/* Background Data Flow - Simulates raw system logs during boot */}
            <Box sx={{ position: 'absolute', bottom: 40, left: 40, opacity: 0.2 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <Typography key={i} sx={{ color: '#00ffcc', fontSize: '0.65rem', fontFamily: 'monospace', mb: 0.5 }}>
                        &gt; 0x{Math.random().toString(16).slice(2, 10).toUpperCase()} ... [OK]
                    </Typography>
                ))}
            </Box>
        </Box>
    );
};

export default LoadingScreen;
