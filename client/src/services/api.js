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

export default api;
