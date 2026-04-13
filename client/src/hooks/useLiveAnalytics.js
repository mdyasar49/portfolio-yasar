import { useState, useEffect, useRef } from 'react';
import { getVisitors } from '../services/api';

/**
 * Custom Hook: useLiveAnalytics
 * Uses lightweight polling to avoid noisy socket reconnect failures.
 */
const useLiveAnalytics = () => {
    const [activeSessions, setActiveSessions] = useState(1); // Default to at least self
    const pollTimerRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        const refreshVisitors = async () => {
            const data = await getVisitors();
            if (mounted && data?.success && Number.isFinite(data.count)) {
                setActiveSessions(Math.max(1, data.count));
            }
        };

        // Initial load and slow polling keeps telemetry fresh
        refreshVisitors();
        pollTimerRef.current = setInterval(refreshVisitors, 30000);

        return () => {
            mounted = false;
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
            }
        };
    }, []);

    return { activeSessions };
};

export default useLiveAnalytics;
