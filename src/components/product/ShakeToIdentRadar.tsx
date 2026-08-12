'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShakeToIdentRadarProps {
  children: React.ReactNode;
  discountCode?: string | null;
}

export default function ShakeToIdentRadar({ children, discountCode }: ShakeToIdentRadarProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [showCode, setShowCode] = useState(false);
  
  const lastCoords = useRef({ x: 0, y: 0, z: 0 });
  const lastUpdate = useRef(0);
  const SHAKE_THRESHOLD = 15; // m/s^2 threshold for shake

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      // NOTE: On modern iOS (13+), accessing DeviceMotionEvent requires user permission
      // which must be triggered from a user action (like a click). 
      // For this implementation, we will detect general support. It may silently fail 
      // if permissions are not granted, which is acceptable per requirements.
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    if (!isSupported || isTriggered || !discountCode) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      if (x === null || y === null || z === null) return;

      const currentTime = Date.now();
      if ((currentTime - lastUpdate.current) > 100) {
        lastUpdate.current = currentTime;

        const deltaX = Math.abs(x - lastCoords.current.x);
        const deltaY = Math.abs(y - lastCoords.current.y);
        const deltaZ = Math.abs(z - lastCoords.current.z);
        
        const totalDelta = deltaX + deltaY + deltaZ;

        if (totalDelta > SHAKE_THRESHOLD && lastCoords.current.x !== 0) {
          triggerIdent();
        }

        lastCoords.current = { x, y, z };
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isSupported, isTriggered]);

  const triggerIdent = () => {
    setIsTriggered(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }

    // Code reveal sequence
    setTimeout(() => {
      setShowCode(true);
    }, 1500);

    // Reset sequence
    setTimeout(() => {
      setIsTriggered(false);
      setShowCode(false);
    }, 5000);
  };

  if (!discountCode) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="relative w-full h-full flex-1">
        {children}

        <AnimatePresence>
          {isTriggered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className="absolute inset-0 z-50 bg-black flex items-center justify-center overflow-hidden rounded-sm"
            >
              {/* Radar Container */}
              <div className="relative w-[90%] aspect-square rounded-full border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center">
                
                {/* Grid Rings */}
                <div className="absolute w-[66%] h-[66%] rounded-full border border-emerald-500/30" />
                <div className="absolute w-[33%] h-[33%] rounded-full border border-emerald-500/30" />
                
                {/* Crosshairs */}
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-emerald-500/30" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-emerald-500/30" />

                {/* Sweeper Line & Gradient */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                  className="absolute inset-0 rounded-full overflow-hidden"
                >
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(16, 185, 129, 0.3) 358deg, rgba(16, 185, 129, 1) 360deg)',
                    }}
                  />
                </motion.div>

                {/* Blip Idents */}
                {!showCode && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: [0, 1, 0] }} 
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      className="absolute top-1/4 left-1/3 w-2 h-2 border border-emerald-300 rotate-45 bg-emerald-500/80 shadow-[0_0_8px_rgba(52,211,153,0.8)]" 
                    />
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: [0, 1, 0] }} 
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
                      className="absolute bottom-1/3 right-1/4 w-2 h-2 border border-emerald-300 rotate-45 bg-emerald-500/80 shadow-[0_0_8px_rgba(52,211,153,0.8)]" 
                    />
                  </>
                )}

                {/* Code Reveal */}
                <AnimatePresence>
                  {showCode && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.1, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full backdrop-blur-[2px]"
                    >
                      <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-widest drop-shadow-[0_0_12px_rgba(255,255,255,1)]">
                        [ IDENT: {discountCode} ]
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pre-Trigger Indicator */}
      {isSupported && (
        <div className="mt-4 flex justify-center h-4">
          <motion.div 
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-mono text-[10px] text-white/40 tracking-widest text-center"
          >
            [ TCAS STATUS: STBY // SHAKE TO IDENT ]
          </motion.div>
        </div>
      )}
    </div>
  );
}
