/**
 * Project: Portfolio - MERN Stack Developer
 * Technologies: React.js, Express.js, Node.js, Material UI, MongoDB
 * Developer: A. Mohamed Yasar
 */
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer, List, ListItem, ListItemText, useScrollTrigger, Container } from '@mui/material';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });
  
  const menuItems = [
    { name: 'About', path: '/#about', type: 'anchor' },
    { name: 'Skills', path: '/#skills', type: 'anchor' },
    { name: 'Projects', path: '/#projects', type: 'anchor' },
    { name: 'Resume', path: '/resume', type: 'link' },
    { name: 'Architecture', path: '/architecture', type: 'link' },
    { name: 'Contact', path: '/#contact', type: 'anchor' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we are on another page, navigate to home and then hash handles it
      // or we can just let RouterLink do its thing, but for smooth we need home
    }
    setMobileOpen(false);
  };

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderNavButton = (item) => {
    const isAnchor = item.type === 'anchor';
    
    if (isAnchor && location.pathname === '/') {
      return (
        <Button 
          key={item.name} 
          onClick={() => scrollToSection(item.name.toLowerCase())}
          sx={{ 
            color: 'text.primary',
            px: 3,
            fontWeight: 500,
            '&:hover': { color: 'primary.light', bgcolor: 'transparent' }
          }}
        >
          {item.name}
        </Button>
      );
    }

    return (
      <Button 
        key={item.name} 
        component={RouterLink} 
        to={item.path}
        onClick={() => setMobileOpen(false)}
        sx={{ 
          color: location.pathname === item.path ? 'primary.light' : 'text.primary',
          px: 3,
          fontWeight: location.pathname === item.path ? 700 : 500,
          '&:hover': { color: 'primary.light', bgcolor: 'transparent' }
        }}
      >
        {item.name}
      </Button>
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          top: trigger ? 20 : 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: trigger ? { xs: '95%', sm: 'auto' } : '100%',
          maxWidth: trigger ? '900px' : '100%',
          bgcolor: trigger ? 'rgba(10, 10, 15, 0.7)' : 'transparent',
          backdropFilter: trigger ? 'blur(24px) saturate(150%)' : 'none',
          borderRadius: trigger ? 100 : 0,
          border: trigger ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: trigger ? '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' : 'none',
        }}
        elevation={0}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', height: trigger ? 64 : 80 }}>
            <Box 
              component={RouterLink} 
              to="/" 
              onClick={handleLogoClick}
              sx={{ 
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900,
                    fontFamily: 'Syncopate', 
                    letterSpacing: -1,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    background: 'linear-gradient(270deg, #ff3366, #ff9933)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 15px rgba(255, 51, 102, 0.5))'
                  }}
                >
                  MY
                </Typography>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  bgcolor: '#33ccff', 
                  borderRadius: '50%',
                  ml: 1,
                  boxShadow: '0 0 15px #33ccff'
                }} />
              </Box>
            </Box>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {menuItems.map((item) => renderNavButton(item))}
            </Box>

            <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ display: { xs: 'flex', md: 'none' } }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle} PaperProps={{ sx: { bgcolor: '#030712', width: 280 } }}>
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}><X /></IconButton>
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                key={item.name} 
                button 
                onClick={() => item.type === 'anchor' ? scrollToSection(item.name.toLowerCase()) : setMobileOpen(false)} 
                component={item.type === 'anchor' && location.pathname === '/' ? 'div' : RouterLink} 
                to={item.path} 
                sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' } }}
              >
                <ListItemText primary={item.name} sx={{ '& .MuiTypography-root': { fontWeight: 600, color: 'white' } }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
