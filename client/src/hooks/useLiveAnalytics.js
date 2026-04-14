import { useState, useEffect, useRef } from 'react';
import { getVisitors } from '../services/api';

/**
 * Custom Hook: useLiveAnalytics
 * Uses lightweight polling to avoid noisy socket reconnect failures.
 */
const useLiveAnalytics = () => {
    const [activeSessions, setActiveSessions] = useState(1); // Default to at least self
    const pollTimerRef = useRef(null);
    const latestAppliedRequestRef = useRef(0);

    useEffect(() => {
        let mounted = true;

        const refreshVisitors = async () => {
            const requestStartedAt = Date.now();
            const data = await getVisitors(false); // Do not increment on polling

            // Only apply the newest successful response to avoid stale overwrites.
            if (
                mounted &&
                data?.success &&
                Number.isFinite(data.count) &&
                requestStartedAt >= latestAppliedRequestRef.current
            ) {
                latestAppliedRequestRef.current = requestStartedAt;
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
