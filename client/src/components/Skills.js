import React from 'react';
import { Box, Typography, Grid, Paper, Stack, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { Database, Layout, Terminal, Sparkles, Cpu } from 'lucide-react';

const SkillCategory = ({ title, skills, icon: Icon, delay, color }) => (
  <motion.div
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
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          borderColor: color,
          boxShadow: `0 0 40px ${color}22, inset 0 0 20px ${color}11`,
          '& .circuit-bg': { opacity: 0.1 },
          '& .expertise-bar': { width: '100%' }
        }
      }}
    >
      {/* Circuit Background Pattern */}
      <Box className="circuit-bg" sx={{ 
        position: 'absolute', inset: 0, opacity: 0.02, 
        backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', 
        backgroundSize: '20px 20px', transition: '0.5s opacity' 
      }} />

      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}15`, color: color, display: 'flex' }}>
            <Icon size={32} />
          </Box>
          <Typography variant="overline" sx={{ color: '#444', fontWeight: 900, letterSpacing: 1 }}>TECH_OS</Typography>
        </Box>

        <Box>
          <Typography variant="h3" sx={{ 
            fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: 1, color: 'white', mb: 1 
          }}>
            {title}
          </Typography>
          <Box className="expertise-bar" sx={{ height: 2, width: '30%', bgcolor: color, transition: '0.6s width cubic-bezier(0.23, 1, 0.32, 1)', boxShadow: `0 0 10px ${color}` }} />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {skills.map((skill, idx) => (
            <Tooltip key={skill} title="Expert Level Consistently Maintained" arrow placement="top">
              <Box
                sx={{
                  px: 1.8, py: 0.6, borderRadius: '4px', bgcolor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 900,
                  color: 'rgba(0,255,204,0.6)', fontFamily: 'monospace', letterSpacing: 1,
                  transition: '0.3s all', cursor: 'crosshair',
                  '&:hover': {
                    color: 'white', borderColor: color, bgcolor: `${color}20`,
                    boxShadow: `0 0 15px ${color}44`, transform: 'skewX(-5deg)'
                  }
                }}
              >
                {skill.toUpperCase()}
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Stack>

      {/* Pulsing Corner Indicator */}
      <Box sx={{ 
        position: 'absolute', top: 15, right: 15, width: 6, height: 6, 
        borderRadius: '50%', bgcolor: color, animation: 'pulse-neon 2s infinite' 
      }} />
    </Paper>
  </motion.div>
);

const Skills = ({ skills }) => {
  if (!skills) return null;

  const categories = [
    { title: 'FRONTEND ARCH', skills: skills.frontend || [], icon: Layout, color: '#33ccff' },
    { title: 'BACKEND CORE', skills: skills.backend || [], icon: Database, color: '#ff3366' },
    { title: 'DATA SYSTEMS', skills: skills.database || [], icon: Cpu, color: '#00ffcc' },
    { title: 'DEV PIPELINES', skills: skills.tools || [], icon: Terminal, color: '#ff9933' },
    { title: 'AI PROTOCOLS', skills: skills.aiTools || [], icon: Sparkles, color: '#a855f7' },
  ];

  return (
    <Box id="skills" sx={{ py: 15, position: 'relative' }}>
      <style>
        {`
          @keyframes pulse-neon {
            0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0px rgba(255,255,255,0.4); }
            100% { transform: scale(1.5); opacity: 0; box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          }
        `}
      </style>

      <Box sx={{ mb: 10, position: 'relative' }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontFamily: 'Syncopate', fontWeight: 900, letterSpacing: 4, mb: 1,
            fontSize: { xs: '1.8rem', md: '3.5rem' }, textAlign: 'center', color: 'white'
          }}
        >
          TECHNICAL <Box component="span" sx={{ color: '#ff3366' }}>ARSENAL</Box>
        </Typography>
        <Typography variant="overline" sx={{ display: 'block', textAlign: 'center', color: '#444', fontWeight: 900, letterSpacing: 6 }}>SYSTEM_SPEC_V2.0</Typography>
        <Box sx={{ width: 100, height: 4, background: 'linear-gradient(90deg, #ff3366, #ff9933)', mx: 'auto', borderRadius: 2, mt: 3 }} />
      </Box>

      <Grid container spacing={3}>
        {categories.map((cat, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={cat.title}>
            <SkillCategory {...cat} delay={i * 0.1} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Skills;
