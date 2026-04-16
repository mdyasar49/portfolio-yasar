/**
 * [React.js & Material UI - Identity Architecture]
 * Technologies: React.js (Memo), Material UI (Grid, Box, Stack), Framer Motion (Scroll Animations)
 * Purpose: This component displays the 'About Me' section, focusing on professional summary and key stats.
 */
import React, { memo } from 'react';
import { Box, Typography, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * About Component
 * @param {Object} profile - Data object containing 'summary', 'softSkills', and other professional details.
 */
const About = memo(({ profile }) => {
  // Safety check: Don't render if profile data is missing
  if (!profile) return null;

  return (
    <Box id="about" sx={{ py: 20, position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Grid container spacing={8} alignItems="center">
          
          {/* [Left Column] - Creative Identity Panel */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative' }}>
              {/* Background abstract animation - Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute',
                  inset: -40,
                  border: '1px solid rgba(51, 204, 255, 0.1)',
                  borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
                  pointerEvents: 'none'
                }}
              />
              {/* Background abstract animation - Inner Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute',
                  inset: -20,
                  border: '1px dashed rgba(255, 51, 102, 0.1)',
                  borderRadius: '62% 38% 37% 63% / 56% 59% 41% 44%',
                  pointerEvents: 'none'
                }}
              />
              
              <Box sx={{ 
                position: 'relative', 
                aspectRatio: '1/1',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
              }}>
                <Typography variant="h1" sx={{ 
                  fontSize: '12rem', fontWeight: 900, color: 'white', 
                  opacity: 0.03, position: 'absolute', fontFamily: 'Syncopate' 
                }}>
                  BIO
                </Typography>
                
                <Stack spacing={1} alignItems="center" sx={{ zIndex: 1 }}>
                   <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: -2 }}>SUMMARY</Typography>
                   <Box sx={{ height: 2, width: 60, bgcolor: '#ff3366', boxShadow: '0 0 10px #ff3366' }} />
                   <Typography variant="overline" sx={{ color: '#00ffcc', letterSpacing: 4, mt: 2, fontWeight: 900 }}>PROFESSIONAL_DATA</Typography>
                </Stack>

                {/* Aesthetic Corner Accents */}
                <Box sx={{ position: 'absolute', top: 20, left: 20, width: 20, height: 20, borderTop: '2px solid #33ccff', borderLeft: '2px solid #33ccff' }} />
                <Box sx={{ position: 'absolute', bottom: 20, right: 20, width: 20, height: 20, borderBottom: '2px solid #ff3366', borderRight: '2px solid #ff3366' }} />
              </Box>
            </Box>
          </Grid>

          {/* [Right Column] - Data & Narrative Panel */}
          <Grid item xs={12} md={7}>
            <Stack spacing={5}>
              {/* Narrative Content */}
              <Box>
                <Typography variant="overline" sx={{ color: '#33ccff', fontWeight: 900, letterSpacing: 5, mb: 1, display: 'block' }}>&gt; EXECUTIVE_SUMMARY</Typography>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', mb: 3, fontSize: '1.8rem' }}>
                  Engineering <span style={{ color: '#ff3366' }}>Modern</span> Solutions
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 2, textAlign: 'justify' }}>
                  {profile.summary}
                </Typography>
              </Box>

              {/* Grid of Achievement Stats */}
              <Grid container spacing={3}>
                {[
                  { label: 'EXPERTISE_LEVEL', value: 'FULL_STACK_DEVELOPER', color: '#33ccff' },
                  { label: 'WORK_EXPERIENCE', value: 'AROUND_3_YEARS', color: '#ff3366' },
                  { label: 'PROJECT_LAUNCHED', value: `${profile.projects?.length || 0}+_TOTAL`, color: '#00ffcc' }
                ].map((stat, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Box sx={{ 
                      p: 2.5, borderRadius: '16px', 
                      bgcolor: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: '0.3s ease',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)', borderColor: stat.color }
                    }}>
                      <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, letterSpacing: 1.5, display: 'block', mb: 1, fontSize: '0.6rem', fontFamily: 'Syncopate' }}>{stat.label}</Typography>
                      <Typography sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.85rem' }}>{stat.value}</Typography>
                      {/* Animated Progress bar per stat */}
                      <Box sx={{ mt: 1.5, height: 2, width: '100%', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 10, overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                          style={{ height: '100%', backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}` }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Soft Skills Chips Distribution */}
              {profile?.softSkills && (
                <Box>
                  <Typography variant="overline" sx={{ color: '#444', fontWeight: 900, letterSpacing: 3, mb: 2, display: 'block' }}>&gt; CORE_COMPETENCIES</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1.5}>
                    {profile.softSkills.map((skill) => (
                      <Box key={skill} sx={{ 
                        px: 2, py: 0.8, borderRadius: '8px', 
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        bgcolor: 'rgba(255, 255, 255, 0.01)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.65rem', fontWeight: 900, letterSpacing: 1,
                        transition: '0.3s',
                        '&:hover': { color: '#33ccff', borderColor: '#33ccff', transform: 'translateY(-2px)' }
                      }}>
                        {skill.toUpperCase()}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
});

export default About;
