/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders the 'About Me' section of the portfolio.
 * It provides a narrative summary of the user's professional background, 
 * along with key statistics (Experience, Expertise Level, Projects Launched)
 * and a cloud of soft skills.
 */

import React, { memo } from 'react';
// Material UI components for grid system, spacing, and typography
import { Box, Typography, Grid, Stack } from '@mui/material';
// Framer Motion for scroll-triggered entrance animations and rotating background shapes
import { motion } from 'framer-motion';

/**
 * [About Component]
 * @param {Object} profile - Data object containing the user's summary and soft skills from the database.
 * 'memo' is used to skip re-renders if the profile data hasn't changed.
 */
const About = memo(({ profile }) => {
  // If the profile data is not loaded yet, don't show anything
  if (!profile) return null;

  return (
    <Box id="about" sx={{ py: 20, position: 'relative' }}>
      {/* Container for the entire section with a fade-in animation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Grid container spacing={8} alignItems="center">
          
          {/* [Left Column] - High-Tech "Digital Identity" HUD */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative' }}>
                {/* 1. Outer Scanning Circle (Slow) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute', inset: -60,
                        border: '1px solid rgba(51, 204, 255, 0.08)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}
                />
                {/* 2. Inner Data Ring (Fast, Dashed) */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute', inset: -30,
                        border: '2px dashed rgba(255, 51, 102, 0.08)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}
                />
                
                {/* Main Profile HUD Container */}
                <Box sx={{ 
                    position: 'relative', 
                    aspectRatio: '1/1',
                    background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.6) 0%, rgba(1, 4, 9, 0.9) 100%)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: '50%',
                    border: '1px solid rgba(51, 204, 255, 0.15)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 100px rgba(0,0,0,0.8), inset 0 0 40px rgba(51, 204, 255, 0.05)',
                    overflow: 'hidden'
                }}>
                    {/* Background Digital Grid */}
                    <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#33ccff 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }} />
                    
                    {/* Identification Data Points */}
                    <Box sx={{ position: 'absolute', top: '20%', width: '100%', textAlign: 'center', zIndex: 2 }}>
                        <Typography variant="caption" sx={{ color: '#ff3366', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.6rem', letterSpacing: 4 }}>ID: 0x28A4F</Typography>
                    </Box>

                    <Stack spacing={2} alignItems="center" sx={{ zIndex: 5 }}>
                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: -2, fontSize: { xs: '2rem', md: '3.5rem' } }}>PROFILE</Typography>
                        <Box sx={{ height: 2, width: 80, bgcolor: '#00ffcc', boxShadow: '0 0 15px #00ffcc', borderRadius: 10 }} />
                    </Stack>

                    {/* Active Scan Line Overlay */}
                    <motion.div
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute', left: 0, right: 0, height: '1px',
                            background: 'linear-gradient(90deg, transparent, #33ccff, transparent)',
                            boxShadow: '0 0 20px #33ccff',
                            zIndex: 10, opacity: 0.3
                        }}
                    />
                </Box>
            </Box>
          </Grid>


          {/* [Right Column] - Narrative Description & Achievement Counters */}
          <Grid item xs={12} md={7}>
            <Stack spacing={5}>
              {/* Profile Bio Text */}
              <Box>
                <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: 3, mb: 1, display: 'block' }}>Executive Summary</Typography>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, fontFamily: 'Outfit', mb: 3, fontSize: '2rem' }}>
                  Engineering <span style={{ color: '#ec4899' }}>Modern</span> Solutions
                </Typography>
                {/* Displays the summary text fetched from the backend */}
                <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 2, textAlign: 'justify' }}>
                  {profile.summary}
                </Typography>
              </Box>

              {/* Grid of professional stats (Expertise, Work Exp, Projects) */}
              <Grid container spacing={3}>
                {[
                  { label: 'Expertise Level', value: 'Full Stack Developer', color: '#6366f1' },
                  { label: 'Work Experience', value: '2.5+ Years', color: '#ec4899' },
                  { label: 'Projects Launched', value: `${profile.projects?.length || 0}+ Total`, color: '#10b981' }
                ].map((stat, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    {/* Individual stat card */}
                    <Box sx={{ 
                      p: 2.5, borderRadius: '16px', 
                      bgcolor: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: '0.3s ease',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)', borderColor: stat.color }
                    }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: 1, display: 'block', mb: 1, fontSize: '0.7rem', fontFamily: 'Outfit', textTransform: 'uppercase' }}>{stat.label}</Typography>
                      <Typography sx={{ color: 'white', fontWeight: 800, fontFamily: 'Outfit', fontSize: '1.1rem' }}>{stat.value}</Typography>
                      {/* Decorative progress bar that fills when scrolled into view */}
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

              {/* Soft Skills Chips - Displayed as small glowing tags */}
              {profile?.softSkills && (
                <Box>
                  <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: 2, mb: 2, display: 'block' }}>Core Competencies</Typography>
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
                        {skill}
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
