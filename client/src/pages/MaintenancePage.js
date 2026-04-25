/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders the global system lock interface (Maintenance Mode).
 * It is activated when the administrator engages architectural isolation
 * via the management hub, preventing public access while the system core
 * or content layers are being updated.
 */

import React from 'react';
// Material UI components for the high-fidelity isolation layout
import { Box, Typography, Stack, Paper } from '@mui/material';
// Icons for security alerts and system core aesthetics
import { ShieldAlert, Cpu } from 'lucide-react';
// Framer Motion for pulsing core and scale transitions
import { motion } from 'framer-motion';

const MaintenancePage = () => {
  return (
        <Box sx={{
            height: '100vh', width: '100vw', bgcolor: '#04070a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', overflow: 'hidden', position: 'relative'
        }}>
            {/* ── [HOLOGRAPHIC MATRIX BACKGROUND] ── */}
            <Box sx={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(51, 204, 255, 0.05) 1px, transparent 0)',
                backgroundSize: '40px 40px', pointerEvents: 'none'
            }} />

            <Box sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.02) 0%, transparent 50%, rgba(51, 204, 255, 0.02) 100%)',
                pointerEvents: 'none'
            }} />

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
                <Stack spacing={6} alignItems="center" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 3 }}>

                    {/* ── [PULSING CORE ICON] ── */}
                    <Box sx={{ position: 'relative' }}>
                        <Box sx={{
                            position: 'absolute', inset: -30, border: '1px solid rgba(255, 51, 102, 0.2)',
                            borderRadius: '50%', animation: 'pulseRing 4s infinite ease-out'
                        }} />
                        <Box sx={{
                            width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            bgcolor: 'rgba(255, 51, 102, 0.05)', border: '1px solid rgba(255, 51, 102, 0.3)',
                            borderRadius: '30px', backdropFilter: 'blur(10px)', boxShadow: '0 0 50px rgba(255, 51, 102, 0.1)'
                        }}>
                             <ShieldAlert size={60} color="#ff3366" />
                        </Box>
                    </Box>

                    {/* ── [SYSTEM STATUS MESSAGING] ── */}
                    <Box>
                        <Typography variant="h2" sx={{
                            fontFamily: 'Syncopate', fontWeight: 900, letterSpacing: -2, mb: 1,
                            fontSize: { xs: '2rem', md: '4rem' },
                            background: 'linear-gradient(to bottom, #fff, #444)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            SYSTEM_LOCKED
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                             <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(51, 204, 255, 0.3)' }} />
                             <Typography variant="overline" sx={{ color: '#33ccff', fontWeight: 900, letterSpacing: 6 }}>
                                PRIMARY_CORE_UPGRADE_IN_PROGRESS
                             </Typography>
                             <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(51, 204, 255, 0.3)' }} />
                        </Stack>
                    </Box>

                    <Paper sx={{
                        p: 6, bgcolor: 'rgba(255,255,255,0.01)', backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.04)', borderRadius: '40px', maxWidth: 700
                    }}>
                        <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 2, fontSize: '1rem', fontFamily: 'monospace' }}>
                            &gt;_ System administrative isolation engaged. The production environment of A. Mohamed Yasar is currently being synchronized with a new architectural blueprint. All external nodes are restricted until the handshake sequence completes.
                        </Typography>
                    </Paper>

                    {/* ── [SYSTEM SPECIFICATIONS] ── */}
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ opacity: 0.6 }}>
                        <Box sx={{ p: 1, bgcolor: 'rgba(51, 204, 255, 0.1)', borderRadius: 1.5, color: '#33ccff' }}>
                             <Cpu size={20} />
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                             <Typography variant="caption" sx={{ display: 'block', color: 'white', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.6rem' }}>ENFORCED_RESTRICTION</Typography>
                             <Typography variant="caption" sx={{ color: '#444', fontFamily: 'monospace', letterSpacing: 2 }}>CORE_v4.2.0 // BYPASS_BLOCKED</Typography>
                        </Box>
                    </Stack>
                </Stack>
            </motion.div>

            <style>{`
                @keyframes pulseRing {
                    0% { transform: scale(0.8); opacity: 0.3; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>
        </Box>
  );
};

export default MaintenancePage;
