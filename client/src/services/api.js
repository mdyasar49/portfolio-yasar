/**
 * 🛰️ Advanced API Orchestration Layer
 * Managed via central axiosInstance for standardized telemetry.
 */
import axiosInstance from './axiosInstance';

/**
 * [PUBLIC_ENDPOINTS]
 */

// Retrieve core system data and interface definitions
export const fetchSystemInterfaceData = async () => {
    return await axiosInstance.get('/profile');
};

// Retrieve and optionally increment visitor telemetries
export const fetchSystemAnalytics = async (increment = false) => {
    try {
        return await axiosInstance.get(`/visitors${increment ? '?inc=true' : ''}`);
    } catch (error) {
        return { success: false, count: 0, history: [] };
    }
};

// Probe system health and resource utilization
export const probeSystemIntegrity = async () => {
    try {
        return await axiosInstance.get('/health');
    } catch (error) {
        return { success: false, status: 'OFFLINE_MODE' };
    }
};

// Dispatch a new communication payload to the administrative core
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

// Execute administrative authentication protocol
export const executeAdministrativeAuth = async (credentials) => {
    return await axiosInstance.post('/auth/login', credentials);
};

// Dispatch a new architectural proposal for administrative vetting
export const dispatchArchitecturalProposal = async (suggestedData) => {
    return await axiosInstance.post('/proposals/submit', { suggestedData });
};

/**
 * [AUTHENTICATED_ADMIN_ENDPOINTS]
 */

// Validate the current administrative session credentials
export const validateAdminSession = async () => {
    return await axiosInstance.get('/auth/me');
};

// Synchronize and persist updated system architecture data
export const synchronizeArchitecture = async (architecturePayload) => {
    return await axiosInstance.put('/profile', architecturePayload);
};

// Fetch decrypted transmission logs from the communication hub
export const fetchTransmissionLogs = async () => {
    return await axiosInstance.get('/contact');
};

// Purge a specific record from the transmission persistent store
export const purgeTransmissionRecord = async (recordId) => {
    return await axiosInstance.delete(`/contact/${recordId}`);
};

// Authorize and merge a pending architectural modification
export const authorizeArchitecturalChange = async (proposalId) => {
    return await axiosInstance.put(`/proposals/approve/${proposalId}`);
};

// Dismiss and archive a pending architectural modification
export const dismissArchitecturalChange = async (proposalId) => {
    return await axiosInstance.put(`/proposals/reject/${proposalId}`);
};

// Fetch any pending architectural modification proposals
export const fetchPendingModifications = async () => {
    return await axiosInstance.get('/proposals');
};

// Rotate administrative security credentials
export const rotateSecurityCredentials = async (credentialPayload) => {
    return await axiosInstance.put('/auth/change-password', credentialPayload);
};

// Modify the global system maintenance lockdown status
export const modifyMaintenanceLock = async (statusPayload) => {
    // statusPayload: { enabled: boolean }
    return await axiosInstance.put('/health/maintenance', statusPayload);
};

export default axiosInstance;
