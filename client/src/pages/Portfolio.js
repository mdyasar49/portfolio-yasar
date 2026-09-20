/**
 * Portfolio Home Page.
 * Assembles all sections and handles loading states with modern freelance positioning.
 */

import React, { memo } from 'react';
import { Box, Container, Typography } from '@mui/material';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import FreelanceServices from '../components/FreelanceServices';
import About from '../components/About';
import Skills from '../components/Skills';
import TechnicalInsight from '../components/TechnicalInsight';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import WorkExperience from '../components/WorkExperience';
import EducationHistory from '../components/EducationHistory';
import ProfessionalResume from '../components/ProfessionalResume';
import SystemLogStream from '../components/SystemLogStream';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Portfolio = memo(({ profile, loading }) => {
  const isCoreLoaded = profile?.name || profile?.menuItems;

  if (loading && !isCoreLoaded)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
          color: 'white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Initializing Platform...
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        scrollBehavior: 'smooth',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Update browser tab title and description */}
      <SEO
        title="A. Mohamed Yasar | Freelance Full Stack & AI Voice Engineer"
        description={profile?.summary || 'Freelance Full Stack Engineer & Automation Specialist'}
      />

      {/* Content */}
      <Container maxWidth="xl" sx={{ pt: 2, pb: 4 }}>
        {(profile.name || profile.summary) && <Hero profile={profile} />}
        
        {/* Core Freelance Services Section */}
        <FreelanceServices profile={profile} />

        {/* Featured Projects Showcase */}
        {profile.projects && <Projects profile={profile} projects={profile.projects} />}

        {/* Client Testimonials & Trust Badges */}
        <Testimonials profile={profile} />

        {/* Technical Skills & Growth Insights */}
        {profile.technicalSkills && <Skills profile={profile} skills={profile.technicalSkills} />}
        {profile.performanceData && <TechnicalInsight profile={profile} />}

        {/* About & Core Competencies */}
        {profile.summary && <About profile={profile} />}

        {/* Track Record & Experience */}
        <Box id="professional-experience">
          {profile.experience && (
            <WorkExperience profile={profile} experience={profile.experience} />
          )}
          {profile.education && (
            <EducationHistory profile={profile} education={profile.education} />
          )}
        </Box>

        {profile.resumeConfig && <ProfessionalResume profile={profile} />}
        {(profile.documentation?.engineeringObjective ||
          profile.documentation?.systemMetricsConfig) && <SystemLogStream profile={profile} />}

        {profile.email && <Contact profile={profile} />}
      </Container>

      {/* Global Footer */}
      <Footer profile={profile} />
    </Box>
  );
});

export default Portfolio;
