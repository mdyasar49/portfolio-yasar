import React from 'react';
import { Box, Typography, Button, Stack, Container, Grid, Paper } from '@mui/material';
import { Download, ExternalLink, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

const ProfessionalDossier = ({ profile }) => {
  const config = profile?.resumeConfig || {};
  const sharing = config.sharingTemplate || {};

  const resumeApi = API_BASE_URL ? `${API_BASE_URL}/profile` : '';
  const iframeSrc = resumeApi
    ? `/resume-pro/index.html?api=${encodeURIComponent(resumeApi)}`
    : '/resume-pro/index.html';

  const handleDownload = () => {
    window.open(`/resume-pro/${config.filename || 'resume.pdf'}`, '_blank');
  };

  return (
    <Box id="resume" sx={{ py: 20, position: 'relative' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Stack spacing={2} sx={{ mb: 10, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              mb: 1,
            }}
          >
            <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(255, 51, 102, 0.3)' }} />
            <Typography
              variant="caption"
              sx={{
                color: '#ec4899',
                fontWeight: 700,
                letterSpacing: 4,
                fontFamily: 'Outfit',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
              }}
            >
              Curriculum Vitae
            </Typography>
            <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(255, 51, 102, 0.3)' }} />
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Outfit',
              fontWeight: 800,
              letterSpacing: -1,
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              textShadow: '0 0 40px rgba(255,255,255,0.05)',
            }}
          >
            Resume &{' '}
            <span style={{ color: '#6366f1', textShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}>
              Assets
            </span>
          </Typography>
        </Stack>

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={7}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    p: 0.5,
                    bgcolor: 'rgba(51, 204, 255, 0.1)',
                    borderRadius: 4,
                    border: '1px solid rgba(51, 204, 255, 0.3)',
                    boxShadow: '0 0 40px rgba(51, 204, 255, 0.1)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: { xs: '500px', md: '700px' },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: 'linear-gradient(90deg, transparent, #33ccff, transparent)',
                      boxShadow: '0 0 15px #33ccff',
                      zIndex: 10,
                      opacity: 0.5,
                      animation: 'scan 4s linear infinite',
                    }}
                  />

                  <iframe
                    src={iframeSrc}
                    title="Direct Resume View"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', background: 'white', borderRadius: '8px' }}
                  />
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    top: -15,
                    left: -15,
                    width: 40,
                    height: 40,
                    borderTop: '2px solid #ff3366',
                    borderLeft: '2px solid #ff3366',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -15,
                    right: -15,
                    width: 40,
                    height: 40,
                    borderBottom: '2px solid #33ccff',
                    borderRight: '2px solid #33ccff',
                  }}
                />
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Paper
                sx={{
                  p: { xs: 4, md: 5 },
                  bgcolor: 'rgba(1, 4, 9, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 6,
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                }}
              >
                <Stack spacing={4}>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        fontWeight: 800,
                        fontFamily: 'Outfit',
                        mb: 2,
                        fontSize: '1.4rem',
                      }}
                    >
                      Resume Overview
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
                      A comprehensive overview of my professional experience and technical skills.
                      This document is optimized for engineering-focused review and reflects current
                      industry standards.
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {[
                      { l: 'TYPE', v: 'FULL_STACK' },
                      { l: 'MOD', v: config.version || 'v1.0.0' },
                      { l: 'STATUS', v: 'ACTIVE' },
                      { l: 'ACCESS', v: 'OPEN' },
                    ].map((s, i) => (
                      <Grid item xs={6} key={i}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748b',
                            fontWeight: 700,
                            display: 'block',
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                          }}
                        >
                          {s.l}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#6366f1',
                            fontWeight: 700,
                            fontFamily: 'Outfit',
                            fontSize: '1rem',
                          }}
                        >
                          {s.v}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>

                  <Stack spacing={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleDownload}
                      startIcon={<Download size={18} />}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                        py: 1.8,
                        borderRadius: 4,
                        fontWeight: 700,
                        fontFamily: 'Outfit',
                        fontSize: '0.95rem',
                        boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)',
                        '&:hover': { transform: 'translateY(-2px)' },
                      }}
                    >
                      Download PDF Version
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => {
                        const resumeUrl = `${window.location.origin}/resume?system_dispatch=true`;
                        const subject = encodeURIComponent(
                          sharing.subject?.replace('{{NAME}}', profile.name) || 'Resume Access',
                        );
                        const bodyText = sharing.body
                          ?.replace(/{{NAME}}/g, profile.name)
                          ?.replace('{{URL}}', resumeUrl)
                          ?.replace('{{VERSION}}', config.version)
                          ?.replace(
                            '{{ID}}',
                            Math.random().toString(36).substring(7).toUpperCase(),
                          );

                        const body = encodeURIComponent(bodyText || '');
                        window.open(
                          `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`,
                          '_blank',
                        );
                      }}
                      startIcon={<Share2 size={18} />}
                      sx={{
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        bgcolor: 'rgba(99, 102, 241, 0.05)',
                        color: '#6366f1',
                        py: 1.8,
                        borderRadius: 4,
                        fontWeight: 700,
                        fontFamily: 'Outfit',
                        fontSize: '0.95rem',
                        '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.15)', borderColor: '#6366f1' },
                      }}
                    >
                      Share Resume Access
                    </Button>
                    <Button
                      fullWidth
                      href="/resume"
                      target="_blank"
                      startIcon={<ExternalLink size={18} />}
                      sx={{
                        border: '1px solid rgba(255,255,255,0.1)',
                        bgcolor: 'rgba(255,255,255,0.02)',
                        color: 'white',
                        py: 1.8,
                        borderRadius: 4,
                        fontWeight: 700,
                        fontFamily: 'Outfit',
                        fontSize: '0.95rem',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: '#6366f1' },
                      }}
                    >
                      View Interactive Resume
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <style>
        {`
          @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
          iframe::-webkit-scrollbar { width: 4px; }
          iframe::-webkit-scrollbar-thumb { background: #33ccff; border-radius: 10px; }
        `}
      </style>
    </Box>
  );
};

export default ProfessionalDossier;
