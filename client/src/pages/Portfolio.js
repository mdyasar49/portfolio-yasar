/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component is the primary Page Assembler (The Home Page). 
 * It orchestrates all the individual sections of the portfolio (Hero, About, Projects, etc.) 
 * and initializes global decorative effects like the particle background and scanning light.
 */

import React, { memo } from 'react';
// Material UI components for global layout and loading state
import { Box, Container, Typography } from '@mui/material';
// SEO component for dynamic meta tags
import SEO from '../components/SEO';
// All page sections (Components)
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import TechnicalInsight from '../components/TechnicalInsight';
import CareerTrajectory from '../components/CareerTrajectory';
import Projects from '../components/Projects';
import ScholasticHistory from '../components/ScholasticHistory';
import ProfessionalDossier from '../components/ProfessionalDossier';
import SystemLogStream from '../components/SystemLogStream';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Portfolio = memo(({ profile, loading }) => {
  // ── [LOADING STATE] ──
  // Displayed while the profile data is being fetched from the backend.
  if (loading && !profile) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default', color: 'white' }}>
       <Typography variant="h6" sx={{ fontFamily: 'Syncopate', fontWeight: 900 }}>LOADING_PROFILE...</Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', scrollBehavior: 'smooth', position: 'relative', overflowX: 'hidden' }}>
      {/* Update browser tab title and description based on fetched profile data */}
      <SEO 
        title="Portfolio" 
        description={profile?.summary || "Full Stack Engineer Portfolio"} 
      />
      
      {/* ── [ATMOSPHERIC PARTICLE BACKGROUND] ── */}
      {/* High-performance canvas-based particle system that floats in the background */}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <canvas id="particle-canvas" style={{ width: '100%', height: '100%', opacity: 0.2 }} />
      </Box>

      {/* ── [GLOBAL SCANNING LIGHT EFFECT] ── */}
      {/* A faint horizontal light beam that moves up and down across the entire site */}
      <Box sx={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: '4px', 
        background: 'linear-gradient(90deg, transparent, rgba(51, 204, 255, 0.4), transparent)', 
        zIndex: 2000, opacity: 0.1, 
        animation: 'scan-optimized 10s linear infinite',
        pointerEvents: 'none',
        willChange: 'transform'
      }} />

      {/* Logic for the background particle animation */}
      <script>
        {`
          (function() {
            const canvas = document.getElementById('particle-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let particles = [];
            
            function resize() {
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;
            }
            
            window.addEventListener('resize', resize);
            resize();
            
            // Individual particle class definition
            class Particle {
              constructor() {
                this.reset();
              }
              reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
              }
              update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
              }
              draw() {
                ctx.fillStyle = '#33ccff';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            
            // Create 50 initial particles
            for(let i=0; i<50; i++) particles.push(new Particle());
            
            // Animation loop
            function animate() {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              particles.forEach(p => { p.update(); p.draw(); });
              requestAnimationFrame(animate);
            }
            animate();
          })();
        `}
      </script>

      {/* Global CSS keyframes for the scanner effect */}
      <style>
        {`
          @keyframes scan-optimized { 
            0% { transform: translateY(-100vh); } 
            100% { transform: translateY(100vh); } 
          }
        `}
      </style>


      {/* ── MAIN CONTENT CONTAINER ── */}
      <Container maxWidth="xl" sx={{ pt: 12, pb: 10 }}>
        {/* Sections are conditionally rendered only if profile data exists */}
        {profile && <Hero profile={profile} />}
        {profile && <About profile={profile} />}
        {profile?.technicalSkills && <Skills skills={profile.technicalSkills} />}
        <TechnicalInsight />

        {profile?.experience && <CareerTrajectory experience={profile.experience} />}
        {profile?.projects && <Projects projects={profile.projects} />}
        {profile?.education && <ScholasticHistory education={profile.education} />}

        <ProfessionalDossier />
        <SystemLogStream />

        <Contact />
      </Container>

      {/* Global Footer */}
      <Footer socials={profile.socials} name={profile.name} />
    </Box>
  );
});

export default Portfolio;

