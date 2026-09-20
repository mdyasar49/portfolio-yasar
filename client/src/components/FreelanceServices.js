/**
 * Freelance Services & Client Solutions section for homepage.
 */

import React, { useState, memo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Stack,
  Button,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Layers,
  Mic,
  Cpu,
  Database,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Calculator,
} from 'lucide-react';
import ProjectEstimatorModal from './ProjectEstimatorModal';
import { Link as RouterLink } from 'react-router-dom';

const iconMap = {
  Layers: <Layers size={24} />,
  Mic: <Mic size={24} />,
  Cpu: <Cpu size={24} />,
  Database: <Database size={24} />,
  Zap: <Zap size={24} />,
};

const FreelanceServices = memo(({ profile }) => {
  const [estimatorOpen, setEstimatorOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('mern_saas');

  const services = profile?.services || [];

  const handleOpenEstimator = (serviceId) => {
    if (serviceId === 'ai-voice') setSelectedType('ai_voice');
    else if (serviceId === 'scraping-automation') setSelectedType('web_scraper');
    else if (serviceId === 'api-backend') setSelectedType('backend_api');
    else if (serviceId === 'speed-optimization') setSelectedType('speed_audit');
    else setSelectedType('mern_saas');

    setEstimatorOpen(true);
  };

  return (
    <Box id="services" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}>
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
              FREELANCE SOLUTIONS & CAPABILITIES
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
              High-Impact{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #f97316, #e11d48)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Engineering Services
              </Box>
            </Typography>
            <Typography
              sx={{
                color: '#94a3b8',
                fontSize: { xs: '1rem', md: '1.25rem' },
                maxWidth: 750,
                mx: 'auto',
                lineHeight: 1.7,
              }}
            >
              Turnkey full-stack web applications, real-time AI voice agents, and high-volume automated scrapers tailored for high-growth businesses and startups.
            </Typography>

            {/* Quick Estimator CTA Pill */}
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedType('mern_saas');
                  setEstimatorOpen(true);
                }}
                startIcon={<Calculator size={18} />}
                sx={{
                  bgcolor: '#e11d48',
                  color: 'white',
                  fontWeight: 800,
                  borderRadius: '100px',
                  px: 3.5,
                  py: 1.3,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  boxShadow: '0 10px 25px rgba(225, 29, 72, 0.4)',
                  '&:hover': { bgcolor: '#f97316' },
                }}
              >
                Instant Project Estimator
              </Button>
              <Button
                component={RouterLink}
                to="/services"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontWeight: 800,
                  borderRadius: '100px',
                  px: 3,
                  py: 1.3,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(225, 29, 72, 0.08)',
                  },
                }}
              >
                View Pricing & Process
              </Button>
            </Stack>
          </motion.div>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={3.5}>
          {services.map((service, index) => {
            const icon = iconMap[service.icon] || <Layers size={24} />;
            return (
              <Grid item xs={12} md={6} lg={4} key={service.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
                      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        borderColor: '#e11d48',
                        boxShadow: '0 20px 50px rgba(225, 29, 72, 0.18)',
                      },
                    }}
                  >
                    {/* Badge */}
                    {service.badge && (
                      <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                        <Chip
                          label={service.badge}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(249, 115, 22, 0.15)',
                            color: '#f97316',
                            border: '1px solid rgba(249, 115, 22, 0.3)',
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                          }}
                        />
                      </Box>
                    )}

                    {/* Service Icon */}
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '14px',
                        bgcolor: 'rgba(225, 29, 72, 0.12)',
                        border: '1px solid rgba(225, 29, 72, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f97316',
                        mb: 3,
                      }}
                    >
                      {icon}
                    </Box>

                    {/* Title & Short Desc */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 900,
                        color: 'white',
                        fontFamily: 'Outfit',
                        mb: 1.5,
                        fontSize: '1.35rem',
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        mb: 3,
                        flexGrow: 0,
                      }}
                    >
                      {service.shortDesc}
                    </Typography>

                    {/* Key Features */}
                    <Stack spacing={1.2} sx={{ mb: 4, flexGrow: 1 }}>
                      {service.features.slice(0, 3).map((feat, i) => (
                        <Stack key={i} direction="row" spacing={1.2} alignItems="flex-start">
                          <CheckCircle2
                            size={16}
                            color="#22c55e"
                            style={{ flexShrink: 0, marginTop: 3 }}
                          />
                          <Typography sx={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.5 }}>
                            {feat}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    {/* Meta & Trigger Button */}
                    <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2.5 }}
                      >
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <Clock size={14} color="#94a3b8" />
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                            {service.turnaround}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="caption"
                          sx={{ color: '#f97316', fontWeight: 900, fontSize: '0.85rem' }}
                        >
                          From {service.startingPrice}
                        </Typography>
                      </Stack>

                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleOpenEstimator(service.id)}
                        endIcon={<ArrowUpRight size={16} />}
                        sx={{
                          borderColor: 'rgba(225, 29, 72, 0.4)',
                          color: 'white',
                          fontWeight: 800,
                          borderRadius: '10px',
                          py: 1,
                          fontSize: '0.78rem',
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: '#e11d48',
                            bgcolor: 'rgba(225, 29, 72, 0.15)',
                          },
                        }}
                      >
                        Configure & Request Scope
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Estimator Modal */}
      <ProjectEstimatorModal
        open={estimatorOpen}
        onClose={() => setEstimatorOpen(false)}
        defaultProjectType={selectedType}
      />
    </Box>
  );
});

export default FreelanceServices;
