/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This module serves as the primary technical documentation portal for the
 * application. It dynamically renders Markdown files (README and Architecture),
 * provides a trilingual translation system (English, Tamil, Tanglish) using
 * the translateService, and features interactive project structure and
 * engineering roadmap explorers.
 */

import React, { useState, useEffect } from 'react';
// Material UI components for the documentation layout and interactive elements
import {
  Box,
  Typography,
  Stack,
  Grid,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Tabs,
  Tab,
  Drawer,
} from '@mui/material';
// Framer Motion for high-fidelity entrance and state-change animations
import { motion, AnimatePresence } from 'framer-motion';
// Icons for technical navigation and status identifiers
import {
  Book,
  Terminal,
  Cpu,
  Hash,
  Activity,
  ChevronRight,
  Layout,
  Layers,
  Zap,
  ShieldCheck,
  Github,
  Globe,
  Search,
  Command,
  RefreshCw,
  Copy,
  Check,
  Menu,
} from 'lucide-react';
// ReactMarkdown for rendering backend-provided Markdown content
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
// Translation services for the "Core Architecture" deep-dive
import LanguageSelector, { languages } from '../components/LanguageSelector';
import { translateText, transliterateToThanglish } from '../services/translateService';

/**
 * [CopyButton Component]
 * A premium interactive button that copies text to the clipboard with visual feedback.
 */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <IconButton
      onClick={handleCopy}
      className="copy-button"
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 50,
        bgcolor: 'rgba(1, 4, 9, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        color: copied ? '#00ffcc' : '#888',
        opacity: 0,
        transform: 'scale(0.8)',
        transition: 'all 0.3s',
      }}
      size="small"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check size={14} />
          </motion.div>
        ) : (
          <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Copy size={14} />
          </motion.div>
        )}
      </AnimatePresence>
    </IconButton>
  );
};

const Documentation = ({ profile }) => {
  const navigate = useNavigate();
  // State for tracking current documentation view and translation settings
  const [activeSection, setActiveSection] = useState('readme');
  const [readmeContent, setReadmeContent] = useState(profile?.readme || '');
  const [projectContent, setProjectContent] = useState(profile?.projectExplanation || '');
  const [isLoading, setIsLoading] = useState(!profile?.readme);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedDoc, setTranslatedDoc] = useState(profile?.projectExplanation || '');
  const [logs, setLogs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [archLanguage, setArchLanguage] = useState('en');
  const [isNavOpen, setIsNavOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Navigation schema for the sidebar and search overlay
  const navItems = [
    { name: 'System Overview', path: 'readme', type: 'doc', icon: <Book size={16} /> },
    { name: 'Core Architecture', path: 'explanation', type: 'doc', icon: <Layers size={16} /> },
    { name: 'Tech Stack', path: 'dev-stack', type: 'doc', icon: <Zap size={16} /> },
    { name: 'Network Status', path: 'api-status', type: 'doc', icon: <Activity size={16} /> },
    { name: 'Frontend Roadmap', path: 'roadmap', type: 'doc', icon: <Layout size={16} /> },
    { name: 'Home / About', path: '/', type: 'page', icon: <Globe size={16} /> },
    { name: 'Professional Resume', path: '/resume', type: 'page', icon: <Layout size={16} /> },
    { name: 'Project Gallery', path: '/projects', type: 'page', icon: <Cpu size={16} /> },
  ];

  const filteredNav = navItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /**
   * [Keyboard Protocol]
   * Listen for Command+K to trigger the global search gateway.
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearching((prev) => !prev);
      }
      if (e.key === 'Escape') setIsSearching(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * [Live Telemetry Simulation]
   * Generates mock system events for visual engagement in the sidebar logs.
   */
  useEffect(() => {
    const logInterval = setInterval(() => {
      const actions = [
        'GET_PROFILE',
        'FETCH_SCHEMA',
        'RESOLVE_DNS',
        'VALIDATE_CORS',
        'PING_DB',
        'CACHE_RELOAD',
      ];
      const newLog = {
        time: new Date().toLocaleTimeString(),
        action: actions[Math.floor(Math.random() * actions.length)],
        status: Math.random() > 0.1 ? 'SUCCESS' : 'PENDING',
      };
      setLogs((prev) => [newLog, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(logInterval);
  }, []);

  /**
   * [Markdown Content Hydration]
   * Synchronizes the documentation state with the profile object or fetches
   * static fallback files from the public directory.
   */
  useEffect(() => {
    if (profile?.readme && profile?.projectExplanation) {
      setReadmeContent(profile.readme);
      setProjectContent(profile.projectExplanation);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const fetchDocs = async () => {
      try {
        const timestamp = new Date().getTime();
        const [readmeRes, projectRes] = await Promise.all([
          fetch(`${process.env.PUBLIC_URL}/docs/README.md?t=${timestamp}`),
          fetch(`${process.env.PUBLIC_URL}/docs/PROJECT_EXPLANATION.md?t=${timestamp}`),
        ]);

        const readmeText = await readmeRes.text();
        const projectText = await projectRes.text();

        setReadmeContent(
          readmeText.trim().startsWith('<!DOCTYPE html>') ? '# SYSTEM_INITIALIZING...' : readmeText,
        );
        setProjectContent(
          projectText.trim().startsWith('<!DOCTYPE html>')
            ? '# ARCHITECTURE_SYNC_PENDING...'
            : projectText,
        );
      } catch (error) {
        console.error('Error fetching docs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, [profile]);

  /**
   * [Dynamic Translation Engine]
   * Triggers the translateService when the architecture language is changed.
   * Supports trilingual "Master View" (English + Tamil + Tanglish).
   */
  useEffect(() => {
    const performTranslation = async () => {
      if (!projectContent || archLanguage === 'en') {
        setTranslatedDoc(projectContent);
        return;
      }

      setIsTranslating(true);
      try {
        if (archLanguage === 'all') {
          // Constructing the trilingual composite view
          const lines = projectContent.split('\n');
          const trilingualLines = await Promise.all(
            lines.map(async (line) => {
              if (!line.trim() || line.startsWith('#') || line.startsWith('---')) return line;
              const taLine = await translateText(line, 'ta');
              const thLine = transliterateToThanglish(taLine);
              return `**[EN]** ${line}\n\n**[TA]** ${taLine}\n\n**[TH]** ${thLine}`;
            }),
          );
          setTranslatedDoc(trilingualLines.join('\n\n'));
        } else {
          const result = await translateText(projectContent, archLanguage);
          setTranslatedDoc(result);
        }
      } catch (err) {
        console.error('Translation Failed', err);
      } finally {
        setIsTranslating(false);
      }
    };

    if (activeSection === 'explanation') performTranslation();
  }, [archLanguage, projectContent, activeSection]);

  const handleNav = (item) => {
    if (item.type === 'doc') setActiveSection(item.path);
    else navigate(item.path);
    setIsSearching(false);
    setSearchQuery('');
  };

  /**
   * [ProjectStructure Component]
   * Visualizes the codebase hierarchy using a nested recursive tree.
   */
  const ProjectStructure = () => {
    const tree = [
      {
        name: 'client',
        type: 'folder',
        children: [
          {
            name: 'src',
            type: 'folder',
            children: [
              {
                name: 'components',
                type: 'folder',
                children: [{ name: 'LanguageSelector.js', type: 'file', highlight: true }],
              },
              {
                name: 'pages',
                type: 'folder',
                children: [{ name: 'Documentation.js', type: 'file', highlight: true }],
              },
            ],
          },
        ],
      },
      {
        name: 'server',
        type: 'folder',
        children: [{ name: 'data.json', type: 'file', highlight: true }],
      },
    ];

    const renderTree = (items, depth = 0) => (
      <Box sx={{ pl: depth * 3 }}>
        {items.map((item, i) => (
          <Box key={i} sx={{ mb: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography sx={{ color: '#444', fontFamily: 'monospace' }}>{'|--'}</Typography>
              <Box sx={{ color: item.type === 'folder' ? '#33ccff' : '#64748b' }}>
                {item.type === 'folder' ? <Layers size={14} /> : <Hash size={14} />}
              </Box>
              <Typography
                sx={{
                  color: item.highlight ? 'white' : '#cbd5e1',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                }}
              >
                {item.name}
              </Typography>
            </Stack>
            {item.children && renderTree(item.children, depth + 1)}
          </Box>
        ))}
      </Box>
    );

    return (
      <Box
        sx={{
          p: 4,
          bgcolor: 'rgba(0,0,0,0.3)',
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.03)',
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: '#555', fontWeight: 900, mb: 3, display: 'block' }}
        >
          PROJECT_TREE_EXPLORER v2.0
        </Typography>
        {renderTree(tree)}
      </Box>
    );
  };

  // Define Markdown visual theme
  const markdownStyles = {
    color: '#cbd5e1',
    lineHeight: 2,
    fontSize: '1rem',
    '& h1': {
      fontSize: '2.2rem',
      borderBottom: '2px solid rgba(51, 204, 255, 0.2)',
      pb: 3,
      color: '#33ccff',
    },
    '& h2': { fontSize: '1.6rem', borderLeft: '4px solid #ff3366', pl: 3, py: 1 },
    '& code': {
      bgcolor: 'rgba(0, 255, 204, 0.1)',
      color: '#00ffcc',
      p: '2px 8px',
      borderRadius: 1.5,
      fontFamily: 'monospace',
    },
    '& pre': {
      bgcolor: '#05070a',
      p: 4,
      borderRadius: 4,
      border: '1px solid rgba(255,255,255,0.08)',
      overflowX: 'auto',
    },
  };

  return (
    <Box
      sx={{
        bgcolor: '#02040a',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <SEO
        title="Engineering Documentation | A. Mohamed Yasar"
        description="Full technical documentation portal for the MERN Stack application."
      />

      {/* ── [SEARCH OVERLAY GATEWAY] ── */}
      <AnimatePresence>
        {isSearching && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearching(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 500,
                background: '#0d1117',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Search size={20} color="#33ccff" />
                <input
                  autoFocus
                  placeholder="FIND_DOCUMENTATION..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    flexGrow: 1,
                    outline: 'none',
                    fontSize: '1.2rem',
                    fontFamily: 'Syncopate',
                    fontWeight: 900,
                  }}
                />
              </Box>
              <Box sx={{ maxHeight: 400, overflowY: 'auto', p: 1.5 }}>
                {filteredNav.map((item, i) => (
                  <Box
                    key={i}
                    onClick={() => handleNav(item)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                    }}
                  >
                    <Box
                      sx={{
                        color: '#ff3366',
                        p: 1,
                        bgcolor: 'rgba(255,51,102,0.05)',
                        borderRadius: 1.5,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography sx={{ color: 'white', fontWeight: 800 }}>{item.name}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      {/* ── [TOP_BAR NAVIGATION] ── */}
      <Box
        sx={{
          height: 80,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, md: 5 },
          bgcolor: 'rgba(1, 4, 9, 0.9)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ p: 1, bgcolor: '#ff3366', borderRadius: '10px', color: 'white' }}>
            <Terminal size={22} />
          </Box>
          <Typography
            sx={{ color: 'white', fontWeight: 900, letterSpacing: 2, fontFamily: 'Syncopate' }}
          >
            SYSTEM_DOCS
          </Typography>
        </Stack>
        <Box
          onClick={() => setIsSearching(true)}
          sx={{
            width: 300,
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            p: 1.5,
            px: 2,
            borderRadius: 2,
            color: '#555',
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800 }}>
            QUICK_FIND...
          </Typography>
          <Typography
            variant="caption"
            sx={{ bgcolor: 'rgba(255,255,255,0.08)', px: 1, borderRadius: 1 }}
          >
            ⌘ K
          </Typography>
        </Box>
      </Box>

      {/* ── [DOCUMENTATION CONTENT HUB] ── */}
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        {!isMobile && (
          <Box
            sx={{
              width: 320,
              borderRight: '1px solid rgba(255,255,255,0.05)',
              p: 4,
              bgcolor: 'rgba(1, 4, 9, 0.7)',
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: '#333', fontWeight: 900, mb: 4, display: 'block' }}
            >
              RESOURCES
            </Typography>
            <Stack spacing={1.5}>
              {navItems.slice(0, 5).map((item) => (
                <Box
                  key={item.path}
                  onClick={() => setActiveSection(item.path)}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    bgcolor:
                      activeSection === item.path ? 'rgba(51, 204, 255, 0.08)' : 'transparent',
                    color: activeSection === item.path ? '#33ccff' : '#64748b',
                  }}
                >
                  {item.icon}{' '}
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 900 }}>
                    {item.name.toUpperCase()}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Box sx={{ flexGrow: 1, p: { xs: 3, md: 8 }, overflowY: 'auto', bgcolor: '#0b0e14' }}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Box
                sx={{
                  height: '50vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress sx={{ color: '#33ccff' }} />
                <Typography sx={{ mt: 4, color: '#334155', fontFamily: 'monospace' }}>
                  ESTABLISHING_TLS_CONNECTION...
                </Typography>
              </Box>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, mb: 6 }}>
                  {activeSection.toUpperCase()}
                </Typography>
                <Box
                  sx={{
                    p: { xs: 3, md: 8 },
                    bgcolor: 'rgba(1, 4, 9, 0.4)',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.03)',
                  }}
                >
                  <ReactMarkdown
                    components={{
                      p: (props) => <Typography variant="body1" sx={markdownStyles} {...props} />,
                      h1: (props) => <Typography variant="h1" sx={markdownStyles} {...props} />,
                      h2: (props) => <Typography variant="h2" sx={markdownStyles} {...props} />,
                      code: (props) => <Box component="code" sx={markdownStyles} {...props} />,
                      pre: ({ children }) => (
                        <Box
                          sx={{
                            position: 'relative',
                            my: 4,
                            '&:hover .copy-button': { opacity: 1 },
                          }}
                        >
                          <CopyButton text={children?.props?.children || ''} />
                          <Box component="pre" sx={markdownStyles['& pre']}>
                            {children}
                          </Box>
                        </Box>
                      ),
                    }}
                  >
                    {activeSection === 'readme'
                      ? readmeContent
                      : activeSection === 'explanation'
                        ? translatedDoc
                        : '# Section PENDING'}
                  </ReactMarkdown>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Documentation;
