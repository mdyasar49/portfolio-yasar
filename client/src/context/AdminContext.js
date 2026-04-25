import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // [Check Session] — Load admin data on startup if token exists
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Set default authorization header for all future API calls
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                const response = await api.get('/auth/me');
                if (response.data.success) {
                    setAdmin(response.data.data);
                } else {
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                }
            } catch (error) {
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // [Login Event] — Save token and update state
    const loginAdmin = (adminData, token) => {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAdmin(adminData);
    };

    // [Logout Event] — Clear everything
    const logoutAdmin = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setAdmin(null);
    };


    return (
        <AdminContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
