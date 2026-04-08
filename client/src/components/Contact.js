import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { Send } from 'lucide-react';
import API_BASE_URL from '../config';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ open: false, severity: 'success', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/contact`, formData);
      setStatus({ open: true, severity: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ open: true, severity: 'error', message: 'Failed to send message.' });
    }
  };

  const handleClose = () => setStatus({ ...status, open: false });

  return (
    <Box id="contact" sx={{ py: 10 }}>
      <Typography variant="h2" gutterBottom sx={{ textAlign: 'center', mb: 8 }}>
        Connect With Me
      </Typography>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={0} className="glass" sx={{ p: 4, borderRadius: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required variant="outlined" margin="normal" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} required variant="outlined" margin="normal" type="email" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleChange} variant="outlined" margin="normal" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Message" name="message" value={formData.message} onChange={handleChange} required variant="outlined" margin="normal" multiline rows={4} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth size="large" startIcon={<Send size={20} />} sx={{ mt: 2 }}>
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={status.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={status.severity} sx={{ width: '100%' }}>
          {status.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
