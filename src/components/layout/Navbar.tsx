'use client';

import React, { useState } from 'react';
import { useCart } from '../cart/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { cart, openCart } = useCart();
  const totalQuantity = cart?.totalQuantity || 0;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl text-white transition-all duration-300">
      <div className="px-6 md:px-12 py-5 flex items-center justify-between max-w-[1600px] mx-auto">
        
        {/* Left Side: Mobile Logo / Desktop Left Links */}
        <div className="flex-1 flex items-center justify-start gap-6">
          <Link href="/" className="md:hidden text-xl font-bold tracking-wider uppercase">
            AVG
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/collections" className="group relative text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase hover:text-white transition-colors py-1">
              Shop the Fleet
              <span className="absolute inset-x-0 -bottom-1 h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </Link>
            <Link href="/about" className="group relative text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase hover:text-white transition-colors py-1">
              About Us
              <span className="absolute inset-x-0 -bottom-1 h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </Link>
          </nav>
        </div>

        {/* Center: Desktop Logo */}
        <div className="shrink-0 flex items-center justify-center">
          <Link href="/" className="group flex flex-col items-center">
            <span className="text-2xl font-black tracking-[0.25em] uppercase text-white group-hover:text-flight-amber transition-colors duration-500">
              AviationGreeks
            </span>
            <div className="w-1/2 h-[1px] bg-white/20 mt-2 group-hover:w-full group-hover:bg-flight-amber transition-all duration-500" />
          </Link>
        </div>

        {/* Right Side: Desktop Right Links & Icons */}
        <div className="flex-1 flex items-center justify-end gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/media" className="group relative text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase hover:text-white transition-colors py-1">
              Media
              <span className="absolute inset-x-0 -bottom-1 h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </Link>
            <Link href="/community" className="group relative text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase hover:text-white transition-colors py-1">
              Community
              <span className="absolute inset-x-0 -bottom-1 h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </Link>
          </nav>

          {/* Search & Cart Icons */}
          <div className="flex items-center gap-4">
            
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-b border-white/20 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white px-2 py-1 w-24 focus:w-48 transition-all duration-500"
              />
              <button type="submit" className="absolute right-0 p-1 text-neutral-400 hover:text-white transition-colors" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </form>

            <Link href="/account" className="p-2 text-neutral-400 hover:text-white transition-colors" aria-label="Account Dossier">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </Link>
            
            <button onClick={openCart} className="relative p-2 text-neutral-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-black transform translate-x-1/4 -translate-y-1/4 bg-flight-amber rounded-full">
                  {totalQuantity}
                </span>
              )}
            </button>
            
            <button 
              className="md:hidden p-2 text-white hover:text-gray-300 transition-colors" 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col p-8"
          >
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Close Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="flex flex-col space-y-6 text-center mt-4">
              <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold uppercase tracking-wider text-white hover:text-flight-amber transition-colors">Shop the Fleet</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold uppercase tracking-wider text-white hover:text-flight-amber transition-colors">About Us</Link>
              <Link href="/media" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold uppercase tracking-wider text-white hover:text-flight-amber transition-colors">Media</Link>
              <Link href="/community" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold uppercase tracking-wider text-white hover:text-flight-amber transition-colors">Community</Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold uppercase tracking-wider text-white hover:text-flight-amber transition-colors">Dossier</Link>
            </nav>
            
            <div className="flex justify-center mt-auto pb-12">
            </div>

            <form onSubmit={(e) => { setIsMobileMenuOpen(false); handleSearch(e); }} className="mt-12 flex flex-col items-center">
              <div className="flex items-center w-full max-w-full sm:max-w-sm border-b border-white/20 pb-2">
                <input 
                  type="text" 
                  placeholder="Search gear..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white placeholder-gray-400 focus:outline-none flex-1 px-2 py-2 text-base md:text-lg w-full"
                />
                <button type="submit" className="p-2 hover:text-gray-300 transition-colors" aria-label="Search">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
