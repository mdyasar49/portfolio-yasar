import { useState, useEffect, useCallback } from 'react';
import { fetchSystemInterfaceData } from '../services/api';

/**
 * Custom Hook: useProfile
 * Fetches portfolio profile data and classifies any errors by type.
 * Returns: profile, loading, error, errorType, retry
 */
const useProfile = () => {
    const [profile, setProfile]     = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [errorType, setErrorType] = useState(null); // 'network' | 'server' | 'notfound' | 'unknown'

    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const fetchProfileData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setErrorType(null);

        const MAX_RETRIES = 4;
        let lastError = null;

        try {
            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                try {
                    const data = await fetchSystemInterfaceData();
                    if (data) {
                        setProfile(data);
                        setMaintenanceMode(data.maintenanceMode || false);
                        return;
                    }
                } catch (err) {
                    lastError = err;
                    if (attempt < MAX_RETRIES) {
                        await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
                    }
                }
            }

            if (lastError) throw lastError;
        } catch (err) {
            setError(err);

            if (!navigator.onLine || err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
                setErrorType('network');
            } else if (err.response?.status === 404) {
                setErrorType('notfound');
            } else if (err.response?.status >= 500) {
                setErrorType('server');
            } else {
                setErrorType('unknown');
            }
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]); 

    return { profile, loading, error, errorType, maintenanceMode, retry: fetchProfileData };
};

export default useProfile;
