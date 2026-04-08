import { useState, useEffect } from 'react';
import { getProfile } from '../services/api';

/**
 * Custom Hook: useProfile
 * Manages fetching and state for the user profile
 */
const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const data = await getProfile();
                if (data) {
                    setProfile(data);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    return { profile, loading, error };
};

export default useProfile;
