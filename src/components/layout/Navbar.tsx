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
    <header className="sticky top-0 z-50 px-8 py-6 flex items-center justify-between border-b border-white/10 bg-black text-white">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold tracking-wider uppercase hover:text-gray-300 transition-colors">
          AviationGreeks
        </Link>
      </div>

      <nav className="hidden md:flex flex-1 justify-center space-x-8">
        <Link href="/collections" className="text-sm font-medium hover:text-gray-300 transition-colors">Shop the Fleet</Link>
        <Link href="/media" className="text-sm font-medium hover:text-gray-300 transition-colors">Media</Link>
        <Link href="/community" className="text-sm font-medium hover:text-gray-300 transition-colors">Community</Link>
      </nav>

      <div className="flex flex-1 justify-end items-center space-x-4">
        <form onSubmit={handleSearch} className="hidden md:flex items-center">
          <input 
            type="text" 
            placeholder="Search gear..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-b border-white/20 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white px-2 py-1 w-48 transition-all focus:w-64"
          />
          <button type="submit" className="p-2 hover:text-gray-300 transition-colors" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>
        <button onClick={openCart} className="relative p-2 hover:text-gray-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        {totalQuantity > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black transform translate-x-1/4 -translate-y-1/4 bg-white rounded-full">
            {totalQuantity}
          </span>
        )}
        </button>
        <button 
          className="md:hidden p-2 text-white hover:text-gray-300 transition-colors ml-2" 
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
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
              <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold uppercase tracking-wider text-white hover:text-[#2563EB] transition-colors">Shop the Fleet</Link>
              <Link href="/media" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold uppercase tracking-wider text-white hover:text-[#2563EB] transition-colors">Media</Link>
              <Link href="/community" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold uppercase tracking-wider text-white hover:text-[#2563EB] transition-colors">Community</Link>
            </nav>

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
