/**
 * [React.js Component - Elite Resume Portal]
 * Technologies: React.js, Framer Motion, Material UI, Lucide Icons
 * Purpose: This component acts as a high-tier interactive gateway for viewing and 
 * downloading the professional engineering resume. It utilizes a 3D parallax 
 * engine for visual depth and orchestrates secure asset delivery via iFrame.
 */
import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Tooltip, Stack, Typography, Chip, Container, Divider, Modal, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, FileText, ShieldCheck, Cpu, Database, Info, Send } from 'lucide-react';
import SEO from '../components/SEO';

import API_BASE_URL from '../config';

const Resume = () => {
  // --- [SYSTEM_STATE_INITIALIZATION] ---
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const disableHeavyMotion = isMobile || prefersReducedMotion;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Resolve the API endpoint for the resume engine
  const resumeApi = API_BASE_URL ? `${API_BASE_URL}/profile` : '';
  const iframeSrc = resumeApi
    ? `/resume-pro/index.html?api=${encodeURIComponent(resumeApi)}`
    : '/resume-pro/index.html';

  // --- [3D_PARALLAX_ENGINE_CALCULATIONS] ---
  // These values track mouse movement to create a high-fidelity depth effect on the resume document.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  /**
   * handleMouseMove
   * @desc Calculates the cursor position relative to the container to drive the 3D rotation.
   */
  const handleMouseMove = (e) => {
    if (disableHeavyMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  /**
   * Lifecycle Manifest [Mounting]
   */
  useEffect(() => {
    // 1. Trigger initial entrance animation
    const timer = setTimeout(() => setIsLoaded(true), 800);

    // 2. High-Premium Auto-Dispatch Feature (Download Only Mode)
    // Detects if the user entered via a resume-dispatch link to auto-start the download.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('system_dispatch') === 'true') {
      setIsDispatching(true);
      const dispatchTimer = setTimeout(() => {
        handleDownload();
      }, 2500); 
      return () => { clearTimeout(timer); clearTimeout(dispatchTimer); };
    }

    return () => clearTimeout(timer);
  }, []);

  /**
   * handleDownload
   * @desc Triggers the asset extraction protocol. Communicates with the internal iframe 
   * to generate a high-resolution PDF.
   */
  const handleDownload = () => {
    const frame = document.getElementById('resume-frame');
    if (frame && frame.contentWindow.downloadAsPDF) {
      frame.contentWindow.downloadAsPDF();
    } else {
      // Fallback: Direct link to static asset if the dynamic engine fails to respond.
      window.open('/resume-pro/A_MOHAMED_YASAR_RESUME.pdf', '_blank');
    }
  };


  /**
   * executeEmailDispatch
   * @desc Orchestrates the construction of an authenticated dispatch link sent via email.
   */
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

  /**
   * executeAssetExtraction
   * @desc High-tier extraction protocol utilizing the experimental Web Share API 
   * for native mobile delivery or direct blob download for desktop.
   */
  const executeAssetExtraction = async () => {
    setIsSelectorOpen(false);
    setIsDispatching(true); 

    try {
      const frame = document.getElementById('resume-frame');
      let pdfBlob;
      
      // 1. Generate PDF snapshot from the index.html content rendered inside the iframe.
      if (frame && frame.contentWindow.getPDFBlob) {
        pdfBlob = await frame.contentWindow.getPDFBlob();
      }

      if (!pdfBlob) {
        handleDownload();
        return;
      }

      const file = new File([pdfBlob], "A_MOHAMED_YASAR_RESUME.pdf", { type: "application/pdf" });

      // 2. Intelligence: Check if we can share the file directly (Mobile Priority).
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "A. Mohamed Yasar - Technical Asset",
          text: "Directly sharing the professional PDF engine export of A. Mohamed Yasar.",
          files: [file],
        });
      } else {
        // 3. Fallback: Desktop direct download.
        handleDownload();
      }
    } catch (error) {
      console.error("Extraction Dispatch Failure:", error);
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
        px: { xs: 2, md: 0 }
      }}
    >
      <SEO title="Elite Resume | A. Mohamed Yasar" description="Access the high-tier professional resume and architecture profile of A. Mohamed Yasar." />
      
      {/* --- [ASSET_DISPATCH_OVERLAY] --- */}
      <AnimatePresence>
        {isDispatching && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 5000,
              backgroundColor: '#02040a', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)'
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

      {/* --- [PROTOCOL_SELECTOR_MODAL] --- */}
      <Modal
        open={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        closeAfterTransition
      >
        <Fade in={isSelectorOpen}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: 350 }, 
            bgcolor: 'rgba(13, 17, 23, 0.95)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(51, 204, 255, 0.3)',
            borderRadius: 3, p: { xs: 2.5, sm: 3.5 }, outline: 'none'
          }}>
            <Stack spacing={4}>
              <Box>
                <Typography sx={{ fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.75rem', color: '#33ccff', letterSpacing: 3, mb: 1 }}>SELECT_DISPATCH_PROTOCOL</Typography>
                <Divider sx={{ borderColor: 'rgba(51, 204, 255, 0.1)' }} />
              </Box>

              <Stack spacing={2}>
                <Button 
                   fullWidth onClick={executeEmailDispatch}
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
                   fullWidth onClick={executeAssetExtraction}
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

      {/* Background Decoratives */}
      <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#33ccff 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.2 }}><Cpu size={120} color="#33ccff" /></Box>

      {/* Identity Label Overlay */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            style={{ position: 'fixed', top: isMobile ? 16 : 30, left: isMobile ? 16 : 40, zIndex: 1000 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ p: 1, bgcolor: '#ff3366', borderRadius: '8px', color: 'white' }}><ShieldCheck size={20} /></Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#ff3366', fontWeight: 900, display: 'block', letterSpacing: 2 }}>ENCRYPTED_ASSET_ACCESS</Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 700, fontFamily: 'Syncopate' }}>RESUME_PROTO_v4.0</Typography>
              </Box>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- [CENTRAL_ASSET_GRID] --- */}
      <Container maxWidth="lg" sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <motion.div
           style={{ rotateX: disableHeavyMotion ? '0deg' : rotateX, rotateY: disableHeavyMotion ? '0deg' : rotateY, zIndex: 10, transformStyle: "preserve-3d", position: 'relative' }}
           initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}
        >
          {/* Document Framing UI */}
          <Box sx={{ position: 'absolute', top: -30, left: -30, width: 80, height: 80, borderTop: '4px solid #33ccff', borderLeft: '4px solid #33ccff', borderRadius: '20px 0 0 0', opacity: 0.6 }} />
          <Box sx={{ position: 'absolute', bottom: -30, right: -30, width: 80, height: 80, borderBottom: '4px solid #ff3366', borderRight: '4px solid #ff3366', borderRadius: '0 0 20px 20px', opacity: 0.6 }} />

          {/* IFrame Container (The Document Itself) */}
          <Box className="holographic-border animate-cyber-reveal" sx={{ 
            width: { xs: '95vw', sm: '85vw', md: '210mm' }, 
            height: { xs: '135vw', sm: '120vh', md: '297mm' }, 
            backgroundColor: 'white', position: 'relative', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.05)',
            boxShadow: '0 80px 160px rgba(0,0,0,0.9), 0 0 100px rgba(51, 204, 255, 0.15)'
          }}>
            <iframe 
               id="resume-frame" src={iframeSrc} title="Professional Resume Architecture"
               width="100%" height="100%" style={{ border: 'none', background: 'white' }}
            />
          </Box>
          
          {/* Action Dock */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
             <Button 
                variant="contained" size="large" onClick={() => setIsSelectorOpen(true)}
                startIcon={<Download size={22} />}
                sx={{ 
                    px: 6, py: 2, borderRadius: 10, bgcolor: '#33ccff', color: '#000', 
                    fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.8rem',
                    '&:hover': { bgcolor: '#00ffcc', transform: 'scale(1.05)' }
                }}
             >
                INITIALIZE_DOWNLOAD
             </Button>
          </Box>
        </motion.div>
      </Container>

      <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          iframe::-webkit-scrollbar { width: 6px; }
          iframe::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.4); border-radius: 10px; }
      `}</style>
    </Box>
  );
};

export default Resume;
