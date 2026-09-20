/**
 * High-performance custom cursor component.
 * Uses GPU translation and RAF interpolation with touch device detection.
 */

import React, { useState, useEffect, useRef, memo } from 'react';
import { Box } from '@mui/material';

const CustomCursor = memo(() => {
  const mainCursorRef = useRef(null);
  const trailingCursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Disable completely on touch devices / mobile to save CPU and battery
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || window.innerWidth < 900) return;

    const main = mainCursorRef.current;
    const trail = trailingCursorRef.current;
    if (!main || !trail) return;

    let mouseX = -100;
    let mouseY = -100;
    let trailX = -100;
    let trailY = -100;
    let isRunning = true;
    let animId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      main.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const handleMouseOver = (e) => {
      const interactive = e.target.closest('button, a, [role="button"], .interactive, input, textarea, select');
      setIsHovered(!!interactive);
    };

    const animate = () => {
      if (!isRunning) return;
      // Smooth interpolation for trail
      trailX += (mouseX - trailX) * 0.2;
      trailY += (mouseY - trailY) * 0.2;
      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    animId = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100000,
        pointerEvents: 'none',
        display: { xs: 'none', md: 'block' },
      }}
    >
      {/* Precision Point */}
      <div
        ref={mainCursorRef}
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isHovered ? '#ffffff' : '#f97316',
          position: 'absolute',
          top: -4,
          left: -4,
          zIndex: 2,
          transition: 'background-color 0.2s ease, transform 0.05s linear',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />

      {/* Kinetic Ring */}
      <div
        ref={trailingCursorRef}
        style={{
          width: isHovered ? 50 : 28,
          height: isHovered ? 50 : 28,
          borderRadius: '50%',
          border: isHovered ? '1.5px solid rgba(249, 115, 22, 0.8)' : '1px solid rgba(225, 29, 72, 0.4)',
          position: 'absolute',
          top: isHovered ? -25 : -14,
          left: isHovered ? -25 : -14,
          zIndex: 1,
          transition: 'width 0.25s ease, height 0.25s ease, top 0.25s ease, left 0.25s ease, border-color 0.25s ease',
          backgroundColor: isHovered ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
          willChange: 'transform',
        }}
      />

      <style>{`
        @media (min-width: 900px) {
          body { cursor: default; }
        }
      `}</style>
    </Box>
  );
});

export default CustomCursor;
