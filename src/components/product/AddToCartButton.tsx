'use client';

import React, { useState } from 'react';
import { useCart } from '../cart/CartContext';
import { useHaptic } from '../../hooks/useHaptic';

export default function AddToCartButton({ 
  variantId,
  productTitle,
  price
}: { 
  variantId: string | undefined;
  productTitle?: string;
  price?: string;
}) {
  const { addToCart } = useCart();
  const { triggerHaptic } = useHaptic();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!variantId) {
      triggerHaptic('warning');
      return;
    }
    triggerHaptic('heavy');
    try {
      setIsAdding(true);
      await addToCart(variantId, 1, productTitle && price ? { title: productTitle, price } : undefined);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={!variantId || isAdding}
      className="w-full md:w-auto px-12 py-5 bg-aviation-blue text-white font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors rounded-sm flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
      {!isAdding && (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      )}
    </button>
  );
}
