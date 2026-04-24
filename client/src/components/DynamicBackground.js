import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';


const DynamicBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const isMobile = window.innerWidth < 900;
    const particleCount = isMobile ? 15 : 55; // Significantly reduce overhead on mobile
    const connectionDistance = isMobile ? 80 : 140;
    let mouse = { x: null, y: null };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };


    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = Math.random() > 0.5 ? '#33ccff' : '#ff3366';
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Mouse avoidance but subtle
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = particles[i].color;
            ctx.lineWidth = 0.2;
            ctx.globalAlpha = 1 - (distance / connectionDistance);
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    resizeCanvas();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, #0a0a14 0%, #010409 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          opacity: 0.6,
        }}
      />
      {/* Organic Quantum Aurora Layer */}
      <Box sx={{
        position: 'absolute', inset: 0,
        zIndex: -2,
        opacity: 0.4,
        filter: 'blur(100px)',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <motion.div
            animate={{ 
                x: [0, 100, -100, 0],
                y: [0, -100, 100, 0],
                scale: [1, 1.2, 0.9, 1]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%',
                background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
            }}
        />
        <motion.div
            animate={{ 
                x: [0, -150, 150, 0],
                y: [0, 100, -100, 0],
                scale: [1, 0.8, 1.3, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '70%', height: '70%',
                background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
            }}
        />
        <motion.div
            animate={{ 
                opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{
                position: 'absolute', top: '20%', left: '30%', width: '40%', height: '40%',
                background: 'radial-gradient(circle, #00ffcc 0%, transparent 70%)',
            }}
        />
      </Box>

      {/* Floating Data Stream Particles (Subtle) */}
      {[...Array(10)].map((_, i) => (
        <motion.div
            key={i}
            initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0
            }}
            animate={{ 
                y: [null, Math.random() * -500],
                opacity: [0, 0.2, 0]
            }}
            transition={{ 
                duration: 20 + Math.random() * 20, 
                repeat: Infinity, 
                ease: "linear" 
            }}
            style={{
                position: 'absolute',
                color: '#33ccff',
                fontFamily: 'monospace',
                fontSize: '0.6rem',
                pointerEvents: 'none',
                zIndex: -1
            }}
        >
            {Math.random().toString(16).toUpperCase().slice(2, 10)}
        </motion.div>
      ))}

    </Box>
  );
};

export default DynamicBackground;
