import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

const Hero = ({ profile }) => {
  return (
    <Box id="hero" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Orbital Gradients */}
      <motion.div
        animate={{ 
          y: [-20, 20, -20],
          x: [-20, 20, -20],
          rotate: [0, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 51, 102, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }}
      />
      <motion.div
        animate={{ 
          y: [20, -20, 20],
          x: [20, -20, 20],
          rotate: [360, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(51, 204, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }}
      />
      <Stack spacing={4} alignItems="center" sx={{ maxWidth: '1200px', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
        >
          <Box sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            background: 'rgba(255, 255, 255, 0.03)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            px: 3, 
            py: 1.5,
            mb: 2,
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}>
            <Sparkles size={16} color="#ff9933" />
            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.95rem' }, letterSpacing: 2, textTransform: 'uppercase' }}>
              Available for Immediate Joining
            </Typography>
          </Box>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.2, delay: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
        >
          <Typography variant="h1" className="hero-gradient-text" sx={{ 
            mb: 1, 
            fontSize: { xs: '3.5rem', md: '7rem', lg: '9rem' },
            lineHeight: 1,
            textShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            {profile.name}
          </Typography>
          <Typography variant="h2" sx={{ 
            color: '#fff', 
            opacity: 0.9, 
            fontWeight: 800, 
            mb: 4,
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2.5rem' },
            letterSpacing: { xs: 1, sm: 2 },
            textTransform: 'uppercase'
          }}>
            The Future of <span style={{ color: '#ff3366' }}>Full Stack</span> Engineering
          </Typography>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Typography variant="body1" sx={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: { xs: '1rem', md: '1.25rem' }, 
            maxWidth: '800px', 
            mx: 'auto', 
            px: { xs: 2, md: 0 },
            lineHeight: 1.8,
            fontWeight: 300
          }}>
            {profile.summary}
          </Typography>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              component={RouterLink} 
              to="/resume" 
              endIcon={<ChevronRight size={20} />}
              sx={{
                background: 'linear-gradient(45deg, #ff3366, #ff9933)',
                color: '#fff',
                px: 5, py: 2,
                fontSize: '1.1rem',
                borderRadius: 50,
                boxShadow: '0 20px 40px rgba(255, 51, 102, 0.4)',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 30px 60px rgba(255, 51, 102, 0.6)' }
              }}
            >
              Enter Portfolio
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              href="#projects" 
              sx={{ 
                borderColor: 'rgba(255,255,255,0.2)', 
                color: '#fff',
                px: 5, py: 2,
                fontSize: '1.1rem',
                borderRadius: 50,
                backdropFilter: 'blur(10px)',
                '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,0.1)' }
              }}
            >
              Explore Architectures
            </Button>
          </Stack>
        </motion.div>
      </Stack>
    </Box>
  );
};

export default Hero;
