import React, { memo } from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const About = memo(({ profile }) => {
  if (!profile) return null;
  return (
    <Box id="about" sx={{ py: 15 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Typography variant="h2" sx={{ 
          fontFamily: 'Syncopate', fontWeight: 900, mb: 8, textAlign: 'center', letterSpacing: 4, fontSize: { xs: '2rem', md: '3.5rem' } 
        }}>
          ENGINEERING <Box component="span" sx={{ color: '#ff3366' }}>PROFILE</Box>
        </Typography>

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="body1" sx={{ color: '#cbd5e1', lineHeight: 2, fontSize: '1.1rem', textAlign: 'justify', mb: 4 }}>
                {profile?.summary}
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mb: 4 }}>
                <Box sx={{ 
                    flex: 1, p: 3, borderRadius: '20px', 
                    border: '1px solid rgba(51, 204, 255, 0.2)', 
                    background: 'linear-gradient(135deg, rgba(51, 204, 255, 0.05), transparent)',
                    position: 'relative', overflow: 'hidden'
                }}>
                  <Typography variant="caption" sx={{ color: '#33ccff88', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1 }}>[OPERATIONAL_HISTORY]</Typography>
                  <Typography variant="h3" sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'monospace' }}>2.5+</Typography>
                  <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, letterSpacing: 1 }}>ANNUAL_CYCLES</Typography>
                </Box>
                <Box sx={{ 
                    flex: 1, p: 3, borderRadius: '20px', 
                    border: '1px solid rgba(255, 51, 102, 0.2)', 
                    background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.05), transparent)',
                    position: 'relative', overflow: 'hidden'
                }}>
                  <Typography variant="caption" sx={{ color: '#ff336688', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1 }}>[DELIVERED_ASSETS]</Typography>
                  <Typography variant="h3" sx={{ color: '#ff3366', fontWeight: 900, fontFamily: 'monospace' }}>15+</Typography>
                  <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, letterSpacing: 1 }}>PRODUCTION_DEPLOYS</Typography>
                </Box>
              </Stack>

              {profile?.softSkills && (
                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {profile.softSkills.map((skill) => (
                    <Typography key={skill} sx={{ 
                      fontSize: '0.7rem', fontWeight: 900, color: '#33ccff', px: 1.5, py: 0.5, borderRadius: 1, border: '1px solid rgba(51, 204, 255, 0.1)', bgcolor: 'rgba(51, 204, 255, 0.03)', letterSpacing: 1
                    }}>
                      {skill.toUpperCase()}
                    </Typography>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative', p: { xs: 2, md: 4 } }}>
              {/* Complex HUD Overlay */}
              <Box sx={{ 
                  position: 'absolute', inset: 0, 
                  border: '1px solid rgba(51, 204, 255, 0.08)', 
                  borderRadius: '50%',
                  animation: 'spin 60s linear infinite',
                  pointerEvents: 'none',
                  display: { xs: 'none', md: 'block' }
              }} />
              <Box sx={{ 
                  position: 'absolute', inset: 20, 
                  border: '2px dashed rgba(255, 51, 102, 0.05)', 
                  borderRadius: '50%',
                  animation: 'spin-reverse 40s linear infinite',
                  pointerEvents: 'none',
                  display: { xs: 'none', md: 'block' }
              }} />
              
              <Paper sx={{ 
                  p: 2, borderRadius: 10, bgcolor: 'rgba(1, 4, 9, 0.5)', 
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255,255,255,0.05)', 
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                   <Typography variant="h1" sx={{ 
                       color: '#111', fontWeight: 900, 
                       fontSize: { xs: '6rem', md: '12rem' }, 
                       opacity: 0.8,
                       textShadow: '0 0 40px rgba(51, 204, 255, 0.1)'
                   }}>
                       MY
                   </Typography>
                </Box>
                
                {/* Real-time Data Labels */}
                <Box sx={{ position: 'absolute', bottom: 30, left: 30 }}>
                    <Typography sx={{ color: '#33ccff', fontWeight: 900, fontSize: '0.55rem', fontFamily: 'monospace', opacity: 0.6 }}>BIOMETRIC_ID: AUTHORIZED</Typography>
                    <Typography sx={{ color: '#ff3366', fontWeight: 900, fontSize: '0.55rem', fontFamily: 'monospace', opacity: 0.6 }}>ENCRYPTION: ACTIVE</Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
});

export default About;
