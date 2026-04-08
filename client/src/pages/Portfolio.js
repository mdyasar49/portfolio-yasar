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
