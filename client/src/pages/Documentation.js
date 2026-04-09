import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import { BookOpen, ServerCog } from 'lucide-react';

const Documentation = ({ profile }) => {
  const [readmeContent, setReadmeContent] = useState('');
  const [projectContent, setProjectContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchDocs = async () => {
      try {
        const [readmeRes, projectRes] = await Promise.all([
          fetch(process.env.PUBLIC_URL + '/README.md'),
          fetch(process.env.PUBLIC_URL + '/PROJECT_EXPLANATION.md')
        ]);
        
        if (readmeRes.ok) setReadmeContent(await readmeRes.text());
        else setReadmeContent('# Error loading README');

        if (projectRes.ok) setProjectContent(await projectRes.text());
        else setProjectContent('# Error loading Project Explanation');

      } catch (error) {
        setReadmeContent('# Network Error');
        setProjectContent('# Network Error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const markdownStyles = {
    p: { xs: 3, md: 6 }, 
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(5,5,5,0.6)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 50px rgba(0,0,0,0.5)',
    color: '#e2e8f0',
    fontFamily: 'Inter',
    lineHeight: 1.8,
    mb: 6,
    '& h1, & h2, & h3': {
      fontFamily: 'Outfit',
      fontWeight: 800,
      color: 'white',
      mt: 5,
      mb: 3,
      letterSpacing: 1
    },
    '& h1': { fontSize: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2, color: '#33ccff' },
    '& h2': { fontSize: '1.8rem', color: '#ff3366' },
    '& h3': { fontSize: '1.4rem' },
    '& a': {
      color: '#33ccff',
      textDecoration: 'none',
      borderBottom: '1px dashed #33ccff',
      transition: 'all 0.2s',
    },
    '& a:hover': {
      color: '#ff3366',
      borderBottomColor: '#ff3366'
    },
    '& code': {
      background: 'rgba(255,255,255,0.05)',
      padding: '2px 6px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      color: '#ff9933'
    },
    '& pre': {
      background: '#0a0a0a',
      padding: '20px',
      borderRadius: '12px',
      overflowX: 'auto',
      border: '1px solid rgba(255,255,255,0.05)',
      '& code': {
        background: 'transparent',
        color: '#e2e8f0',
        padding: 0
      }
    },
    '& ul, & ol': { pl: 3, mb: 4 },
    '& li': { mb: 2 },
    '& hr': { borderColor: 'rgba(255,255,255,0.05)', my: 5 }
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      <SEO 
        title="Engineering Docs" 
        description="Comprehensive technical architecture and documentation for the MERN Stack Portfolio." 
      />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 10 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Typography variant="h2" sx={{ 
            fontFamily: 'Syncopate', 
            fontWeight: 900, 
            textAlign: 'center', 
            mb: 2,
            background: 'linear-gradient(90deg, #fff, #aaa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            SYSTEM <Box component="span" sx={{ color: '#ff3366', WebkitTextFillColor: '#ff3366' }}>ARCHITECTURE</Box>
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 8, fontSize: '1.2rem' }}>
            A deep dive into the engineering principles of this application.
          </Typography>
        </motion.div>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <Typography variant="h6" sx={{ color: '#888', fontFamily: 'Syncopate', animation: 'pulse 2s infinite' }}>
              FETCHING DOCUMENTS...
            </Typography>
          </Box>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, px: 2 }}>
                <BookOpen color="#ff3366" />
                <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 900, color: 'white', letterSpacing: 1 }}>
                  README LOG
                </Typography>
              </Box>
              <Box className="glass-panel" sx={markdownStyles}>
                <ReactMarkdown>{readmeContent}</ReactMarkdown>
              </Box>
            </motion.div>

            <Box sx={{ my: 10, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '2px', height: '100px', background: 'linear-gradient(180deg, rgba(255,255,255,0), #33ccff, rgba(255,255,255,0))' }} />
            </Box>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, px: 2 }}>
                <ServerCog color="#33ccff" />
                <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 900, color: 'white', letterSpacing: 1 }}>
                  DEEP ARCHITECTURE FLOW
                </Typography>
              </Box>
              <Box className="glass-panel" sx={markdownStyles}>
                <ReactMarkdown>{projectContent}</ReactMarkdown>
              </Box>
            </motion.div>
          </>
        )}

      </Container>

      {profile && <Footer socials={profile.socials} name={profile.name} />}
    </Box>
  );
};

export default Documentation;
