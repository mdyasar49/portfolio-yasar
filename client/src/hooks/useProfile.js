import { useState, useEffect } from 'react';
import { getProfile } from '../services/api';

/**
 * Custom Hook: useProfile
 * Manages fetching and state for the user profile.
 * Detects and classifies error types: network, server, or unknown.
 */
const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    // raw error object
    const [errorType, setErrorType] = useState(null); // 'network' | 'server' | 'notfound' | 'unknown'

    const fetchProfileData = async () => {
        setLoading(true);
        setError(null);
        setErrorType(null);

        try {
            const data = await getProfile();
            if (data) {
                setProfile(data);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err);

            // Classify error type for the UI
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
    };

    useEffect(() => {
        fetchProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // retry function — re-fetch on user request
    const retry = () => fetchProfileData();

    return { profile, loading, error, errorType, retry };
};

export default useProfile;
