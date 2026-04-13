import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Tooltip, Stack, Typography, Chip, Container, Divider, Modal, Fade } from '@mui/material';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, Printer, ArrowLeft, FileText, ShieldCheck, Cpu, Database, Share2, Info, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import API_BASE_URL from '../config';

const Resume = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const resumeApi = API_BASE_URL ? `${API_BASE_URL}/profile` : '';
  const iframeSrc = resumeApi
    ? `/resume-pro/index.html?api=${encodeURIComponent(resumeApi)}`
    : '/resume-pro/index.html';

  // 3D Parallax Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  useEffect(() => {
    // 1. Initial Page Load Animation
    const timer = setTimeout(() => setIsLoaded(true), 800);

    // 2. High-Premium Auto-Dispatch Feature (Download Only Mode)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('system_dispatch') === 'true') {
      setIsDispatching(true);
      const dispatchTimer = setTimeout(() => {
        handleDownload();
      }, 500); // High-speed dispatch
      return () => { clearTimeout(timer); clearTimeout(dispatchTimer); };
    }

    return () => clearTimeout(timer);
  }, []);

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
    } else {
      window.open('/resume-pro/A_MOHAMED_YASAR_RESUME.pdf', '_blank');
    }
  };

  const handleShare = () => {
    setIsSelectorOpen(true);
  };

  const executeEmailDispatch = () => {
    setIsSelectorOpen(false);
    const resumeUrl = `${window.location.origin}${window.location.pathname}?system_dispatch=true`;
    const subject = encodeURIComponent("A. Mohamed Yasar | Authenticated Engineering Portfolio & Asset Dispatch");
    const body = encodeURIComponent(
      `[ AUTHENTICATED_ACCESS_REQUEST ]\n\n` +
      `A secure connection has been established to grant you access to the live professional architecture and engineering profile of A. Mohamed Yasar.\n\n` +
      `[ SECURE_PORTAL_LOGON ]\n${resumeUrl}\n\n` +
      `VERIFICATION_PROTOCOL: Upon entering the gateway via the secure link above, the system will automatically extract and deliver the validated PDF Resume asset directly to your device.\n\n` +
      `DISPATCH_ID: ${Math.random().toString(36).substring(7).toUpperCase()}\n` +
      `Core Infrastructure v4.0.5 | Built with MERN`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const executeAssetExtraction = async () => {
    setIsSelectorOpen(false);
    setIsDispatching(true); // Reuse the dispatch overlay for feedback

    try {
      const frame = document.getElementById('resume-frame');
      let pdfBlob;
      
      // 1. Generate PDF snapshot from the index.html content
      if (frame && frame.contentWindow.getPDFBlob) {
        pdfBlob = await frame.contentWindow.getPDFBlob();
      } else {
        const response = await fetch('/resume-pro/A_MOHAMED_YASAR_RESUME.pdf');
        if (response.ok) pdfBlob = await response.blob();
      }

      if (!pdfBlob) throw new Error("Asset module unreachable");

      const file = new File([pdfBlob], "A_MOHAMED_YASAR_RESUME.pdf", { type: "application/pdf" });

      // 2. Intelligence: Check if we can share the file directly (Mobile Priority)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "A. Mohamed Yasar - Technical Asset",
          text: "Directly sharing the professional PDF engine export of A. Mohamed Yasar.",
          files: [file],
        });
      } else {
        // 3. Fallback: Desktop direct download
        handleDownload();
      }
    } catch (error) {
      console.error("Extraction Dispatch Failure:", error);
      // Final fallback to simple download
      handleDownload();
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <Box 
      onMouseMove={handleMouseMove}
      sx={{ 
        minHeight: '100vh', 
        bgcolor: '#02040a',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        perspective: '2000px',
        pt: { xs: 14, md: 5 },
        pb: 10,
        willChange: 'scroll-position'
      }}
    >
      <SEO title="Elite Resume | A. Mohamed Yasar" description="Access the high-tier professional resume and architecture profile of A. Mohamed Yasar." />
      
      {/* High-Premium Dispatch Overlay (Download Only Mode) */}
      <AnimatePresence>
        {isDispatching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 5000,
              backgroundColor: '#02040a',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(20px)',
              overflowY: 'auto',
              padding: '24px 16px'
            }}
          >
            <Stack spacing={4} alignItems="center">
              <Box sx={{ width: 100, height: 100, position: 'relative' }}>
                 <Box sx={{ 
                   position: 'absolute', inset: 0, borderRadius: '50%', 
                   border: '2px solid rgba(51, 204, 255, 0.1)',
                   borderTop: '2px solid #33ccff',
                   animation: 'spin 1s linear infinite'
                 }} />
                 <ShieldCheck size={40} color="#33ccff" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: 3, mb: 1 }}>DISPATCHING_ASSET</Typography>
                <Typography variant="caption" sx={{ color: '#444', fontFamily: 'monospace' }}>SECURE_CHANNEL_ESTABLISHED | M_YASAR.PDF</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>Your professional asset download will start momentarily...</Typography>
              <Button onClick={() => setIsDispatching(false)} variant="text" sx={{ color: '#334155', fontSize: '0.6rem' }}>RETURN_TO_PORTAL</Button>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asset Dispatch Selector Modal */}
      <Modal
        open={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        closeAfterTransition
      >
        <Fade in={isSelectorOpen}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: 400 }, 
            maxHeight: { xs: '88vh', sm: '80vh' },
            overflowY: 'auto',
            bgcolor: 'rgba(13, 17, 23, 0.95)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(51, 204, 255, 0.3)',
            boxShadow: '0 0 100px rgba(0,0,0,1), 0 0 30px rgba(51, 204, 255, 0.1)',
            borderRadius: 4, 
            p: { xs: 3, sm: 4 }, 
            outline: 'none'
          }}>
            <Stack spacing={4}>
              <Box>
                <Typography sx={{ fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.75rem', color: '#33ccff', letterSpacing: 3, mb: 1 }}>SELECT_DISPATCH_PROTOCOL</Typography>
                <Divider sx={{ borderColor: 'rgba(51, 204, 255, 0.1)' }} />
              </Box>

              <Stack spacing={2}>
                <Button 
                  fullWidth 
                  onClick={executeEmailDispatch}
                  sx={{ 
                    py: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', borderRadius: 2, display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start', px: 3,
                    '&:hover': { bgcolor: 'rgba(51, 204, 255, 0.05)', borderColor: '#33ccff' }
                  }}
                >
                  <Typography sx={{ fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Send size={16} color="#33ccff" /> SYSTEM_DISPATCH [EMAIL]
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#555', ml: 3.2 }}>Direct browser-bound sharing via Gmail</Typography>
                </Button>

                <Button 
                  fullWidth 
                  onClick={executeAssetExtraction}
                  sx={{ 
                    py: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', borderRadius: 2, display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start', px: 3,
                    '&:hover': { bgcolor: 'rgba(0, 255, 204, 0.05)', borderColor: '#00ffcc' }
                  }}
                >
                  <Typography sx={{ fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Download size={16} color="#00ffcc" /> ASSET_EXTRACTION [PDF]
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#555', ml: 3.2 }}>Local PDF compilation and direct download</Typography>
                </Button>
              </Stack>

              <Button onClick={() => setIsSelectorOpen(false)} sx={{ color: '#444', fontSize: '0.65rem' }}>CANCEL_AND_RETURN</Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      {/* Dynamic Background Grid */}
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.1,
        backgroundImage: 'radial-gradient(#33ccff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Floating Tech Accents */}
      <Box sx={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.2, filter: 'blur(1px)' }}>
        <Cpu size={120} color="#33ccff" />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '10%', right: '5%', opacity: 0.2, filter: 'blur(1px)' }}>
        <Database size={150} color="#ff3366" />
      </Box>

      {/* Header Info Overlay */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ position: 'fixed', top: 30, left: 40, zIndex: 1000 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ p: 1, bgcolor: '#ff3366', borderRadius: '8px', color: 'white' }}>
                <ShieldCheck size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#ff3366', fontWeight: 900, display: 'block', letterSpacing: 2 }}>ENCRYPTED_ASSET_ACCESS</Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 700, fontFamily: 'Syncopate' }}>RESUME_PROTO_v4.0</Typography>
              </Box>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Toolbar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ position: 'fixed', bottom: 40, zIndex: 1000 }}
      >
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            background: 'rgba(1, 4, 9, 0.8)',
            backdropFilter: 'blur(20px)',
            p: 1.5,
            px: 3,
            borderRadius: 50,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          <Tooltip title="BACK_TO_DASHBOARD">
            <IconButton onClick={() => navigate(-1)} sx={{ color: '#888', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
              <ArrowLeft size={22} />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />

          <Button 
            variant="contained" 
            startIcon={<Download size={20} />}
            onClick={handleDownload}
            sx={{ 
              background: 'linear-gradient(45deg, #ff3366, #ff9933)',
              color: 'white',
              fontWeight: 900,
              px: 4,
              borderRadius: 50,
              fontFamily: 'Syncopate',
              fontSize: '0.75rem',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              boxShadow: '0 10px 20px rgba(255,51,102,0.3)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 30px rgba(255,51,102,0.4)' }
            }}
          >
            PULL_PDF
          </Button>

          <Tooltip title="LIVE_PRINT">
            <IconButton onClick={handlePrint} sx={{ color: '#888', '&:hover': { color: '#33ccff', bgcolor: 'rgba(51, 204, 255, 0.1)' } }}>
              <Printer size={22} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="SHARE_LOGIC">
            <IconButton 
              onClick={handleShare} 
              sx={{ color: '#888', '&:hover': { color: '#00ffcc', bgcolor: 'rgba(0, 255, 204, 0.1)' } }}>
              <Share2 size={22} />
            </IconButton>
          </Tooltip>
        </Stack>
      </motion.div>

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <motion.div
           style={{ 
             rotateX, rotateY, zIndex: 10, transformStyle: "preserve-3d",
             width: 'fit-content', position: 'relative'
           }}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Holographic Brackets */}
          <Box sx={{
             position: 'absolute', top: -30, left: -30, width: 80, height: 80,
             borderTop: '4px solid #33ccff', borderLeft: '4px solid #33ccff',
             borderRadius: '20px 0 0 0', opacity: 0.6
          }} />
          <Box sx={{
             position: 'absolute', bottom: -30, right: -30, width: 80, height: 80,
             borderBottom: '4px solid #ff3366', borderRight: '4px solid #ff3366',
             borderRadius: '0 0 20px 20px', opacity: 0.6
          }} />

          {/* Technical Specs Overlay */}
          <Box sx={{ position: 'absolute', top: 20, right: -120, display: { xs: 'none', lg: 'block' } }}>
             <Stack spacing={1}>
                {['RESOLUTION: 2400x3200', 'ASSET_STATE: VERIFIED', 'SECURITY_LAYER: AES-256'].map(t => (
                   <Typography key={t} variant="caption" sx={{ color: '#334155', fontWeight: 900, fontFamily: 'monospace', display: 'block' }}>&gt; {t}</Typography>
                ))}
             </Stack>
          </Box>

          <Box sx={{ 
            width: { xs: '95vw', sm: '85vw', md: '210mm' }, 
            height: { xs: '120vw', sm: '120vh', md: '297mm' }, 
            backgroundColor: 'white',
            borderRadius: '4px',
            position: 'relative',
            boxShadow: '0 80px 160px rgba(0,0,0,0.9), 0 0 100px rgba(51, 204, 255, 0.15)',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.05)'
          }}>
            {/* Holographic Scan Beam */}
            <motion.div 
               animate={{ top: ['0%', '100%', '0%'] }}
               transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
               style={{
                 position: 'absolute', left: 0, right: 0, height: '3px',
                 background: 'linear-gradient(90deg, transparent, #33ccff, transparent)',
                 boxShadow: '0 0 20px #33ccff',
                 zIndex: 10,
                 opacity: 0.4,
                 pointerEvents: 'none',
                 willChange: 'transform, top'
               }}
            />

            <iframe 
               id="resume-frame"
               src={iframeSrc}
               title="Professional Elite Resume"
               width="100%"
               height="100%"
               style={{ border: 'none', background: 'white' }}
            />
          </Box>
          
          {/* Document Footer */}
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 5, opacity: 0.8 }}>
             <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, bgcolor: 'rgba(51, 204, 255, 0.1)', borderRadius: 1 }}>
                   <FileText size={18} color="#33ccff" />
                </Box>
                <Box>
                  <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '0.8rem', letterSpacing: 2 }}>M_YASAR.DOCX</Typography>
                  <Typography variant="caption" sx={{ color: '#444' }}>SIZE: 2.45 MB | TYPE: PDF_EXPORT</Typography>
                </Box>
             </Stack>
             <Stack direction="row" spacing={3} alignItems="center">
                <Tooltip title="VERIFIED_ENGINEER"><Chip label="ATS_VERIFIED" size="small" sx={{ bgcolor: 'rgba(0, 255, 204, 0.05)', color: '#00ffcc', borderColor: 'rgba(0, 255, 204, 0.3)', fontWeight: 900, fontSize: '0.6rem' }} variant="outlined" /></Tooltip>
                <IconButton sx={{ color: '#444' }}><Info size={16} /></IconButton>
             </Stack>
          </Stack>
        </motion.div>
      </Container>

      <style>
        {`
          @keyframes glow-pulse { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
          iframe::-webkit-scrollbar { width: 6px; }
          iframe::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.4); border-radius: 10px; }
          iframe::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
        `}
      </style>
    </Box>
  );
};

export default Resume;
