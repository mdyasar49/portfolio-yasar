/**
 * Quick View HUD for Freelance Clients and Recruiters.
 */

import React, { useState, memo } from 'react';
import { Box, Typography, Stack, Button, Divider, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, MessageCircle, Calculator, X } from 'lucide-react';
import ProjectEstimatorModal from './ProjectEstimatorModal';
import { Link as RouterLink } from 'react-router-dom';

const RecruiterHUD = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [estimatorOpen, setEstimatorOpen] = useState(false);

  const bullets = [
    '3+ Years Full-Stack (MERN / Python)',
    'Immediate Joiner (Full-Time Roles)',
    '100% On-Time Delivery Guarantee',
    '30 Days Free Post-Launch Support',
  ];

  return (
    <>
      {/* Floating Pill Trigger */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 32 },
          left: { xs: 16, md: 32 },
          zIndex: 1000,
        }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Box
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: { xs: 2, md: 2.5 },
              py: { xs: 1, md: 1.3 },
              bgcolor: 'rgba(225, 29, 72, 0.15)',
              border: '1px solid rgba(225, 29, 72, 0.4)',
              borderRadius: '100px',
              cursor: 'pointer',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 25px rgba(225, 29, 72, 0.25)',
              transition: '0.3s',
              '&:hover': {
                bgcolor: 'rgba(225, 29, 72, 0.25)',
                borderColor: '#e11d48',
              },
            }}
          >
            {isOpen ? <X size={16} color="#e11d48" /> : <Sparkles size={16} color="#f97316" />}
            <Typography
              sx={{
                color: 'white',
                fontWeight: 800,
                fontSize: { xs: '0.65rem', md: '0.72rem' },
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                fontFamily: 'Outfit',
              }}
            >
              {isOpen ? 'Close' : 'Hire / Fast Quote'}
            </Typography>
          </Box>
        </motion.div>

        {/* HUD Slide-Up Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                bottom: '55px',
                left: 0,
                width: window.innerWidth < 600 ? 'calc(100vw - 32px)' : 330,
                pointerEvents: 'auto',
              }}
            >
              <Box
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: '20px',
                  bgcolor: 'rgba(6, 9, 18, 0.98)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(225, 29, 72, 0.3)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                }}
              >
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      color: '#f97316',
                      fontWeight: 900,
                      fontSize: '0.65rem',
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                    }}
                  >
                    AVAILABILITY STATUS
                  </Typography>
                  <Chip
                    label="Immediate Joiner / Open"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(34, 197, 94, 0.15)',
                      color: '#22c55e',
                      fontWeight: 800,
                      fontSize: '0.62rem',
                      height: 20,
                    }}
                  />
                </Stack>

                <Stack spacing={2}>
                  {/* Bullets */}
                  <Stack spacing={1}>
                    {bullets.map((item) => (
                      <Stack key={item} direction="row" spacing={1.2} alignItems="center">
                        <CheckCircle2 size={14} color="#22c55e" style={{ flexShrink: 0 }} />
                        <Typography sx={{ color: '#cbd5e1', fontSize: '0.78rem', fontWeight: 600 }}>
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                  {/* Primary Actions */}
                  <Stack spacing={1}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        setIsOpen(false);
                        setEstimatorOpen(true);
                      }}
                      startIcon={<Calculator size={15} />}
                      sx={{
                        bgcolor: '#e11d48',
                        color: 'white',
                        fontWeight: 800,
                        borderRadius: '10px',
                        py: 1,
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#f97316' },
                      }}
                    >
                      Calculate Project Estimate
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      href="https://wa.me/919025943184?text=Hi%20Mohamed,%20I%20would%20like%20to%20discuss%20a%20full-time%20role%20/%20freelance%20project."
                      target="_blank"
                      startIcon={<MessageCircle size={15} />}
                      sx={{
                        borderColor: 'rgba(34, 197, 94, 0.5)',
                        color: '#22c55e',
                        fontWeight: 800,
                        borderRadius: '10px',
                        py: 0.9,
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        bgcolor: 'rgba(34, 197, 94, 0.05)',
                        '&:hover': { borderColor: '#22c55e', bgcolor: 'rgba(34, 197, 94, 0.15)' },
                      }}
                    >
                      WhatsApp +91-9025943184
                    </Button>

                    <Stack direction="row" spacing={1}>
                      <Button
                        component={RouterLink}
                        to="/resume"
                        onClick={() => setIsOpen(false)}
                        sx={{
                          flex: 1,
                          color: '#cbd5e1',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          py: 0.5,
                          '&:hover': { color: 'white', borderColor: '#e11d48' },
                        }}
                      >
                        View Resume
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/services"
                        onClick={() => setIsOpen(false)}
                        sx={{
                          flex: 1,
                          color: '#cbd5e1',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          py: 0.5,
                          '&:hover': { color: 'white', borderColor: '#e11d48' },
                        }}
                      >
                        All Services
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Estimator Modal */}
      <ProjectEstimatorModal
        open={estimatorOpen}
        onClose={() => setEstimatorOpen(false)}
      />
    </>
  );
});

export default RecruiterHUD;
