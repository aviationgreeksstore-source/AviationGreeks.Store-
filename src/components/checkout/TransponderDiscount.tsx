"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TransponderDiscount() {
  const [code, setCode] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "emergency" | "accepted">("idle");

  const handleKeyPress = (digit: string) => {
    // If a status message is showing, clear it first
    if (status !== "idle") {
      setStatus("idle");
      setCode(digit);
      return;
    }
    // Limit to 4 digits
    if (code.length < 4) {
      setCode((prev) => prev + digit);
    }
  };

  const handleClear = () => {
    setCode("");
    setStatus("idle");
  };

  const handleIdent = () => {
    if (code === "7700") {
      setStatus("emergency");
    } else if (code === "2026") {
      setStatus("accepted");
    } else if (code.length > 0) {
      setStatus("accepted");
    }
  };

  useEffect(() => {
    // Auto-reset back to idle after showing a message
    if (status !== "idle") {
      const timer = setTimeout(() => {
        setStatus("idle");
        setCode("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Format code for the display: e.g. "1 2 _ _"
  const displayCode = code.padEnd(4, "_").split("").join(" ");

  let screenBg = "bg-black";
  let textColor = "text-amber-500";
  let textToDisplay = displayCode;
  let textClass = "font-mono text-3xl tracking-widest text-right";

  if (status === "emergency") {
    screenBg = "bg-red-600";
    textColor = "text-white";
    textToDisplay = "EMERGENCY: 30% OFF APPLIED";
    textClass = "font-mono text-xs sm:text-sm font-bold text-center";
  } else if (status === "accepted") {
    screenBg = "bg-emerald-600";
    textColor = "text-white";
    textToDisplay = "IDENT ACCEPTED";
    textClass = "font-mono text-sm sm:text-base font-bold text-center";
  }

  const renderButton = (
    label: string, 
    onClick: () => void, 
    className: string
  ) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`rounded-md py-4 font-mono font-bold transition-colors shadow-lg select-none ${className}`}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="bg-zinc-950 border-2 border-zinc-800 rounded-lg shadow-2xl p-4 w-full max-w-sm mx-auto flex flex-col gap-5 select-none">
      <div className="flex items-center justify-between px-1">
        <span className="text-zinc-500 font-mono text-[10px] sm:text-xs uppercase tracking-widest">
          Transponder Mode-C
        </span>
        <div className="flex items-center gap-2">
           <span className="text-zinc-600 font-mono text-[10px] uppercase">Reply</span>
           <div className="h-2 w-2 rounded-full bg-amber-500/20"></div>
        </div>
      </div>
      
      {/* Digital Display Screen */}
      <motion.div 
        layout
        className={`${screenBg} border border-white/10 rounded p-2 h-20 flex items-center ${status === 'idle' ? 'justify-end' : 'justify-center'} overflow-hidden transition-colors duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={status + textToDisplay}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`${textColor} ${textClass} w-full`}
            style={{ textShadow: status === 'idle' ? '0 0 10px rgba(245, 158, 11, 0.5)' : 'none' }}
          >
            {status !== 'idle' ? `[ ${textToDisplay} ]` : textToDisplay}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((digit) => 
          renderButton(
            digit, 
            () => handleKeyPress(digit), 
            "bg-gradient-to-b from-zinc-700 to-zinc-800 border border-zinc-600 text-zinc-200 text-xl hover:from-zinc-600 hover:to-zinc-700 shadow-[0_4px_0_rgba(39,39,42,1)]"
          )
        )}
        
        {renderButton(
          "CLR", 
          handleClear, 
          "bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 text-zinc-400 text-sm hover:from-zinc-700 hover:to-zinc-800 shadow-[0_4px_0_rgba(24,24,27,1)]"
        )}

        {renderButton(
          "0", 
          () => handleKeyPress("0"), 
          "bg-gradient-to-b from-zinc-700 to-zinc-800 border border-zinc-600 text-zinc-200 text-xl hover:from-zinc-600 hover:to-zinc-700 shadow-[0_4px_0_rgba(39,39,42,1)]"
        )}

        {renderButton(
          "IDENT", 
          handleIdent, 
          "bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-500 text-amber-950 text-sm hover:from-amber-300 hover:to-amber-500 shadow-[0_4px_0_rgba(180,83,9,1)]"
        )}
      </div>
    </div>
  );
}
