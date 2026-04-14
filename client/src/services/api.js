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

// Global Request Logger
api.interceptors.request.use((config) => {
    // console.log(`🚀 [API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Global Response Error Handler
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
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

export default api;
