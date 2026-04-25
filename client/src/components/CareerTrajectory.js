/**
 * [React.js & Material UI - Career Timeline]
 * Technologies: React.js (Memo), Material UI (Cards, Stack), Framer Motion (Spring Animations), Lucide Icons
 * Purpose: This component renders the 'Career Trajectory' section, visualizing professional
 * experience with embedded technical metrics and responsibility feeds.
 */
import React, { memo } from 'react';
import { Box, Typography, Card, CardContent, Stack, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';

/**
 * CareerTrajectory Component
 * Maps career history into a high-fidelity vertical timeline.
 * @param {Array} experience - Collection of experience objects from the backend profile.
 */
const CareerTrajectory = memo(({ experience }) => {
  if (!experience || !Array.isArray(experience)) return null;

  return (
    <Box id="experience" sx={{ py: 15 }}>
      {/* ─── SECTION HEADER ─── */}
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          mb: { xs: 5, md: 10 },
          textAlign: 'center',
          fontFamily: 'Outfit',
          fontWeight: 800,
          letterSpacing: { xs: -1, md: -2 },
          fontSize: { xs: '2rem', md: '3.75rem' },
        }}
      >
        Career{' '}
        <Box component="span" sx={{ color: '#ec4899' }}>
          Experience
        </Box>
      </Typography>

      <Stack spacing={6}>
        {experience.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2, type: 'spring', bounce: 0.4 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            {/* [Experience Card] - Featuring glassmorphic design and thematic accent */}
            <Card
              className="glass-panel"
              sx={{
                borderLeft: '5px solid #ff3366',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'visible',
                background: 'transparent',
              }}
            >
              <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        fontFamily: 'Outfit',
                        fontSize: { xs: '1.4rem', sm: '1.8rem' },
                        background: 'linear-gradient(90deg, #fff, #cbd5e1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      {exp.role}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      {/* Company Name with live link support */}
                      {exp.companyUrl ? (
                        <Typography
                          variant="h6"
                          component="a"
                          href={exp.companyUrl}
                          target="_blank"
                          sx={{
                            color: '#6366f1',
                            textDecoration: 'none',
                            fontWeight: 600,
                            letterSpacing: 0,
                            fontFamily: 'Outfit',
                            '&:hover': { color: '#ec4899' },
                          }}
                        >
                          {exp.company}
                        </Typography>
                      ) : (
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#6366f1',
                            fontWeight: 600,
                            letterSpacing: 0,
                            fontFamily: 'Outfit',
                          }}
                        >
                          {exp.company}
                        </Typography>
                      )}

                      {/* Official Post/LinkedIn Validation Button */}
                      {exp.companyLinkedIn && (
                        <Button
                          component="a"
                          href={exp.companyLinkedIn}
                          target="_blank"
                          variant="outlined"
                          size="small"
                          startIcon={<Linkedin size={16} />}
                          sx={{
                            color: '#00a0dc',
                            borderColor: 'rgba(0, 160, 220, 0.3)',
                            borderRadius: 6,
                            textTransform: 'none',
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            pl: 1.5,
                            pr: 2,
                            py: 0.5,
                            background: 'rgba(0, 160, 220, 0.05)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#00a0dc',
                              background: 'rgba(0, 160, 220, 0.1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 5px 15px rgba(0, 160, 220, 0.2)',
                            },
                          }}
                        >
                          Official Post
                        </Button>
                      )}
                    </Box>
                  </Box>
                  {/* Service Duration Badge */}
                  <Box
                    sx={{
                      mt: { xs: 2, md: 0 },
                      background: 'rgba(255,255,255,0.05)',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      height: 'fit-content',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: '#ccc', fontWeight: 600, letterSpacing: 1 }}
                    >
                      {exp.period}
                    </Typography>
                  </Box>
                </Box>

                {/* [ENGINEERING METRICS HUD] - Visual KPI indicators for the role */}
                {exp.metrics && (
                  <Stack direction="row" spacing={4} sx={{ mb: 4, flexWrap: 'wrap', gap: 3 }}>
                    {exp.metrics.map((m, i) => (
                      <Box key={i} sx={{ minWidth: 100 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748b',
                            fontWeight: 600,
                            mb: 0.8,
                            display: 'block',
                            letterSpacing: 1,
                            fontSize: '0.65rem',
                            fontFamily: 'Outfit',
                            textTransform: 'uppercase',
                          }}
                        >
                          {m.label}
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            sx={{
                              width: 80,
                              height: 4,
                              bgcolor: 'rgba(255,255,255,0.03)',
                              borderRadius: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${m.value}%` }}
                              transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                              style={{
                                height: '100%',
                                backgroundColor: '#ff3366',
                                boxShadow: '0 0 10px #ff336644',
                              }}
                            />
                          </Box>
                          <Typography
                            sx={{
                              color: '#fff',
                              fontSize: '0.7rem',
                              fontWeight: 900,
                              fontFamily: 'monospace',
                              opacity: 0.8,
                            }}
                          >
                            {m.value}%
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}

                {/* Technical Stack used specifically in this role */}
                {exp.technologies && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#ec4899',
                        fontWeight: 700,
                        mb: 1.5,
                        display: 'block',
                        letterSpacing: 1,
                        fontSize: '0.7rem',
                        fontFamily: 'Outfit',
                        textTransform: 'uppercase',
                      }}
                    >
                      Technology Stack
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {exp.technologies.map((tech) => (
                        <Box
                          key={tech}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: 'rgba(236, 72, 153, 0.05)',
                            border: '1px solid rgba(236, 72, 153, 0.2)',
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#ec4899',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              fontFamily: 'Outfit',
                            }}
                          >
                            {tech}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Responsibility Feed: Detailed task descriptions */}
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 700,
                      mb: 2,
                      display: 'block',
                      letterSpacing: 1,
                      fontSize: '0.7rem',
                      fontFamily: 'Outfit',
                      textTransform: 'uppercase',
                    }}
                  >
                    Key Responsibilities
                  </Typography>
                  <Stack spacing={2.5}>
                    {exp.description.map((item, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 2.5 }}>
                        <Box sx={{ color: '#6366f1', fontSize: '1.2rem', mt: -0.5, opacity: 0.8 }}>
                          •
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#94a3b8',
                            lineHeight: 1.9,
                            fontSize: '1rem',
                            fontWeight: 500,
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
});

export default CareerTrajectory;
