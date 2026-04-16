import React, { memo } from 'react';
import { Box, Container, Typography } from '@mui/material';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import TechnicalInsight from '../components/TechnicalInsight';
import CodeShowcase from '../components/CodeShowcase';
import CareerTrajectory from '../components/CareerTrajectory';
import Projects from '../components/Projects';
import ScholasticHistory from '../components/ScholasticHistory';
import SystemArchitecture from '../components/SystemArchitecture';
import ProfessionalDossier from '../components/ProfessionalDossier';
import SystemLogStream from '../components/SystemLogStream';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import AdministrativeTerminal from './AdministrativeTerminal';

const Portfolio = memo(({ profile, loading }) => {
  if (loading && !profile) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default', color: 'white' }}>
       <Typography variant="h6" sx={{ fontFamily: 'Syncopate', fontWeight: 900 }}>LOADING_PROFILE...</Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', scrollBehavior: 'smooth', position: 'relative', overflowX: 'hidden' }}>
      <SEO 
        title="Portfolio" 
        description={profile?.summary || "Full Stack Engineer Portfolio"} 
      />
      
      {/* ATMOSPHERIC PARTICLE BACKGROUND */}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <canvas id="particle-canvas" style={{ width: '100%', height: '100%', opacity: 0.2 }} />
      </Box>

      {/* GLOBAL SCANNING EFFECT */}
      <Box sx={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: '4px', 
        background: 'linear-gradient(90deg, transparent, rgba(51, 204, 255, 0.4), transparent)', 
        zIndex: 2000, opacity: 0.1, 
        animation: 'scan-optimized 10s linear infinite',
        pointerEvents: 'none',
        willChange: 'transform'
      }} />

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
            
            for(let i=0; i<50; i++) particles.push(new Particle());
            
            function animate() {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              particles.forEach(p => { p.update(); p.draw(); });
              requestAnimationFrame(animate);
            }
            animate();
          })();
        `}
      </script>

      <style>
        {`
          @keyframes scan-optimized { 
            0% { transform: translateY(-100vh); } 
            100% { transform: translateY(100vh); } 
          }
        `}
      </style>


      <Container maxWidth="xl" sx={{ pt: 12, pb: 10 }}>
        {profile && <Hero profile={profile} />}
        {profile && <About profile={profile} />}
        {profile?.technicalSkills && <Skills skills={profile.technicalSkills} />}
        <TechnicalInsight />
        <CodeShowcase />
        {profile?.experience && <CareerTrajectory experience={profile.experience} />}
        {profile?.projects && <Projects projects={profile.projects} />}
        {profile?.education && <ScholasticHistory education={profile.education} />}
        <Box id="terminal" sx={{ py: 10 }}>
           <AdministrativeTerminal publicView={true} />
        </Box>
        <ProfessionalDossier />
        <SystemLogStream />

        <SystemArchitecture />
        <Contact />
      </Container>
      <Footer socials={profile.socials} name={profile.name} />
    </Box>
  );
});

export default Portfolio;

