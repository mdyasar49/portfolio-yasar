import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Stack, Fade, Alert, CircularProgress } from '@mui/material';
import { Terminal, ShieldAlert, KeyRound, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { executeAdministrativeAuth } from '../services/api';
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
            const response = await executeAdministrativeAuth(credentials);
            if (response.success) {
                loginAdmin(response.admin, response.token);
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
            height: '100vh', width: '100vw', bgcolor: '#04070a', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 51, 102, 0.05) 0%, transparent 80%)',
                pointerEvents: 'none'
            }
        }}>
            <SEO title="System Access | Security Layer" description="Authorized administrative decryption protocol." />
            
            {/* Holographic Background Elements */}
            <Box sx={{ position: 'absolute', width: '200%', height: '200%', top: '-50%', left: '-50%', pointerEvents: 'none' }}>
                <Box sx={{ 
                    position: 'absolute', inset: 0, 
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255, 51, 102, 0.02) 41px)',
                    animation: 'backgroundScroll 20s linear infinite'
                }} />
            </Box>

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <Fade in={true} timeout={1500}>
                    <Box>
                        {/* Terminal Authentication Header */}
                        <Stack spacing={3} alignItems="center" sx={{ mb: 8 }}>
                             <Box sx={{ position: 'relative' }}>
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    style={{ 
                                        position: 'absolute', inset: -20, 
                                        borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 51, 102, 0.2) 0%, transparent 70%)' 
                                    }}
                                />
                                <Box sx={{ 
                                    p: 3, borderRadius: '24px', 
                                    border: '1px solid rgba(255, 51, 102, 0.4)', 
                                    bgcolor: 'rgba(255, 51, 102, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    position: 'relative',
                                    zIndex: 2,
                                    boxShadow: '0 0 40px rgba(255, 51, 102, 0.1)'
                                }}>
                                    <Lock size={32} color="#ff3366" />
                                </Box>
                             </Box>
                             <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 900, 
                                    fontFamily: 'Syncopate', 
                                    color: 'white', 
                                    letterSpacing: -1,
                                    textShadow: '0 0 20px rgba(255, 51, 102, 0.3)'
                                }}>
                                    ENCRYPTED_AUTH
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#444', fontFamily: 'monospace', letterSpacing: 5, fontSize: '0.6rem' }}>
                                    VAULT_STATUS: LOCKED // RSA_4096_ACTIVE
                                </Typography>
                             </Box>
                        </Stack>

                        <Box component="form" onSubmit={handleSubmit} sx={{ 
                            p: 6, borderRadius: '40px', 
                            bgcolor: 'rgba(255, 255, 255, 0.02)', 
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.9), inset 0 0 20px rgba(255,255,255,0.02)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Neon Decor Lines */}
                            <Box sx={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, #ff3366, transparent)', opacity: 0.5 }} />
                            
                            {error && (
                                <Alert 
                                    severity="error" 
                                    icon={<ShieldAlert size={20} />} 
                                    sx={{ 
                                        mb: 4, 
                                        bgcolor: 'rgba(255, 51, 102, 0.1)', 
                                        color: '#ff3366', 
                                        border: '1px solid rgba(255, 51, 102, 0.3)', 
                                        borderRadius: '12px',
                                        '& .MuiAlert-icon': { color: '#ff3366' }
                                    }}
                                >
                                    <Typography variant="caption" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{error.toUpperCase()}</Typography>
                                </Alert>
                            )}

                            <TextField 
                                fullWidth label="ADMIN_ID" name="username" value={credentials.username} onChange={handleChange} required sx={inputStyles}
                                InputProps={{ startAdornment: <User size={18} color="#444" style={{ marginRight: 15 }} /> }}
                            />
                            
                            <TextField 
                                fullWidth label="ACCESS_KEY" name="password" type="password" value={credentials.password} onChange={handleChange} required sx={inputStyles}
                                InputProps={{ startAdornment: <KeyRound size={18} color="#444" style={{ marginRight: 15 }} /> }}
                            />

                            <Button 
                                type="submit" 
                                fullWidth 
                                disabled={loading}
                                variant="contained"
                                endIcon={loading ? <CircularProgress size={20} sx={{ color: '#000' }} /> : <Terminal size={20} />}
                                sx={{ 
                                    py: 2.5, mt: 2, 
                                    bgcolor: '#ff3366', 
                                    color: 'white', 
                                    fontWeight: 900, 
                                    fontFamily: 'Syncopate', 
                                    letterSpacing: 2,
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 30px rgba(255, 51, 102, 0.3)',
                                    transition: '0.4s cubic-bezier(0.2, 1, 0.2, 1)',
                                    '&:hover': { 
                                        bgcolor: '#ff4d79', 
                                        boxShadow: '0 20px 50px rgba(255, 51, 102, 0.5)',
                                        transform: 'translateY(-3px) scale(1.02)'
                                    },
                                    '&:active': { transform: 'scale(0.98)' }
                                }}
                            >
                                {loading ? 'BYPASSING_FIREWALL...' : 'EXECUTE_DECRYPTION'}
                            </Button>
                        </Box>

                        <Typography sx={{ textAlign: 'center', mt: 8, color: '#1e293b', fontSize: '0.65rem', fontFamily: 'monospace', letterSpacing: 4, fontWeight: 900 }}>
                            FEDERAL_GOVERNMENT_WARNING: UNAUTHORIZED_ACCESS_IS_A_CRIME
                        </Typography>
                    </Box>
                </Fade>
            </Container>

            <style>
                {`
                    @keyframes backgroundScroll {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(40px); }
                    }
                `}
            </style>
        </Box>
    );
};

export default AdminLogin;
