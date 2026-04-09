import React from 'react';
import { Box, Typography, Grid, Paper, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const About = ({ profile }) => {
  if (!profile) return null;
  return (
    <Box id="about" sx={{ py: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Typography variant="h2" gutterBottom>
          About Me
        </Typography>
        <Grid container spacing={6} alignItems="center">
          {/* ... existing content ... */}
          <Grid item xs={12} md={7}>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              {profile?.summary}
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Currently strengthening backend development skills by learning Core Java, Spring Boot, and Python basics. 
              I am also deepening my expertise in modern full stack architecture with TypeScript to build robust, scalable applications.
            </Typography>
            <Stack direction="row" spacing={4} sx={{ mt: 4, mb: 4 }}>
              <Box>
                <Typography variant="h3" color="primary.light">2.5+</Typography>
                <Typography variant="body2" color="text.secondary">Years Experience</Typography>
              </Box>
              <Box>
                <Typography variant="h3" color="primary.light">5+</Typography>
                <Typography variant="body2" color="text.secondary">Projects Built</Typography>
              </Box>
            </Stack>

            {profile?.softSkills && (
              <>
                <Typography variant="h6" color="primary.light" sx={{ mb: 1 }}>Soft Skills</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
                  {profile.softSkills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ color: 'text.primary', borderColor: 'primary.main' }} />
                  ))}
                </Stack>
              </>
            )}

            {profile?.additionalInfo && (
              <>
                <Typography variant="h6" color="primary.light" sx={{ mb: 1 }}>Additional Information</Typography>
                <Typography variant="body2" color="text.secondary"><b>Availability:</b> {profile.additionalInfo?.availability}</Typography>
                <Typography variant="body2" color="text.secondary"><b>Languages:</b> {profile.additionalInfo?.languages?.join(', ')}</Typography>
                <Typography variant="body2" color="text.secondary"><b>Work Preference:</b> {profile.additionalInfo?.workPreference}</Typography>
              </>
            )}
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper className="glass-panel" elevation={0} sx={{ 
              p: 2, 
              borderRadius: 6, 
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                height: 400, 
                width: '100%', 
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.2) 100%)', 
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
              }}>
                <Typography variant="h1" className="hero-gradient-text" sx={{ opacity: 0.8, fontSize: '8rem' }}>MY</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default About;
