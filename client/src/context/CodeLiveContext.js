/**
 * Language: JavaScript (React.js)
 * Purpose: 
 * This context provides a global state for the "Code Live" mode. 
 * It manages whether the code overlay is visible and which module's 
 * source code should be displayed.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CodeLiveContext = createContext();

export const CodeLiveProvider = ({ children }) => {
    // isCodeLive: Toggle state for the code view
    const [isCodeLive, setIsCodeLive] = useState(false);
    // activeModule: The identifier for the current section (e.g., 'portfolio', 'resume')
    const [activeModule, setActiveModule] = useState('portfolio');
    const location = useLocation();

    /**
     * [Auto-detection Protocol]
     * Automatically updates the 'activeModule' based on the current URL path.
     */
    useEffect(() => {
        const path = location.pathname;
        const hash = location.hash;

        // Route detection logic for public pages
        if (path === '/') {
            if (hash.includes('skills')) setActiveModule('skills');
            else if (hash.includes('projects')) setActiveModule('projects');
            else if (hash.includes('contact')) setActiveModule('contact');
            else setActiveModule('portfolio');
        }
        else if (path.includes('/resume')) setActiveModule('resume');
        else if (path.includes('/docs')) setActiveModule('documentation');
        // Route detection logic for admin/management pages
        else if (path.includes('/admin/dashboard')) setActiveModule('admin');
        else if (path.includes('/admin/management')) setActiveModule('management');
        else if (path.includes('/admin')) setActiveModule('admin');
    }, [location]);


    const toggleCodeLive = () => setIsCodeLive(prev => !prev);

    return (
        <CodeLiveContext.Provider value={{ isCodeLive, toggleCodeLive, activeModule, setActiveModule }}>
            {children}
        </CodeLiveContext.Provider>
    );
};

// Custom hook for accessing the Code Live state
export const useCodeLive = () => useContext(CodeLiveContext);
