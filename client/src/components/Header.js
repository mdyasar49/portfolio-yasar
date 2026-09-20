/**
 * Navigation Header component.
 * Floating bar with glassmorphic style and quick freelance proposal CTA.
 */

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
  Container,
  Typography,
  Stack,
} from '@mui/material';
import { Menu as MenuIcon, X, Sparkles, MessageCircle } from 'lucide-react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';

const Header = ({ profile }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = profile?.menuItems || [];

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 40,
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderNavButton = (item) => {
    const isAnchor = item.type === 'anchor';
    const isActive = item.path
      ? location.hash === item.path.replace('/', '') ||
        (location.pathname === item.path && !isAnchor)
      : false;

    if (isAnchor && location.pathname === '/') {
      return (
        <Button
          key={item.name}
          onClick={() => scrollToSection(item.name.toLowerCase())}
          sx={{
            color: isActive ? '#e11d48' : '#cbd5e1',
            px: 1.8,
            py: 0.8,
            fontSize: '0.75rem',
            fontFamily: 'Outfit',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1,
            transition: '0.2s ease',
            '&:hover': {
              color: '#e11d48',
              bgcolor: 'transparent',
            },
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
          color: location.pathname === item.path ? '#e11d48' : '#cbd5e1',
          px: 1.8,
          py: 0.8,
          fontSize: '0.75rem',
          fontFamily: 'Outfit',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1,
          transition: '0.2s ease',
          '&:hover': {
            color: '#e11d48',
            bgcolor: 'transparent',
          },
        }}
      >
        {item.name}
      </Button>
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {/* Scroll Progress Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 3,
          zIndex: 12000,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #e11d48, #f97316)',
            boxShadow: '0 0 10px rgba(225,29,72,0.5)',
            transformOrigin: '0%',
            scaleX,
          }}
        />
      </Box>

      {/* Main AppBar */}
      <AppBar
        position="fixed"
        sx={{
          top: trigger ? 12 : 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: trigger ? 'max-content' : '100%',
          maxWidth: trigger ? '96%' : '100%',
          minWidth: trigger ? { sm: '720px', md: '950px', lg: '1100px' } : '100%',
          bgcolor: trigger ? 'rgba(8, 11, 20, 0.88)' : 'transparent',
          backdropFilter: trigger ? 'blur(16px)' : 'none',
          borderRadius: trigger ? 100 : 0,
          border: trigger ? '1px solid rgba(255,255,255,0.08)' : 'none',
          transition: 'all 0.3s ease',
          boxShadow: trigger ? '0 12px 35px rgba(0,0,0,0.4)' : 'none',
          zIndex: 11000,
        }}
        elevation={0}
      >
        <Container maxWidth={trigger ? false : 'xl'} sx={{ width: '100%', px: trigger ? 3 : 2 }}>
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              height: trigger ? 56 : 75,
              width: '100%',
              gap: 2,
            }}
          >
            {/* Logo & Brand */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component={RouterLink}
                to="/"
                onClick={handleLogoClick}
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: '0.2s ease',
                  '&:hover': { opacity: 0.85 },
                }}
              >
                <Box
                  component="img"
                  src="/logo.png"
                  alt="Mohamed Yasar"
                  sx={{
                    height: { xs: 24, sm: 28, md: 32 },
                    width: 'auto',
                  }}
                />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography
                    sx={{
                      color: 'white',
                      fontWeight: 900,
                      fontFamily: 'Outfit',
                      fontSize: '0.88rem',
                      letterSpacing: 0.5,
                      lineHeight: 1.1,
                    }}
                  >
                    MOHAMED YASAR
                  </Typography>
                  <Typography
                    sx={{
                      color: '#f97316',
                      fontWeight: 800,
                      fontSize: '0.62rem',
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Full Stack & Software Engineer
                  </Typography>
                </Box>
              </Box>
            </Stack>

            {/* Desktop Nav Items */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                whiteSpace: 'nowrap',
                gap: 0.5,
              }}
            >
              {menuItems.map((item) => renderNavButton(item))}
            </Box>

            {/* CTA Button */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                component={RouterLink}
                to="/services"
                variant="contained"
                size="small"
                startIcon={<Sparkles size={14} />}
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  bgcolor: '#e11d48',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  fontFamily: 'Outfit',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  borderRadius: '100px',
                  px: 2.2,
                  py: 0.8,
                  boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)',
                  '&:hover': { bgcolor: '#f97316' },
                }}
              >
                Hire / Quote
              </Button>

              {/* Mobile Menu Toggle */}
              <IconButton
                color="inherit"
                onClick={handleDrawerToggle}
                sx={{ display: { xs: 'flex', lg: 'none' } }}
              >
                <MenuIcon size={22} />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(5, 8, 18, 0.98)',
            width: 290,
            backdropFilter: 'blur(25px)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          },
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Close & Header */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
          >
            <Box>
              <Typography
                sx={{
                  color: '#f97316',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  letterSpacing: 2,
                }}
              >
                MOHAMED YASAR
              </Typography>
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  fontFamily: 'Outfit',
                }}
              >
                SOFTWARE & FULL STACK PORTFOLIO
              </Typography>
            </Box>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }}
            >
              <X size={20} />
            </IconButton>
          </Box>

          {/* Quick WhatsApp Action */}
          <Button
            variant="contained"
            fullWidth
            href="https://wa.me/919025943184?text=Hi%20Mohamed,%20I%20am%20interested%20in%20discussing%20a%20freelance%20project."
            target="_blank"
            startIcon={<MessageCircle size={16} />}
            sx={{
              bgcolor: '#22c55e',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.78rem',
              borderRadius: '12px',
              py: 1,
              mb: 3,
              textTransform: 'none',
              '&:hover': { bgcolor: '#16a34a' },
            }}
          >
            WhatsApp +91-9025943184
          </Button>

          {/* Menu Items */}
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.name} disablePadding sx={{ mb: 1.2 }}>
                <ListItemButton
                  onClick={() =>
                    item.type === 'anchor'
                      ? scrollToSection(item.name.toLowerCase())
                      : setMobileOpen(false)
                  }
                  component={
                    item.type === 'anchor' && location.pathname === '/' ? 'div' : RouterLink
                  }
                  {...(item.type === 'anchor' && location.pathname === '/'
                    ? {}
                    : { to: item.path })}
                  sx={{
                    borderRadius: '10px',
                    py: 1.2,
                    border: '1px solid rgba(255,255,255,0.04)',
                    '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.1)', borderColor: 'primary.main' },
                  }}
                >
                  <ListItemText
                    primary={item.name.toUpperCase()}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: 800,
                        color: 'white',
                        fontFamily: 'Outfit',
                        letterSpacing: 1.5,
                        fontSize: '0.85rem',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Footer */}
          <Typography
            sx={{
              color: '#475569',
              fontSize: '0.62rem',
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: 1,
            }}
          >
            © 2026 A. MOHAMED YASAR · SOFTWARE ENGINEER
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
