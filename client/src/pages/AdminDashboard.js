import React from 'react';
import { Box, Typography, Container, Grid, Paper, Stack, Button } from '@mui/material';
import { LayoutDashboard, Users, FolderKanban, Cpu, LogOut, Settings, ExternalLink } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const AdminDashboard = () => {
    const { admin, logoutAdmin } = useAdmin();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    const modules = [
        { name: 'Profile Core', desc: 'Edit bio, summary and identifiers', icon: <Users />, color: '#33ccff' },
        { name: 'Projects Hub', desc: 'Manage engineering archives', icon: <FolderKanban />, color: '#ff3366' },
        { name: 'Tech Infrastructure', desc: 'Update skill tiers and tools', icon: <Cpu />, color: '#00ffcc' },
        { name: 'System Settings', desc: 'Auth and security protocols', icon: <Settings />, color: '#94a3b8' }
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
                                OPERATIONS_CONTROL
                            </Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: '#444', fontFamily: 'monospace', letterSpacing: 2 }}>
                            AUTHENTICATED_IDENT: <span style={{ color: '#00ffcc' }}>{admin?.username?.toUpperCase()}</span> [ROLE: {admin?.role?.toUpperCase()}]
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
                        TERMINATE_SESSION
                    </Button>
                </Stack>

                {/* Module Grid */}
                <Grid container spacing={4}>
                    {modules.map((m, i) => (
                        <Grid item xs={12} sm={6} lg={3} key={i}>
                            <Paper sx={{ 
                                p: 4, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 4, transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
                                '&:hover': { 
                                    transform: 'translateY(-8px)', 
                                    borderColor: m.color,
                                    boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${m.color}11`
                                }
                            }}>
                                <Box sx={{ mb: 3, color: m.color }}>{m.icon}</Box>
                                <Typography sx={{ fontWeight: 900, color: 'white', mb: 1, fontFamily: 'Syncopate', fontSize: '0.85rem' }}>{m.name}</Typography>
                                <Typography variant="caption" sx={{ color: '#555', lineHeight: 1.6, display: 'block', mb: 3 }}>{m.desc}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: m.color }}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.6rem' }}>ENTER_MODULE</Typography>
                                    <ExternalLink size={12} />
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Real-time System Logs Placeholder */}
                <Box sx={{ mt: 8, p: 4, bgcolor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: 4 }}>
                     <Typography sx={{ color: '#1e293b', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.7rem', mb: 2 }}>[ SYSTEM_LOGS ]</Typography>
                     <Typography sx={{ color: '#444', fontFamily: 'monospace', fontSize: '0.7rem' }}>&gt; Initializing Dashboard Interface v1.0.0...</Typography>
                     <Typography sx={{ color: '#444', fontFamily: 'monospace', fontSize: '0.7rem' }}>&gt; Encryption sequence validated.</Typography>
                     <Typography sx={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '0.7rem' }}>&gt; Admin session established at {new Date().toLocaleTimeString()}</Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default AdminDashboard;
