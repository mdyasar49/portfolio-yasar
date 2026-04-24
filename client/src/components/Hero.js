/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component serves as the 'Hero' section, the primary visual hook of the portfolio.
 * It features a futuristic, 3D parallax effect where the content tilts as you move your mouse.
 * It displays the user's name, professional title, and a brief career summary.
 */

import React, { memo, useRef } from 'react';
// Material UI components for responsive layout and typography
import { Box, Typography, Button, Stack, Container, useMediaQuery, useTheme } from '@mui/material';
// Framer Motion hooks for managing the 3D mouse-tracking animations
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
// React Router link for internal page navigation
import { Link as RouterLink } from 'react-router-dom';
// Icons for a technical aesthetic
import { Terminal, ShieldCheck } from 'lucide-react';

/**
 * [Hero Component]
 * @param {Object} profile - Data object containing 'name' and 'summary' from the backend.
 * Uses 'memo' to optimize performance by only re-rendering if the profile data changes.
 */
const Hero = memo(({ profile }) => {
  // Reference to the main container to detect mouse movement inside it
  const containerRef = useRef(null);
  const theme = useTheme();
  
  // Detect if the user is on a mobile device or has animations disabled in their OS settings
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const disableHeavyMotion = isMobile || prefersReducedMotion;

  // 3D Tilt Parallax Logic using Framer Motion
  // These 'Motion Values' track the X and Y coordinates (from -0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 'useSpring' smooths the movement so the tilt feels natural and premium instead of jittery
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  // 'useTransform' converts the mouse coordinates into rotation degrees (up to 10 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  /**
   * [handleMouseMove]
   * Function purpose: Calculates where the mouse is relative to the center of the hero section.
   */
  const handleMouseMove = (e) => {
    // If animations are disabled, don't calculate anything
    if (disableHeavyMotion) return; 
    if (!containerRef.current) return;
    // Get the exact dimensions and position of the hero section on the screen
    const rect = containerRef.current.getBoundingClientRect();
    // Calculate the mouse position as a percentage from the center (-0.5 to 0.5)
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    // Update the motion values
    x.set(xPct);
    y.set(yPct);
  };

  /**
   * [handleMouseLeave]
   * Function purpose: Resets the tilt back to zero when the mouse leaves the area.
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
        // 'perspective' is needed to make the 3D tilt look deep and realistic
        perspective: '2000px', 
        bgcolor: 'background.default'
      }}
    >
      {/* Background Circuit Pattern Overlay */}
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.1,
        // Uses a subtle technical drawing pattern
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L90 10 L90 90 L10 90 Z' fill='none' stroke='%2333ccff' stroke-width='0.5'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%2333ccff'/%3E%3Ccircle cx='90' cy='90' r='2' fill='%23ff3366'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        pointerEvents: 'none',
      }} />

      {/* Floating Vertical Data Stream Lines */}
      {[20, 50, 80].map((left, i) => (
        <motion.div
           key={left}
           // Animates the lines sliding from top to bottom infinitely
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
        {/* This motion.div handles the actual 3D tilting effect */}
        <motion.div
          style={{
            // Apply rotation based on mouse movement (unless heavy motion is disabled)
            rotateX: disableHeavyMotion ? '0deg' : rotateX,
            rotateY: disableHeavyMotion ? '0deg' : rotateY,
            // 'preserve-3d' ensures the text inside also looks 3D
            transformStyle: "preserve-3d" 
          }}
          // Initial fade-in and scale-up animation when the site loads
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Stack spacing={4} alignItems="center">
            
            {/* Availability Badge (Top Chip) */}
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
                {/* Green pulsating dot for "Live" status */}
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00ffcc', animation: 'pulse 1.5s infinite' }} />
                <Typography sx={{ color: '#00ffcc', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1, fontFamily: 'Outfit' }}>
                  Available to join immediately
                </Typography>
              </Box>
            </motion.div>

            {/* Main Name Heading */}
            <Box sx={{ position: 'relative' }}>
                <Typography 
                  variant="h1" 
                  className="hero-gradient-text" // Specialized CSS class for the text gradient
                  sx={{ 
                    fontSize: { xs: '2rem', sm: '3.5rem', md: '5.5rem', lg: '7.5rem' },
                    lineHeight: 0.9, 
                    fontWeight: 900,
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                    position: 'relative'
                }}
              >
                {/* Display name from profile, or a fallback if API is slow */}
                {profile.name || "A. MOHAMED YASAR"}
              </Typography>
              
              {/* Floating technical tag next to the name */}
              <Box sx={{ 
                position: 'absolute', top: -10, right: -40, opacity: 0.5,
                display: { xs: 'none', md: 'block' }
              }}>
                <Typography variant="caption" sx={{ color: '#33ccff', fontFamily: 'monospace', fontSize: '0.6rem' }}>[FULL_STACK_ENGINEER]</Typography>
              </Box>
            </Box>

            {/* Secondary Tagline with glow effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Typography variant="h2" sx={{ 
                color: 'white', fontWeight: 600, fontFamily: 'Outfit',
                fontSize: { xs: '1.2rem', md: '2.5rem' }, letterSpacing: 2,
                opacity: 0.9
              }}>
                Engaging the <span style={{ color: '#ff3366', textShadow: '0 0 20px #ff3366' }}>Future</span> of Scale
              </Typography>
            </motion.div>

            {/* Short Profile Summary Text */}
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

            {/* Call-to-Action Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 2 }}>
              {/* Main Button: Link to the Resume page */}
              <Button 
                variant="contained" 
                size="large" 
                component={RouterLink} 
                to="/resume" 
                startIcon={<Terminal size={20} />}
                className="kinetic-button" // Specialized hover animation class
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                  color: 'white', px: 6, py: 2.5,
                  borderRadius: '16px', fontFamily: 'Outfit', fontWeight: 700,
                  fontSize: '1rem', letterSpacing: 1,
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 25px 50px rgba(236, 72, 153, 0.5)' }
                }}
              >
                VIEW_RESUME
              </Button>
              {/* Secondary Button: Anchor link to the Projects section */}
              <Button 
                variant="outlined" 
                size="large" 
                href="#projects" 
                startIcon={<ShieldCheck size={20} />}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.1)', color: 'white',
                  px: 5, py: 2.5, borderRadius: '16px',
                  fontFamily: 'Outfit', fontWeight: 700,
                  fontSize: '1rem', letterSpacing: 1,
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }
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
