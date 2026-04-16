/**
 * Project: Portfolio - MERN Stack Developer
 * Technologies: React.js, Express.js, Node.js, Material UI, MongoDB
 * Developer: A. Mohamed Yasar
 */
import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Box, Drawer, List, ListItem, ListItemButton, ListItemText, useScrollTrigger, Container } from '@mui/material';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });
  
  const menuItems = [
    { name: 'About', path: '/#about', type: 'anchor' },
    { name: 'Skills', path: '/#skills', type: 'anchor' },
    { name: 'Projects', path: '/#projects', type: 'anchor' },
    { name: 'Resume', path: '/#resume', type: 'anchor' },
    { name: 'Architecture', path: '/#architecture', type: 'anchor' },
    { name: 'Terminal', path: '/#terminal', type: 'anchor' },
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
      // If we are on another page, navigate to home with the hash
      navigate(`/#${sectionId}`);
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
    const isTerminal = item.name === 'Terminal';
    const isActive = location.hash === item.path.replace('/', '') || (location.pathname === item.path && !isAnchor);

    
    if (isAnchor && location.pathname === '/') {
      return (
        <Button 
          key={item.name} 
          onClick={() => scrollToSection(item.name.toLowerCase())}
          sx={{ 
            color: isActive ? (isTerminal ? '#00ffcc' : '#ff3366') : 'white',
            px: 2,
            mx: 0.5,
            fontSize: '0.7rem',
            fontFamily: 'Syncopate',
            fontWeight: 900,
            letterSpacing: 1,
            transition: '0.3s ease',
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 12,
                left: '25%',
                width: isActive ? '50%' : 0,
                height: '1.5px',
                bgcolor: isTerminal ? '#00ffcc' : '#ff3366',
                boxShadow: `0 0 12px ${isTerminal ? '#00ffcc' : '#ff3366'}`,
                transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            '&:hover': { 
                color: isTerminal ? '#00ffcc' : '#ff3366',
                bgcolor: 'transparent',
                '&::after': { width: '50%' }
            }
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
          color: location.pathname === item.path ? (isTerminal ? '#00ffcc' : '#ff3366') : 'white',
          px: 2,
          mx: 0.5,
          fontSize: '0.7rem',
          fontFamily: 'Syncopate',
          fontWeight: 900,
          letterSpacing: 1,
          position: 'relative',
          transition: '0.3s ease',
          '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 12,
              left: '25%',
              width: location.pathname === item.path ? '50%' : 0,
              height: '1.5px',
              bgcolor: isTerminal ? '#00ffcc' : '#ff3366',
              boxShadow: `0 0 12px ${isTerminal ? '#00ffcc' : '#ff3366'}`,
              transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          },
          '&:hover': { 
              color: isTerminal ? '#00ffcc' : '#ff3366',
              bgcolor: 'transparent',
              '&::after': { width: '50%' }
          }
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
          top: trigger ? 15 : 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: trigger ? 'max-content' : '100%',
          maxWidth: trigger ? '95%' : '100%',
          minWidth: trigger ? { sm: '800px', md: '1000px', lg: '1150px' } : '100%',
          bgcolor: trigger ? 'rgba(1, 4, 9, 0.85)' : 'transparent',

          backdropFilter: trigger ? 'blur(20px) saturate(180%)' : 'none',
          borderRadius: trigger ? 100 : 0,
          border: trigger ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: trigger ? '0 15px 35px rgba(0,0,0,0.4)' : 'none',
        }}
        elevation={0}
      >


        <Container maxWidth={trigger ? false : "lg"} sx={{ width: '100%', px: trigger ? 4 : 2 }}>
          <Toolbar sx={{ justifyContent: 'space-between', height: trigger ? 64 : 80, width: '100%', gap: trigger ? 4 : 2 }}>

            <Box 
              component={RouterLink} 
              to="/" 
              onClick={handleLogoClick}
              sx={{ 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <Box 
                component="img"
                src="/logo.png"
                alt="Mohamed Yasar"
                sx={{ 
                  height: { xs: 35, sm: 40, md: 45 },
                  width: 'auto',
                  filter: 'drop-shadow(0 0 10px rgba(51, 204, 255, 0.3))'
                }}
              />
            </Box>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', whiteSpace: 'nowrap' }}>
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
                disablePadding
                sx={{ mb: 1 }}
              >
                <ListItemButton
                  onClick={() => item.type === 'anchor' ? scrollToSection(item.name.toLowerCase()) : setMobileOpen(false)}
                  component={item.type === 'anchor' && location.pathname === '/' ? 'div' : RouterLink}
                  {...(item.type === 'anchor' && location.pathname === '/' ? {} : { to: item.path })}
                  sx={{
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' },
                    '&.Mui-focusVisible': {
                      outline: '2px solid rgba(51, 204, 255, 0.5)',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  <ListItemText primary={item.name} sx={{ '& .MuiTypography-root': { fontWeight: 600, color: 'white' } }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
