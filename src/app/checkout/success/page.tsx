import React from 'react';
import { BlackBoxReceipt } from '@/components/checkout/BlackBoxReceipt';

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
    <BlackBoxReceipt 
      orderId={orderId} 
      items={mockItems} 
      customerName="GUEST COMMANDER" 
      total={mockTotal} 
    />
  );
}
