/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders the Footer section, featuring social links, system analytics (visitor tracking), 
 * and technical status indicators. It uses a high-end "Dark Cyber" aesthetic with neon accents.
 */

import React, { useState, useEffect, memo } from 'react';
// Material UI components for layout, icons buttons, and analytical displays
import { Box, Typography, Container, IconButton, Stack, Grid, Tooltip } from '@mui/material';
// Lucide icons for social media and technical indicators
import { Linkedin, Github, Twitter, Mail, Instagram, Facebook, Cpu, ShieldCheck, Terminal, Hash } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
// Service layer API to fetch global visitor statistics
import { fetchSystemAnalytics } from '../services/api';

const Footer = ({ profile }) => {
  const socials = profile?.socials;
  const name = profile?.name;
  const config = profile?.footerConfig || {};

  // State to store and display the total unique visitor count
  const [visitorCount, setVisitorCount] = useState(0);
  // Generate a temporary session ID for visual "status" display
  const [sessionId] = useState(() => Math.random().toString(16).substring(2, 10).toUpperCase());

  /**
   * [Analytics Lifecycle]
   * On mount, fetch visitor data from the backend.
   * If it's a first-time visit in this session, trigger an increment.
   */
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

  // Safety check: if core footer data is not loaded, don't show yet
  if (!socials || !name) return null;

  // Configuration for social media buttons
  const socialLinks = [
    { icon: <Linkedin size={20} />, link: socials.linkedin, color: '#0077b5' },
    { icon: <Github size={20} />, link: socials.github, color: '#f0f6fc' },
    { icon: <Twitter size={20} />, link: socials.twitter, color: '#1da1f2' },
    { icon: <Mail size={20} />, link: `mailto:${profile.email}`, color: '#ff3366' },
    { icon: <Instagram size={20} />, link: socials.instagram, color: '#e4405f' },
    { icon: <Facebook size={20} />, link: socials.facebook, color: '#1877f2' }
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#000000',
        borderTop: '1px solid rgba(51, 204, 255, 0.1)', 
        pt: 12, pb: 12, position: 'relative', overflow: 'hidden'
      }}
    >
      {/* [BACKGROUND WATERMARK] - Giant name text with extremely low opacity */}
      <Box sx={{
        position: 'absolute', bottom: -80, right: -20, opacity: 0.02,
        userSelect: 'none', pointerEvents: 'none'
      }}>
        <Typography sx={{ fontSize: '15rem', fontWeight: 900, fontFamily: 'Syncopate', color: 'white' }}>
          {config.watermark || "YASAR"}
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* ── LOGO & STATUS HUD ── */}
          <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
          <Box 
            component={RouterLink} to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{ textDecoration: 'none', display: 'flex', transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}
          >
            <Box 
              component="img" src="/logo.png" alt="Logo"
              sx={{ height: 50, width: 'auto', filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))' }}
            />
          </Box>

            {/* Technical metadata labels */}
            <Stack direction="row" spacing={2} sx={{ opacity: 0.5 }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#00ffcc' }}>[LICENSE_ID: {sessionId}]</Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>[STATUS: VERIFIED]</Typography>
            </Stack>
          </Stack>

          {/* Professional Tagline */}
          <Typography 
            variant="body2" 
            sx={{ 
              maxWidth: '600px', textAlign: 'center', mb: 6, 
              color: '#334155', fontWeight: 600, fontStyle: 'italic',
              lineHeight: 1.8, fontSize: '0.9rem'
            }}
          >
            "{config.tagline}"
          </Typography>

          {/* ── SOCIAL MAINFRAME ── */}
          <Box sx={{ 
            p: 1, px: 4, borderRadius: 10, background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.03)', mb: 8, display: 'flex', gap: 2
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
              {/* ── ANALYTICS HUD (System Dashboard Style) ── */}
          <Grid container spacing={4} sx={{ mb: 10 }}>
             <Grid item xs={12} md={6}>
                <Box sx={{ 
                    p: 4, borderRadius: 4, bgcolor: 'rgba(51, 204, 255, 0.02)', 
                    border: '1px solid rgba(51, 204, 255, 0.1)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <Typography variant="caption" sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: 2, mb: 3, display: 'block' }}>
                        TRAFFIC_ANALYTICS_V4
                    </Typography>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Box sx={{ p: 2, bgcolor: 'rgba(51, 204, 255, 0.05)', borderRadius: 3 }}>
                            <Terminal size={24} color="#33ccff" />
                        </Box>
                        <Box>
                            <Typography sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace', fontSize: '2rem' }}>
                                {visitorCount > 0 ? visitorCount.toLocaleString() : '---'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                                GLOBAL_UNIQUE_NODES_IDENTIFIED
                            </Typography>
                        </Box>
                    </Stack>
                    {/* Decorative HUD Bracket */}
                    <Box sx={{ position: 'absolute', bottom: -10, right: -10, opacity: 0.1 }}><Terminal size={100} /></Box>
                </Box>
             </Grid>

             <Grid item xs={12} md={6}>
                <Box sx={{ 
                    p: 4, borderRadius: 4, bgcolor: 'rgba(255, 51, 102, 0.02)', 
                    border: '1px solid rgba(255, 51, 102, 0.1)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <Typography variant="caption" sx={{ color: '#ff3366', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: 2, mb: 3, display: 'block' }}>
                        SECURITY_PROTOCOL_ACTIVE
                    </Typography>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Box sx={{ p: 2, bgcolor: 'rgba(255, 51, 102, 0.05)', borderRadius: 3 }}>
                            <ShieldCheck size={24} color="#ff3366" />
                        </Box>
                        <Box>
                            <Typography sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace', fontSize: '2rem' }}>
                                AES-256
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                                END_TO_END_DATA_ENCRYPTION
                            </Typography>
                        </Box>
                    </Stack>
                    {/* Decorative HUD Bracket */}
                    <Box sx={{ position: 'absolute', bottom: -10, right: -10, opacity: 0.1 }}><ShieldCheck size={100} /></Box>
                </Box>
             </Grid>
          </Grid>


          {/* ── TECHNICAL TERMINAL BAR (Copyright & Versioning) ── */}
          <Box sx={{ 
            width: '100%', pt: 4, borderTop: '1px solid rgba(255,255,255,0.03)',
            display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', alignItems: 'center', gap: 2
          }}>
            <Stack direction="row" spacing={1} alignItems="center">
               <Hash size={12} color="#334155" />
               <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: 0.5 }}>
                  &copy; {new Date().getFullYear()} {name} • MIT Licensed
               </Typography>
            </Stack>

            {/* Version control and location metadata */}
            <Stack direction="row" spacing={3}>
               <Stack direction="row" spacing={1} alignItems="center">
                  <Cpu size={12} color="#33ccff" />
                  <Typography sx={{ color: '#33ccff', fontWeight: 900, fontSize: '0.65rem', letterSpacing: 1 }}>
                    {config.engineVersion}
                  </Typography>
               </Stack>
               <Typography sx={{ color: '#64748b', fontWeight: 900, fontSize: '0.65rem', letterSpacing: 1 }}>
                  {config.origin}
               </Typography>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default memo(Footer);
