import React from 'react';
import { Box, Typography, Grid, Paper, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const About = ({ profile }) => {
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
              {profile.summary}
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Currently strengthening backend development skills by learning Core Java, Spring Boot, and Python basics. 
              I am also deepening my expertise in the MERN stack with TypeScript to build robust, scalable applications.
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

            <Typography variant="h6" color="primary.light" sx={{ mb: 1 }}>Soft Skills</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
              {profile.softSkills.map((skill) => (
                <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ color: 'text.primary', borderColor: 'primary.main' }} />
              ))}
            </Stack>

            <Typography variant="h6" color="primary.light" sx={{ mb: 1 }}>Additional Information</Typography>
            <Typography variant="body2" color="text.secondary"><b>Availability:</b> {profile.additionalInfo.availability}</Typography>
            <Typography variant="body2" color="text.secondary"><b>Languages:</b> {profile.additionalInfo.languages.join(', ')}</Typography>
            <Typography variant="body2" color="text.secondary"><b>Work Preference:</b> {profile.additionalInfo.workPreference}</Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ 
              p: 2, 
              bgcolor: 'primary.light', 
              borderRadius: 4, 
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 20,
                left: 20,
                right: -20,
                bottom: -20,
                border: '2px solid',
                borderColor: 'primary.light',
                borderRadius: 4,
                zIndex: -1
              }
            }}>
              <Box sx={{ 
                height: 400, 
                width: '100%', 
                bgcolor: 'background.paper', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h1" color="primary.light" sx={{ opacity: 0.1 }}>MY</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default About;
