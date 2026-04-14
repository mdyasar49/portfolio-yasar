import React, { useState, memo } from 'react';
import { Box, Typography, Card, CardContent, Grid, Stack, Chip, Button, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ExternalLink, Lock, Github, X, Terminal, Zap, Activity, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TiltCard = memo(({ children, accentColor = '#33ccff' }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
        height: '100%',
        perspective: 1200,
        willChange: 'transform'
      }}
    >
      <Box sx={{ 
        height: '100%', 
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute', inset: -2,
          borderRadius: 6,
          background: `linear-gradient(45deg, transparent, ${accentColor}, transparent, ${accentColor}, transparent)`,
          backgroundSize: '400% 400%',
          animation: 'borderFlow 6s linear infinite',
          opacity: 0,
          transition: '0.5s ease',
          filter: `blur(8px) drop-shadow(0 0 10px ${accentColor})`,
          zIndex: 0
        },
        '&:hover::before': { opacity: 0.6 }
      }}>
        <Box sx={{ transform: "translateZ(80px)", height: '100%', position: 'relative', zIndex: 1 }}>
          {children}
        </Box>
      </Box>
    </motion.div>
  );
});

const Projects = memo(({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (!projects || !Array.isArray(projects)) return null;

  const handleOpen = (project) => setSelectedProject(project);
  const handleClose = () => setSelectedProject(null);

  return (
    <Box id="projects" sx={{ py: 20 }}>
      {/* SECTION HEADER */}
      <Stack spacing={2} sx={{ mb: { xs: 8, md: 15 }, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
           <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(51, 204, 255, 0.3)' }} />
           <Typography variant="caption" sx={{ color: '#33ccff', fontWeight: 900, letterSpacing: 6, fontFamily: 'Syncopate', fontSize: '0.65rem' }}>
             ARCHIVE_SYSTEM_v4.5.1
           </Typography>
           <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(51, 204, 255, 0.3)' }} />
        </Box>
        <Typography variant="h2" sx={{ 
          fontFamily: 'Syncopate', 
          fontWeight: 900, 
          letterSpacing: -2,
          fontSize: { xs: '2.8rem', md: '5rem' },
          textShadow: '0 0 40px rgba(255,255,255,0.05)'
        }}>
          TECHNICAL <span style={{ color: '#ff3366', textShadow: '0 0 20px rgba(255, 51, 102, 0.4)' }}>DEPLOYMENTS</span>
        </Typography>
      </Stack>

      <Grid container spacing={{ xs: 6, md: 10 }}>
        {projects.map((project, index) => {
          const accent = index % 2 === 0 ? '#33ccff' : '#ff3366';
          return (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                viewport={{ once: true }}
                style={{ height: '100%' }}
              >
                <TiltCard accentColor={accent}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: 5,
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'rgba(1, 4, 9, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    transition: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'rgba(1, 4, 9, 0.95)',
                      boxShadow: `0 40px 100px rgba(0,0,0,0.9), 0 0 40px ${accent}22`
                    }
                  }}>
                    {/* MEDIA ENGINE with Holographic Scanners */}
                    <Box sx={{ position: 'relative', overflow: 'hidden', height: 320 }}>
                      <CardMedia
                        component="img"
                        height="100%"
                        image={project.image}
                        alt={project.name}
                        loading="lazy"
                        sx={{ 
                          filter: 'brightness(0.7) contrast(1.1)',
                          transition: '0.8s ease',
                          transform: 'scale(1.05)'
                        }}
                      />
                      
                      {/* Scanning Light Beam */}
                      <Box className="scanning-beam" sx={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                        boxShadow: `0 0 20px ${accent}`,
                        zIndex: 3,
                        opacity: 0.3,
                        animation: 'scanVertical 4s linear infinite',
                        pointerEvents: 'none'
                      }} />

                      {/* Technical Spec HUD Overlay */}
                      <Box sx={{ position: 'absolute', top: 25, left: 25, zIndex: 10 }}>
                         <Stack spacing={1}>
                            <Box sx={{ 
                              display: 'flex', alignItems: 'center', gap: 1,
                              bgcolor: 'rgba(0,0,0,0.8)', py: 0.5, px: 1.5, borderRadius: 100,
                              border: `1px solid ${accent}44`,
                              boxShadow: `0 0 10px ${accent}22`
                            }}>
                               <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: accent, animation: 'pulse 1s infinite' }} />
                               <Typography sx={{ color: accent, fontSize: '0.6rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1 }}>DEPLOY_STABLE_v1.2</Typography>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', alignItems: 'center', gap: 1,
                              bgcolor: 'rgba(0,0,0,0.8)', py: 0.5, px: 1.5, borderRadius: 100,
                              border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                               <Zap size={10} color="#ff9933" />
                               <Typography sx={{ color: '#fff', fontSize: '0.6rem', fontWeight: 900, fontFamily: 'monospace', opacity: 0.6 }}>LOAD_PERFORMANCE_OPTIMIZED</Typography>
                            </Box>
                         </Stack>
                      </Box>

                      {/* Deep Fade Backdrop */}
                      <Box sx={{ 
                        position: 'absolute', inset: 0, 
                        background: `linear-gradient(to top, rgba(1, 4, 9, 1) 10%, ${accent}05 100%)`,
                        zIndex: 2
                      }} />
                    </Box>

                    {/* CONTENT MODULE */}
                    <CardContent sx={{ p: 5, flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                         <Typography variant="h4" sx={{ 
                           fontWeight: 900, color: 'white', fontFamily: 'Syncopate', fontSize: '1.4rem', 
                           letterSpacing: -0.5,
                           textShadow: `0 0 15px ${accent}22`
                         }}>
                           {project.name.toUpperCase()}
                         </Typography>
                         <Box sx={{ p: 1, borderRadius: '50%', border: `1px solid ${accent}11`, color: accent }}>
                           <Terminal size={18} />
                         </Box>
                      </Stack>
                      
                      <Typography variant="body2" sx={{ mb: 5, color: '#94a3b8', lineHeight: 1.9, fontSize: '0.95rem', fontWeight: 500 }}>
                         {project.description[0]}
                      </Typography>

                      <Stack direction="row" spacing={2} sx={{ mb: 5, flexWrap: 'wrap', gap: 1.5 }}>
                         {project.technologies.slice(0, 5).map(tech => (
                            <Box key={tech} sx={{ 
                              px: 1, borderLeft: `2px solid ${accent}`, 
                              bgcolor: `${accent}05`
                            }}>
                               <Typography variant="caption" sx={{ color: accent, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1, fontSize: '0.7rem' }}>{tech.toUpperCase()}</Typography>
                            </Box>
                         ))}
                      </Stack>

                      <Box sx={{ mt: 'auto' }}>
                         <Button 
                          fullWidth
                          variant="contained"
                          onClick={() => handleOpen(project)}
                          endIcon={<Activity size={18} />}
                          sx={{ 
                            py: 2, borderRadius: 2, 
                            bgcolor: 'rgba(255,255,255,0.02)', 
                            color: '#cbd5e1',
                            fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.75rem', letterSpacing: 2,
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': { 
                              borderColor: accent, color: '#fff', 
                              bgcolor: `${accent}11`,
                              transform: 'translateY(-2px)'
                            }
                          }}
                         >
                           ANALYZE_ASSET
                         </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* INTELLIGENCE ANALYSIS MODAL */}
      <Dialog 
        open={Boolean(selectedProject)} 
        onClose={handleClose} 
        maxWidth="lg" 
        fullWidth
        fullScreen={fullScreen}
        PaperProps={{ 
          sx: { 
            bgcolor: 'background.default', 
            backgroundImage: 'none',
            border: fullScreen ? 'none' : '1px solid rgba(51, 204, 255, 0.1)',
            borderRadius: fullScreen ? 0 : 6,
            overflow: 'hidden',
            p: { xs: 1, sm: 2, md: 4 },
            maxHeight: { xs: '100vh', md: '92vh' },
            m: { xs: 0, md: 2 }
          } 
        }}
      >
        <AnimatePresence mode="wait">
          {selectedProject && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: { xs: 2, md: 4 }, pr: { xs: 1, md: 2 } }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ p: 2, bgcolor: 'rgba(51, 204, 255, 0.1)', borderRadius: 2, color: '#33ccff', boxShadow: '0 0 20px rgba(51, 204, 255, 0.1)' }}>
                    <LayoutDashboard size={28} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#ff3366', fontWeight: 900, fontSize: '0.7rem', display: 'block', letterSpacing: 4, fontFamily: 'monospace' }}>&gt; SYSTEM_ASSET_DIAGNOSTICS</Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: -1 }}>{selectedProject.name.toUpperCase()}</Typography>
                  </Box>
                </Stack>
                <IconButton onClick={handleClose} sx={{ color: '#444', '&:hover': { color: '#ff3366' } }}><X size={28} /></IconButton>
              </DialogTitle>

              <DialogContent sx={{ px: { xs: 1, sm: 2 }, overflowY: 'auto' }}>
                <Grid container spacing={6}>
                  <Grid item xs={12} lg={7}>
                    <Box sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.01)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.03)' }}>
                      <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 900, mb: 4, fontSize: '0.8rem', letterSpacing: 2, fontFamily: 'Syncopate' }}>TECHNICAL_ARCHITECTURE_LOGS</Typography>
                      <Stack spacing={3}>
                        {selectedProject.description.map((line, i) => (
                           <Stack key={i} direction="row" spacing={3}>
                              <Typography sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'monospace' }}>[{i+1}]</Typography>
                              <Typography sx={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.8, fontWeight: 500 }}>{line}</Typography>
                           </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid item xs={12} lg={5}>
                    <Stack spacing={4}>
                      <Box sx={{ p: 4, bgcolor: 'rgba(0, 255, 204, 0.02)', borderRadius: 4, border: '1px solid rgba(0, 255, 204, 0.15)' }}>
                        <Typography variant="h6" sx={{ color: '#00ffcc', fontWeight: 900, mb: 3, fontSize: '0.75rem', letterSpacing: 2, fontFamily: 'Syncopate' }}>INFRASTRUCTURE_STACK</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                          {selectedProject.technologies.map(t => (
                             <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(0, 255, 204, 0.05)', color: '#00ffcc', fontWeight: 900, borderRadius: 1.5, border: '1px solid rgba(0, 255, 204, 0.2)', fontSize: '0.65rem', fontFamily: 'Syncopate' }} />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box sx={{ p: 4, bgcolor: 'rgba(255, 51, 102, 0.02)', borderRadius: 4, border: '1px solid rgba(255, 51, 102, 0.15)' }}>
                        <Typography variant="h6" sx={{ color: '#ff3366', fontWeight: 900, mb: 2.5, fontSize: '0.75rem', letterSpacing: 2, fontFamily: 'Syncopate' }}>SECURITY_CLEARANCE</Typography>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 51, 102, 0.1)', borderRadius: 2, color: '#ff3366' }}>
                             {selectedProject.github === '#' ? <Lock size={22} /> : <Github size={22} />}
                          </Box>
                          <Box>
                             <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '0.85rem' }}>{selectedProject.github === '#' ? 'RESTRICTED_ACCESS' : 'PUBLIC_OPEN_SOURCE'}</Typography>
                             <Typography variant="caption" sx={{ color: '#444', fontWeight: 800, fontFamily: 'monospace' }}>SEC_PROTOCOL_MOD_6</Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: { xs: 2, md: 5 }, pt: 2, gap: 2, flexWrap: 'wrap' }}>
                <Button onClick={handleClose} sx={{ color: '#444', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.7rem' }}>ABORT_VIEW</Button>
                <Button 
                  variant="contained" 
                  href={selectedProject.link === '#' ? undefined : selectedProject.link} 
                  target="_blank"
                  disabled={selectedProject.link === '#'}
                  startIcon={<ExternalLink size={20} />}
                  sx={{ 
                    background: 'linear-gradient(45deg, #ff3366, #ff9933)', 
                    color: 'white', px: 5, py: 2, borderRadius: 3, fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.85rem',
                    boxShadow: '0 15px 35px rgba(255, 51, 102, 0.3)',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 20px 45px rgba(255, 51, 102, 0.4)' },
                    '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: '#222' }
                  }}
                >
                  LIVE_SYSTEM_BRIDGE
                </Button>
              </DialogActions>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>

      <style>
        {`
          @keyframes borderFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          @keyframes scanVertical { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }
          @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.5; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.5; } }
          .scanning-beam { will-change: top; }
        `}
      </style>
    </Box>
  );
});

export default Projects;
