import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';

const Admin = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/contacts`);
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();
  }, []);

  return (
    <Box sx={{ py: 15, minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom sx={{ mb: 4, color: 'primary.light' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, color: 'text.secondary' }}>
          Viewing all messages sent through the portfolio contact form.
        </Typography>

        <TableContainer component={Paper} className="glass" sx={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'primary.light', fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ color: 'primary.light', fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ color: 'primary.light', fontWeight: 700 }}>Subject</TableCell>
                <TableCell sx={{ color: 'primary.light', fontWeight: 700 }}>Message</TableCell>
                <TableCell sx={{ color: 'primary.light', fontWeight: 700 }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg._id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                  <TableCell sx={{ color: 'text.primary' }}>{msg.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{msg.email}</TableCell>
                  <TableCell>
                    <Chip label={msg.subject} size="small" variant="outlined" sx={{ color: 'primary.light', borderColor: 'primary.light' }} />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', maxWidth: 300 }}>{msg.message}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {new Date(msg.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10, color: 'text.secondary' }}>
                    No messages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default Admin;
