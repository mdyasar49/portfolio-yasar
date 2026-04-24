/**
 * 🚀 Centralized Application Configuration
 * Strictly uses .env file for configuration as requested.
 */

// 1. Determine the Current Environment
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 2. Resolve the API Base URL
// In production, we assume the frontend and backend are on the same domain
export const API_BASE_URL = IS_PRODUCTION 
    ? '/api' 
    : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api');

// 3. Status Log
if (!IS_PRODUCTION) {
    console.log(`📡 [Config] Development mode active. API: ${API_BASE_URL}`);
}

// 4. Default Export
export default API_BASE_URL;
