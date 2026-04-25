import { useState, useEffect, useRef } from 'react';
import { fetchSystemAnalytics } from '../services/api';

/**
 * Custom Hook: useLiveAnalytics
 * Uses lightweight polling to avoid noisy socket reconnect failures.
 */
const useLiveAnalytics = () => {
    const [activeSessions, setActiveSessions] = useState(1);
    const [history, setHistory] = useState([]);
    const pollTimerRef = useRef(null);
    const latestAppliedRequestRef = useRef(0);

    useEffect(() => {
        let mounted = true;

        const refreshVisitors = async () => {
            const requestStartedAt = Date.now();
            const data = await fetchSystemAnalytics(false);

            if (
                mounted &&
                data?.success &&
                requestStartedAt >= latestAppliedRequestRef.current
            ) {
                latestAppliedRequestRef.current = requestStartedAt;
                if (Number.isFinite(data.count)) setActiveSessions(Math.max(1, data.count));
                if (Array.isArray(data.history)) setHistory(data.history);
            }
        };

        refreshVisitors();
        pollTimerRef.current = setInterval(refreshVisitors, 30000);

        return () => {
            mounted = false;
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        };
    }, []);

    return { activeSessions, history };
};

export default useLiveAnalytics;
