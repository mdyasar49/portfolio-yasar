import React from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import { ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const MaintenancePage = () => {
  return (
    <Box sx={{ 
      height: '100vh', 
      bgcolor: '#02040a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Grid */}
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.1,
        backgroundImage: 'radial-gradient(#33ccff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Stack spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: -40, border: '1px dashed rgba(51, 204, 255, 0.2)', borderRadius: '50%' }}
            />
            <ShieldAlert size={80} color="#ff3366" />
          </Box>

          <Box>
            <Typography variant="h2" sx={{ fontFamily: 'Syncopate', fontWeight: 900, letterSpacing: 4, mb: 1, fontSize: { xs: '1.5rem', md: '3rem' } }}>
              SYSTEM_MAINTENANCE
            </Typography>
            <Typography variant="overline" sx={{ color: '#444', fontWeight: 900, letterSpacing: 8 }}>
              STATUS: UNDER_CORE_UPGRADE
            </Typography>
          </Box>

          <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3, maxWidth: 600 }}>
            <Typography variant="body1" sx={{ color: '#888', fontStyle: 'italic', lineHeight: 1.8 }}>
              The professional architecture and production systems of A. Mohamed Yasar are currently undergoing a scheduled maintenance sequence. Public access has been restricted to ensure data integrity during systemic transitions.
            </Typography>
          </Paper>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ opacity: 0.5 }}>
            <Cpu size={16} color="#33ccff" />
            <Typography variant="caption" sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>CORE_VERSION v4.1.0 | AUTH_LOCK: ACTIVE</Typography>
          </Stack>
        </Stack>
      </motion.div>
    </Box>
  );
};

export default MaintenancePage;
