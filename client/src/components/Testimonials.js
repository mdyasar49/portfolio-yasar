/**
 * Client Testimonials & Social Proof section.
 */

import React, { memo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  Stack,
  Rating,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Quote, ShieldCheck, Award, CheckCircle, Zap } from 'lucide-react';

const Testimonials = memo(({ profile }) => {
  const testimonials = profile?.testimonials || [];
  const highlights = profile?.freelanceHighlights || {
    deliveryRate: '100% On-Time',
    clientSatisfaction: '5.0 ★ Rating',
    averageTurnaround: '1 - 3 Weeks',
    postLaunchSupport: '30 Days Support',
  };

  return (
    <Box id="testimonials" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 900,
                letterSpacing: 4,
                mb: 2,
                display: 'block',
                fontFamily: 'Outfit',
              }}
            >
              CLIENT TRUST & TESTIMONIALS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                color: 'white',
                letterSpacing: -1.5,
                fontFamily: 'Outfit',
                lineHeight: 1.1,
                mb: 3,
              }}
            >
              Proven Results,{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #f97316, #e11d48)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Zero Compromise.
              </Box>
            </Typography>
            <Typography
              sx={{
                color: '#94a3b8',
                fontSize: { xs: '1rem', md: '1.2rem' },
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              Real feedback from client engagements across media platforms, legal portals, and AI telephony workflows.
            </Typography>
          </motion.div>
        </Box>

        {/* Highlight Trust Bar */}
        <Grid container spacing={2.5} sx={{ mb: 6 }}>
          {[
            { label: 'DELIVERY RECORD', val: highlights.deliveryRate, icon: <CheckCircle size={20} color="#22c55e" /> },
            { label: 'CLIENT RATING', val: highlights.clientSatisfaction, icon: <Award size={20} color="#f97316" /> },
            { label: 'TURNAROUND', val: highlights.averageTurnaround, icon: <Zap size={20} color="#38bdf8" /> },
            { label: 'WARRANTY', val: highlights.postLaunchSupport, icon: <ShieldCheck size={20} color="#a855f7" /> },
          ].map((item, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Box
                className="glass-card"
                sx={{
                  p: { xs: 2.5, md: 3 },
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.06)',
                  bgcolor: 'rgba(255,255,255,0.01)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box sx={{ mb: 0.5 }}>{item.icon}</Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    color: 'white',
                    fontFamily: 'Outfit',
                    fontSize: { xs: '1.1rem', md: '1.35rem' },
                  }}
                >
                  {item.val}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', fontWeight: 800, letterSpacing: 1.5, fontSize: '0.65rem' }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Testimonial Cards */}
        <Grid container spacing={3.5}>
          {testimonials.map((t, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                style={{ height: '100%' }}
              >
                <Card
                  className="glass-card"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: { xs: 3, md: 4 },
                    position: 'relative',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: '0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(249, 115, 22, 0.4)',
                      transform: 'translateY(-6px)',
                    },
                  }}
                >
                  {/* Quote Icon */}
                  <Box sx={{ color: 'rgba(225, 29, 72, 0.3)', mb: 2 }}>
                    <Quote size={32} />
                  </Box>

                  {/* Rating Stars */}
                  <Rating value={t.rating} readOnly size="small" sx={{ mb: 2, color: '#f97316' }} />

                  {/* Content */}
                  <Typography
                    sx={{
                      color: '#cbd5e1',
                      fontSize: '0.92rem',
                      lineHeight: 1.7,
                      mb: 4,
                      flexGrow: 1,
                      fontStyle: 'italic',
                    }}
                  >
                    "{t.content}"
                  </Typography>

                  {/* Author Meta */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={t.avatar}
                      alt={t.name}
                      sx={{ width: 46, height: 46, border: '2px solid rgba(225, 29, 72, 0.4)' }}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>
                        {t.role} · {t.company}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: '#e11d48', fontWeight: 700, fontSize: '0.7rem' }}
                      >
                        Project: {t.project}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

export default Testimonials;
