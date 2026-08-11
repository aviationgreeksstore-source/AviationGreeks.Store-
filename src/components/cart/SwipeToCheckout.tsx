"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";

interface SwipeToCheckoutProps {
  checkoutUrl: string;
}

export default function SwipeToCheckout({ checkoutUrl }: SwipeToCheckoutProps) {
  const router = useRouter();
  const [isCleared, setIsCleared] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Opacity of the background text fades as you swipe
  const textOpacity = useTransform(x, [0, 150], [1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isCleared) return;

    const containerWidth = containerRef.current?.offsetWidth || 0;
    const tagWidth = tagRef.current?.offsetWidth || 0;
    const maxDrag = containerWidth - tagWidth;
    
    // 80% threshold of the available drag track
    const threshold = maxDrag * 0.8;

    // Check if the user has dragged past the threshold
    if (x.get() >= threshold) {
      setIsCleared(true);
      // Snap to the end
      controls.start({ 
        x: maxDrag, 
        transition: { type: "spring", stiffness: 300, damping: 25 } 
      });
      
      // Trigger checkout
      setTimeout(() => {
        router.push(checkoutUrl);
      }, 400); // Slight delay for the animation to finish
    } else {
      // Snap back to the beginning
      controls.start({ 
        x: 0, 
        transition: { type: "spring", stiffness: 300, damping: 25 } 
      });
    }
  };

  // Sync motion value with animation controls
  useEffect(() => {
    controls.set({ x: x.get() });
  }, [controls, x]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-16 bg-zinc-900 border border-white/10 rounded-md flex items-center overflow-hidden touch-none select-none"
    >
      {/* Background Track Text */}
      <motion.div 
        style={{ opacity: textOpacity }}
        className="absolute w-full text-center text-zinc-500 font-semibold tracking-widest text-sm pointer-events-none"
      >
        SWIPE TO DEPART ➔
      </motion.div>

      {/* Draggable Tag */}
      <motion.div
        ref={tagRef}
        drag={isCleared ? false : "x"}
        dragConstraints={containerRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="absolute left-0 h-full bg-red-600 shadow-[4px_0_12px_rgba(0,0,0,0.4)] flex items-center px-5 cursor-grab active:cursor-grabbing z-10"
      >
        {/* Grommet / Keyring Detail */}
        <div className="w-5 h-5 rounded-full border-[3px] border-zinc-400 bg-zinc-800 flex-shrink-0 mr-4 shadow-inner relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
        </div>
        
        {/* Tag Text */}
        <span className="text-white font-bold tracking-[0.2em] text-sm whitespace-nowrap drop-shadow-sm">
          {isCleared ? "CLEARED FOR TAKEOFF" : "REMOVE BEFORE FLIGHT"}
        </span>
      </motion.div>
    </div>
  );
}
