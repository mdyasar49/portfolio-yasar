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
          <Grid item xs={12} lg={7}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box sx={{ position: 'relative' }}>
                 {/* Holographic Frame for the Live Resume */}
                 <Box sx={{ 
                   p: 0.5, 
                   bgcolor: 'rgba(51, 204, 255, 0.1)', 
                   borderRadius: 4,
                   border: '1px solid rgba(51, 204, 255, 0.3)',
                   boxShadow: '0 0 40px rgba(51, 204, 255, 0.1)',
                   overflow: 'hidden',
                   position: 'relative',
                   height: { xs: '500px', md: '700px' }
                 }}>
                   {/* Vertical Scanner Line */}
                   <Box sx={{
                     position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                     background: 'linear-gradient(90deg, transparent, #33ccff, transparent)',
                     boxShadow: '0 0 15px #33ccff',
                     zIndex: 10, opacity: 0.5,
                     animation: 'scan 4s linear infinite'
                   }} />

                   <iframe 
                      src="/resume-pro/index.html" 
                      title="Direct Resume View"
                      width="100%"
                      height="100%"
                      style={{ border: 'none', background: 'white', borderRadius: '8px' }}
                   />
                 </Box>

                 {/* Tech Brackets */}
                 <Box sx={{ position: 'absolute', top: -15, left: -15, width: 40, height: 40, borderTop: '2px solid #ff3366', borderLeft: '2px solid #ff3366' }} />
                 <Box sx={{ position: 'absolute', bottom: -15, right: -15, width: 40, height: 40, borderBottom: '2px solid #33ccff', borderRight: '2px solid #33ccff' }} />
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Paper sx={{ 
                p: { xs: 4, md: 5 }, 
                bgcolor: 'rgba(1, 4, 9, 0.8)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative'
              }}>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', mb: 2, fontSize: '1.2rem' }}>VERIFIED_PROFILE</Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
                      Instant extraction of professional architecture and core engineering metrics. 
                      This asset is cryptographically validated and ready for enterprise-level review.
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {[
                      { l: 'TYPE', v: 'FULL_STACK' },
                      { l: 'MOD', v: 'v4.2.0' },
                      { l: 'STATUS', v: 'ACTIVE' },
                      { l: 'ACCESS', v: 'OPEN' }
                    ].map((s, i) => (
                      <Grid item xs={6} key={i}>
                        <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, display: 'block' }}>{s.l}</Typography>
                        <Typography sx={{ color: '#33ccff', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.9rem' }}>{s.v}</Typography>
                      </Grid>
                    ))}
                  </Grid>

                  <Stack spacing={2}>
                    <Button 
                      fullWidth
                      variant="contained" 
                      onClick={handleDownload}
                      startIcon={<Download size={18} />}
                      sx={{ 
                        background: 'linear-gradient(45deg, #ff3366, #ff9933)',
                        py: 1.8, borderRadius: 2.5, fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.75rem',
                        boxShadow: '0 10px 20px rgba(255, 51, 102, 0.2)',
                        '&:hover': { transform: 'translateY(-2px)' }
                      }}
                    >
                      PULL_PDF_VERSION
                    </Button>
                    <Button 
                      fullWidth
                      href="/resume" 
                      target="_blank"
                      startIcon={<ExternalLink size={18} />}
                      sx={{ 
                        border: '1px solid rgba(255,255,255,0.05)',
                        bgcolor: 'rgba(255,255,255,0.01)',
                        color: 'white', py: 1.8, borderRadius: 2.5, fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.75rem',
                        '&:hover': { bgcolor: 'rgba(51, 204, 255, 0.05)', borderColor: '#33ccff' }
                      }}
                    >
                      FULL_3D_VIEWER
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <style>
        {`
          @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
          iframe::-webkit-scrollbar { width: 4px; }
          iframe::-webkit-scrollbar-thumb { background: #33ccff; border-radius: 10px; }
        `}
      </style>
    </Box>
  );
};

export default ResumeModule;
