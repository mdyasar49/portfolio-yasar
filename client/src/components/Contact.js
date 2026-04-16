import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack, Container, Grid, CircularProgress, Alert, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { Send, Mail, Terminal, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { dispatchCommunication } from '../services/api';

const Contact = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const result = await dispatchCommunication(formData);
        
        setLoading(false);
        if (result.success) {
            setStatus({ type: 'success', message: 'MESSAGE_DISPATCHED // SECURE_CHANNEL_READY' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
            setStatus({ type: 'error', message: `DISPATCH_FAILURE // ${result.error}` });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            color: 'white',
            fontFamily: 'monospace',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
            '&:hover fieldset': { borderColor: '#33ccff' },
            '&.Mui-focused fieldset': { borderColor: '#33ccff', boxShadow: '0 0 15px rgba(51, 204, 255, 0.1)' },
            backgroundColor: 'rgba(255,255,255,0.02)',
        },
        '& .MuiInputLabel-root': { color: '#444', fontFamily: 'Syncopate', fontSize: '0.7rem' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#33ccff' },
        mb: 3
    };

    return (
        <Container maxWidth="lg" id="contact" sx={{ py: 15 }}>
            <Grid container spacing={8} alignItems="center">
                {/* Visual HUD Side */}
                <Grid item xs={12} md={5}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Typography sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'Syncopate', letterSpacing: 4, mb: 2, fontSize: '0.7rem' }}>
                            [ GET_IN_TOUCH ]
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', mb: 3, fontFamily: 'Syncopate', letterSpacing: -1 }}>
                            SEND A<br/><span style={{ color: '#33ccff' }}>MESSAGE</span>
                        </Typography>
                        <Typography sx={{ color: '#444', lineHeight: 1.8, mb: 6 }}>
                            Have a project in mind or just want to say hi? Feel free to reach out. I'm always open to discussing new opportunities and technical challenges.
                        </Typography>

                        <Stack spacing={3}>
                            {[
                                { icon: <Terminal size={18} />, label: 'SYSTEM_PATH', val: 'node/socket/nodemailer' },
                                { icon: <ShieldCheck size={18} />, label: 'ENCRYPTION', val: 'TLS_v1.3_AUTH' },
                                { 
                                    icon: <Mail size={18} />, 
                                    label: 'DIRECT_DISPATCH', 
                                    val: 'mohamedyasar081786@gmail.com',
                                    isLink: true 
                                }
                            ].map((item, i) => (
                                <Stack 
                                    key={i} 
                                    direction="row" 
                                    spacing={3} 
                                    alignItems="center"
                                    component={item.isLink ? 'a' : 'div'}
                                    href={item.isLink ? `mailto:${item.val}` : undefined}
                                    sx={{ textDecoration: 'none', cursor: item.isLink ? 'pointer' : 'default' }}
                                >
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(51, 204, 255, 0.05)', color: '#33ccff' }}>
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#222', fontWeight: 900, display: 'block', letterSpacing: 1 }}>{item.label}</Typography>
                                        <Typography sx={{ color: item.isLink ? '#33ccff' : '#888', fontFamily: 'monospace', fontSize: '0.8rem' }}>{item.val}</Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </motion.div>
                </Grid>

                {/* Form Side */}
                <Grid item xs={12} md={7}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Box component="form" onSubmit={handleSubmit} sx={{ 
                            p: { xs: 3, md: 6 }, borderRadius: 4, 
                            bgcolor: 'rgba(255,255,255,0.01)', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            position: 'relative', overflow: 'hidden'
                        }}>
                             {/* Form Decoration */}
                            <Box sx={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: 'radial-gradient(circle at top right, rgba(51, 204, 255, 0.1), transparent)' }} />
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="FULL_NAME" name="name" value={formData.name} onChange={handleChange} required sx={inputStyles} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="EMAIL_ADDRESS" name="email" type="email" value={formData.email} onChange={handleChange} required sx={inputStyles} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="SUBJECT" name="subject" value={formData.subject} onChange={handleChange} sx={inputStyles} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="YOUR_MESSAGE" name="message" multiline rows={5} value={formData.message} onChange={handleChange} required sx={inputStyles} />
                                </Grid>
                            </Grid>

                            <Button 
                                type="submit" 
                                fullWidth 
                                disabled={loading}
                                variant="contained"
                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
                                sx={{ 
                                    py: 2, mt: 2, bgcolor: '#33ccff', color: '#000000', fontWeight: 900, 
                                    fontFamily: 'Syncopate', letterSpacing: 2,
                                    '&:hover': { bgcolor: '#00ffcc', boxShadow: '0 0 30px rgba(0, 255, 204, 0.3)' }
                                }}
                            >
                                {loading ? 'SENDING...' : 'SEND_MESSAGE'}
                            </Button>
                        </Box>
                    </motion.div>
                </Grid>
            </Grid>

            <Snackbar 
                open={open} 
                autoHideDuration={6000} 
                onClose={handleClose} 
                anchorOrigin={{ 
                    vertical: isMobile ? 'top' : 'bottom', 
                    horizontal: isMobile ? 'center' : 'right' 
                }}
            >
                <Alert onClose={handleClose} severity={status.type} sx={{ width: '100%', bgcolor: '#02040a', color: 'white', border: `1px solid ${status.type === 'success' ? '#00ffcc' : '#ff3366'}`, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 900 }}>{status.message}</Typography>
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Contact;
