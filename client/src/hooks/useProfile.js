import { useState, useEffect, useCallback } from 'react';
import { getProfile } from '../services/api';
import localData from '../data.json'; // Bundled fallback for [Instant_Load]

/**
 * Custom Hook: useProfile
 * Fetches portfolio profile data and classifies any errors by type.
 * Returns: profile, loading, error, errorType, retry
 */
const useProfile = () => {
    // 1. Initialize with local bundled data for [INSTANT_ZERO_WAIT_LOAD]
    const [profile, setProfile]     = useState(localData);
    const [loading, setLoading]     = useState(false); // No primary loader needed for zero-wait
    const [error, setError]         = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [isRealTime, setIsRealTime] = useState(false); // Tracks if data is from server

    const fetchProfileData = useCallback(async () => {
        // We don't set loading=true here to prevent flickering; we use localData initially
        setError(null);

        try {
            // Add a timeout to the fetch so we don't wait forever on Render sleep
            const fetchPromise = getProfile();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('TIMEOUT')), 5000)
            );

            const data = await Promise.race([fetchPromise, timeoutPromise]);
            
            if (data) {
                setProfile(data);
                setIsRealTime(true);
            }
        } catch (err) {
            // If it's just a timeout or network error, we stay silent because we have localData
            if (err.message !== 'TIMEOUT') {
                console.group('🔍 [API Background Sync]');
                console.warn('Backend still waking up or unreachable. Using bundled fallback.');
                console.log('Error:', err.message);
                console.groupEnd();
            }
            
            // Only show the error screen if we have NO data at all (shouldn't happen with localData)
            if (!profile) {
                setError(err);
                setErrorType(err.message === 'TIMEOUT' ? 'server' : 'network');
            }
        } finally {
            setLoading(false);
        }
    }, [profile]);

    useEffect(() => {
        fetchProfileData();
    }, []); // Run once on mount

    return { profile, loading, error, errorType, retry: fetchProfileData, isRealTime };
};

export default useProfile;
