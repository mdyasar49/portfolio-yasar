import React, { useState, memo } from 'react';
import { Box, Typography, Card, CardContent, Grid, Stack, Chip, Button, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { ExternalLink, Lock, Github, X, Terminal, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TiltCard = memo(({ children }) => {
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
        perspective: 1000,
        willChange: 'transform'
      }}
    >
      <div style={{ transform: "translateZ(50px)", height: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
});

const Projects = memo(({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  if (!projects || !Array.isArray(projects)) return null;

  const handleOpen = (project) => setSelectedProject(project);
  const handleClose = () => setSelectedProject(null);

  return (
    <Box id="projects" sx={{ py: 15 }}>
      <Stack spacing={1} sx={{ mb: { xs: 5, md: 10 }, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#ff3366', fontWeight: 900, letterSpacing: 4, fontFamily: 'monospace' }}>[SYSTEM_DEPLOYMENTS_v4.2]</Typography>
        <Typography variant="h2" sx={{ 
          fontFamily: 'Syncopate', 
          fontWeight: 800, 
          letterSpacing: -1,
          fontSize: { xs: '2.5rem', md: '4.5rem' }
        }}>
          ELITE <span style={{ color: '#ff3366' }}>PROJECTS</span>
        </Typography>
      </Stack>

      <Grid container spacing={{ xs: 4, md: 8 }}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              style={{ height: '100%' }}
            >
              <TiltCard>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'rgba(1, 4, 9, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    borderColor: 'rgba(51, 204, 255, 0.4)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 20px rgba(51, 204, 255, 0.1)'
                  }
                }}>
                  {/* Media Section with HUD Overlay */}
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: 300 }}>
                    <CardMedia
                      component="img"
                      height="100%"
                      image={project.image}
                      alt={project.name}
                      loading="lazy"
                      sx={{ filter: 'brightness(0.6)' }}
                    />
                    
                    {/* Diagnostic Grid on Hover */}
                    <Box sx={{
                      position: 'absolute', inset: 0, opacity: 0.1,
                      backgroundImage: 'linear-gradient(rgba(51, 204, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 204, 255, 0.1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      pointerEvents: 'none'
                    }} />

                    {/* Tech HUD Spec */}
                    <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
                       <Stack direction="row" spacing={1}>
                          <Chip label="200ms_LATENCY" size="small" sx={{ bgcolor: 'rgba(0,0,0,0.4)', border: '1px solid #33ccff', color: '#33ccff', fontSize: '0.6rem', fontWeight: 900, fontFamily: 'monospace' }} />
                          <Chip label="ACTIVE_SEO" size="small" sx={{ bgcolor: 'rgba(0,0,0,0.4)', border: '1px solid #ff3366', color: '#ff3366', fontSize: '0.6rem', fontWeight: 900, fontFamily: 'monospace' }} />
                       </Stack>
                    </Box>

                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(1, 4, 9, 1) 0%, transparent 100%)' }} />
                  </Box>

                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                       <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', fontFamily: 'Syncopate', fontSize: '1.2rem' }}>
                         {project.name.toUpperCase()}
                       </Typography>
                       <Zap size={18} color="#ff9933" />
                    </Stack>
                    
                    <Typography variant="body2" sx={{ mb: 4, color: '#64748b', lineHeight: 1.8, fontSize: '0.9rem' }}>
                       {project.description[0]}
                    </Typography>

                    <Stack direction="row" spacing={1.5} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
                       {project.technologies.slice(0, 4).map(tech => (
                          <Typography key={tech} variant="caption" sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1 }}>#{tech}</Typography>
                       ))}
                    </Stack>

                    <Box sx={{ mt: 'auto' }}>
                       <Button 
                        fullWidth
                        variant="outlined"
                        onClick={() => handleOpen(project)}
                        startIcon={<Terminal size={18} />}
                        sx={{ 
                          py: 1.5, borderRadius: 2, 
                          borderColor: 'rgba(255,255,255,0.05)', 
                          color: '#888',
                          fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.7rem',
                          background: 'rgba(255,255,255,0.01)',
                          transition: 'all 0.3s ease',
                          '&:hover': { borderColor: '#33ccff', color: 'white', background: 'rgba(51, 204, 255, 0.1)' }
                        }}
                       >
                         EXECUTE_INTERFACE
                       </Button>
                    </Box>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Project Intelligence Dialog */}
      <Dialog 
        open={Boolean(selectedProject)} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ 
          sx: { 
            bgcolor: '#010409', 
            backgroundImage: 'none',
            border: '1px solid rgba(51, 204, 255, 0.1)',
            borderRadius: 4,
            p: 2
          } 
        }}
      >
        <AnimatePresence mode="wait">
          {selectedProject && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, bgcolor: 'rgba(51, 204, 255, 0.1)', borderRadius: 1.5, color: '#33ccff' }}>
                    <Activity size={24} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#ff3366', fontWeight: 900, fontSize: '0.65rem', display: 'block', letterSpacing: 2 }}>ASSET_ANALYSIS</Typography>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate' }}>{selectedProject.name.toUpperCase()}</Typography>
                  </Box>
                </Stack>
                <IconButton onClick={handleClose} sx={{ color: '#444' }}><X size={24} /></IconButton>
              </DialogTitle>

              <DialogContent>
                <Grid container spacing={4} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={7}>
                    <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mb: 2, fontSize: '0.9rem', letterSpacing: 1 }}>TECHNICAL_ARCHIVES</Typography>
                      <Stack spacing={2}>
                        {selectedProject.description.map((line, i) => (
                           <Typography key={i} sx={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.8, display: 'flex', gap: 2 }}>
                              <span style={{ color: '#33ccff' }}>&gt;</span> {line}
                           </Typography>
                        ))}
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Stack spacing={3}>
                      <Box sx={{ p: 3, bgcolor: '#000', borderRadius: 3, border: '1px solid rgba(0, 255, 204, 0.1)' }}>
                        <Typography variant="h6" sx={{ color: '#00ffcc', fontWeight: 900, mb: 2, fontSize: '0.8rem', letterSpacing: 2 }}>TECH_STACK</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {selectedProject.technologies.map(t => (
                             <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(51, 204, 255, 0.1)', color: '#33ccff', fontWeight: 900, borderRadius: 1, border: '1px solid rgba(51, 204, 255, 0.2)' }} />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box sx={{ p: 3, bgcolor: '#000', borderRadius: 3, border: '1px solid rgba(255, 51, 102, 0.1)' }}>
                        <Typography variant="h6" sx={{ color: '#ff3366', fontWeight: 900, mb: 1.5, fontSize: '0.8rem', letterSpacing: 2 }}>SECURITY_STATE</Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {selectedProject.github === '#' ? <Lock size={20} color="#ff3366" /> : <Github size={20} color="#00ffcc" />}
                          <Typography variant="caption" sx={{ color: '#444', fontWeight: 800 }}>{selectedProject.github === '#' ? 'RESTRICTED_SOURCE' : 'OPEN_SOURCE_REPOSITORY'}</Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 4, gap: 2 }}>
                <Button onClick={handleClose} sx={{ color: '#444', fontWeight: 900 }}>DISMISS</Button>
                <Button 
                  variant="contained" 
                  href={selectedProject.link} 
                  target="_blank"
                  startIcon={<ExternalLink size={18} />}
                  sx={{ 
                    background: 'linear-gradient(45deg, #ff3366, #ff9933)', 
                    px: 4, borderRadius: 2, fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.75rem' 
                  }}
                >
                  LIVE_DEPLOYMENT
                </Button>
              </DialogActions>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </Box>
  );
});

export default Projects;
