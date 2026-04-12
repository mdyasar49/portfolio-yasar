import React from 'react';
import { Box, Typography, Button, Stack, Container, Grid, Paper, Divider } from '@mui/material';
import { Download, ExternalLink, ShieldCheck, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeModule = () => {
  const handleDownload = () => {
    window.open('/resume-pro/A_MOHAMED_YASAR_RESUME.pdf', '_blank');
  };

  return (
    <Box id="resume" sx={{ py: 20, position: 'relative' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Stack spacing={2} sx={{ mb: 10, textAlign: 'center' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(255, 51, 102, 0.3)' }} />
            <Typography variant="caption" sx={{ color: '#ff3366', fontWeight: 900, letterSpacing: 6, fontFamily: 'Syncopate', fontSize: '0.65rem' }}>
              RESUME_PROTOCOL_v4.2
            </Typography>
            <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(255, 51, 102, 0.3)' }} />
          </Box>
          <Typography variant="h2" sx={{ 
            fontFamily: 'Syncopate', 
            fontWeight: 900, 
            letterSpacing: -2,
            fontSize: { xs: '2.8rem', md: '5rem' },
            textShadow: '0 0 40px rgba(255,255,255,0.05)'
          }}>
            PROFESSIONAL <span style={{ color: '#33ccff', textShadow: '0 0 20px rgba(51, 204, 255, 0.4)' }}>ASSETS</span>
          </Typography>
        </Stack>

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Paper sx={{ 
                p: { xs: 4, md: 6 }, 
                bgcolor: 'rgba(1, 4, 9, 0.8)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Background Tech Accent */}
                <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}>
                  <FileText size={200} />
                </Box>

                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', mb: 2 }}>CORE_QUALIFICATIONS</Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
                      Senior MERN Stack Engineer specializing in high-performance architectures, 
                      real-time telemetry systems, and premium UI/UX implementations. Validated 
                      expertise in cloud infrastructure and secure API design.
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                  <Grid container spacing={3}>
                    {[
                      { label: 'ENGINEERING', val: 'MERN STACK' },
                      { label: 'EXPERIENCE', val: '2+ YEARS' },
                      { label: 'LOCATION', val: 'TAMIL NADU, IN' },
                      { label: 'CLEARANCE', val: 'AUTHENTICATED' }
                    ].map((stat, i) => (
                      <Grid item xs={6} key={i}>
                        <Typography variant="caption" sx={{ color: '#ff3366', fontWeight: 900, letterSpacing: 2, display: 'block' }}>{stat.label}</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 700, fontFamily: 'monospace', fontSize: '1.1rem' }}>{stat.val}</Typography>
                      </Grid>
                    ))}
                  </Grid>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      onClick={handleDownload}
                      startIcon={<Download size={20} />}
                      sx={{ 
                        background: 'linear-gradient(45deg, #ff3366, #ff9933)',
                        color: 'white', px: 5, py: 2, borderRadius: 3, fontWeight: 900, fontFamily: 'Syncopate',
                        boxShadow: '0 20px 40px rgba(255, 51, 102, 0.2)',
                        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 25px 50px rgba(255, 51, 102, 0.3)' }
                      }}
                    >
                      EXTRACT_PDF
                    </Button>
                    <Button 
                      href="/resume" 
                      target="_blank"
                      startIcon={<ExternalLink size={20} />}
                      sx={{ 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white', px: 5, py: 2, borderRadius: 3, fontWeight: 900, fontFamily: 'Syncopate',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: '#33ccff' }
                      }}
                    >
                      FULL_IMMERSIVE_VIEW
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Box sx={{ position: 'relative' }}>
                {/* Visual Security Badge */}
                <Box sx={{ 
                  p: 4, borderRadius: '50%', border: '1px solid rgba(51, 204, 255, 0.2)',
                  width: 300, height: 300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'radial-gradient(circle, rgba(51, 204, 255, 0.05) 0%, transparent 70%)',
                  animation: 'pulse 3s infinite'
                }}>
                  <ShieldCheck size={120} color="#33ccff" />
                </Box>
                
                {/* Floating Tags */}
                <Box sx={{ position: 'absolute', top: '10%', right: '10%', p: 1.5, bgcolor: 'rgba(0,0,0,0.8)', border: '1px solid #00ffcc', borderRadius: 2 }}>
                  <Zap size={24} color="#00ffcc" />
                </Box>
                <Box sx={{ position: 'absolute', bottom: '10%', left: '10%', p: 1.5, bgcolor: 'rgba(0,0,0,0.8)', border: '1px solid #ff3366', borderRadius: 2 }}>
                  <FileText size={24} color="#ff3366" />
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <style>
        {`
          @keyframes pulse { 0% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity: 0.5; transform: scale(1); } }
        `}
      </style>
    </Box>
  );
};

export default ResumeModule;
