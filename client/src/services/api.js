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

export default api;
