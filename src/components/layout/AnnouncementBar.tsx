"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-aegean-blue text-white py-2 px-10 md:px-4 text-center text-xs sm:text-sm font-bold tracking-wider">
      ✈️ FREE WORLDWIDE SHIPPING ON ORDERS OVER €50
      
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
