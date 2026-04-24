/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component provides a dedicated "Recruiter Quick-View" dashboard.
 * It's a floating mini-module that HRs can open to see a 30-second elevator pitch,
 * core technical strengths, and direct contact buttons.
 */

import React, { useState } from 'react';
import { Box, Typography, Stack, Button, Paper, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, CheckCircle2, Download, Send } from 'lucide-react';

const RecruiterHUD = ({ profile }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Dynamic Data Fallbacks
    const pitch = profile?.recruiterPitch || "Ready to deliver production-grade MERN solutions.";
    const bullets = profile?.recruiterBullets || ["Full Stack Expert", "Immediate Availability"];

    return (
        <>
            {/* The Floating Vertical Tab Trigger */}
            <Box sx={{ 
                position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)', 
                zIndex: 10001, display: 'flex', alignItems: 'center' 
            }}>
                <motion.div 
                    whileHover={{ x: 10 }} 
                    style={{
                        background: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white',
                        padding: '12px 10px',
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        cursor: 'pointer',
                        boxShadow: '10px 0 30px rgba(99, 102, 241, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1.5,
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderLeft: 'none'
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Briefcase size={18} style={{ transform: 'rotate(90deg)', marginBottom: 10 }} />
                    <Typography sx={{ 
                        fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.6rem', 
                        letterSpacing: 2, textTransform: 'uppercase' 
                    }}>
                        {isOpen ? 'CLOSE_CONSOLE' : 'FOR_RECRUITERS'}
                    </Typography>
                </motion.div>
            </Box>


            {/* The Dashboard Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.9 }}
                        style={{
                            position: 'fixed', left: 60, top: '50%', transform: 'translateY(-50%)', 
                            zIndex: 10000,
                            width: 340, pointerEvents: 'auto'
                        }}
                    >

                        <Paper sx={{ 
                            p: 3, borderRadius: 4, 
                            background: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                            maxHeight: '70vh',
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': { width: '4px' },
                            '&::-webkit-scrollbar-track': { background: 'transparent' },
                            '&::-webkit-scrollbar-thumb': { 
                                background: 'rgba(99, 102, 241, 0.3)', 
                                borderRadius: '10px',
                                '&:hover': { background: '#6366f1' }
                            }
                        }}>

                            <Typography sx={{ color: '#6366f1', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.7rem', mb: 2 }}>
                                QUICK_SUMMARY
                            </Typography>
                            
                            <Stack spacing={2.5}>
                                <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                                    {pitch}
                                </Typography>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                                <Stack spacing={1.5}>
                                    {bullets.map(item => (
                                        <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                                            <CheckCircle2 size={16} color="#00ffcc" />
                                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>{item}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <Button 
                                        variant="contained" 
                                        fullWidth
                                        startIcon={<Download size={16} />}
                                        sx={{ bgcolor: '#6366f1', borderRadius: 2, fontSize: '0.7rem', fontWeight: 900, fontFamily: 'Syncopate' }}
                                    >
                                        RESUME
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        href="#contact"
                                        onClick={() => setIsOpen(false)}
                                        startIcon={<Send size={16} />}
                                        sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: 2, fontSize: '0.7rem', fontWeight: 900, fontFamily: 'Syncopate' }}
                                    >
                                        HIRE
                                    </Button>
                                </Stack>
                            </Stack>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default RecruiterHUD;
