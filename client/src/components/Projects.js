import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Stack, Chip, Button, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Paper } from '@mui/material';
import { ExternalLink, Lock, Github, X, Globe, Code2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TiltCard = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
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
        perspective: 1000
      }}
    >
      <div style={{ transform: "translateZ(50px)", height: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
};

const Projects = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  if (!projects || !Array.isArray(projects)) return null;

  const handleOpen = (project) => setSelectedProject(project);
  const handleClose = () => setSelectedProject(null);

  return (
    <Box id="projects" sx={{ py: 15 }}>
      <Typography variant="h2" gutterBottom sx={{ mb: 10, textAlign: 'center', fontFamily: 'Syncopate', fontWeight: 800, letterSpacing: 2 }}>
        ELITE <Box component="span" sx={{ color: '#ff3366' }}>PROJECTS</Box>
      </Typography>

      <Grid container spacing={6}>
        {projects.map((project, index) => (
          <Grid item xs={12} lg={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1, type: 'spring', bounce: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ height: '100%' }}
            >
              <TiltCard>
                <Card className="glass-panel" sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'transparent',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)',
                    pointerEvents: 'none',
                    borderRadius: 'inherit'
                  }
                }}>
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: 280, borderRadius: '24px 24px 0 0' }}>
                    <motion.div style={{ height: '100%', width: '100%', filter: 'brightness(0.8)' }}
                      whileHover={{ scale: 1.1, filter: 'brightness(1.1)' }}
                      transition={{ duration: 0.8 }}
                    >
                      <CardMedia
                        component="img"
                        height="100%"
                        image={project.image}
                        alt={project.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    </motion.div>
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 100%)' }} />
                    {project.type.includes('Company') && (
                      <Box sx={{ position: 'absolute', top: 20, right: 20, background: 'linear-gradient(45deg, #ff3366, #ff9933)', px: 2, py: 0.8, borderRadius: 3, boxShadow: '0 10px 20px rgba(255,51,102,0.4)', border: '1px solid rgba(255,255,255,0.4)' }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'white', letterSpacing: 2 }}>PRODUCTION</Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ p: 5, pt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                    <Typography variant="h3" sx={{ mb: 2, fontWeight: 800, fontSize: '2rem', background: 'linear-gradient(90deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.8, color: '#aaa', fontSize: '1.1rem' }}>
                      {project.description[0]}
                    </Typography>
                    
                    <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {project.technologies.map((tech) => (
                        <Chip key={tech} label={tech} size="medium" 
                          sx={{ 
                            background: 'rgba(255, 51, 102, 0.1)', 
                            color: '#ff9933', 
                            fontWeight: 700, 
                            borderRadius: 3,
                            border: '1px solid rgba(255, 51, 102, 0.3)',
                            backdropFilter: 'blur(5px)',
                            px: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': { background: 'rgba(255, 51, 102, 0.3)', transform: 'translateY(-3px)', boxShadow: '0 5px 15px rgba(255, 51, 102, 0.3)' }
                          }} 
                        />
                      ))}
                    </Box>

                    <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <Button 
                        fullWidth
                        variant="contained" 
                        onClick={() => handleOpen(project)} 
                        sx={{ 
                          background: 'rgba(255,255,255,0.05)',
                          py: 2,
                          borderRadius: 4,
                          textTransform: 'uppercase',
                          letterSpacing: 2,
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          justifyContent: 'center',
                          gap: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': { background: 'rgba(255,255,255,0.15)', boxShadow: '0 0 20px rgba(255,255,255,0.2)' }
                        }}
                      >
                        {project.github === '#' ? <Lock size={20} color="#ff3366" /> : <Github size={20} color="#fff" />}
                        <span style={{ color: '#fff' }}>EXPLORE ARCHITECTURE</span>
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={Boolean(selectedProject)} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '24px', 
            background: 'rgba(5, 5, 5, 0.65)',
            backdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 50px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2)',
            overflow: 'hidden'
          } 
        }}
        BackdropProps={{
          sx: { background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }
        }}
      >
        <AnimatePresence mode="wait">
          {selectedProject && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', bounce: 0.3 }}>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 5, px: 5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ p: 2, background: 'linear-gradient(45deg, #ff3366, #ff9933)', borderRadius: '16px', color: 'white', boxShadow: '0 10px 20px rgba(255,51,102,0.3)' }}>
                    {selectedProject.github === '#' ? <Lock size={28} /> : <Github size={28} />}
                  </Box>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 800, 
                    fontSize: '2rem',
                    background: 'linear-gradient(90deg, #fff, #aaa)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    textTransform: 'uppercase',
                    letterSpacing: 2
                  }}>
                    {selectedProject.github === '#' ? 'Locked Logic' : 'Source Logic'}
                  </Typography>
                </Stack>
                <IconButton onClick={handleClose} sx={{ color: 'white', background: 'rgba(255,255,255,0.05)', '&:hover': { background: 'rgba(255,33,66,0.3)' } }}><X size={24} /></IconButton>
              </DialogTitle>

              <DialogContent sx={{ p: 5 }}>
                {selectedProject.github === '#' ? (
                  /* PRIVATE MODE */
                  <Box sx={{ pt: 2 }}>
                    <Typography variant="body1" sx={{ color: '#aaa', mb: 4, lineHeight: 2, fontSize: '1.1rem', textAlign: 'center' }}>
                      The architecture for <b>{selectedProject.name}</b> is strictly confidential. 
                      Access to the source code is restricted to protect corporate IP and client integrity.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                       <Stack direction="column" sx={{ flex: 1, p: 3, background: 'linear-gradient(to bottom, rgba(51,204,255,0.05), transparent)', borderRadius: '16px', border: '1px solid rgba(51,204,255,0.2)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                            <Globe size={24} color="#33ccff" />
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>LIVE PRODUCT</Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.9rem', color: '#888', mb: 2, flexGrow: 1 }}>
                            The application is successfully deployed and actively serving users in production.
                          </Typography>
                       </Stack>
                       
                       <Stack direction="column" sx={{ flex: 1, p: 3, background: 'linear-gradient(to bottom, rgba(255,51,102,0.05), transparent)', justifyContent: 'space-between', borderRadius: '16px', border: '1px dashed rgba(255,51,102,0.3)' }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                              <Lock size={24} color="#ff3366" />
                              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>BACKGROUND VERIFICATION</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.85rem', color: '#888', mb: 3 }}>
                              Source code is restricted. You may directly contact the HR department to verify my employment and contributions to this project.
                            </Typography>
                          </Box>
                          <Button 
                            variant="outlined" 
                            href="mailto:careers@bytesandbinaries.com?subject=Employment%20Verification%3A%20A.%20Mohamed%20Yasar&body=Hello%20HR%20Team%2C%0A%0AI%20am%20currently%20reviewing%20the%20portfolio%20of%20A.%20Mohamed%20Yasar.%20I%20am%20writing%20to%20verify%20their%20past%20employment%20and%20technical%20contributions%20to%20the%20commercial%20software%20developed%20at%20Bytes%20and%20Binaries.%0A%0AThank%20you."
                            sx={{ 
                              color: '#ff3366', 
                              borderColor: 'rgba(255,51,102,0.3)', 
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              py: 1,
                              '&:hover': { background: 'rgba(255,51,102,0.1)', borderColor: '#ff3366' } 
                            }}
                          >
                            CONTACT TO VERIFY
                          </Button>
                       </Stack>
                    </Box>
                  </Box>
                ) : (
                  /* PUBLIC MODE */
                  <Box sx={{ pt: 2 }}>
                    <Paper sx={{ p: 4, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', mb: 5 }}>
                      <Stack spacing={3}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Globe size={20} color="#ff3366" />
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, letterSpacing: 2 }}>GITHUB REPOSITORY</Typography>
                        </Stack>
                        <Box sx={{ p: 3, background: 'rgba(255,255,255,0.02)', borderRadius: 2, overflowX: 'auto', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <Typography sx={{ color: '#ff9933', fontSize: '1rem', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                            {selectedProject.github}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                       <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
                          <Box sx={{ textAlign: 'center', flex: 1, p: 3, background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                             <Code2 size={32} color="#ff3366" />
                             <Typography variant="h4" sx={{ mt: 2, fontSize: '1rem', color: '#fff', fontWeight: 700 }}>Scalable Code</Typography>
                             <Typography sx={{ mt: 1, fontSize: '0.9rem', color: '#888' }}>Clean Architecture Pattern</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center', flex: 1, p: 3, background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                             <Github size={32} color="#ff3366" />
                             <Typography variant="h4" sx={{ mt: 2, fontSize: '1rem', color: '#fff', fontWeight: 700 }}>Git Workflow</Typography>
                             <Typography sx={{ mt: 1, fontSize: '0.9rem', color: '#888' }}>Standard Branching CI/CD</Typography>
                          </Box>
                       </Stack>
                    </Box>
                  </Box>
                )}
              </DialogContent>

              <DialogActions sx={{ p: 5, pt: 0, justifyContent: 'center' }}>
                <Button onClick={handleClose} sx={{ color: '#888', px: 4, py: 1.5, '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.05)' } }}>CANCEL</Button>
                {selectedProject.github !== '#' ? (
                  <Button variant="contained" href={selectedProject.github} target="_blank" startIcon={<Github size={20} />} sx={{ background: 'linear-gradient(45deg, #ff3366, #ff9933)', px: 5, py: 1.5, borderRadius: 50, fontWeight: 800, letterSpacing: 1, boxShadow: '0 10px 20px rgba(255,51,102,0.3)', '&:hover': { transform: 'translateY(-2px)' } }}>
                    INSPECT CODE
                  </Button>
                ) : (
                  <Button variant="contained" href={selectedProject.link} target="_blank" startIcon={<ExternalLink size={20} />} sx={{ background: 'linear-gradient(45deg, #ff3366, #ff9933)', px: 5, py: 1.5, borderRadius: 50, fontWeight: 800, letterSpacing: 1, boxShadow: '0 10px 20px rgba(255,51,102,0.3)', '&:hover': { transform: 'translateY(-2px)' } }}>
                    VISIT PRODUCTION
                  </Button>
                )}
              </DialogActions>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </Box>
  );
};

export default Projects;
