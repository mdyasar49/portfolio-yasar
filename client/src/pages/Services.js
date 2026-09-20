/**
 * Dedicated Freelance Services, Process Roadmap & Pricing Page.
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Stack,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Layers,
  Mic,
  Cpu,
  Database,
  Zap,
  CheckCircle2,
  Clock,
  Calculator,
  ChevronDown,
  MessageCircle,
  Mail,
} from 'lucide-react';
import SEO from '../components/SEO';
import ProjectEstimatorModal from '../components/ProjectEstimatorModal';
import Footer from '../components/Footer';

const iconMap = {
  Layers: <Layers size={28} />,
  Mic: <Mic size={28} />,
  Cpu: <Cpu size={28} />,
  Database: <Database size={28} />,
  Zap: <Zap size={28} />,
};

const Services = ({ profile }) => {
  const [estimatorOpen, setEstimatorOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('mern_saas');

  const services = profile?.services || [];
  const processSteps = profile?.processSteps || [];
  const faqs = profile?.faqs || [];

  const handleOpenEstimator = (serviceId) => {
    if (serviceId === 'ai-voice') setSelectedType('ai_voice');
    else if (serviceId === 'scraping-automation') setSelectedType('web_scraper');
    else if (serviceId === 'api-backend') setSelectedType('backend_api');
    else if (serviceId === 'speed-optimization') setSelectedType('speed_audit');
    else setSelectedType('mern_saas');

    setEstimatorOpen(true);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 12, md: 16 } }}>
      <SEO
        title="Freelance Services & Pricing"
        description="Hire A. Mohamed Yasar for Custom Full-Stack MERN Web Apps, Real-Time AI Voice Portals, Web Scraping Pipelines, and Speed Optimization."
      />

      <Container maxWidth="xl" sx={{ pb: 8 }}>
        {/* Header Hero */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 900,
                letterSpacing: 4,
                display: 'block',
                mb: 2,
                fontFamily: 'Outfit',
              }}
            >
              FREELANCE SOLUTIONS & CAPABILITIES
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.8rem', sm: '4rem', md: '5.5rem' },
                fontWeight: 900,
                color: 'white',
                letterSpacing: -2,
                fontFamily: 'Outfit',
                lineHeight: 1,
                mb: 3,
              }}
            >
              Enterprise Engineering for{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #f97316, #e11d48)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                High-Growth Businesses
              </Box>
            </Typography>
            <Typography
              sx={{
                color: '#94a3b8',
                fontSize: { xs: '1.05rem', md: '1.35rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              Transparent pricing, milestone-based execution, and guaranteed code quality. Delivering production-grade software on time, every time.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" gap={2}>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedType('mern_saas');
                  setEstimatorOpen(true);
                }}
                startIcon={<Calculator size={20} />}
                sx={{
                  bgcolor: '#e11d48',
                  color: 'white',
                  fontWeight: 900,
                  borderRadius: '100px',
                  px: 4,
                  py: 1.5,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  boxShadow: '0 12px 30px rgba(225, 29, 72, 0.4)',
                  '&:hover': { bgcolor: '#f97316' },
                }}
              >
                Launch Project Estimator
              </Button>
              <Button
                variant="outlined"
                href="https://wa.me/919025943184?text=Hi%20Mohamed,%20I%20would%20like%20to%20discuss%20a%20freelance%20project."
                target="_blank"
                startIcon={<MessageCircle size={20} />}
                sx={{
                  borderColor: 'rgba(34, 197, 94, 0.5)',
                  color: '#22c55e',
                  fontWeight: 800,
                  borderRadius: '100px',
                  px: 3.5,
                  py: 1.5,
                  fontSize: '0.9rem',
                  bgcolor: 'rgba(34, 197, 94, 0.05)',
                  '&:hover': {
                    borderColor: '#22c55e',
                    bgcolor: 'rgba(34, 197, 94, 0.15)',
                  },
                }}
              >
                Quick WhatsApp Chat
              </Button>
            </Stack>
          </motion.div>
        </Box>

        {/* Detailed Service Offerings Grid */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: 'white',
            fontFamily: 'Outfit',
            letterSpacing: -1,
            mb: 4,
            textAlign: 'center',
          }}
        >
          Core Service Offerings
        </Typography>

        <Grid container spacing={4} sx={{ mb: 12 }}>
          {services.map((service, index) => {
            const icon = iconMap[service.icon] || <Layers size={28} />;
            return (
              <Grid item xs={12} md={6} key={service.id}>
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
                      p: { xs: 3.5, md: 5 },
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '20px',
                      position: 'relative',
                      transition: '0.4s ease',
                      '&:hover': {
                        borderColor: '#e11d48',
                        boxShadow: '0 20px 50px rgba(225, 29, 72, 0.15)',
                      },
                    }}
                  >
                    {service.badge && (
                      <Chip
                        label={service.badge}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 24,
                          right: 24,
                          bgcolor: 'rgba(249, 115, 22, 0.15)',
                          color: '#f97316',
                          border: '1px solid rgba(249, 115, 22, 0.4)',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        width: 58,
                        height: 58,
                        borderRadius: '16px',
                        bgcolor: 'rgba(225, 29, 72, 0.12)',
                        border: '1px solid rgba(225, 29, 72, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f97316',
                        mb: 3,
                      }}
                    >
                      {icon}
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        color: 'white',
                        fontFamily: 'Outfit',
                        fontSize: { xs: '1.4rem', md: '1.75rem' },
                        mb: 1.5,
                      }}
                    >
                      {service.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.98rem',
                        lineHeight: 1.7,
                        mb: 3,
                      }}
                    >
                      {service.shortDesc}
                    </Typography>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />

                    {/* Features List */}
                    <Typography
                      variant="overline"
                      sx={{ color: '#f97316', fontWeight: 800, letterSpacing: 1.5, display: 'block', mb: 1.5 }}
                    >
                      WHAT IS INCLUDED:
                    </Typography>
                    <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
                      {service.features.map((feature, i) => (
                        <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                          <CheckCircle2
                            size={18}
                            color="#22c55e"
                            style={{ flexShrink: 0, marginTop: 2 }}
                          />
                          <Typography sx={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            {feature}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    <Box sx={{ pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2.5 }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Clock size={16} color="#94a3b8" />
                          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                            Timeline: <strong>{service.turnaround}</strong>
                          </Typography>
                        </Stack>
                        <Typography
                          variant="h6"
                          sx={{ color: '#f97316', fontWeight: 900, fontFamily: 'Outfit' }}
                        >
                          From {service.startingPrice}
                        </Typography>
                      </Stack>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleOpenEstimator(service.id)}
                        sx={{
                          bgcolor: 'rgba(225, 29, 72, 0.9)',
                          color: 'white',
                          fontWeight: 800,
                          borderRadius: '12px',
                          py: 1.2,
                          fontSize: '0.85rem',
                          textTransform: 'none',
                          '&:hover': { bgcolor: '#e11d48' },
                        }}
                      >
                        Calculate Scope & Get Quote
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* 5-Step Freelance Process Roadmap */}
        <Box sx={{ mb: 12 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 900,
                letterSpacing: 3,
                display: 'block',
                mb: 1,
              }}
            >
              HOW WE WORK TOGETHER
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 900, color: 'white', fontFamily: 'Outfit', letterSpacing: -1 }}
            >
              5-Step Agile Delivery Roadmap
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {processSteps.map((stepItem, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Box
                  className="glass-card"
                  sx={{
                    p: 3,
                    height: '100%',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: 'rgba(225, 29, 72, 0.8)',
                      fontFamily: 'Outfit',
                      mb: 1,
                    }}
                  >
                    {stepItem.step}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', fontWeight: 800, fontSize: '1.05rem', mb: 1.5, fontFamily: 'Outfit' }}
                  >
                    {stepItem.title}
                  </Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6 }}>
                    {stepItem.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Client FAQs */}
        <Box sx={{ maxWidth: 850, mx: 'auto', mb: 12 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: '#f97316', fontWeight: 900, letterSpacing: 3, display: 'block', mb: 1 }}
            >
              FREQUENTLY ASKED QUESTIONS
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 900, color: 'white', fontFamily: 'Outfit', letterSpacing: -1 }}
            >
              Client Questions & Policies
            </Typography>
          </Box>

          <Stack spacing={2}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px !important',
                  color: 'white',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown color="#e11d48" />}
                  sx={{ px: 3, py: 1 }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'Outfit' }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>

        {/* Bottom Booking CTA Banner */}
        <Box
          className="glass-card"
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: '24px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(225,29,72,0.15) 0%, rgba(249,115,22,0.15) 100%)',
            border: '1px solid rgba(225,29,72,0.3)',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: 'white',
              fontFamily: 'Outfit',
              letterSpacing: -1,
              mb: 2,
            }}
          >
            Ready to Start Your Project?
          </Typography>
          <Typography
            sx={{
              color: '#cbd5e1',
              fontSize: { xs: '1rem', md: '1.2rem' },
              maxWidth: 600,
              mx: 'auto',
              mb: 4,
            }}
          >
            Book a free strategy consultation or send your requirements for an exact quotation and delivery timeline.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" gap={2}>
            <Button
              variant="contained"
              href="https://wa.me/919025943184?text=Hi%20Mohamed,%20I%20would%20like%20to%20discuss%20a%20freelance%20project."
              target="_blank"
              startIcon={<MessageCircle size={18} />}
              sx={{
                bgcolor: '#22c55e',
                color: 'white',
                fontWeight: 800,
                borderRadius: '100px',
                px: 4,
                py: 1.4,
                fontSize: '0.88rem',
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(34,197,94,0.3)',
                '&:hover': { bgcolor: '#16a34a' },
              }}
            >
              Direct WhatsApp (+91-9025943184)
            </Button>
            <Button
              variant="outlined"
              href="mailto:mohamedyasar081786@gmail.com?subject=Freelance%20Project%20Inquiry"
              startIcon={<Mail size={18} />}
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 800,
                borderRadius: '100px',
                px: 3.5,
                py: 1.4,
                fontSize: '0.88rem',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Email Inquiries
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Global Footer */}
      <Footer profile={profile} />

      {/* Modal */}
      <ProjectEstimatorModal
        open={estimatorOpen}
        onClose={() => setEstimatorOpen(false)}
        defaultProjectType={selectedType}
      />
    </Box>
  );
};

export default Services;
