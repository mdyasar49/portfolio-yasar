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
                        position: 'absolute', inset: -80,
                        border: '1px solid rgba(51, 204, 255, 0.1)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}
                />
                {/* 2. Inner Data Ring (Fast, Dashed) */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute', inset: -40,
                        border: '2px dashed rgba(255, 51, 102, 0.15)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}
                />

                {/* Main Profile HUD Container */}
                <Box sx={{
                    position: 'relative',
                    aspectRatio: '1/1',
                    background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.98) 100%)',
                    backdropFilter: 'blur(40px) saturate(150%)',
                    borderRadius: '50%',
                    border: '1px solid rgba(51, 204, 255, 0.2)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 120px rgba(0,0,0,0.9), inset 0 0 60px rgba(51, 204, 255, 0.1)',
                    overflow: 'hidden',
                    '&:hover .scan-line': { animationDuration: '1s' }
                }}>
                    {/* Background Digital Grid */}
                    <Box sx={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(#33ccff 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }} />

                    {/* Identification Data Points */}
                    <Box sx={{ position: 'absolute', top: '22%', width: '100%', textAlign: 'center', zIndex: 2 }}>
                        <Typography variant="caption" sx={{ color: '#ff3366', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.6rem', letterSpacing: 6, textShadow: '0 0 10px #ff3366' }}>VERIFIED_CORE_STAMP</Typography>
                    </Box>

                    <Stack spacing={2} alignItems="center" sx={{ zIndex: 5 }}>
                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: -2, fontSize: { xs: '2rem', md: '3.5rem' }, textShadow: '0 0 30px rgba(255,255,255,0.1)' }}>SUMMARY</Typography>
                        <Box sx={{ height: 3, width: 100, bgcolor: '#00ffcc', boxShadow: '0 0 25px #00ffcc', borderRadius: 10 }} />
                    </Stack>

                    {/* Active Scan Line Overlay */}
                    <motion.div
                        className="scan-line"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute', left: 0, right: 0, height: '2px',
                            background: 'linear-gradient(90deg, transparent, #33ccff, transparent)',
                            boxShadow: '0 0 30px #33ccff',
                            zIndex: 10, opacity: 0.4
                        }}
                    />

                    {/* Decorative Hex Points */}
                    <Box sx={{ position: 'absolute', bottom: '20%', display: 'flex', gap: 1 }}>
                        {[1, 2, 3].map(i => (
                            <Box key={i} sx={{ width: 4, height: 4, bgcolor: '#33ccff', opacity: 0.5, borderRadius: '50%' }} />
                        ))}
                    </Box>
                </Box>
            </Box>
          </Grid>

          {/* [Right Column] - Narrative Description & Achievement Counters */}
          <Grid item xs={12} md={7}>
            <Stack spacing={6}>
              {/* Profile Bio Text */}
              <Box>
                <motion.div
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                >
                  <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 900, letterSpacing: 4, mb: 1, display: 'block', fontFamily: 'Syncopate', fontSize: '0.7rem' }}>EXECUTIVE_SUMMARY_DISPATCH</Typography>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, fontFamily: 'Outfit', mb: 4, fontSize: { xs: '1.8rem', md: '2.8rem' }, lineHeight: 1.2 }}>
                    Engineering <span style={{ color: '#ff3366', textShadow: '0 0 20px rgba(255, 51, 102, 0.3)' }}>Modern</span> Scalable Ecosystems
                  </Typography>
                  {/* Displays the summary text fetched from the backend */}
                  <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: 2, fontWeight: 400, textAlign: 'justify', borderLeft: '2px solid rgba(99, 102, 241, 0.2)', pl: 4 }}>
                    {profile.summary}
                  </Typography>
                </motion.div>
              </Box>

              {/* Grid of professional stats (Expertise, Work Exp, Projects) */}
              <Grid container spacing={3}>
                {[
                  { label: 'Expertise Level', value: profile.expertiseLevel || 'Full Stack Developer', color: '#6366f1' },
                  { label: 'Work Experience', value: profile.heroMetrics?.find(m => m.label === 'EXPERIENCE')?.val || '2+ Years', color: '#ec4899' },
                  { label: 'Projects Launched', value: `${profile.projects?.length || 0}+ Total`, color: '#10b981' }
                ].map((stat, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    {/* Individual stat card */}
                    <Box sx={{
                      p: 3, borderRadius: '20px',
                      bgcolor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': { 
                        bgcolor: 'rgba(255, 255, 255, 0.05)', 
                        borderColor: stat.color,
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: `0 20px 40px ${stat.color}11`
                      }
                    }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1.5, fontSize: '0.65rem', fontFamily: 'Syncopate', textTransform: 'uppercase' }}>{stat.label}</Typography>
                      <Typography sx={{ color: 'white', fontWeight: 800, fontFamily: 'Outfit', fontSize: '1.25rem' }}>{stat.value}</Typography>
                      {/* Decorative progress bar that fills when scrolled into view */}
                      <Box sx={{ mt: 2, height: 3, width: '100%', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 10, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          transition={{ duration: 1.2, delay: 0.5 + i * 0.2 }}
                          style={{ height: '100%', backgroundColor: stat.color, boxShadow: `0 0 15px ${stat.color}` }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Soft Skills Chips - Displayed as small glowing tags */}
              {profile?.softSkills && (
                <Box>
                  <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 900, letterSpacing: 3, mb: 3, display: 'block', fontFamily: 'Syncopate', fontSize: '0.6rem' }}>CORE_COMPETENCIES</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1.5}>
                    {profile.softSkills.map((skill) => (
                      <Box key={skill} sx={{
                        px: 2.5, py: 1, borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.75rem', fontWeight: 700, letterSpacing: 0.5,
                        transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontFamily: 'Outfit',
                        '&:hover': { color: '#33ccff', borderColor: '#33ccff', bgcolor: 'rgba(51, 204, 255, 0.05)', transform: 'translateY(-4px)' }
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
