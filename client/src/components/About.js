import React from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const About = ({ profile }) => {
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
          ABOUT <Box component="span" sx={{ color: '#ff3366' }}>LOGISTICS</Box>
        </Typography>

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
              <Typography variant="body1" sx={{ color: '#cbd5e1', lineHeight: 2, fontSize: '1.1rem', textAlign: 'justify', mb: 4 }}>
                {profile?.summary}
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mb: 4 }}>
                <Box sx={{ flex: 1, p: 3, borderRadius: 3, border: '1px solid rgba(51, 204, 255, 0.2)', background: 'linear-gradient(to bottom, rgba(51, 204, 255, 0.05), transparent)' }}>
                  <Typography variant="h3" sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'monospace' }}>2.5+</Typography>
                  <Typography variant="caption" sx={{ color: '#555', fontWeight: 900, letterSpacing: 1 }}>YEARS_EXP</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 3, borderRadius: 3, border: '1px solid rgba(255, 51, 102, 0.2)', background: 'linear-gradient(to bottom, rgba(255, 51, 102, 0.05), transparent)' }}>
                  <Typography variant="h3" sx={{ color: '#ff3366', fontWeight: 900, fontFamily: 'monospace' }}>15+</Typography>
                  <Typography variant="caption" sx={{ color: '#555', fontWeight: 900, letterSpacing: 1 }}>PROJECTS_SOLVED</Typography>
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
            <Box sx={{ position: 'relative', p: 2 }}>
              <Box className="hero-glow" sx={{ position: 'absolute', inset: 0, filter: 'blur(100px)', opacity: 0.1, background: 'linear-gradient(45deg, #ff3366, #33ccff)' }} />
              <Paper sx={{ p: 4, borderRadius: 8, bgcolor: 'rgba(1, 4, 9, 0.8)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 6 }}>
                   <Typography variant="h1" sx={{ color: '#111', fontWeight: 900, fontSize: { xs: '6rem', md: '10rem' }, opacity: 0.5 }}>MY</Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default About;
