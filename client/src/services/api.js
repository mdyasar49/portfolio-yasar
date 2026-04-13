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
    (error) => {
        // Log critical network failures for debugging
        if (!error.response) {
            console.error("🌐 [Network Error] Server unreachable or CORS failure.");
        } else {
            // console.error(`❌ [API Error] Status ${error.response.status}:`, error.response.data);
        }
        return Promise.reject(error);
    }
);

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getVisitors = async () => {
    try {
        const response = await api.get('/visitors');
        return response.data;
    } catch (error) {
        console.error('SERVICE_ERROR_VISTORS:', error);
        return { success: false, count: 0 };
    }
};

export const getHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('SERVICE_ERROR_HEALTH:', error);
        return { success: false, status: 'Offline' };
    }
};

export const submitContact = async (formData) => {
    try {
        const response = await api.post('/contact', formData);
        return response.data;
    } catch (error) {
        console.error('SERVICE_ERROR_CONTACT:', error);
        return { 
            success: false, 
            error: error.response?.data?.error || 'System core failure during transmission.' 
        };
    }
};

export default api;
