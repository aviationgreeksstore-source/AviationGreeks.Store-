'use client';

import React from 'react';
import { useCart } from './CartContext';

export default function QuickAddButton({ variantId }: { variantId?: string }) {
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product page
    e.stopPropagation();

    if (!variantId) return;

    try {
      setIsAdding(true);
      await addToCart(variantId, 1);
    } catch (error) {
      console.error('Failed to quick add:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!variantId) return null;

  return (
    <button
      onClick={handleQuickAdd}
      disabled={isLoading || isAdding}
      className="w-full text-center py-3 bg-white text-black text-sm font-black uppercase tracking-wider hover:bg-[#2563EB] hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAdding ? 'Adding...' : 'Quick Add'}
    </button>
  );
}
