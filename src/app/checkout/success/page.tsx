"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { BoardingPassReceipt } from '@/components/checkout/BoardingPassReceipt';
import { getCartAction } from '@/components/cart/actions';
import { useSearchParams } from 'next/navigation';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReceiptData() {
      try {
        const urlOrderId = searchParams.get('order_id');
        const urlCartId = searchParams.get('cart_id');
        const cartId = urlCartId || localStorage.getItem('shopify_cart_id');
        
        // Check if we already have a saved receipt from a recent purchase
        const savedReceipt = localStorage.getItem('last_order_receipt');
        if (savedReceipt && !cartId) {
          const data = JSON.parse(savedReceipt);
          setItems(data.items);
          setTotal(data.total);
          setOrderId(urlOrderId || data.orderId);
          setLoading(false);
          return;
        }

        const newOrderId = urlOrderId || `AG-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderId(newOrderId);

        if (cartId) {
          const result = await getCartAction(cartId);
          if (result.success && result.cart) {
            const cartItems = result.cart.lines.edges.map((edge: any) => {
              const node = edge.node;
              const productTitle = node.merchandise.product.title;
              const variantTitle = node.merchandise.title !== 'Default Title' ? node.merchandise.title : '';
              return {
                id: node.id,
                title: productTitle,
                quantity: node.quantity,
                price: parseFloat(node.cost.totalAmount.amount) / node.quantity,
                notes: variantTitle
              };
            });
            
            const cartTotal = parseFloat(result.cart.cost.subtotalAmount.amount);
            
            setItems(cartItems);
            setTotal(cartTotal);
            
            // Save receipt and clear cart so it doesn't show up in the slide out cart anymore
            localStorage.setItem('last_order_receipt', JSON.stringify({ items: cartItems, total: cartTotal, orderId: newOrderId }));
            localStorage.removeItem('shopify_cart_id');
          }
        }
      } catch (e) {
        console.error("Failed to load real cart data for receipt", e);
      } finally {
        setLoading(false);
      }
    }
    
    loadReceiptData();
  }, [searchParams]);

  if (loading) {
     return (
       <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white py-12 md:py-24 px-4">
         <div className="animate-pulse tracking-widest text-sm text-zinc-500 font-bold uppercase">Loading Flight Manifest...</div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 md:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
          MISSION ACCOMPLISHED
        </h1>
        <p className="text-white/60 text-lg md:text-xl tracking-wide max-w-2xl mx-auto">
          Your gear is confirmed and ready for dispatch. Here is your First-Class Boarding Pass Manifest. 
          Save it to your device and share it to your story to let everyone know you&apos;re flying heavy.
        </p>
      </div>

      <BoardingPassReceipt 
        orderId={orderId} 
        items={items} 
        customerName="AVIATOR" 
        total={total} 
        destination="LHR - London, UK"
      />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white py-12 md:py-24 px-4">
        <div className="animate-pulse tracking-widest text-sm text-zinc-500 font-bold uppercase">Loading Flight Manifest...</div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
