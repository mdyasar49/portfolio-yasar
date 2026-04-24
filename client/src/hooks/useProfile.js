import { useState, useEffect, useCallback } from 'react';
import { fetchFragment, fetchSystemInterfaceData } from '../services/api';

/**
 * Custom Hook: useProfile
 * Implements Progressive Module Loading (PML) architecture.
 * Fetches data fragments one-by-one to ensure instant "Time to Interactive".
 */
const useProfile = () => {
    const [profile, setProfile]     = useState({});
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const updateProfile = (fragment) => {
        setProfile(prev => ({ ...prev, ...fragment }));
    };

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch the entire consolidated profile in a single request
            const data = await fetchSystemInterfaceData();
            
            if (data) {
                setProfile(data);
                setMaintenanceMode(data.maintenanceMode || false);
            }
            
            setLoading(false);
        } catch (err) {
            setError(err);
            setErrorType('network');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return { profile, loading, error, errorType, maintenanceMode, retry: fetchAllData };
};

export default useProfile;
