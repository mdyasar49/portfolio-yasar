/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component visualizes the 'Technical Arsenal' - a categorized breakdown of expertise.
 * It uses Material UI cards and Lucide icons to display Frontend, Backend, Database,
 * DevOps, and AI skills with a futuristic neon-pulse aesthetic.
 */

import React, { memo } from 'react';
// Material UI components for grid layout, card paper, and tooltips
import { Box, Typography, Grid, Paper, Stack, Tooltip } from '@mui/material';
// Framer Motion for entrance animations
import { motion } from 'framer-motion';
// Icons representing different technical domains
import { Database, Layout, Terminal, Sparkles, Cpu, Activity } from 'lucide-react';
// A background decorative component with floating orbital elements
import TechOrbit from './TechOrbit';

/**
 * [SkillCategory Component]
 * Function purpose: Renders an individual category card (e.g., Frontend) with a list of skill tags.
 */
const SkillCategory = memo(({ title, skills, icon: Icon, delay, color }) => (
  <motion.div
    // Entrance animation settings
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
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
        backdropFilter: 'blur(12px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        overflow: 'hidden',
        // Visual changes when the user hovers over a category
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          borderColor: color,
          boxShadow: `0 0 40px ${color}22, inset 0 0 20px ${color}11`,
          // Make the background circuit more visible on hover
          '& .circuit-bg': { opacity: 0.15 },
          // Fill the expertise progress bar to 100% on hover
          '& .expertise-bar': { width: '100%' },
        },
      }}
    >
      {/*
        Background Aesthetic Layer:
        A tiny dotted circuit pattern that appears when you hover over the card.
      */}
      <Box
        className="circuit-bg"
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '15px 15px',
          transition: '0.5s opacity',
        }}
      />

      {/* Decorative Gradient Glow */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Category Header: Icon and "Expert Level" tag */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: `${color}15`,
              color: color,
              display: 'flex',
              boxShadow: `0 0 20px ${color}22`,
            }}
          >
            <Icon size={32} />
          </Box>
          <Typography
            variant="overline"
            sx={{
              color: '#64748b',
              fontWeight: 900,
              letterSpacing: 2,
              fontFamily: 'Syncopate',
              fontSize: '0.55rem',
            }}
          >
            LVL_EXPERT
          </Typography>
        </Box>

        {/* Category Title and animated line indicator */}
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: '1.2rem',
              fontWeight: 800,
              fontFamily: 'Outfit',
              letterSpacing: -0.5,
              color: 'white',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Box
            className="expertise-bar"
            sx={{
              height: 3,
              width: '30%',
              bgcolor: color,
              transition: '0.8s width cubic-bezier(0.23, 1, 0.32, 1)',
              borderRadius: 4,
              boxShadow: `0 0 15px ${color}`,
            }}
          />
        </Box>

        {/* List of Skills tags inside the category */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {skills.map((skill, idx) => {
            // Generate a deterministic but random-looking mastery percentage
            const mastery = 85 + (skill.length % 14);
            return (
              <Tooltip
                key={skill}
                title={`Mastery Level: ${mastery}% - Production Validated`}
                arrow
                placement="top"
              >
                <Box
                  sx={{
                    px: 1.8,
                    py: 0.8,
                    borderRadius: '10px',
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#cbd5e1',
                    fontFamily: 'Outfit',
                    letterSpacing: 0,
                    transition: '0.3s all',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    // Highlight individual skill on hover
                    '&:hover': {
                      color: 'white',
                      borderColor: color,
                      bgcolor: `${color}15`,
                      boxShadow: `0 0 20px ${color}33`,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{skill}</Typography>
                  <Typography
                    sx={{ color: color, fontSize: '0.65rem', fontWeight: 900, opacity: 0.7 }}
                  >
                    {mastery}%
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Stack>

      {/* Pulsing neon dot in the corner to represent a "live" heartbeat */}
      <Box
        sx={{
          position: 'absolute',
          top: 15,
          right: 15,
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: color,
          animation: 'pulse-neon 2.2s infinite',
        }}
      />
    </Paper>
  </motion.div>
));

/**
 * [Skills Component] (Main Parent)
 * Function purpose: Orchestrates the display of all technical skill categories.
 */
const Skills = memo(({ skills }) => {
  // If data hasn't arrived from the backend yet, don't render
  if (!skills) return null;

  // Define the map of categories, associating specific skill arrays with colors and icons
  const categories = [
    {
      title: 'Frontend Development',
      skills: skills.frontend || [],
      icon: Layout,
      color: '#3b82f6',
    },
    {
      title: 'Backend Engineering',
      skills: skills.backend || [],
      icon: Database,
      color: '#ec4899',
    },
    { title: 'Database Systems', skills: skills.database || [], icon: Cpu, color: '#10b981' },
    { title: 'DevOps & Tools', skills: skills.tools || [], icon: Terminal, color: '#f59e0b' },
    { title: 'AI & Automation', skills: skills.aiTools || [], icon: Sparkles, color: '#8b5cf6' },
    { title: 'Other Expertise', skills: skills.other || [], icon: Activity, color: '#64748b' },
  ];

  return (
    <Box id="skills" sx={{ py: 15, position: 'relative' }}>
      {/* Define the 'pulse-neon' keyframe animation globally for the heartbeat dots */}
      <style>
        {`
          @keyframes pulse-neon {
            0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0px rgba(255,255,255,0.4); }
            100% { transform: scale(1.8); opacity: 0; box-shadow: 0 0 0 15px rgba(255,255,255,0); }
          }
        `}
      </style>

      {/* Main Section Header: Technical Audit HUD */}
      <Box sx={{ mb: 12, textAlign: 'center' }}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box
            sx={{
              p: 1.5,
              bgcolor: 'rgba(51, 204, 255, 0.1)',
              borderRadius: 2.5,
              color: '#33ccff',
              boxShadow: '0 0 20px rgba(51, 204, 255, 0.1)',
            }}
          >
            <Activity size={28} />
          </Box>
          <Typography
            variant="overline"
            sx={{
              color: '#00ffcc',
              fontWeight: 900,
              letterSpacing: 8,
              fontFamily: 'Syncopate',
              fontSize: '0.75rem',
            }}
          >
            TECHNICAL_STACK_AUDIT
          </Typography>
        </Stack>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Syncopate',
            fontWeight: 900,
            letterSpacing: -3,
            mb: 2,
            fontSize: { xs: '2.5rem', md: '5.5rem' },
            color: 'white',
            textShadow: '0 0 50px rgba(255,255,255,0.05)',
          }}
        >
          CORE{' '}
          <span style={{ color: '#6366f1', textShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}>
            ARSENAL
          </span>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#94a3b8',
            maxWidth: 800,
            mx: 'auto',
            fontSize: '1.25rem',
            lineHeight: 1.8,
            fontWeight: 400,
          }}
        >
          Validated expertise across modern software lifecycles—from high-performance frontends to
          resilient distributed backends.
        </Typography>
      </Box>

      {/* Background decoration component with floating icons */}
      <TechOrbit />

      {/* Responsive Grid layout for categories (5 cards per row on large screens) */}
      <Grid container spacing={4}>
        {categories.map((cat, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={cat.title}>
            {/* Pass category data and an incremental animation delay to children */}
            <SkillCategory {...cat} delay={i * 0.1} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default Skills;
