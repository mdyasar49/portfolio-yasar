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

      <Grid container spacing={5}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              style={{ height: '100%' }}
            >
              <Card className="glass" sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: 5,
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(10, 25, 47, 0.9) 100%)',
                position: 'relative'
              }}>
                <Box sx={{ position: 'relative', overflow: 'hidden', height: 260 }}>
                  <CardMedia
                    component="img"
                    height="100%"
                    image={project.image}
                    alt={project.name}
                    sx={{ transition: '0.8s transform cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { transform: 'scale(1.1) rotate(1deg)' } }}
                  />
                  {project.type.includes('Company') && (
                    <Box sx={{ position: 'absolute', top: 20, right: 20, bgcolor: 'primary.main', px: 2, py: 0.5, borderRadius: 10, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'white' }}>OFFICIAL</Typography>
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ p: 5, flexGrow: 1 }}>
                  <Typography variant="h3" sx={{ mb: 2, fontWeight: 800 }}>{project.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, fontSize: '1rem' }}>{project.description[0]}</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 4 }}>
                    {project.technologies.map((tech) => (
                      <Chip key={tech} label={tech} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'primary.light', fontWeight: 600, border: '1px solid rgba(255,255,255,0.05)' }} />
                    ))}
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={project.github === '#' ? <Lock size={18} /> : <Github size={18} />} 
                      onClick={() => handleOpen(project)} 
                      sx={{ flex: 1 }}
                    >
                      {project.github === '#' ? 'Private Code' : 'Source'}
                    </Button>
                    {project.link && (
                      <Button variant="contained" startIcon={<ExternalLink size={18} />} href={project.link} target="_blank" sx={{ flex: 1 }}>
                        Live Demo
                      </Button>
                    )}
                  </Stack>
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
