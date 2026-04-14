import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Paper, Stack, Button, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FolderKanban, Cpu, LogOut, Settings, ExternalLink, Activity } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import useLiveAnalytics from '../hooks/useLiveAnalytics';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import SEO from '../components/SEO';
import api from '../services/api';


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
                const res = await api.get('/health');
                if (res.data.success) {
                    const { uptimeSeconds, memoryUsage, db, maintenance } = res.data.data;
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
            const res = await api.put('/health/maintenance', { enabled: !health.maintenance });
            if (res.data.success) {
                setHealth(prev => ({ ...prev, maintenance: !prev.maintenance }));
                setToast({ open: true, message: res.data.message });
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
        <Box sx={{ minHeight: '100vh', bgcolor: '#02040a', pt: 12, pb: 10 }}>
            <SEO title="Control Center | Operations" description="Manage system resources and data layers." />
            
            <Container maxWidth="xl">
                {/* Dashboard Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 8 }}>
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                            <Box sx={{ p: 1, bgcolor: 'rgba(51, 204, 255, 0.1)', borderRadius: 2, color: '#33ccff' }}>
                                <LayoutDashboard size={24} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'Syncopate', color: 'white', letterSpacing: -1 }}>
                                ADMIN_DASHBOARD
                            </Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: '#444', fontFamily: 'monospace', letterSpacing: 2 }}>
                            AUTHORIZED_ADMIN: <span style={{ color: '#00ffcc' }}>{admin?.username?.toUpperCase()}</span> [ROLE: {admin?.role?.toUpperCase()}]
                        </Typography>
                    </Box>

                    <Button 
                        startIcon={<LogOut size={18} />} 
                        onClick={handleLogout}
                        sx={{ 
                            color: '#ff3366', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.7rem',
                            border: '1px solid rgba(255, 51, 102, 0.2)', px: 3, borderRadius: 2,
                            '&:hover': { bgcolor: 'rgba(255, 51, 102, 0.05)', borderColor: '#ff3366' }
                        }}
                    >
                        LOGOUT_SESSION
                    </Button>
                </Stack>

                {/* Module Grid */}
                <Grid container spacing={4}>
                    {modules.map((m, i) => (
                        <Grid item xs={12} sm={6} lg={3} key={i}>
                            <Paper
                                onClick={() => openModule(m.name)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        openModule(m.name);
                                    }
                                }}
                                sx={{ 
                                p: 4, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 4, transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
                                '&:hover': { 
                                    transform: 'translateY(-8px)', 
                                    borderColor: m.color,
                                    boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${m.color}11`
                                },
                                '&:focus-visible': {
                                    outline: `2px solid ${m.color}`,
                                    outlineOffset: 2
                                }
                            }}>
                                <Box sx={{ mb: 3, color: m.color }}>{m.icon}</Box>
                                <Typography sx={{ fontWeight: 900, color: 'white', mb: 1, fontFamily: 'Syncopate', fontSize: '0.85rem' }}>{m.name}</Typography>
                                <Typography variant="caption" sx={{ color: '#555', lineHeight: 1.6, display: 'block', mb: 3 }}>{m.desc}</Typography>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        openModule(m.name);
                                    }}
                                    endIcon={<ExternalLink size={12} />}
                                    sx={{
                                        color: m.color,
                                        fontWeight: 900,
                                        fontSize: '0.6rem',
                                        letterSpacing: 1,
                                        p: 0,
                                        minWidth: 'auto',
                                        '&:hover': { backgroundColor: 'transparent', opacity: 0.85 }
                                    }}
                                >
                                    OPEN_MODULE
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Visual Analytics & Resource Monitor */}
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} lg={8}>
                        <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, height: '100%' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 900, color: 'white', fontFamily: 'Syncopate', fontSize: '0.85rem' }}>VISITOR_TRENDS</Typography>
                                    <Typography variant="caption" sx={{ color: '#444' }}>DAILY_PLATFORM_ENGAGEMENT_MAP</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1, bgcolor: 'rgba(0, 255, 204, 0.1)', borderRadius: 1.5, color: '#00ffcc' }}>
                                        <Activity size={16} />
                                    </Box>
                                    <Typography sx={{ color: '#00ffcc', fontWeight: 900, fontFamily: 'monospace' }}>ACTIVE: {activeSessions}</Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ height: 250, width: '100%', mt: 2 }}>
                                {history && history.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={history}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#33ccff" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#33ccff" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#444" 
                                                fontSize={10} 
                                                fontWeight={900} 
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(str) => str.split('-').slice(1).join('/')}
                                            />
                                            <YAxis hide />
                                            <Tooltip 
                                                contentStyle={{ bgcolor: '#010409', border: '1px solid rgba(51, 204, 255, 0.2)', borderRadius: 8, fontSize: '0.7rem', fontFamily: 'Syncopate' }}
                                                itemStyle={{ color: '#33ccff', fontWeight: 900 }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="#33ccff" 
                                                strokeWidth={3}
                                                fillOpacity={1} 
                                                fill="url(#colorCount)" 
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography sx={{ color: '#222', fontFamily: 'Syncopate', fontSize: '0.7rem' }}>INITIALIZING_ANALYTICS_STREAM...</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, height: '100%' }}>
                            <Typography sx={{ fontWeight: 900, color: 'white', fontFamily: 'Syncopate', fontSize: '0.85rem', mb: 4 }}>RESOURCE_MONITOR</Typography>
                            <Stack spacing={4}>
                                {[
                                    { l: 'API_LATENCY', v: health.latency, c: '#00ffcc', p: 40 },
                                    { l: 'DB_CONNECTION', v: health.db, c: '#33ccff', p: 100 },
                                    { l: 'SERVER_UPTIME', v: health.uptime, c: '#ff3366', p: 80 },
                                    { l: 'MEMORY_USAGE', v: `${health.memory}%`, c: '#ff9933', p: health.memory }
                                ].map((stat, i) => (
                                    <Box key={i}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="caption" sx={{ color: '#444', fontWeight: 900 }}>{stat.l}</Typography>
                                            <Typography variant="caption" sx={{ color: stat.c, fontWeight: 900, fontFamily: 'monospace' }}>{stat.v}</Typography>
                                        </Box>
                                        <Box sx={{ height: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden' }}>
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.p}%` }}
                                                transition={{ duration: 1, ease: 'easeOut' }}
                                                style={{ height: '100%', backgroundColor: stat.c, boxShadow: `0 0 10px ${stat.c}` }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>

                            <Box sx={{ mt: 5, pt: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <Button 
                                    fullWidth 
                                    variant="outlined" 
                                    onClick={handleToggleMaintenance}
                                    disabled={updatingMaintenance}
                                    sx={{ 
                                        py: 1.5, 
                                        borderColor: health.maintenance ? '#ff3366' : 'rgba(51, 204, 255, 0.3)',
                                        color: health.maintenance ? '#ff3366' : '#33ccff',
                                        fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.7rem',
                                        '&:hover': { borderColor: health.maintenance ? '#ff3366' : '#33ccff', bgcolor: 'rgba(255,255,255,0.02)' }
                                    }}
                                >
                                    {updatingMaintenance ? 'PROCESSING...' : (health.maintenance ? 'SYSTEM_LOCKED: RESTORE?' : 'ENGAGE_MAINTENANCE_LOCK')}
                                </Button>
                                <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#444', textAlign: 'center', fontSize: '0.6rem' }}>
                                    {health.maintenance ? 'PUBLIC_ACCESS_RESTRICTED' : 'PUBLIC_ACCESS_ENABLED'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Real-time System Logs Placeholder */}
                <Box sx={{ mt: 8, p: 4, bgcolor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: 4 }}>
                     <Typography sx={{ color: '#1e293b', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.7rem', mb: 2 }}>[ SYSTEM_LOGS ]</Typography>
                     <Typography sx={{ color: '#444', fontFamily: 'monospace', fontSize: '0.7rem' }}>&gt; Initializing Dashboard Interface v1.0.0...</Typography>
                     <Typography sx={{ color: '#444', fontFamily: 'monospace', fontSize: '0.7rem' }}>&gt; Encryption sequence validated.</Typography>
                     <Typography sx={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '0.7rem' }}>&gt; Admin session established at {new Date().toLocaleTimeString()}</Typography>
                </Box>
            </Container>

            <Snackbar
                open={toast.open}
                autoHideDuration={2500}
                onClose={() => setToast({ open: false, message: '' })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setToast({ open: false, message: '' })}
                    severity="info"
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminDashboard;
