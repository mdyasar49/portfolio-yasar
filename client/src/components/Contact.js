/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders the "Contact Me" section of the website.
 * It contains a form that allows visitors to send messages directly to the admin.
 * It handles form state, input validation, and communication with the backend API.
 */

import React, { useState } from 'react';
// Material UI components for form fields, layout, and notifications
import { Box, Typography, TextField, Button, Stack, Container, Grid, CircularProgress, Alert, Snackbar, useMediaQuery, useTheme } from '@mui/material';
// Icons for visual representation of contact methods
import { Send, Mail, MapPin, ShieldCheck } from 'lucide-react';
// Framer Motion for entrance animations
import { motion } from 'framer-motion';
// Import the API service function to send form data to the Node.js backend
import { dispatchCommunication } from '../services/api';

const Contact = ({ profile }) => {
    const theme = useTheme();
    // Detect mobile devices for adjusting notification position
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // State to store the form inputs (name, email, profession, subject, message)
    const [formData, setFormData] = useState({ name: '', email: '', profession: '', subject: '', message: '' });
    // State to track if the form is currently being submitted to the server
    const [loading, setLoading] = useState(false);
    // State to store the success or error message from the server
    const [status, setStatus] = useState({ type: '', message: '' });
    // State to control whether the notification snackbar is open
    const [open, setOpen] = useState(false);

    /**
     * [handleChange]
     * Updates the local formData state as the user types into the input fields.
     */
    const handleChange = (e) => {
        // Dynamic update based on the 'name' attribute of the TextField
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * [handleSubmit]
     * Sends the collected form data to the backend when the user clicks 'Send Message'.
     */
    const handleSubmit = async (e) => {
        // Prevent the browser from refreshing the page
        e.preventDefault();
        // Show the loading spinner
        setLoading(true);

        // Call the external API service function
        const result = await dispatchCommunication(formData);

        // Hide the loading spinner
        setLoading(false);
        // If the message was sent successfully
        if (result.success) {
            // Set a positive status message
            setStatus({ type: 'success', message: result.message || 'Message sent successfully. I will get back to you soon!' });
            // Clear the form fields
            setFormData({ name: '', email: '', profession: '', subject: '', message: '' });
        } else {
            // Check for spam protection specific message
            const errorMsg = result.message || result.error || 'CRITICAL_TRANSMISSION_FAILURE';
            setStatus({ type: 'error', message: `Communication Failure: ${errorMsg}` });
        }
        // Open the notification snackbar
        setOpen(true);
    };

    /**
     * [handleClose]
     * Closes the notification snackbar.
     */
    const handleClose = () => setOpen(false);

    // Reusable styling for the futuristic Material UI TextFields
    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            color: 'white',
            fontFamily: '"Inter", "Roboto", sans-serif',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.15)', borderRadius: 3, transition: 'all 0.3s ease' },
            // On hover, change the border color to pink
            '&:hover fieldset': { borderColor: '#ec4899', backgroundColor: 'rgba(255,255,255,0.02)' },
            // When clicked/focused, change to purple with a subtle glow
            '&.Mui-focused fieldset': { borderColor: '#8b5cf6', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' },
            backgroundColor: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(10px)',
        },
        '& .MuiInputLabel-root': { color: '#9ca3af', fontFamily: '"Inter", "Roboto", sans-serif', fontSize: '0.875rem' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#e5e7eb' },
        mb: 3
    };

    return (
        <Container maxWidth="lg" id="contact" sx={{ py: 15 }}>
            {/* Header: Secure Protocol Identification */}
            <Stack spacing={2} sx={{ mb: 10, textAlign: 'center' }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(51, 204, 255, 0.3)' }} />
                    <Typography variant="caption" sx={{ color: '#00ffcc', fontWeight: 900, letterSpacing: 4, fontFamily: 'Syncopate', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        CONTACT_INQUIRY
                    </Typography>
                    <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(51, 204, 255, 0.3)' }} />
                </Box>
                <Typography variant="h2" sx={{
                    fontFamily: 'Syncopate',
                    fontWeight: 900,
                    letterSpacing: -2,
                    fontSize: { xs: '2.5rem', md: '4.5rem' },
                    textShadow: '0 0 40px rgba(255,255,255,0.05)'
                }}>
                    GET IN <span style={{ color: '#ff3366', textShadow: '0 0 20px rgba(255, 51, 102, 0.4)' }}>TOUCH</span>
                </Typography>
            </Stack>

            <Grid container spacing={8} alignItems="center">

                {/* Left Column: Technical Contact Data */}
                <Grid item xs={12} md={5}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Terminal Log Output */}
                        <Box sx={{ mb: 6, p: 3, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 3, borderLeft: '3px solid #00ffcc', fontFamily: 'monospace' }}>
                            <Typography sx={{ color: '#00ffcc', fontSize: '0.75rem', mb: 1 }}>&gt; SYSTEM_READY... [OK]</Typography>
                            <Typography sx={{ color: '#00ffcc', fontSize: '0.75rem', mb: 1 }}>&gt; SECURE_PROTOCOL_ACTIVE... [AES_256]</Typography>
                            <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, mt: 2 }}>
                                I am currently open to high-impact collaborations, enterprise-scale engineering roles, and innovative architectural challenges.
                            </Typography>
                        </Box>

                        <Stack spacing={4}>
                             {[
                                { icon: <Mail size={22} />, label: 'Email Address', val: profile.email, isLink: true, color: '#33ccff' },
                                { icon: <MapPin size={22} />, label: 'Base Location', val: profile.location, color: '#ff3366' },
                                { icon: <ShieldCheck size={22} />, label: 'Availability Status', val: profile.additionalInfo?.availability || 'Ready to Join', color: '#00ffcc' }
                            ].map((item, i) => (

                                <Stack
                                    key={i}
                                    direction="row"
                                    spacing={3}
                                    alignItems="center"
                                    // If it's the email, make it clickable
                                    component={item.isLink ? 'a' : 'div'}
                                    href={item.isLink ? `mailto:${item.val}` : undefined}
                                    sx={{
                                        textDecoration: 'none',
                                        cursor: item.isLink ? 'pointer' : 'default',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': item.isLink ? { transform: 'translateX(8px)' } : {}
                                    }}
                                >
                                    {/* Icon Container with Gradient Border */}
                                    <Box sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.15) 100%)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.2)' }}>
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: '#e5e7eb', fontWeight: 600, display: 'block', fontFamily: '"Inter", sans-serif' }}>{item.label}</Typography>
                                        <Typography sx={{ color: '#9ca3af', fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', mt: 0.5 }}>{item.val}</Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </motion.div>
                </Grid>

                {/* Right Column: The Actual Contact Form */}
                <Grid item xs={12} md={7}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {/* [SECURITY_SHIELD_CONTAINER] */}
                        <Box sx={{ position: 'relative' }}>
                            {/* Ambient Glow Orbs behind the form */}
                            <Box sx={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(51, 204, 255, 0.15), transparent 70%)', filter: 'blur(60px)', zIndex: 0, animation: 'float 10s ease-in-out infinite' }} />
                            <Box sx={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255, 51, 102, 0.1), transparent 70%)', filter: 'blur(50px)', zIndex: 0, animation: 'float 8s ease-in-out infinite reverse' }} />

                            {/* Semi-transparent Glassmorphic Form Card */}
                            <Box component="form" onSubmit={handleSubmit} sx={{
                                p: { xs: 4, md: 6 },
                                borderRadius: 4,
                                background: 'rgba(15, 23, 42, 0.4)',
                                backdropFilter: 'blur(30px) saturate(180%)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                                position: 'relative',
                                overflow: 'hidden',
                                zIndex: 1
                            }}>
                                {/* Holographic Scanline Overlay */}
                                <Box sx={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
                                    background: 'linear-gradient(90deg, transparent, rgba(0, 255, 204, 0.3), transparent)',
                                    animation: 'scanLineMove 4s linear infinite',
                                    zIndex: 2, pointerEvents: 'none'
                                }} />

                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    {/* Sub-Header: System Telemetry */}
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, opacity: 0.6 }}>
                                        <Typography sx={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#00ffcc', letterSpacing: 1 }}>
                                            [ DISPATCH_PROTOCOL_V4 ]
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#fff' }}>
                                            SECURE_ENCRYPTION: AES_256
                                        </Typography>
                                    </Stack>

                                    <Grid container spacing={2}>
                                        {/* Name Input */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required sx={inputStyles} />
                                        </Grid>
                                        {/* Profession Input */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Profession / Role" name="profession" value={formData.profession} onChange={handleChange} sx={inputStyles} />
                                        </Grid>
                                        {/* Email Input */}
                                        <Grid item xs={12}>
                                            <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required sx={inputStyles} />
                                        </Grid>
                                        {/* Subject Input */}
                                        <Grid item xs={12}>
                                            <TextField fullWidth label="Inquiry Subject" name="subject" value={formData.subject} onChange={handleChange} sx={inputStyles} />
                                        </Grid>
                                        {/* Message Input (Multi-line) */}
                                        <Grid item xs={12}>
                                            <TextField fullWidth label="Message Details" name="message" multiline rows={5} value={formData.message} onChange={handleChange} required sx={inputStyles} />
                                        </Grid>
                                    </Grid>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        fullWidth
                                        disabled={loading}
                                        variant="contained"
                                        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
                                        sx={{
                                            py: 2.5,
                                            mt: 2,
                                            background: 'linear-gradient(135deg, #00ffcc 0%, #33ccff 100%)',
                                            color: '#000',
                                            fontWeight: 900,
                                            fontFamily: 'Syncopate',
                                            fontSize: '0.8rem',
                                            letterSpacing: 2,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            boxShadow: '0 0 30px rgba(0, 255, 204, 0.2)',
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            '&:hover': {
                                                background: '#00ffcc',
                                                transform: 'translateY(-3px) scale(1.01)',
                                                boxShadow: '0 15px 40px rgba(0, 255, 204, 0.4)'
                                            },
                                            '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: '#444' }
                                        }}
                                    >
                                        {loading ? 'INITIALIZING DISPATCH...' : 'ESTABLISH CONNECTION'}
                                    </Button>

                                    <Typography sx={{ mt: 3, textAlign: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                                        * BY INITIATING THIS TRANSMISSION, YOU AGREE TO AUTHENTICATED LOGGING OF YOUR IP AND METADATA.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Notification Popup (Snackbar) shown after submission */}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: isMobile ? 'top' : 'bottom',
                    horizontal: isMobile ? 'center' : 'right'
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={status.type}
                    sx={{
                        width: '100%',
                        bgcolor: 'rgba(15, 23, 42, 0.9)',
                        color: 'white',
                        // Green border for success, red for error
                        border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`,
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        fontFamily: '"Inter", sans-serif'
                    }}
                >
                    {status.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Contact;
