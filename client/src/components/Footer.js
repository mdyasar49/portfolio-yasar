import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, IconButton, Stack, Divider } from '@mui/material';
import { Linkedin, Github, Twitter, Mail, Instagram, Facebook, Cpu, Activity } from 'lucide-react';

import { getVisitors } from '../services/api';

const Footer = ({ socials, name }) => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const fetchVisitorsData = async () => {
        const data = await getVisitors();
        setVisitorCount(data.count);
    };
    fetchVisitorsData();
  }, []);

  if (!socials) return null;
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#010409',
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        pt: 10,
        pb: 6,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* ... existing decorative elements ... */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 900, 
              fontFamily: 'Syncopate',
              letterSpacing: -1.5,
              background: 'linear-gradient(270deg, #ff3366, #ff9933)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              filter: 'drop-shadow(0 0 15px rgba(255, 51, 102, 0.5))'
            }}
          >
            MD YASAR
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ maxWidth: '500px', textAlign: 'center', mb: 4, fontStyle: 'italic' }}
          >
            "Building high-performance, visually stunning web applications with the latest modern technologies."
          </Typography>

          {/* VISITOR COUNTER WIDGET */}
          <Box sx={{ mb: 4, p: 1.5, px: 3, borderRadius: 2, border: '1px solid rgba(51, 204, 255, 0.1)', bgcolor: 'rgba(51, 204, 255, 0.03)', display: 'flex', alignItems: 'center', gap: 2 }}>
             <Activity size={16} color="#33ccff" style={{ animation: 'pulse 2s infinite' }} />
             <Typography sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace', fontSize: '1rem', letterSpacing: 2 }}>
               TOTAL_VISTORS: {visitorCount || 'SYNCING...'}
             </Typography>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 6, flexWrap: 'wrap', gap: 1 }}>
            {[
              { icon: <Linkedin size={20} />, link: socials.linkedin, label: 'LinkedIn' },
              { icon: <Github size={20} />, link: socials.github, label: 'GitHub' },
              { icon: <Twitter size={20} />, link: socials.twitter, label: 'Twitter' },
              { icon: <Facebook size={20} />, link: socials.facebook, label: 'Facebook' },
              { icon: <Instagram size={20} />, link: socials.instagram, label: 'Instagram' },
              { icon: <Mail size={20} />, link: `mailto:${socials.email || 'mohamedyasar081786@gmail.com'}`, label: 'Email' }
            ].map((item, index) => (
              <IconButton 
                key={index}
                href={item.link || '#'} 
                target="_blank" 
                sx={{ 
                  color: 'text.secondary',
                  transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  '&:hover': { 
                    color: '#33ccff',
                    transform: 'translateY(-5px)',
                    bgcolor: 'rgba(51, 204, 255, 0.1)',
                    borderColor: '#33ccff',
                    boxShadow: '0 5px 20px rgba(51, 204, 255, 0.3)'
                  }
                }}
              >
                {item.icon}
              </IconButton>
            ))}
          </Stack>

          <Divider sx={{ width: '100%', borderColor: 'rgba(255,255,255,0.05)', mb: 4 }} />

          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.6 }}>
              &copy; {new Date().getFullYear()} {name}. ALL_ARCHIVES_SECURED.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Cpu size={14} color="#33ccff" />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5 }}>
                POWERED BY FULL STACK EXPERTISE
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      <style>
        {`
          @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        `}
      </style>
    </Box>
  );
};

export default Footer;

