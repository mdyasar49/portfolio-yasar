/**
 * Dedicated Projects & Case Studies Showcase Page.
 * Features category filtering, live demo links, source code, and key metrics.
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ArrowUpRight, X, ExternalLink, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const CATEGORIES = ['All', 'MERN & React', 'AI & Telephony', 'Automation', 'Corporate Portals'];

const ProjectsPage = ({ profile }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState(null);

  const filteredProjects = useMemo(() => {
    const list = profile?.projects || [];
    if (selectedCategory === 'All') return list;
    return list.filter(
      (p) => p.category === selectedCategory || p.type?.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [profile?.projects, selectedCategory]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 12, md: 16 } }}>
      <SEO
        title="Projects & Case Studies"
        description="Explore production-grade MERN web applications, real-time AI Voice portals, Twilio dialers, and automated scrapers engineered by A. Mohamed Yasar."
      />

      <Container maxWidth="xl" sx={{ pb: 8 }}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
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
              ENGINEERING PORTFOLIO
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
              Featured Case Studies &{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #f97316, #e11d48)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Live Systems
              </Box>
            </Typography>
            <Typography
              sx={{
                color: '#94a3b8',
                fontSize: { xs: '1.05rem', md: '1.3rem' },
                maxWidth: 750,
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              Production platforms operating in high-concurrency enterprise environments, media streaming, and client lead generation.
            </Typography>
          </motion.div>
        </Box>

        {/* Filter Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6, flexWrap: 'wrap', gap: 1.5 }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '100px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontFamily: 'Outfit',
                  bgcolor: isSelected ? '#e11d48' : 'rgba(255,255,255,0.03)',
                  color: isSelected ? 'white' : '#94a3b8',
                  border: isSelected
                    ? '1px solid #e11d48'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isSelected ? '0 8px 20px rgba(225, 29, 72, 0.35)' : 'none',
                  transition: '0.25s ease',
                  '&:hover': {
                    bgcolor: isSelected ? '#f97316' : 'rgba(255,255,255,0.08)',
                    color: 'white',
                  },
                }}
              >
                {cat}
              </Button>
            );
          })}
        </Box>

        {/* Projects Grid */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <Grid item xs={12} md={6} lg={4} key={project.name || index}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    className="glass-card"
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        borderColor: '#e11d48',
                        boxShadow: '0 20px 45px rgba(225, 29, 72, 0.18)',
                      },
                    }}
                    onClick={() => setActiveProject(project)}
                  >
                    {/* Project Image */}
                    <Box sx={{ position: 'relative', height: 230, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={project.image}
                        alt={project.name}
                        loading="lazy"
                        decoding="async"
                        sx={{
                          height: '100%',
                          objectFit: 'cover',
                          transition: '0.6s ease',
                          '.glass-card:hover &': {
                            transform: 'scale(1.08)',
                          },
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(3,7,18,0.9) 0%, transparent 80%)',
                        }}
                      />
                      {project.type && (
                        <Chip
                          label={project.type}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 14,
                            left: 14,
                            bgcolor: 'rgba(3,7,18,0.85)',
                            backdropFilter: 'blur(8px)',
                            color: '#f97316',
                            border: '1px solid rgba(249,115,22,0.3)',
                            fontWeight: 800,
                            fontSize: '0.65rem',
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 14,
                          right: 14,
                          p: 1,
                          borderRadius: '50%',
                          bgcolor: 'rgba(3,7,18,0.8)',
                          color: 'white',
                          display: 'flex',
                        }}
                      >
                        <ArrowUpRight size={16} />
                      </Box>
                    </Box>

                    {/* Card Content */}
                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 900,
                          color: 'white',
                          fontFamily: 'Outfit',
                          fontSize: '1.25rem',
                          mb: 1.5,
                          lineHeight: 1.3,
                        }}
                      >
                        {project.name}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#94a3b8',
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          mb: 3,
                          flexGrow: 1,
                        }}
                      >
                        {Array.isArray(project.description) ? project.description[0] : project.description}
                      </Typography>

                      {/* Tech Chips */}
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.8} sx={{ mb: 2.5 }}>
                        {project.technologies?.slice(0, 4).map((tech, i) => (
                          <Chip
                            key={i}
                            label={tech}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.03)',
                              color: '#cbd5e1',
                              border: '1px solid rgba(255,255,255,0.06)',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                            }}
                          />
                        ))}
                      </Stack>

                      {/* Stats Preview */}
                      {project.stats && (
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: '10px',
                            bgcolor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.04)',
                            display: 'flex',
                            justifyContent: 'space-around',
                          }}
                        >
                          {Object.entries(project.stats).slice(0, 2).map(([key, val]) => (
                            <Box key={key} sx={{ textAlign: 'center' }}>
                              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>
                                {key}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: '#f97316', fontSize: '0.8rem' }}>
                                {val}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>

      {/* Project Details Modal */}
      {activeProject && (
        <Dialog
          open={!!activeProject}
          onClose={() => setActiveProject(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'rgba(7, 10, 19, 0.98)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(225, 29, 72, 0.3)',
              borderRadius: '20px',
              color: 'white',
            },
          }}
        >
          <Box sx={{ position: 'relative', height: 280, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              image={activeProject.image}
              alt={activeProject.name}
              sx={{ height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7, 10, 19, 1) 0%, transparent 80%)',
              }}
            />
            <IconButton
              onClick={() => setActiveProject(null)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'white',
                '&:hover': { bgcolor: '#e11d48' },
              }}
            >
              <X size={20} />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: { xs: 3, md: 4 }, pt: 0 }}>
            <Typography
              variant="overline"
              sx={{ color: '#f97316', fontWeight: 800, letterSpacing: 2, display: 'block' }}
            >
              {activeProject.type || 'FULL STACK ARCHITECTURE'}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, color: 'white', fontFamily: 'Outfit', mb: 2 }}
            >
              {activeProject.name}
            </Typography>

            <Typography sx={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.8, mb: 3 }}>
              {Array.isArray(activeProject.description)
                ? activeProject.description.join(' ')
                : activeProject.description}
            </Typography>

            {/* Highlights */}
            {activeProject.highlights && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 1 }}>
                  CORE HIGHLIGHTS & ARCHITECTURE
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {activeProject.highlights.map((h, i) => (
                    <Typography key={i} sx={{ color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Sparkles size={14} color="#f97316" /> {h}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Tech Stack */}
            <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 1 }}>
              TECHNOLOGIES USED
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mt: 1, mb: 4 }}>
              {activeProject.technologies?.map((tech, i) => (
                <Chip
                  key={i}
                  label={tech}
                  sx={{
                    bgcolor: 'rgba(225, 29, 72, 0.12)',
                    color: 'white',
                    border: '1px solid rgba(225, 29, 72, 0.3)',
                    fontWeight: 700,
                  }}
                />
              ))}
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
              {activeProject.link && activeProject.link !== '#' && (
                <Button
                  variant="contained"
                  href={activeProject.link}
                  target="_blank"
                  startIcon={<ExternalLink size={16} />}
                  sx={{
                    bgcolor: '#e11d48',
                    color: 'white',
                    fontWeight: 800,
                    borderRadius: '10px',
                    px: 3,
                    '&:hover': { bgcolor: '#f97316' },
                  }}
                >
                  Visit Live Application
                </Button>
              )}
              {activeProject.github && activeProject.github !== '#' && (
                <Button
                  variant="outlined"
                  href={activeProject.github}
                  target="_blank"
                  startIcon={<Github size={16} />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 800,
                    borderRadius: '10px',
                    px: 3,
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  View GitHub Source
                </Button>
              )}
            </Stack>
          </DialogContent>
        </Dialog>
      )}

      {/* Global Footer */}
      <Footer profile={profile} />
    </Box>
  );
};

export default ProjectsPage;
