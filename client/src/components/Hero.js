/**
 * [React.js & Material UI - Frontend Architecture]
 * Technologies: React.js (Hooks, Memo), Material UI (Theming, Responsive Design), Framer Motion (3D Parallax)
 * Purpose: This component serves as the 'Hero' section, the primary visual hook of the portfolio.
 */
import React, { memo, useRef } from 'react';
import { Box, Typography, Button, Stack, Container, useMediaQuery, useTheme } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Terminal, ShieldCheck } from 'lucide-react';

/**
 * Hero Component
 * @param {Object} profile - Essential data object containing 'name' and 'summary'.
 * Uses memoization to prevent unnecessary re-renders during global state updates.
 */
const Hero = memo(({ profile }) => {
  // Reference for the outer container to calculate mouse positions for parallax
  const containerRef = useRef(null);
  const theme = useTheme();
  
  // Media queries to detect mobile devices or browsers with 'reduced motion' enabled
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const disableHeavyMotion = isMobile || prefersReducedMotion;

  // 3D Tilt Parallax State Logic (Framer Motion)
  // useMotionValue tracks the X and Y coordinates without triggering React state re-renders
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // useSpring smooths out the raw mouse movement for a premium, heavy feel
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  // useTransform maps the -0.5 to 0.5 range to rotation degrees for the 3D effect
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  /**
   * handleMouseMove
   * Calculates the mouse's percentage offset from the center of the container.
   * This drives the 3D parallax 'look-at' effect.
   */
  const handleMouseMove = (e) => {
    if (disableHeavyMotion) return; // Skip logic on low-end or high-motion-sensitive devices
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  /**
   * handleMouseLeave
   * Resets the parallax coordinates to 0 so the elements return to their initial flat state.
   */
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Box 
      id="hero" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        perspective: '2000px', // Crucial for establishing the 3D space depth
        bgcolor: 'background.default'
      }}
    >
      {/* 
        [Circuit Watermark Background]
        Uses an inline SVG data URL to create a subtle tech-inspired pattern.
      */}
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L90 10 L90 90 L10 90 Z' fill='none' stroke='%2333ccff' stroke-width='0.5'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%2333ccff'/%3E%3Ccircle cx='90' cy='90' r='2' fill='%23ff3366'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        pointerEvents: 'none',
      }} />

      {/* 
        [Floating Tech Data Strips]
        Standard CSS-only decoration logic: Moving vertical lines that look like a data stream.
      */}
      {[20, 50, 80].map((left, i) => (
        <motion.div
           key={left}
           animate={{ y: ['-100%', '100%'] }}
           transition={{ duration: 15 + i * 5, repeat: Infinity, ease: 'linear' }}
           style={{
             position: 'absolute', left: `${left}%`, top: 0,
             width: '1px', height: '200px',
             background: 'linear-gradient(to bottom, transparent, #33ccff44, transparent)',
             zIndex: 0, opacity: 0.3
           }}
        />
      ))}

      <Container maxWidth="xl" sx={{ zIndex: 1, textAlign: 'center' }}>
        <motion.div
          style={{
            rotateX: disableHeavyMotion ? '0deg' : rotateX,
            rotateY: disableHeavyMotion ? '0deg' : rotateY,
            transformStyle: "preserve-3d" // Allows child elements to exist in the 3D space
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Stack spacing={4} alignItems="center">
            
            {/* [Availability Chip] - Visual indicator of career status */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <Box sx={{ 
                display: 'inline-flex', alignItems: 'center', gap: 2,
                px: 3, py: 1.2, borderRadius: 50,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(0, 255, 204, 0.2)',
                boxShadow: '0 0 20px rgba(0, 255, 204, 0.1)'
              }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00ffcc', animation: 'pulse 1.5s infinite' }} />
                <Typography sx={{ color: '#00ffcc', fontWeight: 900, fontSize: '0.75rem', letterSpacing: 3, fontFamily: 'monospace' }}>
                  Available to join immediately
                </Typography>
              </Box>
            </motion.div>

            {/* [Primary Name Identification] - The core branding of the page */}
            <Box sx={{ position: 'relative' }}>
              <Typography 
                variant="h1" 
                className="hero-gradient-text" 
                sx={{ 
                  fontSize: { xs: '3.5rem', md: '7rem', lg: '9rem' },
                  lineHeight: 0.9, 
                  fontWeight: 900,
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                  position: 'relative',
                  '&::before, &::after': {
                    // Content duplicates the name for the 'glitch' effect layers
                    content: `"${profile.name || 'A. MOHAMED YASAR'}"`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.8,
                  },
                  '&::before': {
                    color: '#ff3366',
                    zIndex: -1,
                    animation: 'glitch 3s infinite linear alternate-reverse',
                  },
                  '&::after': {
                    color: '#33ccff',
                    zIndex: -2,
                    animation: 'glitch 2s infinite linear alternate-reverse',
                  }
                }}
              >
                {/* Fallback ensures name is never blank even if API has issues */}
                {profile.name || "A. MOHAMED YASAR"}
              </Typography>
              
              {/* Floating tech label - aesthetic detail */}
              <Box sx={{ 
                position: 'absolute', top: -10, right: -40, opacity: 0.5,
                display: { xs: 'none', md: 'block' }
              }}>
                <Typography variant="caption" sx={{ color: '#33ccff', fontFamily: 'monospace', fontSize: '0.6rem' }}>[FULL_STACK_ENGINEER]</Typography>
              </Box>
            </Box>

            {/* [Secondary Role Identification] - Supporting tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Typography variant="h2" sx={{ 
                color: 'white', fontWeight: 900, fontFamily: 'Syncopate',
                fontSize: { xs: '1rem', md: '2rem' }, letterSpacing: 5,
                textTransform: 'uppercase', opacity: 0.8
              }}>
                Engaging the <span style={{ color: '#ff3366', textShadow: '0 0 20px #ff3366' }}>Future</span> of Scale
              </Typography>
            </motion.div>

            {/* [Career Narrative Summary] - Brief introduction text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <Typography variant="body1" sx={{ 
                maxWidth: '850px', 
                color: 'text.secondary', 
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.8, 
                fontWeight: 400,
                letterSpacing: '0.01em',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                {profile.summary}
              </Typography>
            </motion.div>

            {/* [CTA - Calls to Action] - Core navigation paths */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                size="large" 
                component={RouterLink} 
                to="/resume" 
                startIcon={<Terminal size={20} />}
                sx={{
                  background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
                  color: 'white', px: 6, py: 2.5,
                  borderRadius: '12px', fontFamily: 'Syncopate', fontWeight: 900,
                  fontSize: '0.85rem', letterSpacing: 2,
                  boxShadow: '0 20px 40px rgba(0, 210, 255, 0.3)',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 25px 50px rgba(0, 210, 255, 0.5)' }
                }}
              >
                VIEW_RESUME
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                href="#projects" 
                startIcon={<ShieldCheck size={20} />}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.1)', color: 'white',
                  px: 5, py: 2.5, borderRadius: '12px',
                  fontFamily: 'Syncopate', fontWeight: 900,
                  fontSize: '0.85rem', letterSpacing: 2,
                  backdropFilter: 'blur(10px)',
                  '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.05)' }
                }}
              >
                VIEW_PORTFOLIO
              </Button>
            </Stack>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
});

export default Hero;
