/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders a custom high-tech cursor that follows the user's mouse.
 * It features a "Lag-trail" effect and a "Scanner Ring" that reacts to interactions.
 */

import React, { useState, useEffect, useRef } from 'react';

import { Box, Typography } from '@mui/material';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hexData, setHexData] = useState('0x00');
  const [magneticActive, setMagneticActive] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    let targetX = 0;
    let targetY = 0;
    let isMagnetic = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Immediate update for the primary dot
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Magnetic Pull Detection
      const hoveredEl = document.elementFromPoint(mouseX, mouseY);
      const clickable = hoveredEl?.closest('button, a, [role="button"], .interactive');

      if (clickable) {
        const rect = clickable.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // If close enough to center, snap target to center
        targetX = centerX;
        targetY = centerY;
        isMagnetic = true;
        setMagneticActive(true);
      } else {
        targetX = mouseX;
        targetY = mouseY;
        isMagnetic = false;
        setMagneticActive(false);
      }
    };

    const handleMouseOver = (e) => {
      const isClickable = e.target.closest('button, a, [role="button"], .interactive');
      setIsHovered(!!isClickable);
    };

    const animate = () => {
      // Smooth interpolation for the trail
      // If magnetic is active, trail follows the target (center of element)
      // otherwise it follows the raw mouse position
      const finalTargetX = isMagnetic ? targetX : mouseX;
      const finalTargetY = isMagnetic ? targetY : mouseY;

      trailX += (finalTargetX - trailX) * 0.15;
      trailY += (finalTargetY - trailY) * 0.15;

      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;

      // Generate periodic hex data for aesthetic "scanning" effect
      if (Math.random() > 0.95) {
        setHexData(
          `0x${Math.floor(Math.random() * 255)
            .toString(16)
            .toUpperCase()}`,
        );
      }

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

  const themeColor = isHovered ? '#ff3366' : '#00ffcc';
  const accentColor = isHovered ? '#ff3366' : '#33ccff';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10002,
        pointerEvents: 'none',
        display: { xs: 'none', md: 'block' },
      }}
    >
      {/* Primary Sharp Dot */}
      <div
        ref={cursorRef}
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: themeColor,
          boxShadow: `0 0 15px ${themeColor}`,
          position: 'absolute',
          top: -3,
          left: -3,
          willChange: 'transform',
          zIndex: 10,
        }}
      />

      {/* Trailing Scanner Ring System */}
      <div
        ref={trailRef}
        style={{
          width: isHovered ? 80 : 40,
          height: isHovered ? 80 : 40,
          position: 'absolute',
          top: isHovered ? -40 : -20,
          left: isHovered ? -40 : -20,
          transition:
            'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.4s, top 0.4s, left 0.4s',
          willChange: 'transform',
        }}
      >
        {/* [HUD LAYER 1] Main Rotating Border */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `1px dashed ${accentColor}`,
            opacity: 0.4,
            animation: 'spin-ccw 8s linear infinite',
          }}
        />

        {/* [HUD LAYER 2] Secondary Fast Ring */}
        <div
          style={{
            position: 'absolute',
            inset: 4,
            borderRadius: '50%',
            border: `1px solid ${accentColor}`,
            opacity: isHovered ? 0.8 : 0.2,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            animation: 'spin-cw 2s linear infinite',
          }}
        />

        {/* [HUD LAYER 3] Corner Brackets (Visible on Hover) */}
        {isHovered && (
          <Box sx={{ position: 'absolute', inset: -10, opacity: 0.8 }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 8,
                height: 8,
                borderTop: `2px solid ${themeColor}`,
                borderLeft: `2px solid ${themeColor}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 8,
                height: 8,
                borderTop: `2px solid ${themeColor}`,
                borderRight: `2px solid ${themeColor}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: 8,
                height: 8,
                borderBottom: `2px solid ${themeColor}`,
                borderLeft: `2px solid ${themeColor}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 8,
                height: 8,
                borderBottom: `2px solid ${themeColor}`,
                borderRight: `2px solid ${themeColor}`,
              }}
            />
          </Box>
        )}

        {/* [HUD LAYER 4] Scanning Line */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            animation: 'cursorScan 3s ease-in-out infinite',
          }}
        />

        {/* [HUD LAYER 5] Telemetry Data Display */}
        <Typography
          sx={{
            position: 'absolute',
            bottom: -20,
            left: '110%',
            color: accentColor,
            fontFamily: 'monospace',
            fontSize: '0.6rem',
            fontWeight: 900,
            whiteSpace: 'nowrap',
            opacity: 0.6,
            letterSpacing: 1,
          }}
        >
          {magneticActive ? 'LOCK_ENGAGED' : hexData}
        </Typography>
      </div>

      <style>
        {`
                    @keyframes cursorScan {
                        0% { top: 0%; opacity: 0; }
                        50% { opacity: 0.5; }
                        100% { top: 100%; opacity: 0; }
                    }
                    @keyframes spin-cw {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes spin-ccw {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                `}
      </style>
    </Box>
  );
};

export default CustomCursor;
