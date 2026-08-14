'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Share2, PlaneTakeoff, TriangleAlert, Activity, CheckCircle2 } from 'lucide-react';
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
  customerName = 'COMMANDER', 
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-mono p-4 sm:p-8 flex items-center justify-center selection:bg-orange-500 selection:text-white">
      {/* Outer Chassis */}
      <div className="w-full max-w-4xl relative bg-[#121214] rounded-xl shadow-2xl overflow-hidden border border-zinc-800/80 ring-1 ring-white/5">
        
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600"></div>

        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-zinc-800/60 bg-[#151518] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
          
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center border border-zinc-700/50 shadow-inner">
               <Activity className="text-orange-500 animate-pulse w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-[0.15em] text-zinc-100">
                FLIGHT DATA RECORDER
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-semibold">MODEL FDR-2026</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                <span className="text-[10px] sm:text-xs text-orange-500/80 uppercase tracking-widest font-semibold">POST-PURCHASE TELEMETRY</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-lg border border-zinc-800/60 shadow-inner">
            <TriangleAlert className="text-orange-500/80 w-4 h-4" />
            <span className="text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">PROPERTY OF AVIATIONGREEKS</span>
          </div>
        </div>

        {/* Telemetry Visual Stream - More sophisticated */}
        <div className="h-24 bg-black/40 border-b border-zinc-800/60 relative overflow-hidden flex items-center">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          {/* Simulated waveform using pure SVG */}
          <svg className="w-full h-full stroke-orange-500/80 opacity-80 mix-blend-screen" fill="none" preserveAspectRatio="none" viewBox="0 0 1000 100">
            <path d="M0,50 L50,50 L60,20 L70,80 L80,50 L200,50 L210,10 L220,90 L230,50 L400,50 L410,30 L420,70 L430,50 L600,50 L610,20 L620,80 L630,50 L800,50 L810,10 L820,90 L830,50 L1000,50" 
                  strokeWidth="1.5" 
                  className="animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_6px_rgba(249,115,22,0.4)]" />
            <path d="M0,75 L1000,75" stroke="rgba(249,115,22,0.15)" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M0,25 L1000,25" stroke="rgba(249,115,22,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#121214] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#121214] to-transparent z-10" />
        </div>

        {/* Receipt Content Body */}
        <div className="p-6 md:p-10 relative">
          
          {/* Status Readout */}
          <div className="flex items-center gap-4 bg-orange-500/5 border border-orange-500/20 rounded-lg p-4 mb-10 shadow-inner">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
            <p className="uppercase tracking-[0.1em] text-sm text-orange-400 font-medium">
              DATALINK SECURED. CARGO MANIFEST LOGGED. PREPARING FOR DEPARTURE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Identity & Mission Data */}
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 font-semibold">SQUAWK / ORDER ID</p>
                <p className="text-2xl font-medium tracking-wider text-zinc-100">#{orderId}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 font-semibold">COMMANDER</p>
                <p className="text-lg tracking-wider uppercase text-zinc-300">{customerName}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 font-semibold">TRANSMISSION TIME (UTC)</p>
                <p className="text-sm tracking-wider uppercase text-zinc-400">{new Date().toISOString().replace('T', ' ').slice(0, 19)}Z</p>
              </div>
            </div>
            
            {/* Mission Totals */}
            <div className="space-y-6 md:text-right flex flex-col md:items-end">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 font-semibold">TOTAL CARGO VALUE</p>
                <p className="text-4xl font-medium tracking-wider text-zinc-100">${total.toFixed(2)}</p>
              </div>
              <div className="bg-black/30 border border-zinc-800/60 rounded-lg px-5 py-3.5 min-w-[220px]">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-semibold">SYSTEM STATUS</p>
                <div className="flex items-center md:justify-end gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <p className="text-sm tracking-widest uppercase font-semibold">
                    CLEARED FOR TAKEOFF
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payload Manifest (Items) */}
          <div>
            <div className="flex items-center gap-4 mb-6">
               <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.2em]">
                 PAYLOAD MANIFEST
               </h2>
               <div className="flex-1 h-px bg-zinc-800/60"></div>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-zinc-800/60 bg-black/20">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[10px] text-zinc-500 border-b border-zinc-800/60 bg-black/40">
                    <th className="py-3.5 px-5 font-semibold uppercase tracking-widest w-1/2">ITEM DESIGNATION</th>
                    <th className="py-3.5 px-5 font-semibold text-center uppercase tracking-widest">QTY</th>
                    <th className="py-3.5 px-5 font-semibold uppercase tracking-widest">NOTES</th>
                    <th className="py-3.5 px-5 font-semibold text-right uppercase tracking-widest">VALUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {items.map((item, i) => (
                    <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors group">
                      <td className="py-4 px-5 font-medium uppercase tracking-wide text-zinc-300">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-zinc-600 font-normal">{(i + 1).toString().padStart(2, '0')}</span>
                          {item.title}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center text-zinc-400">x{item.quantity}</td>
                      <td className="py-4 px-5 text-xs text-zinc-500 uppercase tracking-wider">{item.notes || '--'}</td>
                      <td className="py-4 px-5 text-right font-medium text-zinc-300">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Action Terminals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-zinc-800/80 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80 bg-[#0e0e10] print:hidden">
          
          <button 
            onClick={handlePrint}
            className="group flex flex-col items-center justify-center p-6 hover:bg-zinc-800/30 transition-colors"
          >
            <Printer className="mb-2.5 w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <span className="uppercase tracking-[0.15em] font-semibold text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">PRINT FLIGHT LOG</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="group flex flex-col items-center justify-center p-6 hover:bg-zinc-800/30 transition-colors"
          >
            <Share2 className="mb-2.5 w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <span className="uppercase tracking-[0.15em] font-semibold text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">SHARE TELEMETRY</span>
          </button>
          
          <button 
            onClick={handleReturn}
            className="group flex flex-col items-center justify-center p-6 hover:bg-zinc-800/30 transition-colors"
          >
            <PlaneTakeoff className="mb-2.5 w-5 h-5 text-zinc-500 group-hover:text-orange-500 transition-colors" />
            <span className="uppercase tracking-[0.15em] font-semibold text-[10px] text-zinc-500 group-hover:text-orange-400 transition-colors">RETURN TO HANGAR</span>
          </button>

        </div>
      </div>
      
      {/* Print-specific styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background-color: white !important; }
          body * { visibility: hidden; }
          .w-full.max-w-4xl, .w-full.max-w-4xl * { visibility: visible; }
          .w-full.max-w-4xl {
            position: absolute; left: 0; top: 0; width: 100% !important; max-width: 100% !important;
            border: none !important; box-shadow: none !important; color: black !important; background-color: white !important;
          }
          .text-zinc-100, .text-zinc-300, .text-zinc-400, .text-zinc-500, .text-zinc-600 { color: black !important; }
          .border-zinc-800\\/80, .border-zinc-800\\/60, .border-zinc-800\\/50, .border-zinc-700\\/50 { border-color: #ddd !important; }
          .bg-\\[\\#121214\\], .bg-\\[\\#151518\\], .bg-\\[\\#09090b\\], .bg-black\\/40, .bg-black\\/30, .bg-black\\/20, .bg-orange-500\\/5 { background-color: white !important; }
          .text-orange-500, .text-orange-400, .text-orange-500\\/80 { color: #333 !important; }
          .text-emerald-400 { color: #333 !important; }
          .animate-pulse, .animate-\\[pulse_2s_ease-in-out_infinite\\] { animation: none !important; }
          .stroke-orange-500\\/80 { stroke: black !important; }
          .from-orange-600, .via-orange-500, .to-orange-600 { background: black !important; }
        }
      `}} />
    </div>
  );
}
