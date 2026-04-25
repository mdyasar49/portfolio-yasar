/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders a high-fidelity "System Documentation" HUD.
 * It provides technical details about the portfolio's architecture,
 * deployment, and performance metrics, designed to impress technical HRs.
 */

import React, { useState } from 'react';
import { Box, Typography, Stack, IconButton, Paper, Divider, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, X, Server, Database, Globe, ShieldCheck } from 'lucide-react';

const DocumentationHUD = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extraction Logic: Fallback to empty defaults if backend data is missing
  const objective = profile?.engineeringObjective || {};
  const systemDNA = profile?.coreSystemDNA || [];
  const security = profile?.securityProtocols || [];
  const performance = profile?.performanceMetrics || [];

  return (
    <>
      {/* The Floating Trigger Button (Bottom Right) */}
      <Box sx={{ position: 'fixed', right: 30, bottom: 175, zIndex: 10001 }}>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              bgcolor: 'rgba(51, 204, 255, 0.1)',
              color: '#33ccff',
              p: 2,
              border: '1px solid rgba(51, 204, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 20px rgba(51, 204, 255, 0.2)',
              '&:hover': { bgcolor: 'rgba(51, 204, 255, 0.2)' },
            }}
          >
            {isOpen ? <X size={24} /> : <Book size={24} />}
          </IconButton>
        </motion.div>
        {!isOpen && (
          <Box
            sx={{
              position: 'absolute',
              right: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              mr: 2,
              px: 2,
              py: 0.5,
              bgcolor: 'rgba(0,0,0,0.8)',
              borderRadius: 2,
              border: '1px solid rgba(51, 204, 255, 0.1)',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#33ccff',
                fontWeight: 900,
                fontFamily: 'Syncopate',
                fontSize: '0.6rem',
              }}
            >
              TECHNICAL_SPECIFICATIONS
            </Typography>
          </Box>
        )}
      </Box>

      {/* The Documentation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: '-45%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-45%', x: '-50%' }}
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              zIndex: 10000,
              width: '90%',
              maxWidth: 400,
              pointerEvents: 'auto',
            }}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: '24px',
                background:
                  'linear-gradient(135deg, rgba(1, 4, 9, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(51, 204, 255, 0.2)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.9), inset 0 0 40px rgba(51, 204, 255, 0.05)',
                maxHeight: '75vh',
                overflowY: 'auto',
                position: 'relative',
                backgroundImage: `
                                linear-gradient(rgba(51, 204, 255, 0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(51, 204, 255, 0.05) 1px, transparent 1px)
                            `,
                backgroundSize: '30px 30px',
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(51, 204, 255, 0.3)',
                  borderRadius: '10px',
                  '&:hover': { background: '#33ccff' },
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  width: 20,
                  height: 20,
                  borderTop: '2px solid #33ccff',
                  borderLeft: '2px solid #33ccff',
                  opacity: 0.5,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  width: 20,
                  height: 20,
                  borderBottom: '2px solid #33ccff',
                  borderRight: '2px solid #33ccff',
                  opacity: 0.5,
                }}
              />

              <Stack spacing={4}>
                {/* --- SECTION 1: HEADER --- */}
                <Box sx={{ position: 'relative' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: '#33ccff',
                        borderRadius: '2px',
                        boxShadow: '0 0 10px #33ccff',
                      }}
                    />
                    <Typography
                      sx={{
                        color: '#33ccff',
                        fontWeight: 900,
                        fontFamily: 'Syncopate',
                        fontSize: '0.65rem',
                        letterSpacing: 2,
                      }}
                    >
                      ENGINEERING_BLUEPRINT_SR_2026
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 900,
                      fontFamily: 'Outfit',
                      letterSpacing: -1,
                    }}
                  >
                    Full-Stack <span style={{ color: '#6366f1' }}>System Map</span>
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(51, 204, 255, 0.1)' }} />

                {/* --- SECTION 2: SYSTEM FLOW VISUAL --- */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    borderRadius: 3,
                    border: '1px dashed rgba(51, 204, 255, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ p: 1, border: '1px solid #33ccff', borderRadius: 1, mb: 0.5 }}>
                        <Globe size={14} color="#33ccff" />
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: '0.5rem', color: '#33ccff' }}>
                        CLIENT
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: '1px',
                        width: 40,
                        bgcolor: 'rgba(51, 204, 255, 0.3)',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: -2,
                          width: 4,
                          height: 4,
                          borderTop: '1px solid #33ccff',
                          borderRight: '1px solid #33ccff',
                          transform: 'rotate(45deg)',
                        }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ p: 1, border: '1px solid #6366f1', borderRadius: 1, mb: 0.5 }}>
                        <Server size={14} color="#6366f1" />
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: '0.5rem', color: '#6366f1' }}>
                        ENGINE
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: '1px',
                        width: 40,
                        bgcolor: 'rgba(51, 204, 255, 0.3)',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: -2,
                          width: 4,
                          height: 4,
                          borderTop: '1px solid #33ccff',
                          borderRight: '1px solid #33ccff',
                          transform: 'rotate(45deg)',
                        }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ p: 1, border: '1px solid #00ffcc', borderRadius: 1, mb: 0.5 }}>
                        <Database size={14} color="#00ffcc" />
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: '0.5rem', color: '#00ffcc' }}>
                        PERSIST
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* --- SECTION 3: PROJECT EXPLANATION --- */}
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: '#64748b',
                      fontWeight: 900,
                      mb: 2,
                      display: 'block',
                      letterSpacing: 2,
                    }}
                  >
                    PROJECT_EXPLANATION
                  </Typography>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        mb: 1,
                        fontFamily: 'Outfit',
                      }}
                    >
                      {objective.title || 'System Core'}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                        lineHeight: 1.6,
                        textAlign: 'justify',
                        fontFamily: 'Outfit',
                      }}
                    >
                      {objective.description || 'System data not available.'}
                    </Typography>
                  </Box>
                </Box>

                {/* --- SECTION 4: ARCHITECTURE HIGHLIGHTS --- */}
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: '#64748b',
                      fontWeight: 900,
                      mb: 2,
                      display: 'block',
                      letterSpacing: 2,
                    }}
                  >
                    CORE_SYSTEM_DNA
                  </Typography>
                  <Grid container spacing={2}>
                    {systemDNA.map((item, idx) => (
                      <Grid item xs={12} key={idx}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: item.color,
                              fontSize: '0.65rem',
                              fontWeight: 900,
                              fontFamily: 'monospace',
                            }}
                          >
                            {item.val}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* --- SECTION 5: SECURITY PROTOCOLS --- */}
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: '#64748b',
                      fontWeight: 900,
                      mb: 2,
                      display: 'block',
                      letterSpacing: 2,
                    }}
                  >
                    SECURITY_PROTOCOLS
                  </Typography>
                  <Stack spacing={2}>
                    {security.map((s, i) => (
                      <Box
                        key={i}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: `1px solid ${s.color}22`,
                          bgcolor: `${s.color}05`,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <ShieldCheck size={18} color={s.color} />
                          <Box>
                            <Typography
                              sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 800 }}
                            >
                              {s.title}
                            </Typography>
                            <Typography
                              sx={{ color: s.color, fontSize: '0.6rem', fontWeight: 900 }}
                            >
                              {s.status}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* --- SECTION 6: PERFORMANCE --- */}
                <Box>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      bgcolor: 'rgba(51, 204, 255, 0.02)',
                      border: '1px solid rgba(51, 204, 255, 0.1)',
                    }}
                  >
                    <Grid container spacing={2}>
                      {performance.map((m, i) => (
                        <Grid item xs={4} key={i} sx={{ textAlign: 'center' }}>
                          <Typography
                            sx={{
                              color: m.color,
                              fontWeight: 900,
                              fontSize: '1.2rem',
                              fontFamily: 'Syncopate',
                            }}
                          >
                            {m.val}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#444', fontWeight: 900, fontSize: '0.55rem' }}
                          >
                            {m.label}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    color: '#111',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    letterSpacing: 5,
                    pt: 2,
                    opacity: 0.5,
                  }}
                >
                  &lt; SYSTEM_BLUEPRINT_TERMINATED /&gt;
                </Typography>
              </Stack>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DocumentationHUD;
