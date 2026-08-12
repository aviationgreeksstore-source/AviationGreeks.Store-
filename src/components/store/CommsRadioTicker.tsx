'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

const radioMessages = [
  "[ FREQ ACTIVE ]",
  "[ 412 PILOTS ON DATALINK ]",
  "[ NEW DROP ANNOUNCED IN #COMMS ]",
  "[ AVIATION GREEKS ELITE LOUNGE ONLINE ]",
];

export default function CommsRadioTicker({ discordUrl = "https://discord.gg/your-invite" }: { discordUrl?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Custom motion value for smooth, pausable infinite scrolling
  const baseX = useMotionValue(100);
  const x = useTransform(baseX, (v) => `${v}%`);
  
  useAnimationFrame((time, delta) => {
    // Pause scrolling when hovered
    if (isHovered) return; 
    
    // Move left by a consistent amount (adjust 0.005 for speed)
    let newX = baseX.get() - (delta * 0.005);
    
    // Reset to start when completely off-screen left
    // Adjust the wrap threshold (-100 to -200) based on content width if needed
    if (newX <= -150) {
      newX = 100;
    }
    
    baseX.set(newX);
  });

  return (
    <Link href={discordUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
      {/* The Chassis */}
      <div 
        className="w-full bg-zinc-950 border-y border-zinc-800 p-2 relative overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* The Radio Display */}
        <div className="bg-black shadow-inner border border-white/10 px-4 py-2 flex items-center relative overflow-hidden h-12 md:h-14">
          
          {/* Indicator Light */}
          <div className="absolute left-4 z-30 bg-black py-2 pr-4 flex items-center h-full">
            <svg width="12" height="12" viewBox="0 0 12 12" className="animate-pulse fill-emerald-500">
              <circle cx="6" cy="6" r="6" />
            </svg>
          </div>

          {/* Mask for the scrolling area */}
          <div className="flex-1 ml-10 overflow-hidden relative h-full flex items-center">
            
            {/* Overlay on hover */}
            <div 
              className={`absolute inset-0 z-20 flex items-center justify-center bg-black/80 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="font-mono text-white uppercase tracking-widest text-sm md:text-base font-bold animate-pulse">
                [ CLICK TO JOIN FREQUENCY ]
              </span>
            </div>

            {/* Scrolling Text */}
            <motion.div
              className={`flex whitespace-nowrap gap-8 transition-colors duration-300 ${
                isHovered ? 'text-white' : 'text-emerald-500'
              }`}
              style={{ x }}
            >
              {/* Render items twice to ensure smooth visual wrap-around if needed, 
                  though with a 100% to -100% full translation, a single block can work.
                  Duplicating creates a longer continuous datalink string. */}
              {radioMessages.map((msg, i) => (
                <span key={`a-${i}`} className="font-mono uppercase tracking-widest text-sm md:text-base">
                  {msg}
                </span>
              ))}
              {radioMessages.map((msg, i) => (
                <span key={`b-${i}`} className="font-mono uppercase tracking-widest text-sm md:text-base">
                  {msg}
                </span>
              ))}
            </motion.div>

          </div>
        </div>
      </div>
    </Link>
  );
}
