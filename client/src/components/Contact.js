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

const Contact = () => {
    const theme = useTheme();
    // Detect mobile devices for adjusting notification position
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // State to store the form inputs (name, email, subject, message)
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
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
            setStatus({ type: 'success', message: 'Message sent successfully. I will get back to you soon!' });
            // Clear the form fields
            setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
            // If it failed, set an error message with the specific error detail
            setStatus({ type: 'error', message: `Failed to send message: ${result.error}` });
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
            <Grid container spacing={8} alignItems="center">
                
                {/* Left Column: Contact Information and Text */}
                <Grid item xs={12} md={5}>
                    {/* Animate in from the left */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Decorative 'Contact Me' Badge */}
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2, py: 1, borderRadius: '50px', background: 'linear-gradient(90deg, rgba(139,92,246,0.1) 0%, rgba(236,72,153,0.1) 100%)', border: '1px solid rgba(236,72,153,0.2)', mb: 3 }}>
                            <Typography sx={{ color: '#ec4899', fontWeight: 600, fontFamily: '"Inter", sans-serif', letterSpacing: 1, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                Contact Me
                            </Typography>
                        </Box>
                        
                        {/* Main Section Heading with Gradient Text */}
                        <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 3, fontFamily: '"Inter", sans-serif', letterSpacing: -1, lineHeight: 1.2 }}>
                            Let's build something <br/>
                            <span style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>amazing together.</span>
                        </Typography>
                        
                        {/* Supporting Paragraph */}
                        <Typography sx={{ color: '#9ca3af', lineHeight: 1.8, mb: 6, fontSize: '1.05rem', fontFamily: '"Inter", sans-serif' }}>
                            Have a project in mind or just want to say hi? Feel free to reach out. I'm always open to discussing new opportunities and technical challenges.
                        </Typography>

                        {/* Contact Method Cards (Email, Location, Security) */}
                        <Stack spacing={4}>
                            {[
                                { icon: <Mail size={22} />, label: 'Email', val: 'mohamedyasar081786@gmail.com', isLink: true },
                                { icon: <MapPin size={22} />, label: 'Location', val: 'Remote / Global' },
                                { icon: <ShieldCheck size={22} />, label: 'Secure Communication', val: 'End-to-end encrypted protocol' }
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
                        {/* Semi-transparent Glassmorphic Form Card */}
                        <Box component="form" onSubmit={handleSubmit} sx={{ 
                            p: { xs: 4, md: 6 }, 
                            borderRadius: 4, 
                            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            position: 'relative', 
                            overflow: 'hidden'
                        }}>
                            {/* Decorative background blurs inside the card */}
                            <Box sx={{ position: 'absolute', top: '-20%', right: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
                            <Box sx={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
                            
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Grid container spacing={2}>
                                    {/* Name Input */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} required sx={inputStyles} />
                                    </Grid>
                                    {/* Email Input */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required sx={inputStyles} />
                                    </Grid>
                                    {/* Subject Input */}
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleChange} sx={inputStyles} />
                                    </Grid>
                                    {/* Message Input (Multi-line) */}
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Your Message" name="message" multiline rows={5} value={formData.message} onChange={handleChange} required sx={inputStyles} />
                                    </Grid>
                                </Grid>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    fullWidth 
                                    // Disable the button while the message is being sent
                                    disabled={loading}
                                    variant="contained"
                                    // Show a loading spinner if 'loading' state is true
                                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
                                    sx={{ 
                                        py: 2, 
                                        mt: 2, 
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                        color: '#ffffff', 
                                        fontWeight: 600, 
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: '1rem',
                                        letterSpacing: 0.5,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        boxShadow: '0 10px 20px -10px rgba(236, 72, 153, 0.5)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 15px 25px -10px rgba(236, 72, 153, 0.6)' 
                                        }
                                    }}
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </Button>
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
