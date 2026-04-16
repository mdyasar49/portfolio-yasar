import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Paper, Stack, Button, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FolderKanban, Cpu, LogOut, Settings, ExternalLink, Activity } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import useLiveAnalytics from '../hooks/useLiveAnalytics';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import SEO from '../components/SEO';
import { probeSystemIntegrity, modifyMaintenanceLock } from '../services/api';


const AdminDashboard = () => {
    const { admin, logoutAdmin } = useAdmin();
    const { history, activeSessions } = useLiveAnalytics();
    const [toast, setToast] = useState({ open: false, message: '' });
    const [health, setHealth] = useState({
        latency: '...',
        db: '...',
        uptime: '...',
        memory: 0,
        maintenance: false
    });
    const [updatingMaintenance, setUpdatingMaintenance] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Optimized Session Check: Only redirect if NO admin context exists 
        // AND no valid token is found after a brief hydration period.
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!admin && (!token || token === 'null')) {
                navigate('/admin/login');
            }
        };

        // Brief delay to allow Context/Storage hydration
        const timer = setTimeout(checkAuth, 500);
        return () => clearTimeout(timer);
    }, [admin, navigate]);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const res = await probeSystemIntegrity();
                if (res.success) {
                    const { uptimeSeconds, memoryUsage, db, maintenance } = res.data;
                    setHealth({
                        latency: `${db.latency}ms`,
                        db: db.status,
                        uptime: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`,
                        memory: memoryUsage,
                        maintenance: maintenance
                    });
                }
            } catch (e) {
                if (e.response?.status === 401) {
                    navigate('/admin/login');
                }
                console.error('HEALTH_POLL_FAIL');
            }
        };


        fetchHealth();
        const interval = setInterval(fetchHealth, 10000);
        return () => clearInterval(interval);
    }, [navigate]);

    const handleToggleMaintenance = async () => {
        setUpdatingMaintenance(true);
        try {
            const res = await modifyMaintenanceLock({ enabled: !health.maintenance });
            if (res.success) {
                setHealth(prev => ({ ...prev, maintenance: !prev.maintenance }));
                setToast({ open: true, message: res.message });
            }
        } catch (e) {
            setToast({ open: true, message: 'FAILED_TO_TOGGLE_LOCK.' });
        } finally {
            setUpdatingMaintenance(false);
        }
    };


    const handleLogout = () => {
        logoutAdmin();
        window.location.href = '/admin/login';
    };

    const openModule = (moduleName) => {

        const moduleRoutes = {
            'PROFESSIONAL IDENTITY': '/admin/management?tab=0',
            'PORTFOLIO ORCHESTRATION': '/admin/management?tab=1',
            'TECHNOLOGY STACK': '/admin/management?tab=2',
            'OPERATIONAL SECURITY': '/admin/management?tab=6'
        };

        const target = moduleRoutes[moduleName];
        if (target) {
            navigate(target);
            return;
        }

        setToast({
            open: true,
            message: `${moduleName} module is syncing. Please try again.`
        });
    };

    const modules = [
        { name: 'PROFESSIONAL IDENTITY', desc: 'Maintain primary professional identifiers and career bio.', icon: <Users />, color: '#33ccff' },
        { name: 'PORTFOLIO ORCHESTRATION', desc: 'Securely manage your engineering projects and content layers.', icon: <FolderKanban />, color: '#ff3366' },
        { name: 'TECHNOLOGY STACK', desc: 'Orchestrate technical competencies and system tools.', icon: <Cpu />, color: '#00ffcc' },
        { name: 'OPERATIONAL SECURITY', desc: 'Manage system access protocols and security credentials.', icon: <Settings />, color: '#94a3b8' }
    ];


    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#04070a', 
            pt: 12, pb: 10,
            backgroundImage: `radial-gradient(circle at 10% 20%, rgba(51, 204, 255, 0.03) 0%, transparent 40%),
                              radial-gradient(circle at 90% 80%, rgba(255, 51, 102, 0.03) 0%, transparent 40%)`,
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'fixed',
                inset: 0,
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
                opacity: 0.02,
                pointerEvents: 'none'
            }
        }}>
            <SEO title="Grand Dashboard | System Command" description="Enterprise-grade administrative oversight." />
            
            <Container maxWidth="xl">
                {/* Header: Command Center HUD */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', md: 'center' }, 
                    mb: 10,
                    gap: 4
                }}>
                    <Box>
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
                            <Box sx={{ 
                                width: 56, height: 56, 
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'linear-gradient(135deg, rgba(51, 204, 255, 0.2), transparent)',
                                border: '1px solid rgba(51, 204, 255, 0.3)',
                                borderRadius: '16px',
                                color: '#33ccff',
                                boxShadow: '0 0 20px rgba(51, 204, 255, 0.1)'
                            }}>
                                <LayoutDashboard size={28} />
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{ 
                                    fontWeight: 900, 
                                    fontFamily: 'Syncopate', 
                                    color: 'white', 
                                    letterSpacing: -2,
                                    textShadow: '0 0 30px rgba(255,255,255,0.1)'
                                }}>
                                    SYSTEM_CORE
                                </Typography>
                                <Typography variant="overline" sx={{ color: '#33ccff', fontWeight: 900, letterSpacing: 5 }}>
                                    ADMINISTRATIVE_COMMAND_CENTER
                                </Typography>
                            </Box>
                        </Stack>
                        <Box sx={{ 
                            display: 'flex', alignItems: 'center', gap: 2, 
                            pl: 1, color: '#444', fontFamily: 'monospace', fontSize: '0.75rem' 
                        }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: '#00ffcc', borderRadius: '50%', boxShadow: '0 0 8px #00ffcc' }} />
                            UPTIME_STABLE // IDENTITY_VERIFIED: <span style={{ color: '#00ffcc' }}>{admin?.username?.toUpperCase()}</span>
                        </Box>
                    </Box>

                    <Button 
                        startIcon={<LogOut size={18} />} 
                        onClick={handleLogout}
                        sx={{ 
                            color: '#ff3366', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.75rem',
                            border: '1px solid rgba(255, 51, 102, 0.3)', 
                            px: 4, py: 1.5,
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)',
                            transition: '0.4s',
                            '&:hover': { 
                                bgcolor: 'rgba(255, 51, 102, 0.1)', 
                                borderColor: '#ff3366',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 0 20px rgba(255, 51, 102, 0.2)'
                            }
                        }}
                    >
                        TERMINATE_SESSION
                    </Button>
                </Box>

                {/* Main Command Console */}
                <Grid container spacing={4}>
                    {/* Diagnostic Monitor - Large Left Panel */}
                    <Grid item xs={12} lg={8}>
                        <Paper sx={{ 
                            p: 6, 
                            bgcolor: 'rgba(10, 15, 25, 0.6)', 
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '40px',
                            height: '100%',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0, left: 0, right: 0, height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(51, 204, 255, 0.2), transparent)'
                            }
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 900, color: 'white', fontFamily: 'Syncopate', fontSize: '1rem', mb: 1 }}>TRAFFIC_STREAM</Typography>
                                    <Typography variant="caption" sx={{ color: '#555', fontFamily: 'monospace', letterSpacing: 2 }}>GLOBAL_REQUEST_TELEMETRY</Typography>
                                </Box>
                                <Box sx={{ 
                                    px: 3, py: 1, 
                                    bgcolor: 'rgba(0, 255, 204, 0.05)', 
                                    border: '1px solid rgba(0, 255, 204, 0.1)',
                                    borderRadius: '50px', 
                                    color: '#00ffcc',
                                    display: 'flex', alignItems: 'center', gap: 2
                                }}>
                                    <Activity size={18} />
                                    <Typography sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{activeSessions} NODES_ACTIVE</Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ height: 350, width: '100%', mt: 4 }}>
                                {history && history.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={history}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#33ccff" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#33ccff" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#444" 
                                                fontSize={11} 
                                                fontWeight={900} 
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(str) => str.split('-').slice(1).join('/')}
                                            />
                                            <YAxis hide />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: 'rgba(0,0,0,0.8)', 
                                                    border: '1px solid rgba(51, 204, 255, 0.3)', 
                                                    borderRadius: '12px', 
                                                    fontSize: '0.8rem', 
                                                    fontFamily: 'Syncopate',
                                                    backdropFilter: 'blur(10px)'
                                                }}
                                                itemStyle={{ color: '#33ccff', fontWeight: 900 }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="#33ccff" 
                                                strokeWidth={4}
                                                fillOpacity={1} 
                                                fill="url(#colorCount)" 
                                                animationDuration={3000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography sx={{ color: '#111', fontFamily: 'Syncopate', fontSize: '0.8rem', letterSpacing: 4 }}>SYNCHRONIZING_ANALYTICS_ARRAY...</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Panel: Vital Signs */}
                    <Grid item xs={12} lg={4}>
                        <Paper sx={{ 
                            p: 6, 
                            bgcolor: 'rgba(4, 7, 10, 0.4)', 
                            border: '1px solid rgba(255,255,255,0.05)', 
                            borderRadius: '40px', 
                            height: '100%',
                            backdropFilter: 'blur(15px)'
                        }}>
                            <Typography sx={{ fontWeight: 900, color: 'white', fontFamily: 'Syncopate', fontSize: '1rem', mb: 6 }}>CORE_VITAL_SIGNS</Typography>
                            <Stack spacing={5}>
                                {[
                                    { l: 'LATENCY', v: health.latency, c: '#00ffcc', p: 40 },
                                    { l: 'DATABASE', v: health.db, c: '#33ccff', p: 100 },
                                    { l: 'UPTIME', v: health.uptime, c: '#ff3366', p: 80 },
                                    { l: 'MEMORY', v: `${health.memory}%`, c: '#ff9933', p: health.memory }
                                ].map((stat, i) => (
                                    <Box key={i}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="caption" sx={{ color: '#555', fontWeight: 900, letterSpacing: 2 }}>{stat.l}</Typography>
                                            <Typography variant="caption" sx={{ color: stat.c, fontWeight: 900, fontFamily: 'monospace', fontSize: '0.8rem' }}>{stat.v}</Typography>
                                        </Box>
                                        <Box sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, overflow: 'hidden' }}>
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.p}%` }}
                                                transition={{ duration: 1.5, ease: 'circOut' }}
                                                style={{ height: '100%', backgroundColor: stat.c, boxShadow: `0 0 15px ${stat.c}88` }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>

                            <Box sx={{ mt: 8, pt: 6, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <Button 
                                    fullWidth 
                                    variant="outlined" 
                                    onClick={handleToggleMaintenance}
                                    disabled={updatingMaintenance}
                                    sx={{ 
                                        py: 2.5, 
                                        borderColor: health.maintenance ? '#ff3366' : 'rgba(51, 204, 255, 0.4)',
                                        color: health.maintenance ? '#ff3366' : '#33ccff',
                                        background: health.maintenance ? 'rgba(255, 51, 102, 0.05)' : 'transparent',
                                        fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.75rem',
                                        borderRadius: '16px',
                                        '&:hover': { 
                                            borderColor: health.maintenance ? '#ff3366' : '#33ccff', 
                                            bgcolor: health.maintenance ? 'rgba(255, 51, 102, 0.1)' : 'rgba(255,255,255,0.03)',
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                >
                                    {updatingMaintenance ? 'PROCESSING...' : (health.maintenance ? 'TERMINATE_LOCK' : 'INDEPENDENT_LOCKOUT')}
                                </Button>
                                <Typography variant="caption" sx={{ display: 'block', mt: 3, color: '#444', textAlign: 'center', fontSize: '0.65rem', fontFamily: 'monospace' }}>
                                    {health.maintenance ? '[ SECURITY_ENFORCED: GUEST_REDIRECT_ACTIVE ]' : '[ SYSTEM_IDLE: PUBLIC_ACCESS_ALLOW ]'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Tactical Operations: Quick Access Modules */}
                <Box sx={{ mt: 10 }}>
                    <Typography sx={{ fontWeight: 900, color: '#222', fontFamily: 'Syncopate', fontSize: '0.8rem', mb: 6, letterSpacing: 10 }}>TACTICAL_OPERATIONS</Typography>
                    <Grid container spacing={4}>
                        {modules.map((m, i) => (
                            <Grid item xs={12} sm={6} lg={3} key={i}>
                                <Paper
                                    onClick={() => openModule(m.name)}
                                    sx={{ 
                                        p: 5, 
                                        bgcolor: 'rgba(255,255,255,0.01)', 
                                        border: '1px solid rgba(255,255,255,0.03)',
                                        borderRadius: '24px', 
                                        transition: '0.4s cubic-bezier(0.2, 1, 0.2, 1)', 
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': { 
                                            transform: 'translateY(-12px)', 
                                            borderColor: m.color,
                                            boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 30px ${m.color}11`,
                                            background: 'rgba(255,255,255,0.02)'
                                        }
                                    }}>
                                    <Box sx={{ 
                                        mb: 4, color: m.color, 
                                        p: 2, bgcolor: `${m.color}11`, 
                                        width: 'max-content', borderRadius: '12px' 
                                    }}>{m.icon}</Box>
                                    <Typography sx={{ fontWeight: 900, color: 'white', mb: 2, fontFamily: 'Syncopate', fontSize: '0.9rem' }}>{m.name}</Typography>
                                    <Typography variant="caption" sx={{ color: '#555', lineHeight: 1.8, display: 'block', mb: 4, height: 50 }}>{m.desc}</Typography>
                                    
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ color: m.color }}>
                                        <Typography sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ACCESS_MODULE</Typography>
                                        <ExternalLink size={14} />
                                    </Stack>

                                    {/* Abstract Grid Pattern Overlay */}
                                    <Box sx={{ 
                                        position: 'absolute', bottom: -10, right: -10, 
                                        opacity: 0.05, transform: 'rotate(-45deg)',
                                        color: m.color
                                    }}>
                                        {m.icon}
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Session Event Feed */}
                <Box sx={{ 
                    mt: 10, p: 6, 
                    bgcolor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.02)', 
                    borderRadius: '30px',
                    fontFamily: 'monospace'
                }}>
                     <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                        <Box sx={{ width: 10, height: 10, bgcolor: '#ff3366', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                        <Typography sx={{ color: '#333', fontWeight: 900, fontSize: '0.8rem', letterSpacing: 4 }}>REAL_TIME_TERMINAL_FEED</Typography>
                     </Stack>
                     <Stack spacing={1}>
                        <Typography sx={{ color: '#222', fontSize: '0.75rem' }}>&gt; Initializing Neural Interface Interface v2.0.4 [BUILD_ELITE]</Typography>
                        <Typography sx={{ color: '#222', fontSize: '0.75rem' }}>&gt; Decrypting SSL_LAYER_RSA_4096... [PASS]</Typography>
                        <Typography sx={{ color: '#00ffcc', fontSize: '0.75rem' }}>&gt; Master Controller established at {new Date().toLocaleTimeString()} [LOCAL_IP: 192.168.1.1]</Typography>
                        <Typography sx={{ color: '#444', fontSize: '0.75rem' }}>&gt; Monitoring active telemetries for {activeSessions} remote nodes.</Typography>
                     </Stack>
                </Box>
            </Container>

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ open: false, message: '' })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setToast({ open: false, message: '' })}
                    severity="success"
                    variant="filled"
                    sx={{ bgcolor: '#00ffcc', color: '#000', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.7rem' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>

            <style>
                {`
                    @keyframes pulse { 
                        0% { opacity: 0.3; transform: scale(0.9); } 
                        50% { opacity: 1; transform: scale(1.1); } 
                        100% { opacity: 0.3; transform: scale(0.9); } 
                    }
                `}
            </style>
        </Box>
    );
};

export default AdminDashboard;
