'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from './CartContext';
import SwipeToCheckout from './SwipeToCheckout';

export default function SlideOutCart() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();

  if (!isCartOpen) return null;

  const lines = cart?.lines?.edges || [];
  const subtotal = cart?.cost?.subtotalAmount?.amount || '0.00';
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || 'USD';
  
  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(subtotal));

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Slide-out panel */}
      <div className="relative w-full sm:w-[400px] max-w-[100vw] bg-[#050505] border-l border-white/10 shadow-xl flex flex-col h-full transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-white">Your Cart</h2>
          <button 
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {lines.length === 0 ? (
            <p className="text-gray-400 text-center mt-12">Your cart is empty.</p>
          ) : (
            lines.map((edge: any) => {
              const node = edge.node;
              const product = node.merchandise.product;
              const price = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: node.cost.totalAmount.currencyCode,
              }).format(parseFloat(node.cost.totalAmount.amount));

              return (
                <div key={node.id} className="relative flex gap-4 bg-[#0a0a0a] p-4 rounded-sm border border-white/5">
                  <button onClick={() => removeFromCart(node.id)} className="absolute top-1 right-1 text-gray-500 hover:text-red-500 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Remove item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                  <div className="w-20 h-24 bg-zinc-800 rounded-sm overflow-hidden flex-shrink-0 relative">
                    {product.featuredImage?.url ? (
                      <Image 
                        src={product.featuredImage.url} 
                        alt={product.featuredImage.altText || product.title}
                        fill
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">No Image</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div className="pr-6">
                      <h3 className="text-white font-bold">{product.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{node.merchandise.title !== 'Default Title' ? node.merchandise.title : ''}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1 bg-[#111111] rounded-sm p-1">
                        <button onClick={() => updateQuantity(node.id, node.quantity - 1)} className="text-gray-400 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Decrease quantity">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <span className="text-white text-sm font-medium w-6 text-center">{node.quantity}</span>
                        <button onClick={() => updateQuantity(node.id, node.quantity + 1)} className="text-gray-400 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Increase quantity">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-white font-bold">{price}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Checkout button */}
        {lines.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#050505]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-2xl font-bold text-white">{formattedSubtotal}</span>
            </div>
            <SwipeToCheckout checkoutUrl={cart.checkoutUrl} />
          </div>
        )}
      </div>
    </div>
  );
}
