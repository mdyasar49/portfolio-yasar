/**
 * [React.js & Material UI - Competency Architecture]
 * Technologies: React.js (Memo), Material UI (Grid, Paper, Stack, Tooltip), Lucide Icons, Framer Motion
 * Purpose: This component visualizes the 'Technical Arsenal' - a categorized breakdown of expertise.
 */
import React, { memo } from 'react';
import { Box, Typography, Grid, Paper, Stack, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { Database, Layout, Terminal, Sparkles, Cpu, Activity } from 'lucide-react';
import TechOrbit from './TechOrbit';

/**
 * SkillCategory Component
 * Specialized sub-component to render an interactive panel for a specific skill vertical.
 */
const SkillCategory = memo(({ title, skills, icon: Icon, delay, color }) => (
  <motion.div
    // initial state for 'entry' animation
    initial={{ opacity: 0, scale: 0.9 }}
    // target state when scrolled into viewport
    whileInView={{ opacity: 1, scale: 1 }}
    // smooth cubic easing transition
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: true }}
    style={{ height: '100%' }}
  >
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        height: '100%', 
        borderRadius: 6, 
        position: 'relative',
        background: 'rgba(2, 6, 23, 0.7)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        overflow: 'hidden',
        // Interactive Hover State Transitions
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          borderColor: color,
          boxShadow: `0 0 40px ${color}22, inset 0 0 20px ${color}11`,
          '& .circuit-bg': { opacity: 0.1 },
          '& .expertise-bar': { width: '100%' }
        }
      }}
    >
      {/* 
        [Aesthetic Layer] 
        Circuit Background Pattern - uses a tiny radial gradient to simulate electronic grid dots.
      */}
      <Box className="circuit-bg" sx={{ 
        position: 'absolute', inset: 0, opacity: 0.02, 
        backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', 
        backgroundSize: '20px 20px', transition: '0.5s opacity' 
      }} />

      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section: Icon & Category Label */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}15`, color: color, display: 'flex' }}>
            <Icon size={32} />
          </Box>
          <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: 1 }}>EXPERT LEVEL</Typography>
        </Box>

        {/* Dynamic Expertise Bar - width grows on container hover */}
        <Box>
          <Typography variant="h3" sx={{ 
            fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Outfit', letterSpacing: 0, color: 'white', mb: 1 
          }}>
            {title}
          </Typography>
          <Box className="expertise-bar" sx={{ height: 2, width: '30%', bgcolor: color, transition: '0.6s width cubic-bezier(0.23, 1, 0.32, 1)', boxShadow: `0 0 10px ${color}` }} />
        </Box>

        {/* Skill Tag Distribution: Iterates through skill arrays */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {skills.map((skill, idx) => (
            <Tooltip key={skill} title="Expert Level Consistently Maintained" arrow placement="top">
              <Box
                sx={{
                  px: 1.8, py: 0.6, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', fontWeight: 500,
                  color: '#cbd5e1', fontFamily: 'Outfit', letterSpacing: 0,
                  transition: '0.3s all', cursor: 'pointer',
                  '&:hover': {
                    color: 'white', borderColor: color, bgcolor: `${color}15`,
                    boxShadow: `0 0 15px ${color}33`, transform: 'translateY(-2px)'
                  }
                }}
              >
                {skill}
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Stack>

      {/* Decorative Neon Pulse - Visual 'Active' heartbeat indicator */}
      <Box sx={{ 
        position: 'absolute', top: 15, right: 15, width: 6, height: 6, 
        borderRadius: '50%', bgcolor: color, animation: 'pulse-neon 2s infinite' 
      }} />
    </Paper>
  </motion.div>
));

/**
 * Skills Component
 * Parent orchestrator for technical skill visualizations and data mapping.
 */
const Skills = memo(({ skills }) => {
  if (!skills) return null;

  // Domain categorization map for the various technical sectors
  const categories = [
    { title: 'Frontend Development', skills: skills.frontend || [], icon: Layout, color: '#3b82f6' },
    { title: 'Backend Engineering', skills: skills.backend || [], icon: Database, color: '#ec4899' },
    { title: 'Database Systems', skills: skills.database || [], icon: Cpu, color: '#10b981' },
    { title: 'DevOps & Tools', skills: skills.tools || [], icon: Terminal, color: '#f59e0b' },
    { title: 'AI & Automation', skills: skills.aiTools || [], icon: Sparkles, color: '#8b5cf6' },
    { title: 'Other Expertise', skills: skills.other || [], icon: Activity, color: '#64748b' },
  ];

  return (
    <Box id="skills" sx={{ py: 15, position: 'relative' }}>
      {/* Global CSS for the custom pulse animation */}
      <style>
        {`
          @keyframes pulse-neon {
            0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0px rgba(255,255,255,0.4); }
            100% { transform: scale(1.5); opacity: 0; box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          }
        `}
      </style>

      {/* Primary Section Branding */}
      <Box sx={{ mb: 10, position: 'relative' }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontFamily: 'Outfit', fontWeight: 800, letterSpacing: -1, mb: 1,
            fontSize: { xs: '1.8rem', md: '3.5rem' }, textAlign: 'center', color: 'white'
          }}
        >
          Technical <Box component="span" sx={{ color: '#6366f1' }}>Expertise</Box>
        </Typography>
        <Typography variant="overline" sx={{ display: 'block', textAlign: 'center', color: '#64748b', fontWeight: 600, letterSpacing: 2 }}>CORE COMPETENCIES</Typography>
        <Box sx={{ width: 60, height: 4, background: 'linear-gradient(90deg, #6366f1, #ec4899)', mx: 'auto', borderRadius: 2, mt: 3 }} />
      </Box>

      {/* Floating Orbital Decoration Component */}
      <TechOrbit />

      {/* Categorized Resource Grid */}
      <Grid container spacing={3}>
        {categories.map((cat, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={cat.title}>
            <SkillCategory {...cat} delay={i * 0.1} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default Skills;
