/**
 * 🚀 Centralized Application Configuration
 * Orchestrates API endpoints, environment variables, and global constants.
 * Supports both Vite and Create React App (CRA) environments.
 */

// 1. Robust Environment Variable Extraction
const getEnvVar = (name) => {
    // Attempt CRA (Node/Process) style
    try {
        if (typeof process !== 'undefined' && process.env) {
            return process.env[name];
        }
    } catch (e) { /* Fallback */ }

    // Attempt Vite style
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
            return import.meta.env[name];
        }
    } catch (e) { /* Fallback */ }

    return null;
};

// 2. API Base URL Resolution
// Prioritizes environment variables, falls back to Production Render URL
export const API_BASE_URL = getEnvVar('REACT_APP_API_BASE_URL') || getEnvVar('VITE_API_BASE_URL') || 'https://mern-portfolio-yasar.onrender.com/api';

// 3. Global Environment Flags
export const IS_PRODUCTION = 
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') ||
    (typeof import.meta !== 'undefined' && import.meta.env?.PROD);

// 4. Default Export (Mainly for API URL)
export default API_BASE_URL;

/**
 * Development Helper:
 * Logs the current API context to the console for easier troubleshooting
 */
if (!IS_PRODUCTION) {
    console.groupCollapsed('🛠️ [Config] Developer Environment Loaded');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Environment:', 'Development');
    console.groupEnd();
}
