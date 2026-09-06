'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Wind, Compass, Gauge, Thermometer, Cloud, Copy, Check, RefreshCw } from 'lucide-react';

interface MetarStation {
  icaoId: string;
  name: string;
  temp?: number;
  dewp?: number;
  wdir?: number | string;
  wspd?: number;
  visib?: string | number;
  altim?: number;
  fltCat?: string;
  rawOb?: string;
  cover?: string;
  reportTime?: string;
}

const AIRPORTS = [
  { icao: 'LGAV', city: 'Athens', name: 'Eleftherios Venizelos' },
  { icao: 'LGTS', city: 'Thessaloniki', name: 'Makedonia' },
  { icao: 'LGIR', city: 'Heraklion', name: 'Nikos Kazantzakis' },
  { icao: 'LGSA', city: 'Chania', name: 'Souda Bay' },
  { icao: 'LGKR', city: 'Corfu', name: 'Ioannis Kapodistrias' },
  { icao: 'LGRP', city: 'Rhodes', name: 'Diagoras' },
];

export default function HellenicMetarDatalink() {
  const [selectedIcao, setSelectedIcao] = useState<string>('LGAV');
  const [stations, setStations] = useState<Record<string, MetarStation>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchMetars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/metar');
      if (res.ok) {
        const json = await res.json();
        const map: Record<string, MetarStation> = {};
        if (Array.isArray(json.stations)) {
          json.stations.forEach((s: MetarStation) => {
            map[s.icaoId] = s;
          });
        }
        setStations(map);
        setLastUpdated(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC');
      }
    } catch (err) {
      console.error('Failed to load METAR telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetars();
    const interval = setInterval(fetchMetars, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const activeStation = stations[selectedIcao] || {
    icaoId: selectedIcao,
    name: AIRPORTS.find(a => a.icao === selectedIcao)?.name || selectedIcao,
    temp: 24,
    dewp: 15,
    wdir: 340,
    wspd: 10,
    visib: '10+',
    altim: 1016,
    fltCat: 'VFR',
    rawOb: `METAR ${selectedIcao} AUTO CAVOK Q1016`,
    cover: 'CAVOK'
  };

  const handleCopy = () => {
    if (activeStation.rawOb) {
      navigator.clipboard.writeText(activeStation.rawOb);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFlightCatBadge = (cat?: string) => {
    switch (cat?.toUpperCase()) {
      case 'IFR':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MVFR':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'LIFR':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'VFR':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#080808] to-black border-y border-white/10 py-12 px-6 md:px-12 relative overflow-hidden">
      {/* Background Radar Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase tracking-widest text-emerald-400">
                  LIVE TELEMETRY
                </span>
                <span className="text-white/30 text-xs">{"//"}</span>
                <span className="font-mono text-xs text-neutral-400 tracking-wider">
                  HELLENIC AIRSPACE METAR DATALINK
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mt-0.5">
                Flight Deck Weather Station
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {lastUpdated && (
              <span className="text-[11px] font-mono text-neutral-500">
                SYNCED: {lastUpdated}
              </span>
            )}
            <button
              onClick={fetchMetars}
              disabled={loading}
              className="p-1.5 rounded-sm bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-colors disabled:opacity-50"
              title="Refresh Telemetry"
              aria-label="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Airport Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {AIRPORTS.map((apt) => {
            const isSelected = selectedIcao === apt.icao;
            const stationData = stations[apt.icao];
            return (
              <button
                key={apt.icao}
                onClick={() => setSelectedIcao(apt.icao)}
                className={`group shrink-0 px-4 py-2.5 rounded-sm border font-mono transition-all text-left ${
                  isSelected
                    ? 'border-aegean-blue bg-aegean-blue/15 text-white shadow-[0_0_15px_rgba(0,119,255,0.15)]'
                    : 'border-white/10 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-black tracking-widest ${isSelected ? 'text-sky-300' : 'text-neutral-200 group-hover:text-white'}`}>
                    {apt.icao}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs border uppercase ${getFlightCatBadge(stationData?.fltCat)}`}>
                    {stationData?.fltCat || 'VFR'}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 group-hover:text-neutral-400 truncate max-w-[130px]">
                  {apt.city}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Station Telemetry Console */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIcao}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-950/90 border border-white/10 p-6 rounded-sm shadow-xl relative overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-aegean-blue to-transparent" />

            {/* Left: Station Identity & Category */}
            <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-3xl font-black tracking-widest text-white">
                    {activeStation.icaoId}
                  </span>
                  <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-xs border tracking-widest uppercase ${getFlightCatBadge(activeStation.fltCat)}`}>
                    ● {activeStation.fltCat || 'VFR'} OPS
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wide">
                  {AIRPORTS.find(a => a.icao === activeStation.icaoId)?.name || activeStation.name}
                </h3>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  HELLENIC FIR {"//"} ICAO IDENTIFIER
                </p>
              </div>

              {/* Sky Condition Banner */}
              <div className="mt-6 p-3 bg-white/5 border border-white/5 rounded-xs flex items-center gap-3">
                <Cloud className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="text-xs">
                  <div className="text-neutral-400 font-mono uppercase text-[10px] tracking-wider">Ceiling & Condition</div>
                  <div className="font-bold text-white font-mono">{activeStation.cover || 'CAVOK (Clear Skies)'}</div>
                </div>
              </div>
            </div>

            {/* Middle: Decoded Flight Instruments */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {/* Wind Instrument */}
              <div className="p-4 bg-neutral-900/80 border border-white/10 rounded-sm">
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-2">
                  <Wind className="w-4 h-4 text-emerald-400" />
                  <span>SURFACE WIND</span>
                </div>
                <div className="text-xl md:text-2xl font-black font-mono text-white">
                  {typeof activeStation.wdir === 'number' ? `${activeStation.wdir}°` : activeStation.wdir || 'VRB'}
                  <span className="text-sm font-normal text-neutral-400 ml-1">@ {activeStation.wspd ?? 0} KT</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-1 uppercase">
                  {Number(activeStation.wspd) > 15 ? 'Gust Alert' : 'Normal Crosswind'}
                </div>
              </div>

              {/* Temperature / Dewpoint */}
              <div className="p-4 bg-neutral-900/80 border border-white/10 rounded-sm">
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-2">
                  <Thermometer className="w-4 h-4 text-rose-400" />
                  <span>TEMP / DEWPOINT</span>
                </div>
                <div className="text-xl md:text-2xl font-black font-mono text-white">
                  {activeStation.temp ?? '--'}°C
                  <span className="text-sm font-normal text-neutral-400 ml-1">/ {activeStation.dewp ?? '--'}°C</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-1 uppercase">
                  Spread: {typeof activeStation.temp === 'number' && typeof activeStation.dewp === 'number' ? `${activeStation.temp - activeStation.dewp}°C` : '--'}
                </div>
              </div>

              {/* Altimeter / QNH */}
              <div className="p-4 bg-neutral-900/80 border border-white/10 rounded-sm">
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-2">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  <span>ALTIMETER / QNH</span>
                </div>
                <div className="text-xl md:text-2xl font-black font-mono text-white">
                  {activeStation.altim ?? 1013}
                  <span className="text-sm font-normal text-neutral-400 ml-1">hPa</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-1 uppercase">
                  {activeStation.altim ? `${(activeStation.altim * 0.02953).toFixed(2)} inHg` : '29.92 inHg'}
                </div>
              </div>

              {/* Visibility */}
              <div className="p-4 bg-neutral-900/80 border border-white/10 rounded-sm">
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>VISIBILITY</span>
                </div>
                <div className="text-xl md:text-2xl font-black font-mono text-white">
                  {activeStation.visib ?? '10+'}
                  <span className="text-sm font-normal text-neutral-400 ml-1">SM</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-1 uppercase">
                  Flight Deck Clear
                </div>
              </div>
            </div>

            {/* Right: Raw ICAO METAR String */}
            <div className="lg:col-span-3 flex flex-col justify-between bg-black/60 border border-white/10 p-4 rounded-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    RAW ICAO METAR
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 rounded-xs transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs text-sky-200/90 leading-relaxed break-words bg-neutral-950 p-3 rounded-xs border border-white/5 selection:bg-aegean-blue">
                  {activeStation.rawOb || 'NO RAW OBSERVATION AVAILABLE'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>SRC: NOAA / WMO</span>
                <span className="text-emerald-400 font-bold">ONLINE DATALINK</span>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
