import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { motion } from 'framer-motion';

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const orbit = keyframes`
  from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
`;

const TechOrbit = () => {
  const technologies = [
    { name: 'React', color: '#61dafb' },
    { name: 'Node.js', color: '#68a063' },
    { name: 'MongoDB', color: '#47a248' },
    { name: 'Express', color: '#ffffff' },
    { name: 'Redux', color: '#764abc' },
    { name: 'Python', color: '#3776ab' },
    { name: 'Java', color: '#007396' },
    { name: 'SQL', color: '#00758f' }
  ];

  return (
    <Box sx={{ 
      position: 'relative', 
      height: 400, 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      perspective: '1000px',
      mb: 10,
      overflow: 'hidden'
    }}>
      {/* Central Core */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 360],
          boxShadow: [
            '0 0 20px rgba(51, 204, 255, 0.2)',
            '0 0 60px rgba(51, 204, 255, 0.5)',
            '0 0 20px rgba(51, 204, 255, 0.2)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #33ccff, #007396)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(255,255,255,0.2)'
        }}
      >
        <Typography sx={{ fontWeight: 900, color: 'white', fontSize: '0.8rem', fontFamily: 'Syncopate' }}>CORE</Typography>
      </motion.div>

      {/* Orbiting Tech Rings */}
      <Box sx={{ 
        position: 'absolute', 
        width: 300, 
        height: 300, 
        borderRadius: '50%', 
        border: '1px dashed rgba(51, 204, 255, 0.1)',
        animation: `${float} 6s ease-in-out infinite`
      }} />
      <Box sx={{ 
        position: 'absolute', 
        width: 450, 
        height: 450, 
        borderRadius: '50%', 
        border: '1px dashed rgba(255, 51, 102, 0.05)',
        animation: `${float} 8s ease-in-out infinite reverse`
      }} />

      {technologies.map((tech, i) => {
        const delay = i * 0.5;
        
        return (
          <Box
            key={tech.name}
            sx={{
              position: 'absolute',
              animation: `${orbit} ${20 + i * 2}s linear infinite`,
              animationDelay: `-${delay}s`,
              zIndex: 5
            }}
          >
            <motion.div
              whileHover={{ scale: 1.5, zIndex: 20 }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: 'rgba(2, 6, 23, 0.8)',
                backdropFilter: 'blur(5px)',
                border: `1px solid ${tech.color}44`,
                boxShadow: `0 0 15px ${tech.color}22`,
                color: tech.color,
                fontWeight: 900,
                fontSize: '0.7rem',
                fontFamily: 'Syncopate',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {tech.name.toUpperCase()}
            </motion.div>
          </Box>
        );
      })}

      {/* Background Particles/Nodes */}
      <Box sx={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: 2,
              height: 2,
              bgcolor: i % 2 === 0 ? '#33ccff' : '#ff3366',
              borderRadius: '50%',
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#33ccff' : '#ff3366'}`,
              animation: `${float} ${3 + Math.random() * 5}s ease-in-out infinite`
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TechOrbit;
