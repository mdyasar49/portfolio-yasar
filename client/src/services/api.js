/**
 * [Node.js / Axios - API Orchestration Layer]
 * Technologies: Javascript (ES6+), Axios (XHR Client), RESTful API Patterns
 * Purpose: This service layer centralizes all HTTP communication between the React frontend
 * and the Node.js/Express backend. It handles telemetry, authentication, and data synchronization.
 */
import axiosInstance from './axiosInstance';

/**
 * [PUBLIC_ENDPOINTS]
 * Access: Open to all visitors.
 */

export const fetchSystemInterfaceData = async () => {
    return await axiosInstance.get('/profile');
};

/**
 * [ATOMIC_DATA_ENDPOINTS]
 * Purpose: Fetches specific modules for progressive data loading.
 */

// Fetches core profile info (name, title, summary, etc.)
export const fetchBasicDetails = async () => {
    const response = await axiosInstance.get('/profile/basicdetails');
    return response.payload || response;
};

// Fetches navigation menu items
export const fetchHeader = async () => {
    const response = await axiosInstance.get('/header');
    return response.payload || response;
};

// Fetches technical skills distribution
export const fetchSkills = async () => {
    const response = await axiosInstance.get('/profile/skills');
    return response.payload || response;
};

// Fetches professional work history
export const fetchExperience = async () => {
    const response = await axiosInstance.get('/profile/experience');
    return response.payload || response;
};

// Fetches portfolio project showcase
export const fetchProjects = async () => {
    const response = await axiosInstance.get('/profile/projects');
    return response.payload || response;
};

// Fetches academic qualifications
export const fetchEducation = async () => {
    const response = await axiosInstance.get('/profile/education');
    return response.payload || response;
};

// Fetches social media link tree
export const fetchSocials = async () => {
    const response = await axiosInstance.get('/profile/socials');
    return response.payload || response;
};

// Fetches availability and preferences
export const fetchAdditionalInfo = async () => {
    const response = await axiosInstance.get('/profile/additional');
    return response.payload || response;
};

// Fetches project documentation/README content
export const fetchDocumentation = async () => {
    const response = await axiosInstance.get('/docs');
    return response.payload || response;
};

// Fetches system-wide analytics data
export const fetchAnalytics = async () => {
    const response = await axiosInstance.get('/analytics');
    return response.payload || response;
};

// Fetches common layout data (Header/Footer)
export const fetchCommonLayout = async () => {
    const response = await axiosInstance.get('/common/layout');
    return response.payload || response;
};

/**
 * fetchFragment
 * @desc Retrieves a specific, atomic data module (e.g., skills, projects).
 * @param {string} type - The fragment identifier (basic_info, skills, etc.)
 */
export const fetchFragment = async (type) => {
    try {
        const response = await axiosInstance.get(`/fragments/${type}`);
        // If the backend uses the standard { success, payload } wrapper
        if (response && response.payload !== undefined) {
            return response.payload;
        }
        // Fallback for direct array/object responses
        return response;
    } catch (error) {
        console.error(`FRAGMENT_FETCH_ERROR [${type}]:`, error.message);
        return null;
    }
};

/**
 * fetchSystemAnalytics
 * @desc Retrieves visitor counts and hit history.
 * @param {boolean} increment - If true, the backend will count this as a new unique visit.
 */
export const fetchSystemAnalytics = async (increment = false) => {
    try {
        return await axiosInstance.get(`/visitors${increment ? '?inc=true' : ''}`);
    } catch (error) {
        return { success: false, count: 0, history: [] };
    }
};

/**
 * probeSystemIntegrity
 * @desc Diagnostics endpoint to check if the database and server are responsive.
 */
export const probeSystemIntegrity = async () => {
    try {
        return await axiosInstance.get('/health');
    } catch (error) {
        return { success: false, status: 'OFFLINE_MODE' };
    }
};

/**
 * dispatchCommunication
 * @desc Transmits contact form data to the backend dispatch system.
 * @param {Object} payload - { name, email, subject, message }
 */
export const dispatchCommunication = async (payload) => {
    try {
        return await axiosInstance.post('/contact', payload);
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || 'CRITICAL_TRANSMISSION_FAILURE'
        };
    }
};

/**
 * executeAdministrativeAuth
 * @desc Handles the login handshake for the admin dashboard.
 */
export const executeAdministrativeAuth = async (credentials) => {
    return await axiosInstance.post('/auth/login', credentials);
};

/**
 * [AUTHENTICATED_ADMIN_ENDPOINTS]
 * Access: Restricted to authorized administrative session holders (requires JWT).
 */

/**
 * validateAdminSession
 * @desc Verifies if the current JWT token in local storage is still valid.
 */
export const validateAdminSession = async () => {
    return await axiosInstance.get('/auth/me');
};

/**
 * synchronizeArchitecture
 * @desc Global update method to persist profile changes back to the production database.
 */
export const synchronizeArchitecture = async (architecturePayload) => {
    return await axiosInstance.put('/profile', architecturePayload);
};

/**
 * fetchPendingModifications
 * @desc Retrieves all architectural proposals waiting for approval.
 */
export const fetchPendingModifications = async () => {
    return await axiosInstance.get('/proposals');
};

/**
 * authorizeArchitecturalChange
 * @desc Approves a specific proposal and hydrates the live profile with its content.
 */
export const authorizeArchitecturalChange = async (proposalId) => {
    return await axiosInstance.put(`/proposals/approve/${proposalId}`);
};

/**
 * dismissArchitecturalChange
 * @desc Rejects a proposed change and moves it to history.
 */
export const dismissArchitecturalChange = async (proposalId) => {
    return await axiosInstance.put(`/proposals/reject/${proposalId}`);
};

/**
 * dispatchArchitecturalProposal
 * @desc Submits a new proposal for system refinement from the public interface.
 */
export const dispatchArchitecturalProposal = async (proposalPayload) => {
    return await axiosInstance.post('/proposals/submit', proposalPayload);
};

/**
 * rotateSecurityCredentials
 * @desc Updates administrative password credentials.
 */
export const rotateSecurityCredentials = async (credentials) => {
    return await axiosInstance.put('/auth/change-password', credentials);
};

/**
 * fetchTransmissionLogs
 * @desc Retrieves the list of messages sent through the contact form.
 */
export const fetchTransmissionLogs = async () => {
    return await axiosInstance.get('/contact');
};

/**
 * purgeTransmissionRecord
 * @desc Deletes a specific contact message from the database.
 */
export const purgeTransmissionRecord = async (recordId) => {
    return await axiosInstance.delete(`/contact/${recordId}`);
};

/**
 * modifyMaintenanceLock
 * @desc Toggles the global site maintenance status.
 */
export const modifyMaintenanceLock = async (statusPayload) => {
    // statusPayload: { enabled: boolean }
    return await axiosInstance.put('/health/maintenance', statusPayload);
};

export default axiosInstance;
