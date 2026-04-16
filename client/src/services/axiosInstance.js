/**
 * 🛰️ Centralized Axios Interceptor Engine
 * Standardizes all outbound HTTP telemetries and inbound response parsing.
 */
import axios from 'axios';
import { API_BASE_URL } from '../config';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15s timeout for high-latency environments
});

// Request Interceptor: Attach authentication tokens or telemetry headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('system_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('🛰️ [Telemetry Outbound Error]:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor: Standardize data extraction and global error handling
axiosInstance.interceptors.response.use(
    (response) => {
        // Automatically return the data payload for cleaner service calls
        return response.data;
    },
    (error) => {
        const status = error.response ? error.response.status : 'OFFLINE';
        console.error(`🛰️ [Telemetry Inbound Error] [Status: ${status}]:`, error.message);
        
        // Handle unauthorized or expired sessions
        if (status === 401) {
            localStorage.removeItem('system_token');
            // Optional: window.location.href = '/admin/login';
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
