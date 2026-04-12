import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Typography, 
  Stack,
  Tooltip,
  Fade
} from '@mui/material';
import { Globe, Check, ChevronDown, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', label: 'Technical' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', label: 'தமிழ்' },
  { code: 'th', name: 'Thanglish', flag: '🔡', label: 'Transliterated' },
  { code: 'all', name: 'Trilingual', flag: '🌐', label: 'All Modes' }
];

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (langCode) => {
    onLanguageChange(langCode);
    handleClose();
  };

  const activeLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <Box>
      <Tooltip title="Switch Document Language" arrow placement="top">
        <Button
          onClick={handleClick}
          sx={{
            bgcolor: open ? 'rgba(51, 204, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
            border: '1px solid',
            borderColor: open ? 'rgba(51, 204, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            px: 2.5,
            py: 1.2,
            color: 'white',
            textTransform: 'none',
            backdropFilter: 'blur(10px)',
            boxShadow: open ? '0 0 30px rgba(51, 204, 255, 0.2)' : 'none',
            '&:hover': {
              bgcolor: 'rgba(51, 204, 255, 0.08)',
              borderColor: 'rgba(51, 204, 255, 0.5)',
              boxShadow: '0 0 20px rgba(51, 204, 255, 0.15)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          startIcon={
            <motion.div animate={{ rotate: open ? 180 : 0 }}>
              <Languages size={18} color={open ? "#33ccff" : "#64748b"} />
            </motion.div>
          }
          endIcon={
            <ChevronDown 
              size={14} 
              style={{ 
                transform: open ? 'rotate(180deg)' : 'none', 
                transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                color: open ? '#33ccff' : '#444'
              }} 
            />
          }
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography sx={{ 
              fontSize: '0.8rem', 
              fontWeight: 900, 
              fontFamily: 'Syncopate', 
              letterSpacing: 1.5,
              color: open ? '#33ccff' : 'white'
            }}>
              {activeLang.name.toUpperCase()}
            </Typography>
            <Box sx={{ 
              px: 1, py: 0.2, borderRadius: 1, 
              bgcolor: 'rgba(255,255,255,0.05)', 
              fontSize: '0.6rem', color: '#555',
              fontWeight: 900,
              fontFamily: 'monospace'
            }}>
              {activeLang.flag}
            </Box>
          </Stack>
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        transitionDuration={400}
        PaperProps={{
          sx: {
            mt: 1.5,
            bgcolor: 'rgba(13, 17, 23, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
            minWidth: 240,
            overflow: 'hidden',
            p: 1
          }
        }}
      >
        <Box sx={{ p: 2, pb: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.03)', mb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
           <Box sx={{ p: 1, bgcolor: 'rgba(51, 204, 255, 0.1)', borderRadius: 1.5, color: '#33ccff' }}>
              <Globe size={16} />
           </Box>
           <Box>
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 900, letterSpacing: 2, display: 'block', fontSize: '0.65rem' }}>DOCK_LOCALIZATION</Typography>
              <Typography variant="caption" sx={{ color: '#444', fontWeight: 700, fontSize: '0.55rem' }}>SELECT_DOCUMENT_INTERFACE</Typography>
           </Box>
        </Box>

        <Stack spacing={0.5}>
          {languages.map((lang, index) => (
            <MenuItem 
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              sx={{
                py: 2,
                px: 2,
                mx: 0.5,
                borderRadius: '12px',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                bgcolor: currentLanguage === lang.code ? 'rgba(51, 204, 255, 0.05)' : 'transparent',
                border: '1px solid',
                borderColor: currentLanguage === lang.code ? 'rgba(51, 204, 255, 0.2)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  transform: 'translateX(8px)',
                  '& .lang-name': { color: '#33ccff' },
                  '& .lang-flag': { transform: 'scale(1.2) rotate(5deg)' }
                }
              }}
            >
              <Box className="lang-flag" sx={{ 
                fontSize: '1.4rem', 
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                filter: currentLanguage === lang.code ? 'none' : 'grayscale(0.5) opacity(0.5)'
              }}>
                {lang.flag}
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography className="lang-name" sx={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 800,
                  color: currentLanguage === lang.code ? '#33ccff' : '#cbd5e1',
                  transition: 'color 0.3s'
                }}>
                  {lang.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#444', fontSize: '0.65rem', fontWeight: 700 }}>
                  TYPE: {lang.label.toUpperCase()}
                </Typography>
              </Box>

              {currentLanguage === lang.code ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <Box sx={{ 
                    width: 8, height: 8, borderRadius: '50%', 
                    bgcolor: '#33ccff', boxShadow: '0 0 10px #33ccff' 
                  }} />
                </motion.div>
              ) : (
                <Check size={14} color="#1a1f26" />
              )}
            </MenuItem>
          ))}
        </Stack>

        <Box sx={{ mt: 1, p: 1.5, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.02)' }}>
           <Typography sx={{ color: '#333', fontSize: '0.6rem', fontWeight: 900, textAlign: 'center', letterSpacing: 1 }}>
              L10N_SYSTEM_CORE_V2.0
           </Typography>
        </Box>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
