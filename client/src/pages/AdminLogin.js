import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Stack, Fade, Alert, CircularProgress } from '@mui/material';
import { Terminal, ShieldAlert, KeyRound, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import api from '../services/api';
import SEO from '../components/SEO';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { loginAdmin } = useAdmin();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.success) {
                loginAdmin(response.data.admin, response.data.token);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'System core unreachable. Auth failed.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            color: 'white',
            fontFamily: 'monospace',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
            '&:hover fieldset': { borderColor: '#ff3366' },
            '&.Mui-focused fieldset': { borderColor: '#ff3366', boxShadow: '0 0 20px rgba(255, 51, 102, 0.1)' },
            backgroundColor: 'rgba(0,0,0,0.3)',
        },
        '& .MuiInputLabel-root': { color: '#444', fontFamily: 'Syncopate', fontSize: '0.65rem' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#ff3366' },
        mb: 3
    };

    return (
        <Box sx={{ 
            height: '100vh', width: '100vw', bgcolor: '#010409', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden' 
        }}>
            <SEO title="System Access | Control Center" description="Authorized personnel access only." />
            
            {/* Background Atmosphere */}
            <Box sx={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(#ff3366 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <Box sx={{ position: 'absolute', top: '10%', right: '10%', opacity: 0.1, filter: 'blur(100px)', width: 300, height: 300, bgcolor: '#ff3366', borderRadius: '50%' }} />

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <Fade in={true} timeout={1000}>
                    <Box>
                        {/* System Header */}
                        <Stack spacing={2} alignItems="center" sx={{ mb: 6 }}>
                             <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                             >
                                <Box sx={{ p: 2, borderRadius: '50%', border: '1px solid rgba(255, 51, 102, 0.3)', position: 'relative' }}>
                                    <Lock size={30} color="#ff3366" />
                                    <Box sx={{ position: 'absolute', inset: -5, border: '2px solid #ff3366', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 2s linear infinite' }} />
                                </Box>
                             </motion.div>
                             <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: 'Syncopate', color: 'white', letterSpacing: -1 }}>CONTROL_GATEWAY</Typography>
                                <Typography variant="caption" sx={{ color: '#444', fontFamily: 'monospace', letterSpacing: 2 }}>SECURITY_PROTOCOL: AUTH_V4.0</Typography>
                             </Box>
                        </Stack>

                        <Box component="form" onSubmit={handleSubmit} sx={{ 
                            p: 4, borderRadius: 3, 
                            bgcolor: 'rgba(255,255,255,0.01)', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
                        }}>
                            {error && (
                                <Alert severity="error" icon={<ShieldAlert size={20} />} sx={{ mb: 4, bgcolor: 'rgba(255, 51, 102, 0.1)', color: '#ff3366', border: '1px solid #ff3366', borderRadius: 2 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{error.toUpperCase()}</Typography>
                                </Alert>
                            )}

                            <TextField 
                                fullWidth label="ROOT_USERNAME" name="username" value={credentials.username} onChange={handleChange} required sx={inputStyles}
                                InputProps={{ startAdornment: <User size={16} color="#444" style={{ marginRight: 15 }} /> }}
                            />
                            
                            <TextField 
                                fullWidth label="ENCRYPTION_KEY" name="password" type="password" value={credentials.password} onChange={handleChange} required sx={inputStyles}
                                InputProps={{ startAdornment: <KeyRound size={16} color="#444" style={{ marginRight: 15 }} /> }}
                            />

                            <Button 
                                type="submit" 
                                fullWidth 
                                disabled={loading}
                                variant="contained"
                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Terminal size={20} />}
                                sx={{ 
                                    py: 2, mt: 1, bgcolor: '#ff3366', color: 'white', fontWeight: 900, 
                                    fontFamily: 'Syncopate', letterSpacing: 2,
                                    '&:hover': { bgcolor: '#ff4d79', boxShadow: '0 0 30px rgba(255, 51, 102, 0.4)' }
                                }}
                            >
                                {loading ? 'BYPASSING...' : 'INITIATE_SESSION'}
                            </Button>
                        </Box>

                        <Typography sx={{ textAlign: 'center', mt: 4, color: '#222', fontSize: '0.6rem', fontFamily: 'monospace', letterSpacing: 2 }}>
                            IP_LOGGING_ACTIVE // UNAUTHORIZED_ACCESS_BLACKLISTED
                        </Typography>
                    </Box>
                </Fade>
            </Container>

            <style>
                {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
            </style>
        </Box>
    );
};

export default AdminLogin;
