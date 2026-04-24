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

    const fetchProgressively = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Critical Path: Fetch initial bundle or navigation first
            // We still fetch the full profile as a fallback/initial seed, 
            // but then we refresh specific parts if needed.
            // Actually, per USER request, we fetch fragments one by one.
            
            const fragments = [
                'navigation', 'basic_info', 'analytics', 'socials', 
                'skills', 'experience', 'projects', 'education', 'documentation'
            ];

            // Start fetching fragments
            // Some can be parallel (Promise.all) or sequential for "pop-in" effect.
            
            // Critical First: Navigation & Basic Info
            const [nav, basic] = await Promise.all([
                fetchFragment('navigation'),
                fetchFragment('basic_info')
            ]);

            if (nav) updateProfile(nav);
            if (basic) {
                updateProfile(basic);
                setMaintenanceMode(basic.maintenanceMode || false);
            }

            // The page is now visually ready (Header + Hero)
            setLoading(false);

            // Fetch the rest in the background
            const secondary = ['analytics', 'socials', 'skills', 'experience', 'projects', 'education', 'documentation'];
            
            for (const frag of secondary) {
                fetchFragment(frag).then(data => {
                    if (data) {
                        // Special case: experience and projects are strictly arrays in their source files
                        if (frag === 'experience') {
                            updateProfile({ experience: Array.isArray(data) ? data : (data.payload || []) });
                        }
                        else if (frag === 'projects') {
                            updateProfile({ projects: Array.isArray(data) ? data : (data.payload || []) });
                        }
                        else updateProfile(data);
                    }
                });
            }

        } catch (err) {
            setError(err);
            setErrorType('network');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProgressively();
    }, [fetchProgressively]);

    return { profile, loading, error, errorType, maintenanceMode, retry: fetchProgressively };
};

export default useProfile;
