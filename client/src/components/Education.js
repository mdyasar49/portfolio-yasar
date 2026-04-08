import React from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const Education = ({ education }) => {
  if (!education || !Array.isArray(education)) return null;

  return (
    <Box id="education" sx={{ py: 10 }}>
      <Typography variant="h2" gutterBottom sx={{ mb: 6 }}>
        Education
      </Typography>

      <Stack spacing={3}>
        {education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Paper className="glass" sx={{ p: 4, display: 'flex', gap: 3, alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.dark', color: 'primary.light' }}>
                <GraduationCap size={32} />
              </Box>
              <Box>
                <Typography variant="h3" color="primary.light">
                  {edu.degree}
                </Typography>
                {edu.institutionUrl ? (
                  <Typography 
                    variant="h6" 
                    component="a" 
                    href={edu.institutionUrl} 
                    target="_blank" 
                    sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
                  >
                    {edu.institution}
                  </Typography>
                ) : (
                  <Typography variant="h6" color="text.primary">
                    {edu.institution}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Graduated: {edu.year}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
};

export default Education;
