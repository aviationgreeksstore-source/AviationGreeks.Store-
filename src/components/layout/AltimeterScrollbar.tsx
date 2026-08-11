"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function AltimeterScrollbar() {
  const { scrollYProgress } = useScroll();
  const [altitudeStr, setAltitudeStr] = useState("39000");
  const [isLanded, setIsLanded] = useState(false);

  // Map scroll 0 -> 1 to altitude 39000 -> 0
  const altitude = useTransform(scrollYProgress, [0, 1], [39000, 0]);
  
  // Tape moves opposite to scroll (scrolling down pushes tape up)
  const tapeY = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  useEffect(() => {
    return altitude.on("change", (latest) => {
      const alt = Math.max(0, Math.round(latest));
      setAltitudeStr(alt.toString().padStart(5, "0"));
      setIsLanded(alt === 0);
    });
  }, [altitude]);

  // Generate 100 ticks for the tape
  const ticks = Array.from({ length: 100 });

  return (
    <div className="hidden md:flex fixed right-0 top-0 h-screen w-16 bg-black/40 backdrop-blur-md border-l border-white/10 z-[100] flex-col items-center justify-center overflow-hidden pointer-events-none">
      
      {/* Moving Tape */}
      <motion.div 
        className="absolute top-0 w-full flex flex-col items-center"
        style={{ y: tapeY }}
      >
        {ticks.map((_, i) => (
          <div key={i} className="h-10 w-full flex items-center justify-end pr-2 opacity-30">
            {i % 5 === 0 ? (
              <div className="h-[2px] w-6 bg-white" />
            ) : (
              <div className="h-[1px] w-3 bg-white" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Static HUD Bracket and Altitude */}
      <div className="relative z-10 flex items-center justify-center bg-black/40 backdrop-blur-md py-2 w-full font-mono text-sm tracking-tighter">
        <div className={`flex items-center space-x-1 ${isLanded ? "text-flight-amber" : "text-white"}`}>
          <span className="opacity-50">[</span>
          <span className="font-bold w-[45px] text-center">{altitudeStr}</span>
          <span className="opacity-50">]</span>
        </div>
        
        {/* HUD Lock corner accents */}
        <div className="absolute top-0 left-1 w-2 h-2 border-t-2 border-l-2 border-white/50" />
        <div className="absolute top-0 right-1 w-2 h-2 border-t-2 border-r-2 border-white/50" />
        <div className="absolute bottom-0 left-1 w-2 h-2 border-b-2 border-l-2 border-white/50" />
        <div className="absolute bottom-0 right-1 w-2 h-2 border-b-2 border-r-2 border-white/50" />
      </div>

    </div>
  );
}
