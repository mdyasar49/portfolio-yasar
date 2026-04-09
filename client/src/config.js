/**
 * 🚀 Centralized Application Configuration
 * Strictly uses .env file for configuration as requested.
 */

// 1. Determine the Current Environment
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 2. Resolve the API Base URL strictly from .env
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 3. Warning if .env is missing or server wasn't restarted
if (!API_BASE_URL) {
    console.error(
        "❌ [Config Error]: REACT_APP_API_BASE_URL is NOT defined! " +
        "Please check your client/.env file. " +
        "IMPORTANT: You MUST restart your React server (npm start) after changing the .env file!"
    );
}

// 4. Default Export
export default API_BASE_URL;
