/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders the "Code Live" panel. It now features a custom
 * syntax highlighter, line numbers, and a professional "Integrated Development Environment"
 * (IDE) aesthetic for 100% architectural transparency.
 */

import React, { useState, useEffect, useMemo } from 'react';
// Material UI components for the panel UI and tabbed layout
import {
  Box, Typography, IconButton, Stack, Tab, Tabs,
  CircularProgress, Fade, Tooltip
} from '@mui/material';
// Icons for technical aesthetics and actions
import { X, Cpu, Terminal, Copy, Check, Hash, FileCode, Monitor } from 'lucide-react';
// Custom hook to access global Code Live state
import { useCodeLive } from '../context/CodeLiveContext';
// Axios instance for backend communication
import axios from '../services/axiosInstance';
// Framer Motion for interactive animations
import { motion } from 'framer-motion';

/**
 * [SyntaxHighlighter Protocol]
 * A custom, lightweight regex-based engine to colorize JavaScript/React code.
 */
const highlightCode = (code) => {
    if (!code) return '';

    // Escaping HTML characters
    let html = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Highlighting Rules
    const rules = [
        { pattern: /\/\/.*/g, class: 'comment' },                               // Comments
        { pattern: /\/\*[\s\S]*?\*\//g, class: 'comment' },                    // Multi-line Comments
        { pattern: /(['"`])(?:(?!\1).|\\\1)*?\1/g, class: 'string' },           // Strings
        { pattern: /\b(import|export|default|from|const|let|var|if|else|return|switch|case|break|continue|for|while|try|catch|finally|async|await|function|class|extends|new|this|typeof|instanceof|yield|null|undefined|true|false)\b/g, class: 'keyword' }, // Keywords
        { pattern: /\b(useEffect|useState|useMemo|useCallback|useRef|useContext|useReducer|useLocation|useNavigate|useParams)\b/g, class: 'hook' }, // React Hooks
        { pattern: /&lt;([a-zA-Z0-9]+)/g, class: 'tag' },                       // JSX Tags (Opening)
        { pattern: /\/&gt;/g, class: 'tag' },                                   // JSX Tags (Self-closing)
        { pattern: /&lt;\/([a-zA-Z0-9]+)&gt;/g, class: 'tag' },                // JSX Tags (Closing)
        { pattern: /\b([0-9]+)\b/g, class: 'number' },                          // Numbers
    ];

    rules.forEach(rule => {
        html = html.replace(rule.pattern, match => `<span class="code-${rule.class}">${match}</span>`);
    });

    return html;
};

/**
 * [CopyAction Component]
 */
const CopyAction = ({ content }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <Tooltip title={copied ? "Copied!" : "Copy Code"}>
            <IconButton onClick={handleCopy} size="small" sx={{ color: copied ? '#00ffcc' : '#64748b', transition: 'all 0.3s' }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
            </IconButton>
        </Tooltip>
    );
};

const CodeLiveOverlay = () => {
    const { isCodeLive, toggleCodeLive, activeModule } = useCodeLive();
    const [codeData, setCodeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        if (isCodeLive) {
            setLoading(true);
            axios.get(`/code?moduleName=${activeModule}`)
                .then(res => setCodeData(res))
                .catch(err => console.error("Code Fetch Error:", err))
                .finally(() => setLoading(false));
        }
    }, [isCodeLive, activeModule]);

    const activeContent = useMemo(() => {
        if (!codeData) return '';
        const content = tab === 0 ? codeData.frontend?.content : codeData.backend?.content;
        return content || '';
    }, [codeData, tab]);

    const highlightedHTML = useMemo(() => highlightCode(activeContent), [activeContent]);

    if (!isCodeLive) return null;

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                background: '#0d1117',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '-20px 0 50px rgba(0,0,0,0.5)',
                zIndex: 2001
            }}
        >
            {/* ── [IDE HEADER] ── */}
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(255,255,255,0.01)' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1, bgcolor: '#ff3366', borderRadius: 1.5, color: 'white', display: 'flex', boxShadow: '0 0 15px rgba(255, 51, 102, 0.3)' }}><Terminal size={18} /></Box>
                    <Box>
                        <Typography sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.7rem', letterSpacing: 1 }}>CODE_LIVE_v2.0</Typography>
                        <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                           <Monitor size={10} /> SYSTEM_READY // {activeModule.toUpperCase()}
                        </Typography>
                    </Box>
                </Stack>
                <IconButton onClick={toggleCodeLive} sx={{ color: '#444', '&:hover': { color: '#ff3366', rotate: '90deg' }, transition: 'all 0.3s' }}><X size={20} /></IconButton>
            </Box>

            {/* ── [IDE TABBED NAVIGATION] ── */}
            <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', px: { xs: 0, sm: 2 }, bgcolor: 'rgba(0,0,0,0.2)' }}>
                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    variant="fullWidth"
                    sx={{
                        minHeight: 45,
                        '& .MuiTabs-indicator': { bgcolor: '#ff3366', height: 2 },
                        '& .MuiTab-root': {
                            color: '#444',
                            fontWeight: 900,
                            fontFamily: 'Syncopate',
                            fontSize: { xs: '0.55rem', sm: '0.6rem' },
                            minWidth: 'auto',
                            px: { xs: 1, sm: 3 },
                            py: 1.5,
                            transition: 'all 0.3s',
                            '&.Mui-selected': { color: 'white' },
                            '&:hover': { color: '#888' }
                        }
                    }}
                >
                    <Tab label="FRONTEND_UI" icon={<FileCode size={14} />} iconPosition="start" />
                    <Tab label="BACKEND_CORE" icon={<Cpu size={14} />} iconPosition="start" />
                </Tabs>
            </Box>

            {/* ── [IDE SOURCE CODE AREA] ── */}
            <Box sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative', bgcolor: '#010409' }}>
                {loading ? (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <CircularProgress size={25} sx={{ color: '#ff3366' }} />
                        <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 900, fontFamily: 'monospace', letterSpacing: 2 }}>STREAMING_SOURCE...</Typography>
                    </Box>
                ) : (
                    <Fade in={!loading}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* File Info Bar */}
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.03)', bgcolor: 'rgba(255,255,255,0.01)' }}>
                                <Typography sx={{ color: '#64748b', fontSize: '0.65rem', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Hash size={12} /> {(tab === 0 ? codeData?.frontend?.path : codeData?.backend?.path) || 'SOURCE_UNAVAILABLE'}
                                </Typography>
                                <CopyAction content={activeContent} />
                            </Stack>

                            {/* Code Content with Line Numbers */}
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', p: 0 }}>
                                {/* Line Number Column */}
                                <Box sx={{
                                    py: 3, px: 2, borderRight: '1px solid rgba(255,255,255,0.03)',
                                    bgcolor: 'rgba(0,0,0,0.3)', textAlign: 'right', userSelect: 'none'
                                }}>
                                    {activeContent.split('\n').map((_, i) => (
                                        <Typography key={i} sx={{ color: '#1e293b', fontSize: '0.75rem', fontFamily: 'monospace', lineHeight: 1.7 }}>
                                            {i + 1}
                                        </Typography>
                                    ))}
                                </Box>

                                {/* Code Area */}
                                <Box sx={{ p: 3, width: '100%' }}>
                                    <Typography component="pre" sx={{
                                        color: '#8b949e', fontSize: '0.75rem', fontFamily: 'monospace',
                                        lineHeight: 1.7, whiteSpace: 'pre',
                                        '& .code-comment': { color: '#484f58', fontStyle: 'italic' },
                                        '& .code-keyword': { color: '#ff7b72' },
                                        '& .code-hook': { color: '#d2a8ff' },
                                        '& .code-string': { color: '#a5d6ff' },
                                        '& .code-tag': { color: '#7ee787' },
                                        '& .code-number': { color: '#d2a8ff' },
                                    }} dangerouslySetInnerHTML={{ __html: highlightedHTML }} />
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                )}
            </Box>

            {/* ── [IDE FOOTER] ── */}
            <Box sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 900, fontFamily: 'monospace', letterSpacing: 2 }}>ARCHITECTURE_TRANSPARENCY_MODE // v2.0</Typography>
            </Box>
        </motion.div>
    );
};

export default CodeLiveOverlay;
