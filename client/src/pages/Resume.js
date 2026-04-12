import React from 'react';
import { Box, Button, IconButton, Tooltip, Stack } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, Printer, ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Resume = () => {
  const navigate = useNavigate();

  // 3D Parallax Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handlePrint = () => {
    try {
      const frame = document.getElementById('resume-frame');
      if (frame) {
        frame.contentWindow.focus();
        frame.contentWindow.print();
      }
    } catch (e) {
      window.print();
    }
  };

  const handleDownload = () => {
    const frame = document.getElementById('resume-frame');
    if (frame && frame.contentWindow.downloadAsPDF) {
      frame.contentWindow.downloadAsPDF();
    }
  };

  return (
    <Box 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#030712',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '2000px',
        pt: { xs: 12, md: 6 },
        pb: 4,
        px: { xs: 2, md: 4 }
      }}
    >
      <SEO title="Professional Resume" description="High-end professional resume of A. Mohamed Yasar" />
      
      {/* Background Ambience */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 80%)'
      }} />

      {/* Action Toolbar */}
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          position: 'fixed', 
          top: { xs: 80, md: 25 }, 
          zIndex: 100, 
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(15px)',
          p: 1.2,
          px: 2,
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}
      >
        <Tooltip title="Exit Preview">
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
            <ArrowLeft size={20} />
          </IconButton>
        </Tooltip>
        
        <Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />

        <Tooltip title="Save as PDF">
          <Button 
            variant="contained" 
            startIcon={<Download size={18} />}
            onClick={handleDownload}
            sx={{ 
              bgcolor: '#6366f1', 
              fontWeight: 800,
              px: { xs: 3, md: 4 },
              borderRadius: 3,
              textTransform: 'uppercase',
              letterSpacing: 1,
              '&:hover': { bgcolor: '#4f46e5', transform: 'translateY(-2px)' }
            }}
          >
            Download PDF
          </Button>
        </Tooltip>

        <Tooltip title="Print Document">
          <IconButton onClick={handlePrint} sx={{ color: '#aaa', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
            <Printer size={20} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* 3D Tilted Resume Frame */}
      <motion.div
        style={{ 
          rotateX, 
          rotateY, 
          zIndex: 10,
          transformStyle: "preserve-3d",
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Box sx={{ 
          width: { xs: '95vw', sm: '85vw', md: '210mm' }, 
          height: { xs: '85vh', sm: '90vh', md: '297mm' }, 
          backgroundColor: 'white',
          borderRadius: 1,
          position: 'relative',
          boxShadow: '0 60px 120px rgba(0,0,0,0.9), 0 0 80px rgba(99, 102, 241, 0.1)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Subtle Document Overlay */}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 5,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%)',
          }} />

          <iframe 
             id="resume-frame"
             src="/resume-pro/index.html" 
             title="Professional ATS Resume"
             width="100%"
             height="100%"
             style={{ border: 'none' }}
          />
        </Box>
        
        {/* Document Label (Virtual Shadow Effect) */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 4, opacity: 0.5 }}>
          <FileText size={16} color="white" />
          <Box sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, letterSpacing: 1.5 }}>
            A_MOHAMED_YASAR_RESUME.PDF
          </Box>
        </Stack>
      </motion.div>

      <style>
        {`
          iframe::-webkit-scrollbar { width: 6px; }
          iframe::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        `}
      </style>
    </Box>
  );
};

export default Resume;
