import React from 'react';
import { Box, Typography, Button, Stack, Container, Grid, Paper, Chip, useTheme, useMediaQuery, keyframes } from '@mui/material';
import { Layers, Cpu, Globe, Database, Server, Terminal, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SystemArchitecture = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const techStack = [
    { name: 'REACT.js', icon: <Layers size={20} />, color: '#61dafb', desc: 'Frontend Architecture' },
    { name: 'NODE.js', icon: <Server size={20} />, color: '#68a063', desc: 'Runtime Environment' },
    { name: 'EXPRESS', icon: <Terminal size={20} />, color: '#ffffff', desc: 'API Framework' },
    { name: 'MONGODB', icon: <Database size={20} />, color: '#47a248', desc: 'Data Layer' }
  ];

  return (
    <Box id="architecture" sx={{ py: { xs: 10, md: 20 }, bgcolor: 'rgba(51, 204, 255, 0.02)', position: 'relative' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Stack spacing={2} sx={{ mb: { xs: 6, md: 12 }, textAlign: 'center' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(0, 255, 204, 0.3)' }} />
            <Typography variant="caption" sx={{ color: '#00ffcc', fontWeight: 900, letterSpacing: { xs: 3, md: 6 }, fontFamily: 'Syncopate', fontSize: '0.65rem' }}>
              SYSTEM_ARCHITECTURE
            </Typography>
            <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(0, 255, 204, 0.3)' }} />
          </Box>
          <Typography variant="h2" sx={{
            fontFamily: 'Syncopate',
            fontWeight: 900,
            letterSpacing: -2,
            fontSize: { xs: '2rem', sm: '3rem', md: '5rem' }
          }}>
            ARCHITECTURE <span style={{ color: '#00ffcc' }}>MAP</span>
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Paper sx={{
                p: { xs: 3, sm: 4, md: 6 },
                bgcolor: 'rgba(2, 4, 10, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: 6,
                border: '1px solid rgba(0, 255, 204, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', mb: 5, display: 'flex', alignItems: 'center', gap: 2, fontSize: { xs: '1rem', md: '1.5rem' } }}>
                  <Cpu color="#00ffcc" size={isSmall ? 20 : 24} /> FULL_STACK_ARCHITECTURE
                </Typography>

                <Grid container spacing={{ xs: 2, md: 4 }}>
                  {techStack.map((tech, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <Box sx={{
                        p: { xs: 2, md: 3 }, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        transition: '0.3s',
                        '&:hover': { borderColor: tech.color, transform: isMobile ? 'none' : 'translateX(10px)' }
                      }}>
                        <Stack direction="row" spacing={isSmall ? 2 : 3} alignItems="center">
                          <Box sx={{ p: 1.5, bgcolor: `${tech.color}11`, borderRadius: 2, color: tech.color }}>
                            {tech.icon}
                          </Box>
                          <Box>
                            <Typography sx={{ color: 'white', fontWeight: 900, fontSize: { xs: '0.75rem', md: '0.9rem' }, fontFamily: 'Syncopate' }}>{tech.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#444', fontWeight: 700, fontSize: '0.6rem' }}>{tech.desc.toUpperCase()}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Stack direction="row" spacing={3} sx={{ mt: 6 }}>
                   <Button
                    href="/architecture"
                    variant="outlined"
                    fullWidth={isMobile}
                    endIcon={<Globe size={18} />}
                    sx={{
                      borderColor: '#00ffcc', color: '#00ffcc', px: 4, py: 1.5, borderRadius: 2,
                      fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.7rem',
                      '&:hover': { bgcolor: 'rgba(0, 255, 204, 0.05)', borderColor: '#00ffcc' }
                    }}
                   >
                     VIEW_DOCUMENTATION
                   </Button>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={{ xs: 3, md: 4 }}>
               <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: 'rgba(2, 4, 10, 0.9)', borderRadius: 5, border: '1px solid rgba(51, 204, 255, 0.1)' }}>
                  <Typography variant="h6" sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'Syncopate', mb: 3, fontSize: '0.8rem' }}>SECURITY_MEASURES</Typography>
                  <Stack spacing={2}>
                    {[
                      { l: 'ENCRYPTION', v: 'AES-256' },
                      { l: 'AUTHENTICATION', v: 'JWT / AUTH' },
                      { l: 'API_GATEWAY', v: 'SECURED' }
                    ].map((s, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#444', fontWeight: 900 }}>{s.l}</Typography>
                        <Chip label={s.v} size="small" sx={{ bgcolor: 'rgba(51, 204, 255, 0.05)', color: '#33ccff', border: '1px solid rgba(51, 204, 255, 0.2)', fontSize: '0.6rem', fontWeight: 900 }} />
                      </Box>
                    ))}
                  </Stack>
               </Paper>

               <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: 'rgba(2, 4, 10, 0.9)', borderRadius: 5, border: '1px solid rgba(255, 51, 102, 0.1)' }}>
                  <Typography variant="h6" sx={{ color: '#ff3366', fontWeight: 900, fontFamily: 'Syncopate', mb: 3, fontSize: '0.8rem' }}>PLATFORM_STATUS</Typography>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box sx={{ p: 2, bgcolor: 'rgba(255, 51, 102, 0.1)', borderRadius: '50%', color: '#ff3366', animation: `${spin} 4s linear infinite` }}>
                      <Shield size={24} />
                    </Box>
                    <Box>
                      <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '0.75rem' }}>SSL_SECURED</Typography>
                      <Typography variant="caption" sx={{ color: '#444' }}>PRODUCTION_READY</Typography>
                    </Box>
                  </Stack>
               </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SystemArchitecture;
