import React from 'react';
import { BoardingPassReceipt } from '@/components/checkout/BoardingPassReceipt';

// Mock data for demonstration - in a real app you'd fetch this using the search params 
// (e.g. ?order_id=xxx) or retrieve it from your state management / database.
export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract order ID from URL or use a generated mock squawk code
  const orderId = (searchParams.order_id as string) || `AG-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Mock items payload
  const mockItems = [
    {
      id: '1',
      title: 'A320 NEO CAPTAIN HOODIE',
      quantity: 1,
      price: 89.99,
      notes: 'SIZE: L | WT: 0.8KG'
    },
    {
      id: '2',
      title: 'REMOVE BEFORE FLIGHT KEYCHAIN',
      quantity: 3,
      price: 9.99,
      notes: 'COLOR: RED | WT: 0.1KG'
    },
    {
      id: '3',
      title: 'ATC CLEARANCE DESK MAT',
      quantity: 1,
      price: 34.99,
      notes: 'DIM: 90x40CM | WT: 0.5KG'
    }
  ];

  const mockTotal = mockItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
        items={mockItems} 
        customerName="JOHN DOE" 
        total={mockTotal} 
        destination="LHR - London, UK"
      />
    </div>
  );
}
