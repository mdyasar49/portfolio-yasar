import React from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Code2, Database, Layout, Terminal } from 'lucide-react';

const SkillCategory = ({ title, skills, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    <Paper className="glass" sx={{ p: 4, height: '100%', borderRadius: 6, transition: '0.4s all' }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.light' }}>
          <Icon size={24} />
        </Box>
        <Typography variant="h3" sx={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</Typography>
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {skills.map((skill) => (
          <Box
            key={skill}
            sx={{
              px: 2,
              py: 0.8,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.9rem',
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.light',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                bgcolor: 'rgba(99, 102, 241, 0.05)'
              }
            }}
          >
            {skill}
          </Box>
        ))}
      </Box>
    </Paper>
  </motion.div>
);

const Skills = ({ skills }) => {
  const categories = [
    { title: 'Frontend Mastery', skills: skills.frontend, icon: Layout },
    { title: 'Backend Logic', skills: skills.backend, icon: Database },
    { title: 'Data Architecture', skills: skills.database, icon: Code2 },
    { title: 'DevOps & Tools', skills: skills.tools, icon: Terminal },
  ];

  return (
    <Box id="skills" sx={{ py: 15 }}>
      <Typography variant="h2" gutterBottom sx={{ mb: 8, textAlign: 'center' }}>
        Technical <Box component="span" sx={{ color: 'primary.light' }}>Arsenal</Box>
      </Typography>
      <Grid container spacing={4}>
        {categories.map((cat, i) => (
          <Grid item xs={12} sm={6} md={3} key={cat.title}>
            <SkillCategory {...cat} delay={i * 0.1} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Skills;
