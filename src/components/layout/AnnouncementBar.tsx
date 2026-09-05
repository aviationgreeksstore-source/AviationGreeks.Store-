"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-aegean-blue text-white py-2 px-10 md:px-4 text-center text-xs sm:text-sm font-bold tracking-wider flex items-center justify-center flex-wrap gap-2">
      <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] sm:text-xs font-black bg-amber-400 text-black uppercase tracking-widest animate-pulse">
        AFW 2026 LIVE
      </span>
      <span>
        ATHENS FLYING WEEK SPECIAL // USE CODE <strong className="underline decoration-amber-400 text-amber-300 font-black">AFW2026</strong> FOR 15% OFF // EU FREE SHIPPING OVER 50€
      </span>
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 -translate-y-1/2 right-4 md:right-24 text-white/80 hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
