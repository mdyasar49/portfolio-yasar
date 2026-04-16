import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, IconButton, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, Check, Circle } from 'lucide-react';

const codeSnippets = [
  {
    title: 'Advanced_State_Orchestration.js',
    language: 'javascript',
    code: `// Scalable State Pattern with Redux Toolkit
const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    initializeCore: (state) => {
      state.bootSequence = 'V3.0.4';
      state.isReady = true;
    },
    updateMetrics: (state, action) => {
      // Optimized state update with mutation safety
      const { latency, uptime } = action.payload;
      state.metrics = { ...state.metrics, latency, uptime };
    }
  }
});`
  },
  {
    title: 'Rest_API_Middleware.js',
    language: 'javascript',
    code: `// Resilience & Error Orchestration Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log critical failures to telemetry
  logger.error(\`[\${req.method}] \${req.url} >> \${err.message}\`);

  res.status(statusCode).json({
    status: 'FAIL',
    code: statusCode,
    message: err.message,
    trace: process.env.NODE_ENV === 'DEV' ? err.stack : null
  });
};`
  }
];

const CodeShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box id="codeshowcase" sx={{ py: 15, position: 'relative' }}>
      <Container maxWidth="lg">
        <Typography variant="overline" sx={{ color: '#ff3366', fontWeight: 900, letterSpacing: 6, textAlign: 'center', display: 'block', mb: 2 }}>
          ENGINEERING_DEEP_DIVE
        </Typography>
        <Typography variant="h2" sx={{ fontFamily: 'Syncopate', fontWeight: 900, textAlign: 'center', mb: 10, fontSize: { xs: '2rem', md: '3.5rem' } }}>
          TECHNICAL <span style={{ color: '#33ccff' }}>BLUEPRINTS</span>
        </Typography>

        <Paper sx={{ 
          bgcolor: '#0d1117', 
          borderRadius: 4, 
          overflow: 'hidden', 
          border: '1px solid rgba(51, 204, 255, 0.1)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
        }}>
          {/* Editor Header */}
          <Box sx={{ bgcolor: '#161b22', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1}>
              <Circle size={12} fill="#ff5f56" stroke="none" />
              <Circle size={12} fill="#ffbd2e" stroke="none" />
              <Circle size={12} fill="#27c93f" stroke="none" />
            </Stack>
            
            <Stack direction="row" spacing={2}>
              {codeSnippets.map((snippet, i) => (
                <Box 
                  key={i} 
                  onClick={() => setActiveTab(i)}
                  sx={{ 
                    cursor: 'pointer',
                    px: 3, py: 1, 
                    bgcolor: activeTab === i ? '#0d1117' : 'transparent',
                    borderRadius: '8px 8px 0 0',
                    border: activeTab === i ? '1px solid rgba(51, 204, 255, 0.1)' : 'none',
                    borderBottom: activeTab === i ? '2px solid #33ccff' : 'none',
                    display: 'flex', alignItems: 'center', gap: 1
                  }}
                >
                  <Terminal size={14} color={activeTab === i ? '#33ccff' : '#444'} />
                  <Typography variant="caption" sx={{ color: activeTab === i ? 'white' : '#666', fontWeight: 900, fontFamily: 'monospace' }}>
                    {snippet.title}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <IconButton onClick={handleCopy} size="small" sx={{ color: '#444', '&:hover': { color: '#33ccff' } }}>
              {copied ? <Check size={18} color="#00ffcc" /> : <Copy size={18} />}
            </IconButton>
          </Box>

          {/* Code Body */}
          <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 300, position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '1rem', color: '#e6edf3', lineHeight: 1.6, overflowX: 'auto' }}>
                  <code>{codeSnippets[activeTab].code}</code>
                </pre>
              </motion.div>
            </AnimatePresence>
            
            {/* Watermark */}
            <Typography sx={{ 
              position: 'absolute', bottom: 20, right: 30, 
              color: 'rgba(51, 204, 255, 0.05)', fontWeight: 900, 
              fontFamily: 'Syncopate', fontSize: '3rem', pointerEvents: 'none' 
            }}>
              YASAR_OS
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CodeShowcase;
