"use client";

import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import { Share2, Plane } from 'lucide-react';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface BoardingPassProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  destination?: string;
}

export function BoardingPassReceipt({ 
  orderId, 
  customerName, 
  items,
  destination = "LHR - London, UK"
}: BoardingPassProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!receiptRef.current) return;
    
    try {
      setIsExporting(true);
      
      const dataUrl = await toPng(receiptRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `Manifest_${orderId}.png`, { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'First-Class Manifest',
          text: 'Secured the payload. #AviationGreeks',
        });
      } else {
        const link = document.createElement('a');
        link.download = `Manifest_${orderId}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }).toUpperCase();
  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  }) + ' ZULU';

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
      {/* Visible Boarding Pass */}
      <div className="w-full bg-zinc-950 border border-white/20 shadow-2xl flex flex-col md:flex-row rounded-lg overflow-hidden relative">
        {/* Decorative perforated line for desktop */}
        <div className="hidden md:block absolute top-0 bottom-0 right-[25%] border-r-2 border-dashed border-white/20 z-10"></div>
        
        {/* Left Panel */}
        <div className="flex-1 p-6 md:p-8 flex flex-col relative md:w-3/4">
          <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-white/50 text-xs tracking-[0.2em] font-bold">AVIATIONGREEKS // FIRST-CLASS MANIFEST</h1>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-1 uppercase tracking-wider">FLIGHT #{orderId}</h2>
            </div>
            <div className="text-right">
              <span className="text-white/50 text-xs tracking-widest block">CABIN</span>
              <span className="text-white font-bold tracking-widest">CREW / HEAVY</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-white/50 text-xs tracking-widest mb-1">PASSENGER</p>
              <p className="text-white font-bold text-lg uppercase">{customerName}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs tracking-widest mb-1">DATE / TIME</p>
              <p className="text-white font-bold uppercase">{dateStr}</p>
              <p className="text-white/80 font-mono text-sm">{timeStr}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs tracking-widest mb-1">ORIGIN</p>
              <p className="text-white font-bold text-lg">LGAV</p>
              <p className="text-white/60 text-xs uppercase">Athens, GR</p>
            </div>
            <div>
              <p className="text-white/50 text-xs tracking-widest mb-1">DESTINATION</p>
              <p className="text-white font-bold text-lg">{destination.split(' - ')[0]}</p>
              <p className="text-white/60 text-xs uppercase">{destination.split(' - ')[1] || destination}</p>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-white/50 text-xs tracking-widest mb-3 border-b border-white/10 pb-2">MANIFEST CONTENTS</p>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm uppercase">{item.title}</p>
                    {item.notes && <p className="text-white/50 text-xs font-mono">{item.notes}</p>}
                  </div>
                  <div className="text-white font-mono text-sm">
                    x{item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel (Stub) */}
        <div className="w-full md:w-1/4 bg-zinc-900 p-6 md:p-8 flex flex-col items-center justify-center border-t border-dashed border-white/20 md:border-t-0 md:border-l relative overflow-hidden">
           {/* Perforated edge effect for mobile */}
           <div className="md:hidden absolute top-0 left-0 right-0 border-t-2 border-dashed border-white/20 z-10"></div>
          
          <div className="w-full flex justify-between md:flex-col md:space-y-6 md:items-center mb-6">
            <div className="text-center">
              <p className="text-white/50 text-xs tracking-widest mb-1">GATE</p>
              <p className="text-white font-black text-2xl md:text-3xl">A21</p>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-xs tracking-widest mb-1">SEAT</p>
              <p className="text-white font-black text-2xl md:text-3xl">1A</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg">
            <QRCode 
              value={`https://aviationgreeks.com/track/${orderId}`}
              size={120}
              className="w-24 h-24 md:w-32 md:h-32"
            />
          </div>
          <p className="text-white/30 text-[0.6rem] tracking-widest mt-4 text-center">
            {orderId}
          </p>
        </div>
      </div>

      <button 
        onClick={handleExport}
        disabled={isExporting}
        className="group relative flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-200 transition-colors rounded-none uppercase font-black tracking-widest text-sm disabled:opacity-50"
      >
        {isExporting ? (
          <span className="flex items-center gap-2">
            PREPARING EXPORT...
          </span>
        ) : (
          <>
            <span>EXPORT TO FLIGHT DECK // SHARE TO STORY</span>
            <Plane className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Hidden 9:16 Export Container */}
      <div className="fixed top-[-9999px] left-[-9999px] -z-50 pointer-events-none">
        <div 
          ref={receiptRef}
          className="w-[1080px] h-[1920px] bg-zinc-950 flex items-center justify-center relative overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(50, 50, 50, 0.4) 0%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 blur-[120px] rounded-full"></div>
          
          <div className="w-[900px] bg-zinc-950 border border-white/20 shadow-2xl flex flex-col rounded-xl overflow-hidden relative z-10">
            {/* Horizontal Perforation */}
            <div className="absolute top-[70%] left-0 right-0 border-t-4 border-dashed border-white/20 z-10"></div>
            
            {/* Top Main Section */}
            <div className="h-[70%] p-12 flex flex-col">
              <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-8">
                <div>
                  <h1 className="text-white/50 text-xl tracking-[0.2em] font-bold">AVIATIONGREEKS // FIRST-CLASS MANIFEST</h1>
                  <h2 className="text-5xl font-black text-white mt-4 uppercase tracking-wider">FLIGHT #{orderId}</h2>
                </div>
                <div className="text-right">
                  <span className="text-white/50 text-xl tracking-widest block">CABIN</span>
                  <span className="text-white font-bold text-2xl tracking-widest mt-2 block">CREW / HEAVY</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <p className="text-white/50 text-lg tracking-widest mb-2">PASSENGER</p>
                  <p className="text-white font-bold text-3xl uppercase">{customerName}</p>
                </div>
                <div>
                  <p className="text-white/50 text-lg tracking-widest mb-2">DATE / TIME</p>
                  <p className="text-white font-bold text-2xl uppercase">{dateStr}</p>
                  <p className="text-white/80 font-mono text-xl">{timeStr}</p>
                </div>
                <div>
                  <p className="text-white/50 text-lg tracking-widest mb-2">ORIGIN</p>
                  <p className="text-white font-bold text-3xl">LGAV</p>
                  <p className="text-white/60 text-xl uppercase mt-1">Athens, GR</p>
                </div>
                <div>
                  <p className="text-white/50 text-lg tracking-widest mb-2">DESTINATION</p>
                  <p className="text-white font-bold text-3xl">{destination.split(' - ')[0]}</p>
                  <p className="text-white/60 text-xl uppercase mt-1">{destination.split(' - ')[1] || destination}</p>
                </div>
              </div>

              <div className="mt-auto">
                <p className="text-white/50 text-lg tracking-widest mb-6 border-b border-white/10 pb-4">MANIFEST CONTENTS</p>
                <div className="space-y-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-bold text-2xl uppercase">{item.title}</p>
                        {item.notes && <p className="text-white/50 text-lg font-mono mt-1">{item.notes}</p>}
                      </div>
                      <div className="text-white font-mono text-2xl">
                        x{item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Stub Section */}
            <div className="h-[30%] bg-zinc-900 p-12 flex items-center justify-between relative overflow-hidden">
              <div className="flex gap-16">
                <div>
                  <p className="text-white/50 text-xl tracking-widest mb-2">GATE</p>
                  <p className="text-white font-black text-6xl">A21</p>
                </div>
                <div>
                  <p className="text-white/50 text-xl tracking-widest mb-2">SEAT</p>
                  <p className="text-white font-black text-6xl">1A</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="bg-white p-6 rounded-xl">
                  <QRCode 
                    value={`https://aviationgreeks.com/track/${orderId}`}
                    size={200}
                  />
                </div>
                <p className="text-white/30 text-sm tracking-widest mt-4">
                  {orderId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
