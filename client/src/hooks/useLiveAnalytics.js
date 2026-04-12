import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import API_BASE_URL from '../config';

/**
 * Custom Hook: useLiveAnalytics
 * Establishes a WebSocket connection to track live active sessions.
 */
const useLiveAnalytics = () => {
    const [activeSessions, setActiveSessions] = useState(1); // Default to at least self
    const socketRef = useRef(null);

    useEffect(() => {
        // Derive Socket URL from API_BASE_URL (removing /api)
        const socketUrl = API_BASE_URL.replace('/api', '');
        
        // Initialize Socket connection
        socketRef.current = io(socketUrl, {
            reconnectionAttempts: 5,
            timeout: 10000,
        });

        // Listen for live updates
        socketRef.current.on('visitorCountUpdate', (count) => {
            setActiveSessions(count);
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return { activeSessions };
};

export default useLiveAnalytics;
