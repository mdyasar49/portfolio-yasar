import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Education from '../components/Education';
import Footer from '../components/Footer';

const Portfolio = ({ profile, loading }) => {
  if (loading && !profile) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#010409', color: 'white' }}>
       <Typography variant="h6" sx={{ fontFamily: 'Syncopate', fontWeight: 900 }}>INITIALIZING_INTERFACE...</Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#010409', minHeight: '100vh', scrollBehavior: 'smooth', position: 'relative', overflowX: 'hidden' }}>
      <SEO 
        title="Portfolio" 
        description={profile?.summary || "Full Stack Engineer Portfolio"} 
      />
      
      {/* GLOBAL SCANNING EFFECT */}
      <Box sx={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: '1px', 
        background: 'linear-gradient(90deg, transparent, #ff3366, transparent)', 
        zIndex: 2000, opacity: 0.2, animation: 'scan 4s linear infinite',
        pointerEvents: 'none'
      }} />

      <style>
        {`
          @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
          html { scroll-behavior: smooth; }
        `}
      </style>

      <Container maxWidth="xl" sx={{ pt: 12, pb: 10 }}>
        {profile && <Hero profile={profile} />}
        {profile && <About profile={profile} />}
        {profile?.technicalSkills && <Skills skills={profile.technicalSkills} />}
        {profile?.experience && <Experience experience={profile.experience} />}
        {profile?.projects && <Projects projects={profile.projects} />}
        {profile?.education && <Education education={profile.education} />}
      </Container>
      <Footer socials={profile.socials} name={profile.name} />
    </Box>
  );
};

export default Portfolio;
