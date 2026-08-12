import React from "react";

export default async function LiveMetar() {
  try {
    const res = await fetch("https://aviationweather.gov/api/data/metar?ids=LGAV", {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      return null;
    }

    const metarData = await res.text();
    
    if (!metarData || metarData.trim() === "") {
      return null;
    }

    return (
      <div className="flex items-center space-x-3 px-4">
        {/* Pulsing Datalink Indicator */}
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
        </span>
        
        {/* METAR Text */}
        <span className="font-mono font-bold text-[10px] md:text-xs text-emerald-400 uppercase tracking-widest truncate max-w-[200px] lg:max-w-[400px]">
          {metarData.trim()}
        </span>
      </div>
    );
  } catch (error) {
    return null;
  }
}
