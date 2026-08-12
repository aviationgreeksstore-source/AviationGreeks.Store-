"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { approachStaggerContainer, hudRevealVariant } from "@/lib/animations"; // Use existing animation variants

export default function CinematicHero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden border-b border-[#333333]">
      {/* Background Image */}
      <Image
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2000&auto=format&fit=crop"
        alt="Aviation cinematic background"
        fill
        priority
      />

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Foreground Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center max-w-4xl px-4 w-full"
        initial="hidden"
        animate="visible"
        variants={approachStaggerContainer}
      >
        <motion.h1
          variants={hudRevealVariant}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white"
        >
          Gear for people <br />
          who actually <br />
          <span className="text-aegean-blue">
            fly.
          </span>
        </motion.h1>

        <motion.p
          variants={hudRevealVariant}
          className="mt-6 text-lg md:text-xl lg:text-2xl text-gray-300 font-medium tracking-wide max-w-2xl mx-auto"
        >
          Premium gear designed for the modern aviator.
          <br className="hidden md:block" /> Engineered for the flight deck, built for the tarmac.
        </motion.p>

        <motion.div
          variants={hudRevealVariant}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10"
        >
          <Link href="/collections">
            <button className="px-10 py-5 bg-aegean-blue text-white text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-colors rounded-sm shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              SHOP THE FLEET
            </button>
          </Link>
          <Link href="/media">
            <button className="px-10 py-5 bg-transparent border-2 border-white text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm">
              WATCH OUR CHANNEL
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
