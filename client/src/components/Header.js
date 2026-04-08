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
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const renderNavButton = (item) => {
    const isActive = location.pathname === item.path;
    const isAnchor = item.type === 'anchor';
    
    return (
      <Button 
        key={item.name} 
        component={isAnchor ? 'a' : RouterLink} 
        to={!isAnchor ? item.path : undefined}
        href={isAnchor ? item.path.replace('/', '') : undefined}
        sx={{ 
          color: isActive ? 'primary.light' : 'text.primary',
          px: 3,
          fontWeight: isActive ? 700 : 500,
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
          width: trigger ? 'auto' : '100%',
          maxWidth: trigger ? '900px' : '100%',
          bgcolor: trigger ? 'rgba(17, 24, 39, 0.8)' : 'transparent',
          backdropFilter: trigger ? 'blur(16px)' : 'none',
          borderRadius: trigger ? 100 : 0,
          border: trigger ? '1px solid rgba(255,255,255,0.08)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: trigger ? '0 10px 40px rgba(0,0,0,0.5)' : 'none',
        }}
        elevation={0}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', height: trigger ? 64 : 80 }}>
            <Box 
              component={RouterLink} 
              to="/" 
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
                    letterSpacing: -2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))'
                  }}
                >
                  MY
                </Typography>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  bgcolor: '#ec4899', 
                  borderRadius: '50%',
                  ml: 0.5,
                  boxShadow: '0 0 15px #ec4899'
                }} />
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary', 
                  fontSize: '0.65rem', 
                  letterSpacing: 1, 
                  fontWeight: 600,
                  mt: -0.5,
                  opacity: 0.8
                }}
              >
                REACT • NODE • MONGODB
              </Typography>
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
                onClick={handleDrawerToggle} 
                component={item.type === 'link' ? RouterLink : 'a'} 
                to={item.type === 'link' ? item.path : undefined} 
                href={item.type === 'anchor' ? item.path.replace('/', '') : undefined}
                sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' } }}
              >
                <ListItemText primary={item.name} sx={{ '& .MuiTypography-root': { fontWeight: 600 } }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
