/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders the 'Featured Projects' section, which is the core showcase of the portfolio.
 * It features interactive "Tilt Cards" that follow mouse movement in 3D, 
 * and a deep-dive "Technical Analysis" modal for viewing project details, stack, and highlights.
 */

import React, { useState, memo } from 'react';
// Material UI components for high-end cards, modals (Dialogs), tabs, and responsive layout
import { Box, Typography, Card, CardContent, Grid, Stack, Chip, Button, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useMediaQuery, useTheme, Tabs, Tab } from '@mui/material';
// Technical icons for CTA buttons and section headers
import { ExternalLink, Lock, Github, X, Terminal, Zap, Activity, LayoutDashboard, Cpu } from 'lucide-react';
// Framer Motion for the 3D parallax tilt effects and smooth modal transitions
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * [TiltCard Component]
 * Function purpose: Provides a reusable wrapper that applies a 3D tilt effect 
 * to its children based on the user's mouse position.
 */
const TiltCard = memo(({ children, accentColor = '#33ccff' }) => {
  // Motion values to track mouse position without triggering standard React re-renders
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs to make the tilt feel fluid and expensive
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  // Map the mouse percentage to rotation degrees (tilt up to 10 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  /**
   * [handleMouseMove]
   * Calculates the cursor offset from the center of the card.
   */
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  /**
   * [handleMouseLeave]
   * Resets the rotation back to zero when the mouse leaves.
   */
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
        transformStyle: "preserve-3d", // Required for child elements to "float" in 3D
        height: '100%',
        perspective: 1200,
        willChange: 'transform' // Performance optimization for the GPU
      }}
    >
      {/* Decorative Outer Border Glow that appears on hover */}
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
        {/* Child container pushed forward in 3D space for the "pop" effect */}
        <Box sx={{ transform: "translateZ(80px)", height: '100%', position: 'relative', zIndex: 1 }}>
          {children}
        </Box>
      </Box>
    </motion.div>
  );
});

/**
 * [Projects Component] (Main Orchestrator)
 * Function purpose: Renders the project grid and manages the detail modal state.
 * @param {Array} projects - The list of projects fetched from the Node.js backend.
 */
const Projects = memo(({ projects }) => {
  // state to track which project is currently being viewed in the modal
  const [selectedProject, setSelectedProject] = useState(null);
  // state to track whether we are looking at the 'Overview' or 'Stack' tab in the modal
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  // Responsive check: Use full-screen modal on mobile
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Logic to extract unique technologies from all projects for the filter bar
  const allTech = ['ALL', ...new Set(projects.flatMap(p => p.technologies.map(t => t.toUpperCase())))];
  const [filter, setFilter] = useState('ALL');

  // Filtered projects list based on selection
  const filteredProjects = filter === 'ALL' 
    ? projects 
    : projects.filter(p => p.technologies.some(t => t.toUpperCase() === filter));

  // If there are no projects loaded, don't show the section
  if (!projects || !Array.isArray(projects)) return null;

  // Function to open the details modal
  const handleOpen = (project) => {
    setSelectedProject(project);
    setActiveTab(0); // Always start on the Overview tab
  };
  
  // Function to close the modal
  const handleClose = () => setSelectedProject(null);

  return (
    <Box id="projects" sx={{ py: 20 }}>
      {/* ── SECTION HEADER ── */}
      <Stack spacing={2} sx={{ mb: { xs: 8, md: 10 }, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
           <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(51, 204, 255, 0.3)' }} />
           <Typography variant="caption" sx={{ color: '#ec4899', fontWeight: 700, letterSpacing: 4, fontFamily: 'Outfit', fontSize: '0.85rem', textTransform: 'uppercase' }}>
             Curated Work
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
          FEATURED <span style={{ color: '#6366f1', textShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}>PROJECTS</span>
        </Typography>
      </Stack>

      {/* ── TECH FILTER BAR ── */}
      <Box sx={{ 
        mb: 8, display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap',
        maxWidth: 900, mx: 'auto', p: 1, borderRadius: 10,
        bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)'
      }}>
        {allTech.map(tech => (
          <Button
            key={tech}
            onClick={() => setFilter(tech)}
            sx={{
              px: 3, py: 1, borderRadius: 10,
              fontSize: '0.65rem', fontWeight: 900, fontFamily: 'Syncopate',
              bgcolor: filter === tech ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: filter === tech ? '#6366f1' : '#444',
              border: '1px solid',
              borderColor: filter === tech ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
              transition: 'all 0.3s'
            }}
          >
            {tech}
          </Button>
        ))}
      </Box>

      {/* ── PROJECT COUNT HUD ── */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 900, fontFamily: 'monospace', letterSpacing: 2 }}>
          STREAMING_ASSETS: {filteredProjects.length} // STACK: {filter}
        </Typography>
      </Box>

      {/* ── PROJECT GRID ── */}
      <Grid container spacing={{ xs: 6, md: 10 }}>
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            // Alternating colors between purple and pink for each project
            const accent = index % 2 === 0 ? '#6366f1' : '#ec4899';
            return (
              <Grid item xs={12} md={6} key={project.name}>
                {/* Fade-in animation as the project card enters the screen */}
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  style={{ height: '100%' }}
                >
                  {/* Apply the 3D tilt effect */}
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
                      {/* [MEDIA CONTAINER] Image with holographic scanning light effect */}
                      <Box sx={{ position: 'relative', overflow: 'hidden', height: 320 }}>
                        <CardMedia
                          component="img"
                          className="project-img"
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
                        
                        {/* Animated Scanning Beam line */}
                        <Box className="scanning-beam" sx={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                          boxShadow: `0 0 20px ${accent}`,
                          zIndex: 3,
                          opacity: 0.3,
                          animation: 'scanVertical 4s linear infinite',
                          pointerEvents: 'none'
                        }} />

                        {/* Technical HUD Overlay (Badge system on top of image) */}
                        <Box sx={{ position: 'absolute', top: 25, left: 25, zIndex: 10 }}>
                           <Stack spacing={1}>
                              {/* "Production Ready" Badge */}
                              <Box sx={{ 
                                display: 'flex', alignItems: 'center', gap: 1,
                                bgcolor: 'rgba(0,0,0,0.8)', py: 0.5, px: 1.5, borderRadius: 100,
                                border: `1px solid ${accent}44`,
                                boxShadow: `0 0 10px ${accent}22`
                              }}>
                                 <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: accent, animation: 'pulse 1s infinite' }} />
                                 <Typography sx={{ color: accent, fontSize: '0.6rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1 }}>PRODUCTION_READY</Typography>
                              </Box>
                              {/* "Performance Optimized" Badge */}
                              <Box sx={{ 
                                display: 'flex', alignItems: 'center', gap: 1,
                                bgcolor: 'rgba(0,0,0,0.8)', py: 0.5, px: 1.5, borderRadius: 100,
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}>
                                 <Zap size={10} color="#ff9933" />
                                 <Typography sx={{ color: '#fff', fontSize: '0.6rem', fontWeight: 900, fontFamily: 'monospace', opacity: 0.6 }}>PERFORMANCE_OPTIMIZED</Typography>
                              </Box>
                              
                              {/* Visual Project Stats HUD (if data exists) */}
                              {project.stats && (
                                <Box sx={{ 
                                  display: 'flex', gap: 1.5, mt: 1,
                                  bgcolor: 'rgba(0,0,0,0.6)', py: 0.5, px: 2, borderRadius: 100,
                                  border: '1px solid rgba(255,255,255,0.05)',
                                  backdropFilter: 'blur(5px)'
                                }}>
                                  {Object.entries(project.stats).map(([k, v]) => (
                                    <Box key={k} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography sx={{ color: '#444', fontSize: '0.55rem', fontWeight: 900 }}>{k.toUpperCase()}:</Typography>
                                      <Typography sx={{ color: '#fff', fontSize: '0.6rem', fontWeight: 900 }}>{v}</Typography>
                                    </Box>
                                  ))}
                                </Box>
                              )}
                           </Stack>
                        </Box>

                        {/* Dark Gradient Overlay for better text readability */}
                        <Box sx={{ 
                          position: 'absolute', inset: 0, 
                          background: `linear-gradient(to top, rgba(1, 4, 9, 1) 10%, ${accent}05 100%)`,
                          zIndex: 2
                        }} />
                      </Box>

                      {/* CARD CONTENT MODULE */}
                      <CardContent sx={{ p: 5, flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 5 }}>
                        {/* Title and technical icon */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                           <Typography variant="h4" sx={{ 
                             fontWeight: 800, color: 'white', fontFamily: 'Outfit', fontSize: '1.8rem', 
                             letterSpacing: 0,
                             textShadow: `0 0 15px ${accent}22`
                           }}>
                             {project.name}
                           </Typography>
                           <Box sx={{ p: 1, borderRadius: '50%', border: `1px solid ${accent}11`, color: accent }}>
                             <Terminal size={18} />
                           </Box>
                        </Stack>
                        
                        {/* Short project description line */}
                        <Typography variant="body2" sx={{ mb: 5, color: '#94a3b8', lineHeight: 1.9, fontSize: '0.95rem', fontWeight: 500 }}>
                           {project.description[0]}
                        </Typography>

                        {/* List of top 5 technologies used in the project */}
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

                        {/* Button to open the deep-dive analysis modal */}
                        <Box sx={{ mt: 'auto' }}>
                           <Button 
                            fullWidth
                            variant="contained"
                            onClick={() => handleOpen(project)}
                            endIcon={<Activity size={18} />}
                            sx={{ 
                              py: 2, borderRadius: 3, 
                              bgcolor: 'rgba(255,255,255,0.03)', 
                              color: '#cbd5e1',
                              fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.9rem', letterSpacing: 1,
                              border: '1px solid rgba(255,255,255,0.08)',
                              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': { 
                                borderColor: accent, color: '#fff', 
                                bgcolor: `${accent}11`,
                                transform: 'translateY(-2px)'
                              }
                            }}
                           >
                             View Details
                           </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              </Grid>
            );
          })}
        </AnimatePresence>
      </Grid>


      {/* ── INTELLIGENCE ANALYSIS MODAL ── */}
      {/* This dialog provides detailed information about the selected project */}
      <Dialog 
        open={Boolean(selectedProject)} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        fullScreen={fullScreen}
        PaperProps={{ 
          sx: { 
            bgcolor: 'background.default', 
            backgroundImage: 'none',
            border: fullScreen ? 'none' : '1px solid rgba(51, 204, 255, 0.1)',
            borderRadius: fullScreen ? 0 : 5,
            overflow: 'hidden',
            p: { xs: 1, sm: 1.5, md: 2.5 },
            maxHeight: { xs: '100dvh', md: '85vh' },
            height: { xs: '100dvh', md: 'auto' },
            m: { xs: 0, md: 2 },
            display: 'flex',
            flexDirection: 'column'
          } 
        }}
      >
        <AnimatePresence mode="wait">
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0 }}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                width: '100%',
                overflow: 'hidden'
              }}
            >
              {/* Modal Header: Project Name and Close Button */}
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: { xs: 1.5, md: 2.5 }, pr: { xs: 1, md: 2 } }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ p: 2, bgcolor: 'rgba(51, 204, 255, 0.1)', borderRadius: 2, color: '#33ccff', boxShadow: '0 0 20px rgba(51, 204, 255, 0.1)' }}>
                    <LayoutDashboard size={28} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#ff3366', fontWeight: 900, fontSize: '0.7rem', display: 'block', letterSpacing: 4, fontFamily: 'monospace' }}>&gt; TECHNICAL_SPECIFICATIONS</Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: -1 }}>{selectedProject.name.toUpperCase()}</Typography>
                  </Box>
                </Stack>
                <IconButton onClick={handleClose} sx={{ color: '#444', '&:hover': { color: '#ff3366' } }}><X size={28} /></IconButton>
              </DialogTitle>

              {/* Navigation Tabs (Overview vs Stack) */}
              <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', px: { xs: 2, md: 4 } }}>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, v) => setActiveTab(v)}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTabs-indicator': { bgcolor: '#33ccff', height: 3, boxShadow: '0 0 15px #33ccff' },
                    '& .MuiTab-root': { 
                      color: '#444', 
                      fontFamily: 'Syncopate', 
                      fontWeight: 900, 
                      fontSize: { xs: '0.6rem', md: '0.75rem' },
                      py: 2,
                      '&.Mui-selected': { color: 'white' }
                    }
                  }}
                >
                  <Tab label="OVERVIEW" icon={<Activity size={16} />} iconPosition="start" />
                  <Tab label="STACK" icon={<Cpu size={16} />} iconPosition="start" />
                </Tabs>
              </Box>

              {/* Modal Body Content */}
              <DialogContent sx={{ px: { xs: 2, md: 4 }, py: 4, overflowY: 'auto', flex: 1 }}>
                <AnimatePresence mode="wait">
                  {/* TAB 1: Logical breakdown and narrative lines */}
                  {activeTab === 0 ? (
                    <motion.div 
                      key="logs" 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'rgba(255,255,255,0.01)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.03)' }}>
                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 900, mb: 4, fontSize: '0.8rem', letterSpacing: 2, fontFamily: 'Syncopate' }}>PROJECT_OVERVIEW</Typography>
                        <Stack spacing={3}>
                          {selectedProject.description.map((line, i) => (
                             <Stack key={i} direction="row" spacing={3}>
                                <Typography sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'monospace' }}>[{i+1}]</Typography>
                                <Typography sx={{ color: '#e2e8f0', fontSize: { xs: '0.85rem', md: '1rem' }, lineHeight: 1.8, fontWeight: 500 }}>{line}</Typography>
                             </Stack>
                          ))}
                        </Stack>
                      </Box>

                      {/* Display extra highlights/features if they exist */}
                      {selectedProject.highlights && (
                         <Box sx={{ mt: 4, p: { xs: 2, md: 4 }, bgcolor: 'rgba(0, 255, 204, 0.01)', borderRadius: 4, border: '1px solid rgba(0, 255, 204, 0.05)' }}>
                            <Typography variant="h3" sx={{ color: '#00ffcc', fontWeight: 900, mb: 3, fontSize: '0.75rem', letterSpacing: 2, fontFamily: 'Syncopate' }}>KEY_HIGHLIGHTS</Typography>
                            <Stack spacing={2}>
                               {selectedProject.highlights.map((h, i) => (
                                 <Stack key={i} direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#00ffcc' }} />
                                    <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500, opacity: 0.8 }}>{h}</Typography>
                                 </Stack>
                               ))}
                            </Stack>
                         </Box>
                      )}
                    </motion.div>
                  ) : (
                    /* TAB 2: Full Technology Stack and Repository Security Status */
                    <motion.div 
                      key="arch" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Stack spacing={4}>
                        {/* Technical Stack Chip cloud */}
                        <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: 'rgba(0, 255, 204, 0.02)', borderRadius: 4, border: '1px solid rgba(0, 255, 204, 0.15)' }}>
                          <Typography variant="h6" sx={{ color: '#00ffcc', fontWeight: 900, mb: 3, fontSize: '0.75rem', letterSpacing: 2, fontFamily: 'Syncopate' }}>TECHNOLOGY_STACK</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                            {selectedProject.technologies.map(t => (
                               <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(0, 255, 204, 0.05)', color: '#00ffcc', fontWeight: 900, borderRadius: 1.5, border: '1px solid rgba(0, 255, 204, 0.2)', fontSize: '0.65rem', fontFamily: 'Syncopate' }} />
                            ))}
                          </Box>
                        </Box>
                        
                        {/* Security and Repository Access Status */}
                        <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: 'rgba(255, 51, 102, 0.02)', borderRadius: 4, border: '1px solid rgba(255, 51, 102, 0.15)' }}>
                          <Typography variant="h6" sx={{ color: '#ff3366', fontWeight: 900, mb: 2.5, fontSize: '0.75rem', letterSpacing: 2, fontFamily: 'Syncopate' }}>ACCESS_CONTROL</Typography>
                          <Stack direction="row" spacing={3} alignItems="center">
                            <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 51, 102, 0.1)', borderRadius: 2, color: '#ff3366' }}>
                               {/* Check if repository is private or open on Github */}
                               {selectedProject.github === '#' ? <Lock size={22} /> : <Github size={22} />}
                            </Box>
                            <Box>
                               <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '0.85rem' }}>{selectedProject.github === '#' ? 'PRIVATE_REPOSITORY' : 'OPEN_SOURCE'}</Typography>
                               <Typography variant="caption" sx={{ color: '#444', fontWeight: 800, fontFamily: 'monospace' }}>SECURITY_STATUS</Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>
                    </motion.div>
                  )}
                </AnimatePresence>
              </DialogContent>

              {/* Modal Footer: Live View Button and Close */}
              <DialogActions sx={{ p: { xs: 2, md: 3.5 }, pt: 2, gap: 2, flexWrap: 'wrap' }}>
                <Button onClick={handleClose} sx={{ color: '#444', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.7rem' }}>CLOSE</Button>
                <Button 
                  variant="contained" 
                  // Open live link in a new tab if it exists
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
                  VIEW_LIVE_PROJECT
                </Button>
              </DialogActions>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>

      {/* Global CSS for specialized animations in this component */}
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
