/**
 * [React.js & Material UI - Academic Foundations]
 * Technologies: React.js (Memo), Material UI (Paper, Stack), Lucide Icons, Framer Motion
 * Purpose: This component renders the 'Academic Background' section, mapping formal
 * educational qualifications with high-fidelity visual cards.
 */
import React, { memo } from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * AcademicTimeline Component
 * Displays a list of educational milestones.
 * @param {Array} education - Array of education objects containing degree, institution, and year.
 */
const AcademicTimeline = memo(({ education }) => {
  if (!education || !Array.isArray(education)) return null;

  return (
    <Box id="education" sx={{ py: 15 }}>
      {/* ─── SECTION HEADER ─── */}
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          mb: 10,
          textAlign: 'center',
          fontFamily: 'Syncopate',
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        ACADEMIC{' '}
        <Box component="span" sx={{ color: '#ff3366' }}>
          BACKGROUND
        </Box>
      </Typography>

      <Stack spacing={6}>
        {education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2, type: 'spring', bounce: 0.4 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            {/* [Education Card] - Glassmorphic design with central iconography */}
            <Paper
              className="glass-panel"
              sx={{
                p: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 4,
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                background: 'transparent',
              }}
            >
              {/* Specialized Graduation Icon with pulse-like shadow */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: '50%',
                  background: 'rgba(255, 51, 102, 0.1)',
                  color: '#ff3366',
                  border: '1px solid rgba(255, 51, 102, 0.3)',
                  boxShadow: '0 0 30px rgba(255, 51, 102, 0.2)',
                }}
              >
                <GraduationCap size={40} />
              </Box>

              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 1,
                    fontWeight: 800,
                    fontSize: '1.8rem',
                    background: 'linear-gradient(90deg, #fff, #aaa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {edu.degree}
                </Typography>

                {/* Institution name with dynamic link support */}
                {edu.institutionUrl ? (
                  <Typography
                    variant="h6"
                    component="a"
                    href={edu.institutionUrl}
                    target="_blank"
                    sx={{
                      mb: 1,
                      display: 'block',
                      color: '#ff9933',
                      textDecoration: 'none',
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      '&:hover': { color: '#ff3366' },
                    }}
                  >
                    {edu.institution}
                  </Typography>
                ) : (
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      color: '#ff9933',
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {edu.institution}
                  </Typography>
                )}

                {/* Graduation Validation Badge */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#ccc',
                    fontWeight: 600,
                    letterSpacing: 1,
                    background: 'rgba(255,255,255,0.05)',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    display: 'inline-block',
                  }}
                >
                  GRADUATED: {edu.year}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
});

export default AcademicTimeline;
