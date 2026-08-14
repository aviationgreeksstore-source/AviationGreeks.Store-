"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

export default function NewsletterFlyout() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If user previously closed the flyout in this session, don't show it again
    if (typeof window !== "undefined" && sessionStorage.getItem("newsletter_flyout_dismissed") === "true") {
      return;
    }

    // Show the flyout after a short delay so it doesn't immediately pop up
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("newsletter_flyout_dismissed", "true");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 w-auto sm:w-full sm:max-w-sm bg-black border border-white/10 p-6 shadow-2xl rounded-sm"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
            aria-label="Close newsletter flyout"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
              Join the Crew
            </h3>
            <p className="text-sm text-gray-400">
              Get exclusive access to new drops, limited editions, and pilot gear.
            </p>
          </div>
          
          <form className="flex flex-col space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white py-2 px-0 outline-none transition-colors placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              className="group flex items-center justify-between text-white font-bold uppercase tracking-widest text-sm pt-4 hover:opacity-80 transition-opacity"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
