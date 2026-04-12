import { useState, useEffect, useCallback } from 'react';
import { getProfile } from '../services/api';

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

    const fetchProfileData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setErrorType(null);

        try {
            const data = await getProfile();
            if (data) setProfile(data);
        } catch (err) {
            console.error('Error fetching profile:', err);
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
    }, []); // getProfile is a stable module-level import — no deps needed

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]); // fetchProfileData is stable (useCallback with [])

    return { profile, loading, error, errorType, retry: fetchProfileData };
};

export default useProfile;
