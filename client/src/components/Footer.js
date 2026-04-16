import React, { useState, useEffect, memo } from 'react';
import { Box, Typography, Container, IconButton, Stack, Divider, Tooltip } from '@mui/material';
import { Linkedin, Github, Twitter, Mail, Instagram, Facebook, Cpu, ShieldCheck, Terminal, Hash } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchSystemAnalytics } from '../services/api';

const Footer = ({ socials, name }) => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [sessionId] = useState(() => Math.random().toString(16).substring(2, 10).toUpperCase());

  useEffect(() => {
    const fetchVisitorsData = async () => {
        const hasIncremented = sessionStorage.getItem('v_inc');
        const data = await fetchSystemAnalytics(!hasIncremented); 
        
        if (data?.success) {
            setVisitorCount(data.count);
            if (!hasIncremented) sessionStorage.setItem('v_inc', 'true');
        }
    };
    fetchVisitorsData();
  }, []);

  if (!socials) return null;

  const socialLinks = [
    { icon: <Linkedin size={20} />, link: socials.linkedin, color: '#0077b5' },
    { icon: <Github size={20} />, link: socials.github, color: '#f0f6fc' },
    { icon: <Twitter size={20} />, link: socials.twitter, color: '#1da1f2' },
    { icon: <Mail size={20} />, link: `mailto:${socials.email || 'mohamedyasar081786@gmail.com'}`, color: '#ff3366' },
    { icon: <Instagram size={20} />, link: socials.instagram, color: '#e4405f' },
    { icon: <Facebook size={20} />, link: socials.facebook, color: '#1877f2' }
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#000000',
        borderTop: '1px solid rgba(51, 204, 255, 0.1)', 
        pt: 12,
        pb: 12,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Watermark */}
      <Box sx={{
        position: 'absolute', bottom: -80, right: -20, opacity: 0.02,
        userSelect: 'none', pointerEvents: 'none'
      }}>
        <Typography sx={{ fontSize: '15rem', fontWeight: 900, fontFamily: 'Syncopate', color: 'white' }}>YASAR</Typography>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Logo & Status */}
          <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
            <Box 
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{ 
                height: 50, 
                width: 'auto',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))'
              }}
            />
            <Stack direction="row" spacing={2} sx={{ opacity: 0.5 }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#00ffcc' }}>[LICENSE_ID: {sessionId}]</Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>[STATUS: VERIFIED]</Typography>
            </Stack>
          </Stack>

          {/* Tagline */}
          <Typography 
            variant="body2" 
            sx={{ 
              maxWidth: '600px', textAlign: 'center', mb: 6, 
              color: '#334155', fontWeight: 600, fontStyle: 'italic',
              lineHeight: 1.8, fontSize: '0.9rem'
            }}
          >
            "Engineering high-performance interactive architectures that push the boundaries of modern full-stack development."
          </Typography>

          {/* Social Mainframe */}
          <Box sx={{ 
            p: 1, px: 4, borderRadius: 10, 
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.03)',
            mb: 8, display: 'flex', gap: 2
          }}>
            {socialLinks.map((item, index) => (
              <Tooltip key={index} title={item.link ? "OPEN_LINK" : "N/A"}>
                <IconButton 
                  href={item.link || '#'} 
                  target={item.link?.startsWith('mailto:') ? undefined : "_blank"} 
                  sx={{ 
                    color: '#444', 
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': { 
                      color: item.color,
                      transform: 'scale(1.2) translateY(-4px)',
                      filter: `drop-shadow(0 0 10px ${item.color}88)`
                    }
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>

          {/* Analytics HUD */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mb: 8, width: '100%', justifyContent: 'center' }}>
             <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1 }}>TRAFFIC_METRICS</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                   <Box sx={{ width: 40, height: 40, bgcolor: 'rgba(51, 204, 255, 0.05)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Terminal size={18} color="#33ccff" />
                   </Box>
                   <Box>
                      <Typography sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace', fontSize: '1.2rem' }}>{visitorCount > 0 ? visitorCount.toLocaleString() : '...'}</Typography>
                      <Typography variant="caption" sx={{ color: '#00ffcc', fontSize: '0.6rem' }}>UNIQUE_VISITORS_TOTAL</Typography>
                   </Box>
                </Stack>
             </Box>
             
             <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, borderColor: 'rgba(255,255,255,0.05)' }} />

             <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1 }}>CORE_ENCRYPTION</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                   <Box sx={{ width: 40, height: 40, bgcolor: 'rgba(255, 51, 102, 0.05)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={18} color="#ff3366" />
                   </Box>
                   <Box>
                      <Typography sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace', fontSize: '1.2rem' }}>AES-256</Typography>
                      <Typography variant="caption" sx={{ color: '#ff3366', fontSize: '0.6rem' }}>DATA_SECURITY_ACTIVE</Typography>
                   </Box>
                </Stack>
             </Box>
          </Stack>

          {/* Technical Terminal Footer */}
          <Box sx={{ 
            width: '100%', pt: 4, 
            borderTop: '1px solid rgba(255,255,255,0.03)',
            display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', alignItems: 'center', gap: 2
          }}>
            <Stack direction="row" spacing={1} alignItems="center">
               <Hash size={12} color="#334155" />
               <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: 0.5 }}>
                  &copy; {new Date().getFullYear()} ARCH_TERMINUS // NO_UNAUTHORIZED_ACCESS
               </Typography>
            </Stack>

            <Stack direction="row" spacing={3}>
               <Stack direction="row" spacing={1} alignItems="center">
                  <Cpu size={12} color="#33ccff" />
                  <Typography sx={{ color: '#33ccff', fontWeight: 900, fontSize: '0.65rem', letterSpacing: 1 }}>ENG_MERN_V4</Typography>
               </Stack>
               <Typography sx={{ color: '#64748b', fontWeight: 900, fontSize: '0.65rem', letterSpacing: 1 }}>MADE_IN_TAMIL_NADU</Typography>
               <Tooltip title="SYSTEM_ACCESS">
                  <IconButton 
                    component={RouterLink} 
                    to="/admin/login"
                    size="small"
                    sx={{ color: '#334155', '&:hover': { color: '#ff3366', bgcolor: 'rgba(255, 51, 102, 0.05)' } }}
                  >
                    <Terminal size={10} />
                  </IconButton>
               </Tooltip>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default memo(Footer);
