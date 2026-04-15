/**
 * [Axios Service: REST API Interaction]
 * This service uses Axios to communicate between the React.js frontend 
 * and the Express.js backend API.
 */
import axios from 'axios';
import API_BASE_URL from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Global Request Orchestration - Attaching Credentials
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Global Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle session expiration
        if (error.response?.status === 401) {
            // Optional: Redirect to login or clear token
            // localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export const getProfile = async () => {
    const response = await api.get('/profile');
    return response.data;
};

export const getVisitors = async (increment = false) => {
    try {
        const response = await api.get(`/visitors${increment ? '?inc=true' : ''}`);
        return response.data;
    } catch {
        return { success: false, count: 0 };
    }
};

export const getHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch {
        return { success: false, status: 'Offline' };
    }
};

export const submitContact = async (formData) => {
    try {
        const response = await api.post('/contact', formData);
        return response.data;
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data?.error || 'System core failure during transmission.' 
        };
    }
};

// [AUTHENTICATED_ENDPOINTS]

/**
 * Identify current admin session
 */
export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

/**
 * Update portfolio architecture
 */
export const updateProfile = async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
};

/**
 * Retrieve all contact transmissions
 */
export const getContacts = async () => {
    const response = await api.get('/contact');
    return response.data;
};

/**
 * Purge a specific transmission
 */
export const deleteContact = async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
};

/**
 * Approve architectural proposal
 */
export const approveProposal = async (id) => {
    const response = await api.put(`/proposals/approve/${id}`);
    return response.data;
};

/**
 * Reject architectural proposal
 */
export const rejectProposal = async (id) => {
    const response = await api.put(`/proposals/reject/${id}`);
    return response.data;
};

/**
 * Update security credentials
 */
export const changePassword = async (passData) => {
    const response = await api.put('/auth/change-password', passData);
    return response.data;
};

/**
 * Toggle system maintenance lock
 */
export const toggleMaintenance = async (enabled) => {
    const response = await api.put('/health/maintenance', { enabled });
    return response.data;
};

export default api;
