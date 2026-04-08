import React from 'react';
import { Box, Container } from '@mui/material';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Education from '../components/Education';
import Footer from '../components/Footer';

const Portfolio = ({ profile, loading }) => {
  if (loading && !profile) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
      Loading Profile Data...
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      <Container maxWidth="lg" sx={{ pt: 8 }}>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={profile.technicalSkills} />
        <Experience experience={profile.experience} />
        <Projects projects={profile.projects} />
        <Education education={profile.education} />
      </Container>
      <Footer socials={profile.socials} name={profile.name} />
    </Box>
  );
};

export default Portfolio;
