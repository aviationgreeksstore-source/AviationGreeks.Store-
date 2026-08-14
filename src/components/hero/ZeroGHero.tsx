"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState as useReactState } from "react";

// Sample transparent t-shirt images (or placeholders)
const SHIRT_IMAGES = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop", // Assuming these can work as placeholders.
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop",
];

// Configuration for each floating shirt
const SHIRTS_CONFIG = [
  { id: 1, src: SHIRT_IMAGES[0], top: "10%", left: "5%", scale: 0.7, blur: "blur-md", zIndex: 1, duration: 12, delay: 0 },
  { id: 2, src: SHIRT_IMAGES[1], top: "20%", left: "80%", scale: 1.2, blur: "blur-none", zIndex: 10, duration: 9, delay: 1 },
  { id: 3, src: SHIRT_IMAGES[2], top: "70%", left: "10%", scale: 1.1, blur: "blur-none", zIndex: 12, duration: 10, delay: 2 },
  { id: 4, src: SHIRT_IMAGES[3], top: "65%", left: "75%", scale: 0.6, blur: "blur-sm", zIndex: 2, duration: 14, delay: 0.5 },
  { id: 5, src: SHIRT_IMAGES[4], top: "-5%", left: "40%", scale: 0.8, blur: "blur-sm", zIndex: 3, duration: 15, delay: 3 },
  { id: 6, src: SHIRT_IMAGES[5], top: "85%", left: "45%", scale: 1.0, blur: "blur-none", zIndex: 11, duration: 11, delay: 1.5 },
];

export default function ZeroGHero() {
  const [isMounted, setIsMounted] = useState(false);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Map mouse movement to parallax translation (opposite direction)
  const parallaxX = useTransform(springX, [-0.5, 0.5], [30, -30]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [30, -30]);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position between -0.5 and 0.5
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#333333] bg-[#0A0A0A]">
      {/* 3D Parallax Background Container */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          x: isMounted ? parallaxX : 0,
          y: isMounted ? parallaxY : 0,
        }}
      >
        {SHIRTS_CONFIG.map((shirt) => (
          <motion.div
            key={shirt.id}
            className={`absolute ${shirt.blur} opacity-70`}
            style={{
              top: shirt.top,
              left: shirt.left,
              zIndex: shirt.zIndex,
              width: 250, // Approx width for shirts
              height: 250,
              scale: shirt.scale,
            }}
            animate={{
              y: ["-15px", "15px", "-15px"],
              rotate: [-2, 3, -2],
            }}
            transition={{
              duration: shirt.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shirt.delay,
            }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden mix-blend-screen opacity-50">
                {/* Using a rounded wrapper so rectangular unsplash images don't look completely blocky in space, but real transparent pngs would be better */}
              <Image
                src={shirt.src}
                alt="Floating gear"
                fill
                priority={true}
                sizes="(max-width: 768px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-1000 ease-in-out ${isMounted ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Hero Content (Centered, Massive Text) */}
      <div className="relative z-20 text-center max-w-5xl px-4 flex flex-col items-center pointer-events-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white drop-shadow-2xl"
        >
          Gear for people <br />
          who actually <br />
          <span className="text-aegean-blue">fly.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-medium tracking-wide max-w-2xl mx-auto mt-4 sm:mt-6 px-4 drop-shadow-lg"
        >
          Premium gear designed for the modern aviator.
          <br className="hidden md:block" /> Engineered for the flight deck, built for the tarmac.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col w-full px-4 sm:px-0 sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
        >
          <Link href="/collections" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 bg-aegean-blue text-white text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-colors rounded-sm shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Shop the Fleet
            </motion.button>
          </Link>
          <Link href="/media" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 bg-black/50 backdrop-blur-md border-2 border-white text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm"
            >
              Watch Our Channel
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
