/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders the global navigation bar (Header).
 * It features a responsive layout with a floating glassmorphic design that
 * shrinks and blurs on scroll. It handles internal page anchoring (smooth scroll)
 * and external routing.
 */

import React, { useState } from 'react';
// Material UI components for the layout, buttons, and mobile drawer
import { AppBar, Toolbar, Button, IconButton, Box, Drawer, List, ListItem, ListItemButton, ListItemText, useScrollTrigger, Container } from '@mui/material';
// Icons for mobile menu toggle and close
import { Menu as MenuIcon, X } from 'lucide-react';
// React Router hooks for navigation and location tracking
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// Icons for code live mode
import { Code2, Zap } from 'lucide-react';
// Context for code live state
import { useCodeLive } from '../context/CodeLiveContext';


const Header = ({ profile }) => {
  // State to manage the visibility of the mobile side drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Access global Code Live state and toggle function
  const { isCodeLive, toggleCodeLive } = useCodeLive();

  // Extraction Logic: Fallback to an empty list if backend data is not yet loaded
  const menuItems = profile?.menuItems || [];

  // Hook to detect scroll position - used to transform the header into a floating island
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  // Toggles the mobile drawer menu
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  /**
   * [scrollToSection]
   * Logic to handle smooth scrolling to a specific ID on the homepage.
   * If the user is on a different page, it navigates back home first.
   */
  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Cross-page navigation to a specific section
      navigate(`/#${sectionId}`);
    }
    setMobileOpen(false); // Close drawer after clicking (for mobile)
  };

  /**
   * [handleLogoClick]
   * Returns the user to the very top of the page when the logo is clicked.
   */
  const handleLogoClick = (e) => {
    // Navigate to root to clear hashes and ensure we are on the home page
    navigate('/');

    // Target the specific scroll container used in App.js
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback for global window scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  /**
   * [renderNavButton]
   * Dynamically renders either an anchor link or a router link based on item type.
   * Includes high-end visual feedback for the active route (glow lines).
   */
  const renderNavButton = (item) => {
    const isAnchor = item.type === 'anchor';
    const isTerminal = item.name === 'Terminal';
    // Check if the current button matches the active section/page
    const isActive = item.path ? (location.hash === item.path.replace('/', '') || (location.pathname === item.path && !isAnchor)) : false;

    // Render logic for Homepage Anchors
    if (isAnchor && location.pathname === '/') {
      return (
        <Button
          key={item.name}
          onClick={() => scrollToSection(item.name.toLowerCase())}
          sx={{
            color: isActive ? (isTerminal ? '#00ffcc' : '#ff3366') : 'white',
            px: 2, mx: 0.5, fontSize: '0.7rem', fontFamily: 'Syncopate', fontWeight: 900, letterSpacing: 1,
            transition: '0.3s ease', position: 'relative',
            // Animated bottom underline
            '&::after': {
                content: '""', position: 'absolute', bottom: 12, left: '25%',
                width: isActive ? '50%' : 0, height: '1.5px',
                bgcolor: isTerminal ? '#00ffcc' : '#ff3366',
                boxShadow: `0 0 12px ${isTerminal ? '#00ffcc' : '#ff3366'}`,
                transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            '&:hover': { color: isTerminal ? '#00ffcc' : '#ff3366', bgcolor: 'transparent', '&::after': { width: '50%' } }
          }}
        >
          {item.name}
        </Button>
      );
    }

    // Render logic for standard Router Links (Cross-page)
    return (
      <Button
        key={item.name}
        component={RouterLink}
        to={item.path}
        onClick={() => setMobileOpen(false)}
        sx={{
          color: location.pathname === item.path ? (isTerminal ? '#00ffcc' : '#ff3366') : 'white',
          px: 2, mx: 0.5, fontSize: '0.7rem', fontFamily: 'Syncopate', fontWeight: 900, letterSpacing: 1,
          position: 'relative', transition: '0.3s ease',
          '&::after': {
              content: '""', position: 'absolute', bottom: 12, left: '25%',
              width: location.pathname === item.path ? '50%' : 0, height: '1.5px',
              bgcolor: isTerminal ? '#00ffcc' : '#ff3366',
              boxShadow: `0 0 12px ${isTerminal ? '#00ffcc' : '#ff3366'}`,
              transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          },
          '&:hover': { color: isTerminal ? '#00ffcc' : '#ff3366', bgcolor: 'transparent', '&::after': { width: '50%' } }
        }}
      >
        {item.name}
      </Button>
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {/* ── THE MAIN APPBAR ── */}
      <AppBar
        position="fixed"
        sx={{
          // Transformations applied based on 'trigger' (scroll position)
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
          zIndex: 11000,
        }}
        elevation={0}
      >
        <Container maxWidth={trigger ? false : "lg"} sx={{ width: '100%', px: trigger ? 4 : 2 }}>
          <Toolbar sx={{ justifyContent: 'space-between', height: trigger ? 64 : 80, width: '100%', gap: trigger ? 4 : 2 }}>

            {/* [BRANDING] Logo with hover lift effect */}
            <Box
              component={RouterLink}
              to="/"
              onClick={handleLogoClick}
              sx={{
                textDecoration: 'none', display: 'flex', alignItems: 'center',
                transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Mohamed Yasar"
                sx={{
                  height: { xs: 35, sm: 40, md: 45 }, width: 'auto',
                  filter: 'drop-shadow(0 0 10px rgba(51, 204, 255, 0.3))'
                }}
              />
            </Box>

            {/* [DESKTOP NAVIGATION] Hidden on small screens */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', whiteSpace: 'nowrap', gap: 2 }}>
              {menuItems.map((item) => renderNavButton(item))}

              {/* ── [CODE_LIVE TOGGLE] ── */}
              <Box sx={{ ml: 4, pl: 4, borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}>
                <Button
                  onClick={toggleCodeLive}
                  sx={{
                    bgcolor: isCodeLive ? 'rgba(255, 51, 102, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: isCodeLive ? '#ff3366' : 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px', px: 2, py: 1, color: isCodeLive ? '#ff3366' : '#64748b',
                    fontSize: '0.6rem', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: 1,
                    backdropFilter: 'blur(10px)', transition: 'all 0.4s',
                    boxShadow: isCodeLive ? '0 0 20px rgba(255, 51, 102, 0.2)' : 'none',
                    '&:hover': { bgcolor: 'rgba(255, 51, 102, 0.05)', borderColor: '#ff3366', color: '#ff3366' }
                  }}
                  startIcon={<Code2 size={14} />}
                >
                  CODE_LIVE: {isCodeLive ? 'ON' : 'OFF'}
                </Button>
              </Box>
            </Box>


            {/* [MOBILE MENU TOGGLE] Visible only on mobile */}
            <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ display: { xs: 'flex', md: 'none' } }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ── MOBILE SIDE DRAWER ── */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(3, 7, 18, 0.95)', width: 280,
            backdropFilter: 'blur(20px) saturate(180%)',
            borderLeft: '1px solid rgba(255,255,255,0.08)'
          }
        }}
      >
        <Box sx={{ p: 4 }}>
          {/* Close Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}><X /></IconButton>
          </Box>
          {/* Menu List */}
          <List>
            {/* Mobile Code Live Toggle */}
            <ListItem sx={{ mb: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 2 }}>
               <Button
                  fullWidth onClick={() => { toggleCodeLive(); setMobileOpen(false); }}
                  sx={{
                    bgcolor: isCodeLive ? 'rgba(255, 51, 102, 0.1)' : 'transparent',
                    color: isCodeLive ? '#ff3366' : 'white', borderRadius: 2, py: 1.5,
                    fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.7rem'
                  }}
                  startIcon={<Zap size={14} />}
               >
                  CODE_LIVE: {isCodeLive ? 'ON' : 'OFF'}
               </Button>
            </ListItem>

            {menuItems.map((item) => (

              <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => item.type === 'anchor' ? scrollToSection(item.name.toLowerCase()) : setMobileOpen(false)}
                  component={item.type === 'anchor' && location.pathname === '/' ? 'div' : RouterLink}
                  {...(item.type === 'anchor' && location.pathname === '/' ? {} : { to: item.path })}
                  sx={{
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' },
                    '&.Mui-focusVisible': { outline: '2px solid rgba(51, 204, 255, 0.5)', outlineOffset: '2px' }
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
