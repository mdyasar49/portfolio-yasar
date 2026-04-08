import { Box, Typography, Button, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = ({ profile }) => {
  return (
    <Box id="hero" sx={{ 
      minHeight: '90vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative'
    }}>
      <Stack spacing={4} alignItems="center" sx={{ maxWidth: '1000px' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8 }}
        >
          <Chip 
            label="Immediate Joiner" 
            sx={{ 
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.light',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              fontWeight: 700,
              fontSize: '0.9rem',
              py: 2,
              px: 1,
              mb: 3
            }} 
            variant="outlined" 
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h1" className="hero-gradient-text" sx={{ mb: 2 }}>
            {profile.name}
          </Typography>
          <Typography variant="h2" sx={{ color: 'text.primary', opacity: 0.9, fontWeight: 600, mb: 3 }}>
            Crafting Digital Excellence through Code
          </Typography>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.25rem', maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
            {profile.summary}
          </Typography>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              size="large" 
              component={RouterLink} 
              to="/resume" 
              endIcon={<ChevronRight size={20} />}
            >
              View Full Portfolio
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              href="#projects" 
              sx={{ borderColor: 'rgba(255,255,255,0.1)', color: 'text.primary' }}
            >
              Explore My Work
            </Button>
          </Stack>
        </motion.div>

        {/* Dynamic Skill Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ marginTop: '60px' }}
        >
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={3}>
            {['React.js', 'Node.js', 'Spring Boot', 'SQL'].map((tech) => (
              <Typography key={tech} variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 2 }}>
                {tech}
              </Typography>
            ))}
          </Stack>
        </motion.div>
      </Stack>
    </Box>
  );
};

export default Hero;
