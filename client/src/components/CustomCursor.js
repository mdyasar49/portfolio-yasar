/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders a custom high-tech cursor that follows the user's mouse.
 * It features a "Lag-trail" effect and a "Scanner Ring" that reacts to interactions.
 */

import React, { useState, useEffect, useRef } from 'react';

import { Box } from '@mui/material';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const trailRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const trail = trailRef.current;
        if (!cursor || !trail) return;

        let mouseX = 0;
        let mouseY = 0;
        let trailX = 0;
        let trailY = 0;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate update for the primary dot
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        };

        const handleMouseOver = (e) => {
            const isClickable = e.target.closest('button, a, [role="button"], .interactive');
            setIsHovered(!!isClickable);
        };

        const animate = () => {
            // Smooth interpolation for the trail
            trailX += (mouseX - trailX) * 0.15;
            trailY += (mouseY - trailY) * 0.15;
            
            trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
            
            requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <Box sx={{ 
            position: 'fixed', top: 0, left: 0, zIndex: 10002, 
            pointerEvents: 'none', display: { xs: 'none', md: 'block' } 
        }}>
            {/* Primary Sharp Dot */}
            <div
                ref={cursorRef}
                style={{
                    width: 8, height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#00ffcc',
                    boxShadow: '0 0 15px #00ffcc',
                    position: 'absolute',
                    top: -4, left: -4,
                    willChange: 'transform'
                }}
            />

            {/* Trailing Scanner Ring */}
            <div
                ref={trailRef}
                style={{
                    width: isHovered ? 60 : 30,
                    height: isHovered ? 60 : 30,
                    borderRadius: '50%',
                    border: '1px solid rgba(51, 204, 255, 0.4)',
                    boxShadow: isHovered ? '0 0 20px rgba(51, 204, 255, 0.3)' : 'none',
                    position: 'absolute',
                    top: isHovered ? -30 : -15, 
                    left: isHovered ? -30 : -15,
                    transition: 'width 0.3s, height 0.3s, top 0.3s, left 0.3s',
                    willChange: 'transform'
                }}
            >
                <Box sx={{ 
                    position: 'absolute', top: '50%', left: 0, right: 0, 
                    height: '1px', background: 'rgba(51, 204, 255, 0.2)',
                    animation: 'cursorScan 2s linear infinite'
                }} />
            </div>

            <style>
                {`
                    @keyframes cursorScan {
                        0% { top: 0%; opacity: 0; }
                        50% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                `}
            </style>
        </Box>
    );
};


export default CustomCursor;
