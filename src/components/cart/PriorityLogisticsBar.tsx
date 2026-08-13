'use client';

import React from 'react';
import { useCart } from './CartContext';

const FREE_SHIPPING_THRESHOLD = 50;

export default function PriorityLogisticsBar() {
  const { cart } = useCart();

  const subtotalString = cart?.cost?.subtotalAmount?.amount || '0';
  const subtotal = parseFloat(subtotalString);

  const percentage = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const isThresholdMet = percentage >= 100;

  return (
    <div className="px-6 py-4 border-b border-white/10 bg-[#0a0a0a]">
      <div className="flex justify-between items-end mb-2 font-mono text-xs md:text-sm tracking-wide">
        {!isThresholdMet ? (
          <span className="text-amber-500 font-bold">
            [ ADD €{remaining.toFixed(2)} MORE FOR FREE SHIPPING ]
          </span>
        ) : (
          <span className="text-emerald-500 font-bold">
            [ STATUS: FREE SHIPPING UNLOCKED ]
          </span>
        )}
      </div>

      <div className="h-2 w-full bg-zinc-900 border border-white/10 rounded-sm overflow-hidden relative">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: isThresholdMet ? '#10b981' : '#f59e0b',
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(0,0,0,0.1) 10px,
              rgba(0,0,0,0.1) 20px
            )`,
          }}
        />
      </div>
    </div>
  );
}
