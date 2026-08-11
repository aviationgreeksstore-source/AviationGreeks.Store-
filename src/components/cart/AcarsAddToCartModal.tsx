'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';

export default function AcarsAddToCartModal() {
  const { acarsData, closeAcarsModal, openCart } = useCart();
  const [typedLines, setTypedLines] = useState<number>(0);

  // Auto-dismiss and typing effect
  useEffect(() => {
    if (acarsData) {
      setTypedLines(0);
      
      // Type out lines sequentially
      const timers = [
        setTimeout(() => setTypedLines(1), 300),
        setTimeout(() => setTypedLines(2), 700),
        setTimeout(() => setTypedLines(3), 1100),
        setTimeout(() => setTypedLines(4), 1500),
        setTimeout(() => setTypedLines(5), 1900),
      ];

      // Auto dismiss after 6 seconds
      const dismissTimer = setTimeout(() => {
        closeAcarsModal();
      }, 6000);

      return () => {
        timers.forEach(clearTimeout);
        clearTimeout(dismissTimer);
      };
    }
  }, [acarsData, closeAcarsModal]);

  const handleViewFlightPlan = () => {
    closeAcarsModal();
    openCart();
  };

  const lines = acarsData ? [
    `> DATALINK: CONNECTED`,
    `> REQ: UPLINK_ITEM`,
    `> ITEM: ${acarsData.title}`,
    `> QTY: ${acarsData.quantity} | VAL: ${acarsData.price}`,
    `> STATUS: UPLINK SUCCESSFUL // CLEARED FOR DEPARTURE`
  ] : [];

  return (
    <AnimatePresence>
      {acarsData && (
        <motion.div
          initial={{ opacity: 0, y: 100, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: 50 }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 100,
            // Custom takeoff easing curve roughly simulated by spring or cubic-bezier
            // ease: [0.25, 0.1, 0.25, 1.0]
          }}
          className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-black border border-white/20 shadow-2xl font-mono text-xs md:text-sm text-amber-500 uppercase tracking-wider flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/20 bg-neutral-900/50 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-white font-bold tracking-widest text-[10px] md:text-xs">ACARS DATALINK v2.0 // LGAV OPS</span>
            </div>
            <button 
              onClick={closeAcarsModal}
              className="text-white/60 hover:text-white transition-colors"
            >
              [X]
            </button>
          </div>

          {/* Telemetry Stream */}
          <div className="p-4 flex flex-col gap-2 min-h-[140px] text-amber-400">
            {lines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: index < typedLines ? 1 : 0 }}
                transition={{ duration: 0 }}
              >
                {line}
              </motion.div>
            ))}
            
            {/* Blinking Cursor */}
            <motion.div 
              animate={{ opacity: [1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-amber-400 mt-1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 p-3 border-t border-white/20 bg-black">
            <button
              onClick={handleViewFlightPlan}
              className="flex-1 bg-[#004b87] text-white py-2 px-3 font-bold hover:bg-[#003865] transition-colors border border-[#004b87]"
            >
              [ VIEW FLIGHT PLAN ]
            </button>
            <button
              onClick={closeAcarsModal}
              className="flex-1 bg-transparent text-white border border-white/30 py-2 px-3 hover:bg-white/10 transition-colors"
            >
              [ RESUME FLIGHT ]
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
