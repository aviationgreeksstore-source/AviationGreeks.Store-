"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_/*".split("");
const getRandomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export interface FlightProduct {
  id: string;
  flight: string;
  dest: string;
  status: string;
}

interface SplitFlapBoardProps {
  products?: FlightProduct[];
}

const SplitFlapChar = ({
  targetChar,
  delay = 0,
  trigger,
}: {
  targetChar: string;
  delay?: number;
  trigger: boolean;
}) => {
  const [displayChar, setDisplayChar] = useState(" ");
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    setDisplayChar(getRandomChar());
    setIsFlipping(true);

    const interval = setInterval(() => {
      setDisplayChar(getRandomChar());
    }, 75);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplayChar(targetChar.toUpperCase() || " ");
      setIsFlipping(false);
    }, 1500 + delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [trigger, targetChar, delay]);

  const charToShow = trigger ? displayChar : " ";

  return (
    <div
      className="bg-black border border-white/20 text-zinc-100 font-mono text-sm md:text-lg uppercase w-6 h-8 md:w-8 md:h-12 flex items-center justify-center relative rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
      style={{ perspective: "400px" }}
    >
      {/* Static Top Half */}
      <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden flex items-end justify-center bg-zinc-900 rounded-t-sm">
        <span className="translate-y-[50%]">{charToShow}</span>
      </div>

      {/* Static Bottom Half */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden flex items-start justify-center bg-zinc-900 rounded-b-sm">
        <span className="-translate-y-[50%]">{charToShow}</span>
      </div>

      {/* The Hinge (Divider) */}
      <div className="absolute top-1/2 left-0 right-0 border-b border-black w-full z-20 pointer-events-none -translate-y-[1px]" />
      <div className="absolute top-1/2 left-0 right-0 border-t border-white/10 w-full z-20 pointer-events-none" />

      {/* Flipping Top Flap */}
      {isFlipping && (
        <motion.div
          animate={{ rotateX: [0, -90] }}
          transition={{
            duration: 0.075,
            repeat: Infinity,
            ease: "easeIn",
          }}
          style={{ transformOrigin: "bottom" }}
          className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden flex items-end justify-center bg-zinc-800 rounded-t-sm z-10 border-b border-white/5"
        >
          <span className="translate-y-[50%] shadow-sm">{charToShow}</span>
        </motion.div>
      )}

      {/* Overlay gradient for depth & glare */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/60 pointer-events-none rounded-sm z-30" />
    </div>
  );
};

const SplitFlapWord = ({
  word,
  trigger,
  baseIndex = 0,
  rowDelay = 0,
}: {
  word: string;
  trigger: boolean;
  baseIndex?: number;
  rowDelay?: number;
}) => {
  return (
    <div className="flex gap-[1px] md:gap-[2px]">
      {word.split("").map((char, i) => (
        <SplitFlapChar
          key={i}
          targetChar={char}
          trigger={trigger}
          delay={rowDelay + (baseIndex + i) * 35} // Stagger from left to right across the row
        />
      ))}
    </div>
  );
};

const ProductRow = ({
  product,
  inView,
  rowIndex,
}: {
  product: FlightProduct;
  inView: boolean;
  rowIndex: number;
}) => {
  // Format to fixed lengths so the board looks tabular and uniform
  const flightCol = `[ FLIGHT: ${product.flight} ]`.padEnd(18, " ");
  const destCol = `[ DEST: ${product.dest} ]`.padEnd(36, " ");
  const statusCol = `[ STATUS: ${product.status} ]`.padEnd(26, " ");

  const rowStaggerDelay = rowIndex * 150; // Delay each row slightly for a more chaotic mechanical start

  return (
    <div className="flex gap-2 md:gap-4 mb-2 md:mb-3 whitespace-nowrap items-center">
      <SplitFlapWord
        word={flightCol}
        trigger={inView}
        baseIndex={0}
        rowDelay={rowStaggerDelay}
      />
      <SplitFlapWord
        word={destCol}
        trigger={inView}
        baseIndex={flightCol.length}
        rowDelay={rowStaggerDelay}
      />
      <SplitFlapWord
        word={statusCol}
        trigger={inView}
        baseIndex={flightCol.length + destCol.length}
        rowDelay={rowStaggerDelay}
      />
    </div>
  );
};

export default function SplitFlapBoard({ products }: SplitFlapBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(boardRef, { once: true, margin: "-50px 0px" });

  // If no products are passed or the array is empty, we gracefully hide the board.
  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = products;

  return (
    <div className="w-full bg-zinc-950 border-4 border-zinc-900 rounded-xl p-4 md:p-8 shadow-[inset_0_10px_30px_rgba(0,0,0,1),0_20px_40px_rgba(0,0,0,0.5)] overflow-x-auto relative">
      {/* Mechanical Inner Frame Border */}
      <div className="absolute inset-2 border border-white/5 pointer-events-none rounded-lg" />
      
      {/* Board Header / Meta */}
      <div className="flex justify-between items-center mb-6 px-2 border-b-2 border-zinc-800 pb-4 relative z-10">
        <h2 className="text-zinc-500 font-mono text-xs md:text-sm tracking-[0.3em] uppercase">
          DEPARTURES - NEW ARRIVALS
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-zinc-600 font-mono text-xs uppercase hidden sm:inline">
            Status: Active
          </span>
          <div className="w-3 h-3 rounded-full bg-green-500/80 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
        </div>
      </div>

      {/* The Flap Grid Container */}
      <div
        ref={boardRef}
        className="flex flex-col min-w-max pb-2 md:pb-4 relative z-10"
      >
        {displayProducts.map((p, i) => (
          <ProductRow key={p.id} product={p} inView={isInView} rowIndex={i} />
        ))}
      </div>
    </div>
  );
}
