import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SEO from '../components/SEO';

const Resume = () => {
  // 3D Parallax Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Box 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#020617',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1500px',
        p: { xs: 2, sm: 4, md: 6 }
      }}
    >
      <SEO title="Professional Resume" description="High-end professional resume of A. Mohamed Yasar" />
      <Box sx={{
        position: 'fixed',
        top: '-10%',
        left: '-10%',
        width: '120vw',
        height: '120vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'float 20s infinite alternate'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 15s infinite alternate-reverse'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.9) 0%, transparent 100%)',
        }} />
      </Box>

      {/* 3D Tilted Resume Frame */}
      <motion.div
        style={{ 
          rotateX, 
          rotateY, 
          zIndex: 10,
          transformStyle: "preserve-3d",
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Box sx={{ 
          width: { xs: '95vw', sm: '85vw', md: '210mm' }, 
          height: { xs: '80vh', sm: '85vh', md: '297mm' }, 
          backgroundColor: 'white',
          borderRadius: 2,
          position: 'relative',
          boxShadow: '0 50px 100px rgba(0,0,0,0.8), 0 0 50px rgba(99, 102, 241, 0.15)',
          overflow: 'hidden',
          // Holographic Border Glow
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: -2,
            background: 'linear-gradient(45deg, transparent, rgba(99, 102, 241, 0.2), transparent, rgba(236, 72, 153, 0.2), transparent)',
            borderRadius: 'inherit',
            zIndex: -1,
            opacity: 0.5
          }
        }}>
          <iframe 
             src="/resume-design.html" 
             title="Luxury Professional Resume"
             width="100%"
             height="100%"
             style={{ border: 'none' }}
          />
        </Box>
      </motion.div>

      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0); }
            100% { transform: translate(30px, 40px); }
          }
          /* Custom Scrollbar for the preview */
          iframe::-webkit-scrollbar { width: 6px; }
          iframe::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        `}
      </style>
    </Box>
  );
};

export default Resume;
