import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * ProtectedRoute Component
 * Restricts access to Admin-only pages.
 */
const ProtectedRoute = ({ children }) => {
    const { admin, loading } = useAdmin();

    if (loading) {
        return (
            <Box sx={{ 
                height: '100vh', display: 'flex', flexDirection: 'column', 
                alignItems: 'center', justifyContent: 'center', bgcolor: '#010409' 
            }}>
                <CircularProgress sx={{ color: '#33ccff', mb: 2 }} />
                <Typography sx={{ color: '#444', fontFamily: 'Syncopate', fontSize: '0.6rem' }}>
                    VERIFYING_CREDENTIALS...
                </Typography>
            </Box>
        );
    }

    if (!admin) {
        // [REDIRECT] — System unauthorized, return to login gateway
        return <Navigate to="/admin/login" />;
    }

    return children;
};

export default ProtectedRoute;
