import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Grid, IconButton, Divider, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
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
  Command
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Documentation = ({ profile }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('readme');
  const [readmeContent, setReadmeContent] = useState('');
  const [projectContent, setProjectContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Quick Find Navigation Items
  const navItems = [
    { name: 'System Logistics', path: 'readme', type: 'doc', icon: <Book size={16} /> },
    { name: 'System Architecture', path: 'explanation', type: 'doc', icon: <Layers size={16} /> },
    { name: 'Tech Stack', path: 'dev-stack', type: 'doc', icon: <Zap size={16} /> },
    { name: 'Network Status', path: 'api-status', type: 'doc', icon: <Activity size={16} /> },
    { name: 'Home / About', path: '/', type: 'page', icon: <Globe size={16} /> },
    { name: 'Professional Resume', path: '/resume', type: 'page', icon: <Layout size={16} /> },
    { name: 'Project Gallery', path: '/projects', type: 'page', icon: <Cpu size={16} /> },
  ];

  const filteredNav = navItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Keyboard Shortcut CMD+K
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearching(prev => !prev);
      }
      if (e.key === 'Escape') setIsSearching(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Simulated Live API Logs
    const logInterval = setInterval(() => {
      const actions = ['GET_PROFILE', 'FETCH_SCHEMA', 'RESOLVE_DNS', 'VALIDATE_CORS', 'PING_DB', 'CACHE_RELOAD'];
      const newLog = {
        time: new Date().toLocaleTimeString(),
        action: actions[Math.floor(Math.random() * actions.length)],
        status: Math.random() > 0.1 ? 'SUCCESS' : 'PENDING'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchDocs = async () => {
      try {
        const timestamp = new Date().getTime();
        const [readmeRes, projectRes] = await Promise.all([
          fetch(`${process.env.PUBLIC_URL}/docs/README.md?t=${timestamp}`),
          fetch(`${process.env.PUBLIC_URL}/docs/PROJECT_EXPLANATION.md?t=${timestamp}`)
        ]);
        
        const readmeText = await readmeRes.text();
        const projectText = await projectRes.text();

        if (readmeText.trim().startsWith('<!DOCTYPE html>')) {
           setReadmeContent('# SYSTEM_INITIALIZING...\nDocumentation is currently being synced to the cloud. Please refresh in a moment.');
        } else {
           setReadmeContent(readmeText);
        }

        if (projectText.trim().startsWith('<!DOCTYPE html>')) {
           setProjectContent('# ARCHITECTURE_SYNC_PENDING...\nWaiting for system logistics update.');
        } else {
           setProjectContent(projectText);
        }
      } catch (error) {
        console.error('Error fetching docs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleNav = (item) => {
    if (item.type === 'doc') {
      setActiveSection(item.path);
    } else {
      navigate(item.path);
    }
    setIsSearching(false);
    setSearchQuery('');
  };

  const sections = [
    { id: 'readme', title: 'SYSTEM LOGISTICS', icon: <Book size={18} />, content: readmeContent, color: '#33ccff' },
    { id: 'explanation', title: 'SYSTEM ARCHITECTURE', icon: <Cpu size={18} />, content: projectContent, color: '#ff3366' },
  ];

  const sidebarItems = [
    { id: 'readme', label: 'SYSTEM LOGISTICS', icon: <Hash size={16} /> },
    { id: 'explanation', label: 'SYSTEM ARCHITECTURE', icon: <Layers size={16} /> },
    { id: 'dev-stack', label: 'DEVELOPMENT STACK', icon: <Zap size={16} /> },
    { id: 'api-status', label: 'NETWORK STATUS', icon: <Activity size={16} /> },
    { id: 'structure', label: 'FILESYSTEM', icon: <Hash size={16} /> },
  ];

  const ProjectStructure = () => {
    const tree = [
      { name: 'client', type: 'folder', children: [
        { name: 'public', type: 'folder', children: [
          { name: 'docs', type: 'folder', children: [{ name: 'README.md', type: 'file' }, { name: 'PROJECT_EXPLANATION.md', type: 'file' }] },
          { name: 'resume-pro', type: 'folder', highlight: true }
        ]},
        { name: 'src', type: 'folder', children: [
          { name: 'components', type: 'folder' },
          { name: 'pages', type: 'folder', children: [{ name: 'Documentation.js', type: 'file', highlight: true }] },
          { name: 'App.js', type: 'file' }
        ]}
      ]},
      { name: 'server', type: 'folder', children: [
        { name: 'controllers', type: 'folder' },
        { name: 'routes', type: 'folder' },
        { name: 'data.json', type: 'file', highlight: true },
        { name: 'app.js', type: 'file' }
      ]},
      { name: 'README.md', type: 'file' }
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
              <Typography sx={{ 
                color: item.highlight ? 'white' : '#cbd5e1', 
                fontSize: '0.85rem', 
                fontFamily: 'monospace',
                fontWeight: item.highlight ? 800 : 400,
                bgcolor: item.highlight ? 'rgba(0,255,204,0.1)' : 'transparent',
                px: 1, borderRadius: 0.5
              }}>
                {item.name}
              </Typography>
            </Stack>
            {item.children && renderTree(item.children, depth + 1)}
          </Box>
        ))}
      </Box>
    );

    return (
      <Box sx={{ p: 4, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.03)' }}>
        <Typography variant="caption" sx={{ color: '#555', fontWeight: 900, mb: 3, display: 'block' }}>PROJECT_TREE_EXPLORER v2.0</Typography>
        {renderTree(tree)}
      </Box>
    );
  };

  const markdownStyles = {
    color: '#cbd5e1',
    lineHeight: 2,
    fontSize: '1rem',
    '& h1, & h2, & h3': { color: 'white', fontWeight: 900, mb: 3, mt: 5, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 1 },
    '& h1': { 
      fontSize: '2.2rem', 
      borderBottom: '2px solid rgba(51, 204, 255, 0.2)', 
      pb: 3, 
      color: '#33ccff',
      textShadow: '0 0 30px rgba(51, 204, 255, 0.2)' 
    },
    '& h2': { fontSize: '1.6rem', borderLeft: '4px solid #ff3366', pl: 3, py: 1 },
    '& p': { mb: 3, textAlign: 'justify' },
    '& code': { bgcolor: 'rgba(0, 255, 204, 0.1)', color: '#00ffcc', p: '2px 8px', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', border: '1px solid rgba(0, 255, 204, 0.2)' },
    '& pre': { 
      bgcolor: '#05070a', p: 4, borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      my: 4,
      '& code': { bgcolor: 'transparent', p: 0, color: '#e2e8f0', border: 'none' }
    },
    '& ul, & ol': { pl: 4, mb: 4 },
    '& li': { mb: 1.5 },
    '& table': {
       width: '100%', borderCollapse: 'collapse', my: 4,
       '& th': { bgcolor: 'rgba(255,255,255,0.03)', p: 2, border: '1px solid rgba(255,255,255,0.08)', color: 'white' },
       '& td': { p: 2, border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }
    }
  };

  return (
    <Box sx={{ bgcolor: '#010409', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <SEO title="Engineering Dashboard" description="Full technical documentation portal for the MERN Stack application." />
      
      {/* QUICK FIND MODAL OVERLAY */}
      <AnimatePresence>
        {isSearching && (
          <Box sx={{ 
            position: 'fixed', inset: 0, zIndex: 9999, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 
          }}>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                onClick={() => setIsSearching(false)}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} 
             />
             <motion.div initial={{ scale: 0.95, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: -20 }}
                style={{ position: 'relative', width: '100%', maxWidth: 600, background: '#0d1117', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.8)' }}>
                
                <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Search size={20} color="#33ccff" />
                   <input 
                      autoFocus
                      placeholder="SEARCH_COMMAND..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ 
                        background: 'none', border: 'none', color: 'white', flexGrow: 1, outline: 'none',
                        fontSize: '1.2rem', fontFamily: 'Syncopate', fontWeight: 900
                      }}
                   />
                   <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', px: 1, borderRadius: 1, color: '#555', fontSize: '0.7rem' }}>ESC</Box>
                </Box>

                <Box sx={{ maxHeight: 400, overflowY: 'auto', p: 1.5 }}>
                   {filteredNav.length > 0 ? (
                     filteredNav.map((item, i) => (
                        <Box key={i} onClick={() => handleNav(item)}
                           sx={{ 
                             p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
                             transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.03)', transform: 'translateX(5px)' }
                           }}>
                           <Box sx={{ color: '#ff3366', p: 1, bgcolor: 'rgba(255,51,102,0.05)', borderRadius: 1.5 }}>{item.icon}</Box>
                           <Box flexGrow={1}>
                              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>{item.name}</Typography>
                              <Typography variant="caption" sx={{ color: '#555' }}>Type: {item.type.toUpperCase()}</Typography>
                           </Box>
                           <ChevronRight size={14} color="#333" />
                        </Box>
                     ))
                   ) : (
                      <Box sx={{ p: 10, textAlign: 'center' }}>
                         <Typography sx={{ color: '#333', fontWeight: 900, fontFamily: 'monospace' }}>NO_RESULTS_FOUND_FOR: "{searchQuery}"</Typography>
                      </Box>
                   )}
                </Box>
                
                <Box sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', gap: 2 }}>
                   <Stack direction="row" spacing={1} alignItems="center">
                      <Command size={10} color="#555" />
                      <Typography variant="caption" sx={{ color: '#555', fontWeight: 700 }}>TO_NAVIGATE</Typography>
                   </Stack>
                </Box>
             </motion.div>
          </Box>
        )}
      </AnimatePresence>

      {/* GLOBAL SCANNING EFFECT */}
      <Box sx={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: '1px', 
        background: 'linear-gradient(90deg, transparent, #ff3366, transparent)', 
        zIndex: 2000, opacity: 0.3, animation: 'scan 4s linear infinite' 
      }} />

      {/* Dashboard Top Header */}
      <Box sx={{ 
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
        justifyContent: 'space-between'
      }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ p: 1, bgcolor: '#ff3366', borderRadius: '10px', color: 'white', boxShadow: '0 0 20px rgba(255,51,102,0.4)' }}>
            <Terminal size={22} />
          </Box>
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', letterSpacing: 2, fontFamily: 'Syncopate' }}>CORE_V2.0</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <div className="status-blink" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00ffcc' }} />
              <Typography variant="caption" sx={{ color: '#00ffcc', fontWeight: 800, letterSpacing: 1 }}>SYSTEM_ALIVE</Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
           {!isMobile && (
             <Box 
               onClick={() => setIsSearching(true)}
               sx={{ 
                 width: 300, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                 p: 1.5, px: 2, borderRadius: 2, color: '#555', display: 'flex', justifyContent: 'space-between',
                 cursor: 'pointer', '&:hover': { border: '1px solid rgba(51, 204, 255, 0.3)' }
               }}
             >
               <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>QUICK_FIND...</Typography>
               <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.08)', px: 1, borderRadius: 1 }}>⌘ K</Typography>
             </Box>
           )}
           <IconButton sx={{ color: '#888', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }} href="https://github.com/mdyasar49/mern-portfolio-yasar" target="_blank">
             <Github size={20} />
           </IconButton>
        </Stack>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex' }}>
         {/* SIDEBAR NAVIGATION */}
         {!isMobile && (
           <Box sx={{ 
             width: 320, 
             borderRight: '1px solid rgba(255,255,255,0.05)', 
             p: 4,
             bgcolor: 'rgba(1, 4, 9, 0.7)',
             display: 'flex',
             flexDirection: 'column'
           }}>
             <Typography variant="overline" sx={{ color: '#333', fontWeight: 900, letterSpacing: 3, mb: 4, display: 'block' }}>RESOURCES</Typography>
             <Stack spacing={1.5}>
                {sidebarItems.map((item) => (
                  <Box 
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    sx={{ 
                      p: 2, px: 2.5, borderRadius: 3, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 2.5,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      bgcolor: activeSection === item.id ? 'rgba(51, 204, 255, 0.08)' : 'transparent',
                      color: activeSection === item.id ? '#33ccff' : '#64748b',
                      border: activeSection === item.id ? '1px solid rgba(51, 204, 255, 0.2)' : '1px solid transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.03)', color: 'white', transform: 'translateX(5px)' }
                    }}
                  >
                    {item.icon}
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: 1.5 }}>{item.label}</Typography>
                    {activeSection === item.id && <motion.div layoutId="indicator" style={{ marginLeft: 'auto' }}><ChevronRight size={16} /></motion.div>}
                  </Box>
                ))}
             </Stack>

             <Divider sx={{ my: 5, borderColor: 'rgba(255,255,255,0.03)' }} />

             <Typography variant="overline" sx={{ color: '#333', fontWeight: 900, letterSpacing: 3, mb: 4, display: 'block' }}>ARCHITECTURE HEALTH</Typography>
             <Stack spacing={3}>
               <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>FRONTEND_STABILITY</Typography>
                    <Typography variant="caption" sx={{ color: '#00ffcc', fontWeight: 900 }}>100%</Typography>
                  </Stack>
                  <Box sx={{ height: 6, width: '100%', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
                     <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} style={{ height: '100%', backgroundColor: '#00ffcc', borderRadius: 'inherit', boxShadow: '0 0 10px #00ffcc' }} />
                  </Box>
               </Box>
               <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>API_LATENCY</Typography>
                    <Typography variant="caption" sx={{ color: '#ff3366', fontWeight: 900 }}>OPTIMAL</Typography>
                  </Stack>
                  <Box sx={{ height: 6, width: '100%', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
                     <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5, delay: 0.2 }} style={{ height: '100%', backgroundColor: '#ff3366', borderRadius: 'inherit', boxShadow: '0 0 10px #ff3366' }} />
                  </Box>
               </Box>
             </Stack>

             <Box sx={{ mt: 'auto', p: 2, background: 'rgba(0,0,0,0.5)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.03)' }}>
                <Typography variant="caption" sx={{ color: '#555', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                   <Activity size={12} /> REALTIME_EVENT_LOG
                </Typography>
                {logs.map((log, i) => (
                   <Typography key={i} sx={{ fontSize: '0.65rem', fontFamily: 'monospace', color: log.status === 'SUCCESS' ? '#00ffcc' : '#ff3366', opacity: 0.7 - i * 0.1, mb: 0.5 }}>
                      [{log.time}] {log.action} : {log.status}
                   </Typography>
                ))}
             </Box>
           </Box>
         )}

         {/* MAIN CONTENT AREA */}
         <Box sx={{ flexGrow: 1, p: { xs: 3, md: 8 }, overflowY: 'auto', bgcolor: '#0b0e14' }}>
           <AnimatePresence mode="wait">
              {isLoading ? (
                <Box key="loading" sx={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Box className="loader-ring" sx={{ width: 60, height: 60, border: '2px solid rgba(255,255,255,0.05)', borderTopColor: '#33ccff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <Typography sx={{ mt: 4, color: '#334155', fontFamily: 'monospace', letterSpacing: 3, fontSize: '0.8rem' }}>ESTABLISHING_TLS_CONNECTION...</Typography>
                </Box>
              ) : (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* BREADCRUMB */}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, opacity: 0.4 }}>
                     <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>RESOURCES</Typography>
                     <ChevronRight size={12} color="white" />
                     <Typography variant="caption" sx={{ color: '#33ccff', fontWeight: 900 }}>{sidebarItems.find(i => i.id === activeSection)?.label}</Typography>
                  </Stack>

                  {/* DYNAMIC SECTION RENDERING */}
                  {activeSection === 'readme' || activeSection === 'explanation' ? (
                     <Box sx={{ maxWidth: '1100px' }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 6 }}>
                           <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, fontSize: { xs: '1.8rem', md: '3rem' }, letterSpacing: -1 }}>
                             {sections.find(s => s.id === activeSection)?.title}
                           </Typography>
                        </Stack>

                        <Box sx={{ 
                          p: { xs: 3, md: 8 }, 
                          bgcolor: 'rgba(1, 4, 9, 0.4)', 
                          borderRadius: 8, 
                          border: '1px solid rgba(255,255,255,0.03)',
                          boxShadow: '0 60px 100px rgba(0,0,0,0.7)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                           {/* Decorative background grid */}
                           <Box sx={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />
                           
                           <ReactMarkdown components={{
                              p: ({node, ...props}) => <Typography variant="body1" sx={markdownStyles} {...props} />,
                              h1: ({node, ...props}) => <Typography variant="h1" sx={markdownStyles} {...props} />,
                              h2: ({node, ...props}) => <Typography variant="h2" sx={markdownStyles} {...props} />,
                              h3: ({node, ...props}) => <Typography variant="h3" sx={markdownStyles} {...props} />,
                              li: ({node, ...props}) => <Box component="li" sx={markdownStyles} {...props} />,
                              code: ({node, ...props}) => <Box component="code" sx={markdownStyles} {...props} />,
                              pre: ({node, ...props}) => <Box component="pre" sx={markdownStyles} {...props} />,
                              table: ({node, ...props}) => <Box component="table" sx={markdownStyles} {...props} />,
                              th: ({node, ...props}) => <Box component="th" sx={markdownStyles} {...props} />,
                              td: ({node, ...props}) => <Box component="td" sx={markdownStyles} {...props} />,
                              a: ({node, ...props}) => <Box component="a" target="_blank" rel="noopener noreferrer" sx={markdownStyles} {...props} />
                           }}>
                             {activeSection === 'readme' ? readmeContent : projectContent}
                           </ReactMarkdown>
                        </Box>
                     </Box>
                  ) : activeSection === 'structure' ? (
                     <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mb: 4 }}>System Structure</Typography>
                        <ProjectStructure />
                     </Box>
                  ) : activeSection === 'dev-stack' ? (
                     <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mb: 4 }}>System Stack</Typography>
                        <Grid container spacing={3}>
                           {[
                             { name: 'React 18', role: 'Frontend Layer', color: '#61dafb', icon: <Zap /> },
                             { name: 'Node.js', role: 'Backend Runtime', color: '#68a063', icon: <Cpu /> },
                             { name: 'Express', role: 'API Framework', color: '#fff', icon: <Terminal /> },
                             { name: 'MongoDB', role: 'NoSQL Engine', color: '#449c45', icon: <Layers /> }
                           ].map((tech) => (
                             <Grid item xs={12} sm={6} key={tech.name}>
                                <Box sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 3 }}>
                                   <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', color: tech.color }}>{tech.icon}</Box>
                                   <Box>
                                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>{tech.name}</Typography>
                                      <Typography variant="caption" sx={{ color: '#555', letterSpacing: 1 }}>{tech.role}</Typography>
                                   </Box>
                                </Box>
                             </Grid>
                           ))}
                        </Grid>
                     </Box>
                  ) : (
                    <Box sx={{ maxWidth: '600px', mx: 'auto', textAlign: 'center', py: 10 }}>
                       <ShieldCheck size={80} color="#00ffcc" style={{ opacity: 0.3, marginBottom: 20 }} />
                       <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 2 }}>API Security Active</Typography>
                       <Typography sx={{ color: '#555' }}>All backend endpoints are monitored and secured with CORS validation.</Typography>
                    </Box>
                  )}
                </motion.div>
              )}
           </AnimatePresence>
         </Box>
      </Box>

      <Footer socials={profile.socials} name={profile.name} />

      <style>
        {`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes scan { 
            0% { top: -10%; }
            100% { top: 110%; }
          }
          .status-blink { animation: pulse 2s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
        `}
      </style>
    </Box>
  );
};

export default Documentation;
