'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Share2, PlaneTakeoff, TriangleAlert, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface ReceiptItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface BlackBoxReceiptProps {
  orderId: string;
  items: ReceiptItem[];
  customerName?: string;
  total: number;
}

export function BlackBoxReceipt({ 
  orderId, 
  items, 
  customerName = 'GUEST COMMANDER', 
  total 
}: BlackBoxReceiptProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AviationGreeks Gear is Secured!',
          text: `SQUAWK CODE #${orderId} - Preparing for departure! ✈️`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback copy to clipboard
      try {
        await navigator.clipboard.writeText(`AviationGreeks Order Secured! SQUAWK #${orderId} - ${window.location.href}`);
        alert('Telemetry link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const handleReturn = () => {
    router.push('/');
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-black text-orange-500 font-mono p-4 sm:p-8 flex items-center justify-center selection:bg-orange-500 selection:text-black">
      <div className="w-full max-w-4xl border-4 border-orange-500 relative bg-[#0a0a0a] shadow-[0_0_50px_rgba(255,85,0,0.15)] overflow-hidden">
        
        {/* Physical Chassis / Warning Label Header */}
        <div className="border-b-4 border-orange-500 p-4 bg-orange-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-3">
              <Activity className="animate-pulse w-6 h-6 md:w-8 md:h-8" />
              FLIGHT DATA RECORDER
            </h1>
            <p className="text-sm opacity-80 uppercase tracking-widest mt-1">MODEL FDR-2026 // POST-PURCHASE TELEMETRY</p>
          </div>
          <div className="flex items-center gap-2 border-2 border-orange-500 px-4 py-2 bg-black text-orange-500 text-xs md:text-sm font-bold uppercase tracking-widest">
            <TriangleAlert className="animate-pulse text-red-500 w-5 h-5" />
            <span className="text-red-500">DO NOT OPEN - PROPERTY OF AVIATIONGREEKS OPS</span>
          </div>
        </div>

        {/* Telemetry Visual Stream */}
        <div className="h-20 border-b-4 border-orange-500 bg-black overflow-hidden flex items-end opacity-80 relative z-0">
          {/* Simulated waveform using pure SVG */}
          <svg className="w-full h-full stroke-orange-500 opacity-60" fill="none" preserveAspectRatio="none" viewBox="0 0 1000 100">
            <path d="M0,50 L50,50 L60,20 L70,80 L80,50 L200,50 L210,10 L220,90 L230,50 L400,50 L410,30 L420,70 L430,50 L600,50 L610,20 L620,80 L630,50 L800,50 L810,10 L820,90 L830,50 L1000,50" 
                  strokeWidth="2" 
                  className="animate-[pulse_1.5s_ease-in-out_infinite]" />
            <path d="M0,80 Q150,40 300,80 T600,80 T900,40 T1000,80" 
                  strokeWidth="1" 
                  opacity="0.3" 
                  className="animate-pulse" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none" />
        </div>

        {/* Receipt Content Body */}
        <div className="p-6 md:p-10 space-y-10 relative z-10">
          
          {/* Status Readout */}
          <div className="bg-orange-500/10 border border-orange-500/50 p-5 shadow-[inset_0_0_20px_rgba(255,85,0,0.1)]">
            <p className="uppercase tracking-widest text-lg md:text-xl font-bold flex items-center gap-3">
              <span className="text-2xl animate-pulse">{'>'}</span> 
              DATALINK SECURED. CARGO MANIFEST LOGGED. PREPARING FOR DEPARTURE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/50 p-6 border border-orange-500/20">
            {/* Identity & Mission Data */}
            <div className="space-y-6">
              <div>
                <p className="text-xs opacity-60 uppercase tracking-widest mb-1">SQUAWK / ORDER ID</p>
                <p className="text-3xl font-black tracking-widest text-white">#{orderId}</p>
              </div>
              <div>
                <p className="text-xs opacity-60 uppercase tracking-widest mb-1">COMMANDER</p>
                <p className="text-xl tracking-widest uppercase">{customerName}</p>
              </div>
              <div>
                <p className="text-xs opacity-60 uppercase tracking-widest mb-1">TRANSMISSION TIME (UTC)</p>
                <p className="text-lg tracking-widest uppercase">{new Date().toISOString().replace('T', ' ').slice(0, 19)}Z</p>
              </div>
            </div>
            
            {/* Mission Totals */}
            <div className="space-y-6 md:text-right flex flex-col md:items-end">
              <div>
                <p className="text-xs opacity-60 uppercase tracking-widest mb-1">TOTAL CARGO VALUE</p>
                <p className="text-4xl font-black tracking-widest text-white">${total.toFixed(2)}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500 px-4 py-2 inline-block">
                <p className="text-xs text-green-500 opacity-80 uppercase tracking-widest mb-1">SYSTEM STATUS</p>
                <p className="text-xl tracking-widest uppercase text-green-400 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  CLEARED FOR TAKEOFF
                </p>
              </div>
            </div>
          </div>

          {/* Payload Manifest (Items) */}
          <div className="mt-8 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-orange-500/30"></div>
            <h2 className="text-2xl font-black uppercase tracking-[0.15em] border-b-2 border-orange-500 pb-3 mb-6 flex items-center gap-3">
              [ PAYLOAD MANIFEST ]
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-orange-500 text-sm opacity-80">
                    <th className="py-3 px-4 font-bold uppercase tracking-widest w-1/2">ITEM DESIGNATION</th>
                    <th className="py-3 px-4 font-bold text-center uppercase tracking-widest">QTY</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-widest">NOTES (WT/DIM)</th>
                    <th className="py-3 px-4 font-bold text-right uppercase tracking-widest">VALUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-500/20">
                  {items.map((item, i) => (
                    <tr key={item.id} className="hover:bg-orange-500/5 transition-colors group">
                      <td className="py-5 px-4 font-bold uppercase tracking-wide text-white group-hover:text-orange-400 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xs opacity-50 font-normal">{(i + 1).toString().padStart(2, '0')}</span>
                          {item.title}
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center text-lg font-bold">x{item.quantity}</td>
                      <td className="py-5 px-4 text-sm opacity-70 uppercase tracking-wider">{item.notes || 'STANDARD'}</td>
                      <td className="py-5 px-4 text-right font-bold text-white">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Action Terminals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-t-4 border-orange-500 divide-y sm:divide-y-0 sm:divide-x-4 divide-orange-500 text-center relative z-10 print:hidden">
          
          <button 
            onClick={handlePrint}
            className="group flex flex-col items-center justify-center p-8 bg-black hover:bg-orange-500 hover:text-black transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmNTUwMCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-50 group-hover:opacity-0 transition-opacity"></div>
            <Printer className="mb-3 w-8 h-8 group-hover:animate-bounce relative z-10" />
            <span className="uppercase tracking-[0.2em] font-bold text-sm relative z-10">PRINT FLIGHT LOG</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="group flex flex-col items-center justify-center p-8 bg-black hover:bg-orange-500 hover:text-black transition-all duration-300 relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmNTUwMCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-50 group-hover:opacity-0 transition-opacity"></div>
            <Share2 className="mb-3 w-8 h-8 group-hover:scale-125 transition-transform relative z-10" />
            <span className="uppercase tracking-[0.2em] font-bold text-sm relative z-10">SHARE TELEMETRY</span>
          </button>
          
          <button 
            onClick={handleReturn}
            className="group flex flex-col items-center justify-center p-8 bg-black hover:bg-orange-500 hover:text-black transition-all duration-300 relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmNTUwMCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-50 group-hover:opacity-0 transition-opacity"></div>
            <PlaneTakeoff className="mb-3 w-8 h-8 group-hover:-translate-y-2 group-hover:translate-x-2 transition-transform relative z-10" />
            <span className="uppercase tracking-[0.2em] font-bold text-sm relative z-10">RETURN TO HANGAR</span>
          </button>

        </div>
      </div>
      
      {/* Print-specific styles using standard global style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: white !important;
          }
          body * {
            visibility: hidden;
          }
          .w-full.max-w-4xl, .w-full.max-w-4xl * {
            visibility: visible;
          }
          .w-full.max-w-4xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            color: black !important;
            background-color: white !important;
          }
          /* Override all colors for print to save ink but keep the structure */
          .text-orange-500, .border-orange-500, .border-orange-500\\/50, .border-orange-500\\/30, .border-orange-500\\/20, .border-orange-500\\/10 {
            color: black !important;
            border-color: black !important;
          }
          .text-red-500 {
            color: black !important;
          }
          .text-green-500, .text-green-400, .border-green-500 {
            color: black !important;
            border-color: black !important;
          }
          .bg-orange-500\\/10, .bg-orange-500\\/5, .bg-black\\/50, .bg-\\[\\#0a0a0a\\], .bg-green-500\\/10, .bg-green-400, .bg-black {
            background-color: white !important;
          }
          .text-white {
            color: black !important;
          }
          .animate-pulse, .animate-\\[pulse_1\\.5s_ease-in-out_infinite\\] {
            animation: none !important;
          }
          .stroke-orange-500 {
            stroke: black !important;
          }
        }
      `}} />
    </div>
  );
}
