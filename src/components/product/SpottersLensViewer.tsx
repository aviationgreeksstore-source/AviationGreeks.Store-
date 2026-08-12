'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpottersLensViewerProps {
  children: React.ReactNode;
  /**
   * How much to scale the image when zoomed in.
   * Default is 2 (200%).
   */
  zoomScale?: number;
}

export default function SpottersLensViewer({ children, zoomScale = 2 }: SpottersLensViewerProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }, []);

  const handleDesktopEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') {
      setIsZoomed(true);
      handlePointerMove(e);
    }
  };

  const handleDesktopLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') {
      setIsZoomed(false);
    }
  };

  const handleMobileDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') {
      setIsZoomed(true);
      handlePointerMove(e);
    }
  };

  const handleMobileUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') {
      setIsZoomed(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-crosshair touch-none select-none group bg-black/5 rounded-xl"
      style={{ WebkitTouchCallout: 'none' }}
      onPointerEnter={handleDesktopEnter}
      onPointerMove={(e) => {
        if (isZoomed) handlePointerMove(e);
      }}
      onPointerLeave={(e) => {
        handleDesktopLeave(e);
        // Failsafe for touch dragging out of bounds
        if (e.pointerType !== 'mouse') setIsZoomed(false); 
      }}
      onPointerDown={handleMobileDown}
      onPointerUp={handleMobileUp}
      onPointerCancel={handleMobileUp}
    >
      <motion.div
        animate={{
          scale: isZoomed ? zoomScale : 1,
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="relative w-full h-full will-change-transform flex items-center justify-center"
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 z-10"
            style={{
              background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
            }}
          >
            {/* Top UI Bar */}
            <div className="flex justify-between items-start text-white/85 font-mono text-xs md:text-sm drop-shadow-md uppercase">
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                />
                <span className="font-bold tracking-widest">[ REC ]</span>
              </div>
              <div className="flex items-center gap-2 font-bold tracking-wider">
                <span>4K 60FPS</span>
                {/* Minimal Battery SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
                  <line x1="22" y1="11" x2="22" y2="13" />
                  {/* Battery Fill Level */}
                  <rect x="4" y="9" width="11" height="6" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Center Focus Brackets */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center text-white/70"
              >
                {/* Corners */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-white/80" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-white/80" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-white/80" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-white/80" />
                
                {/* Center dot */}
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
              </motion.div>
            </div>

            {/* Bottom UI Bar */}
            <div className="flex justify-between items-end text-white/85 font-mono text-[10px] md:text-xs drop-shadow-md pb-1 uppercase">
              <div className="flex flex-col items-center gap-2 opacity-90">
                 {/* Exposure Slider mock */}
                 <div className="h-16 md:h-20 w-[2px] bg-white/30 relative flex justify-center">
                    {/* Ticks */}
                    <div className="absolute top-1/4 w-2 h-[1px] bg-white/50" />
                    <div className="absolute top-1/2 w-3.5 h-[1.5px] bg-white/90" />
                    <div className="absolute top-3/4 w-2 h-[1px] bg-white/50" />
                    {/* Indicator Line */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-5 h-[2px] bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.8)]" />
                 </div>
                 <span className="font-bold tracking-wider">EV 0.0</span>
              </div>
              
              <div className="font-bold tracking-widest whitespace-nowrap">
                <span>[ FOCAL: 200MM | ISO: 100 | f/2.8 ]</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
