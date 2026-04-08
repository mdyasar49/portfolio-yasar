import React from 'react';
import { Box, Typography, Container, IconButton, Stack, Divider } from '@mui/material';
import { Linkedin, Github, Twitter, Mail, Instagram, Facebook, Cpu } from 'lucide-react';

const Footer = ({ socials, name }) => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#030712',
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        pt: 10,
        pb: 6,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Blur Background */}
      <Box sx={{
        position: 'absolute',
        bottom: -50,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '200px',
        bgcolor: 'primary.main',
        filter: 'blur(120px)',
        opacity: 0.1,
        borderRadius: '50%',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 900, 
              letterSpacing: -1.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
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

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 6 }}>
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
                    color: 'primary.light',
                    transform: 'translateY(-5px)',
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    borderColor: 'primary.main',
                    boxShadow: '0 5px 20px rgba(99, 102, 241, 0.3)'
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
              &copy; {new Date().getFullYear()} {name}. All rights reserved.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Cpu size={14} color="#6366f1" />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5 }}>
                POWERED BY MERN STACK
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

