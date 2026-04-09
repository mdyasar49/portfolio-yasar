import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Stack, Chip, Button, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Paper } from '@mui/material';
import { ExternalLink, Lock, Github, X, Globe, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  if (!projects || !Array.isArray(projects)) return null;

  const handleOpen = (project) => setSelectedProject(project);
  const handleClose = () => setSelectedProject(null);

  return (
    <Box id="projects" sx={{ py: 15 }}>
      <Typography variant="h2" gutterBottom sx={{ mb: 8, textAlign: 'center' }}>
        Professional <Box component="span" sx={{ color: 'primary.light' }}>Catalog</Box>
      </Typography>

      <Grid container spacing={6}>
        {projects.map((project, index) => (
          <Grid item xs={12} lg={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover="hover"
              style={{ height: '100%' }}
            >
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: 4,
                bgcolor: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                position: 'relative',
                overflow: 'visible', // allows glow to overflow
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -1,
                  background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%)',
                  borderRadius: 'inherit',
                  zIndex: -1,
                  opacity: 0,
                  transition: 'opacity 0.4s ease-in-out',
                },
              }}
              component={motion.div}
              variants={{
                hover: { 
                  y: -10,
                  scale: 1.02,
                  boxShadow: '0 20px 40px -10px rgba(99,102,241,0.2)',
                  transition: { duration: 0.3 }
                }
              }}
              onHoverStart={(e) => {
                e.target.closest('.MuiCard-root').style.setProperty('--glow-opacity', '1');
              }}
              onHoverEnd={(e) => {
                e.target.closest('.MuiCard-root').style.setProperty('--glow-opacity', '0');
              }}
              >
                <Box sx={{ 
                  position: 'absolute', inset: -1, borderRadius: 'inherit', zIndex: -1,
                  background: 'linear-gradient(45deg, #6366f1, #ec4899)', opacity: 'var(--glow-opacity, 0)',
                  transition: 'opacity 0.3s ease', filter: 'blur(20px)'
                }} />
                
                <Box sx={{ position: 'relative', overflow: 'hidden', height: 300, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                  <motion.div style={{ height: '100%', width: '100%' }}
                    variants={{ hover: { scale: 1.1 } }}
                    transition={{ duration: 0.6 }}
                  >
                    <CardMedia
                      component="img"
                      height="100%"
                      image={project.image}
                      alt={project.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  </motion.div>
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,1) 0%, transparent 100%)' }} />
                  {project.type.includes('Company') && (
                    <Box sx={{ position: 'absolute', top: 20, right: 20, bgcolor: 'rgba(99, 102, 241, 0.9)', backdropFilter: 'blur(4px)', px: 2, py: 0.5, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'white', letterSpacing: 1 }}>OFFICIAL</Typography>
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ p: 4, pt: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, bgcolor: '#0f172a' }}>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 800, background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.8, color: '#94a3b8', fontSize: '1.05rem' }}>
                    {project.description[0]}
                  </Typography>
                  
                  <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project.technologies.map((tech) => (
                      <Chip key={tech} label={tech} size="small" 
                        sx={{ 
                          bgcolor: 'rgba(99, 102, 241, 0.1)', 
                          color: '#818cf8', 
                          fontWeight: 600, 
                          borderRadius: 2,
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)', transform: 'translateY(-2px)' }
                        }} 
                      />
                    ))}
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                    <Button 
                      fullWidth
                      variant="text" 
                      onClick={() => handleOpen(project)} 
                      sx={{ 
                        color: 'white',
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        justifyContent: 'space-between',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {project.github === '#' ? <Lock size={20} color="#ec4899" /> : <Github size={20} color="#818cf8" />}
                        <span>{project.github === '#' ? 'View Private Logic' : 'View Source Code'}</span>
                      </Box>
                      <motion.div variants={{ hover: { x: 5 } }}>→</motion.div>
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Global Project/Repository Modal */}
      <Dialog 
        open={Boolean(selectedProject)} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 6, 
            bgcolor: '#030712', 
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden'
          } 
        }}
      >
        <AnimatePresence mode="wait">
          {selectedProject && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 4, px: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 2, color: 'white' }}>
                    {selectedProject.github === '#' ? <Lock size={20} /> : <Github size={20} />}
                  </Box>
                  <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 800 }}>
                    {selectedProject.github === '#' ? 'Confidential Repo' : 'Public Repository'}
                  </Typography>
                </Stack>
                <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}><X /></IconButton>
              </DialogTitle>

              <DialogContent sx={{ p: 4 }}>
                {selectedProject.github === '#' ? (
                  /* PRIVATE MODE */
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body1" sx={{ color: '#8892b0', mb: 4, lineHeight: 1.8 }}>
                      The source code for <b>{selectedProject.name}</b> is strictly confidential as it is commercial property of <b>Bytes and Binaries</b>. 
                      Access is restricted to protect corporate logic and client integrity.
                    </Typography>
                    <Box sx={{ p: 3, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: 4, border: '1px dashed rgba(99, 102, 241, 0.3)' }}>
                      <Typography variant="body2" color="primary.light" sx={{ fontWeight: 600 }}>
                        💡 You may request a private walkthrough of the logic during a technical interview.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  /* PUBLIC MODE */
                  <Box>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                      Explore the source code for <b>{selectedProject.name}</b> on GitHub.
                    </Typography>
                    <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, mb: 4 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Globe size={16} color="#6366f1" />
                          <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 700, letterSpacing: 1 }}>REPOSITORY URL</Typography>
                        </Stack>
                        <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, overflowX: 'auto' }}>
                          <Typography sx={{ color: '#8892b0', fontSize: '0.9rem', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                            {selectedProject.github}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                       <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                          <Box sx={{ textAlign: 'center', flex: 1, p: 2, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: 3 }}>
                             <Code2 size={24} color="#6366f1" />
                             <Typography variant="h4" sx={{ mt: 1, fontSize: '0.8rem', color: 'text.secondary' }}>Clean Code</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center', flex: 1, p: 2, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: 3 }}>
                             <Github size={24} color="#6366f1" />
                             <Typography variant="h4" sx={{ mt: 1, fontSize: '0.8rem', color: 'text.secondary' }}>Git Workflow</Typography>
                          </Box>
                       </Stack>
                    </Box>
                  </Box>
                )}
              </DialogContent>

              <DialogActions sx={{ p: 4, pt: 0 }}>
                <Button onClick={handleClose} sx={{ color: 'text.secondary', px: 3 }}>Close</Button>
                {selectedProject.github !== '#' ? (
                  <Button variant="contained" href={selectedProject.github} target="_blank" startIcon={<Github size={18} />} sx={{ px: 4 }}>
                    Open Repository
                  </Button>
                ) : (
                  <Button variant="contained" href={selectedProject.link} target="_blank" startIcon={<ExternalLink size={18} />} sx={{ px: 4 }}>
                    Visit Product Site
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
