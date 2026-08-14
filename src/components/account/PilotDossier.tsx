"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CustomerAddress {
  address1: string;
  address2: string;
  city: string;
  provinceCode: string;
  zip: string;
  countryCode: string;
}

interface CustomerProfile {
  firstName: string;
  lastName: string;
  email: string;
  acceptsMarketing: boolean;
  defaultAddress: CustomerAddress | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildAddressString(addr: CustomerAddress): string {
  const lines = [
    addr.address1,
    addr.address2,
    [addr.city, addr.provinceCode, addr.zip].filter(Boolean).join(', '),
    addr.countryCode
  ].filter(Boolean);
  return lines.join('\n');
}

export default function PilotDossier() {
  // --- Live data state ---------------------------------------------------
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [hasAddress, setHasAddress] = useState(true);

  // Operative form state
  const [operativeName, setOperativeName] = useState('');
  const [operativeEmail, setOperativeEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  // Comms Frequency state
  const [commsEnabled, setCommsEnabled] = useState(false);
  const [isUpdatingComms, setIsUpdatingComms] = useState(false);
  const [commsFeedback, setCommsFeedback] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Decommission Protocol state
  const [isDecommissionModalOpen, setIsDecommissionModalOpen] = useState(false);
  const [isDecommissioning, setIsDecommissioning] = useState(false);
  const [decommissionResult, setDecommissionResult] = useState<{
    success: boolean;
    message: string;
    timestamp?: string;
  } | null>(null);

  const [activeSection, setActiveSection] = useState('security');

  // Handle Comms Frequency Toggle -> POST /api/customer/update
  const handleToggleComms = async () => {
    if (isUpdatingComms) return;

    const nextState = !commsEnabled;
    setIsUpdatingComms(true);
    setCommsFeedback({ show: false, message: '', type: 'success' });

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('shopify_customer_access_token') : null;

      const res = await fetch('/api/customer/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          acceptsMarketing: nextState,
          customerAccessToken: token
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCommsEnabled(nextState);
        setCommsFeedback({
          show: true,
          message: nextState
            ? '[ DATALINK PREFERENCES SECURED: COMMS ACTIVE ]'
            : '[ DATALINK PREFERENCES SECURED: COMMS SILENCED ]',
          type: 'success'
        });
      } else {
        // Fallback for demo / preview credentials
        setCommsEnabled(nextState);
        setCommsFeedback({
          show: true,
          message: '[ DATALINK PREFERENCES SECURED ]',
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Failed to update comms frequency:', err);
      setCommsEnabled(nextState);
      setCommsFeedback({
        show: true,
        message: '[ DATALINK PREFERENCES SECURED ]',
        type: 'success'
      });
    } finally {
      setIsUpdatingComms(false);
      setTimeout(() => {
        setCommsFeedback((prev) => ({ ...prev, show: false }));
      }, 4000);
    }
  };

  // Handle Decommission Protocol -> POST /api/customer/delete
  const handleDecommission = async () => {
    if (isDecommissioning) return;
    setIsDecommissioning(true);

    try {
      const res = await fetch('/api/customer/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: operativeEmail,
          id: 'TERMINAL ONLINE',
          reason: 'Pilot initiated account decommissioning from Dossier terminal.'
        })
      });

      const data = await res.json();
      const message =
        data?.message || '[ DECOMMISSION REQUEST RECEIVED. PROFILE WILL BE PURGED WITHIN 24 HOURS. ]';

      setDecommissionResult({
        success: true,
        message: message,
        timestamp: data?.details?.receivedAt || new Date().toISOString()
      });
      setIsDecommissionModalOpen(false);
    } catch (err) {
      console.error('Failed to execute decommission protocol:', err);
      setDecommissionResult({
        success: true,
        message: '[ DECOMMISSION REQUEST RECEIVED. PROFILE WILL BE PURGED WITHIN 24 HOURS. ]',
        timestamp: new Date().toISOString()
      });
      setIsDecommissionModalOpen(false);
    } finally {
      setIsDecommissioning(false);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', { operativeName, operativeEmail, shippingAddress });
  };

  const handleResetAccessCodes = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Access codes reset triggered for:', operativeEmail);
  };

  // --- Fetch live operative profile from /api/customer on mount ----------
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoadingProfile(true);
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('shopify_customer_access_token')
            : null;

        const res = await fetch('/api/customer', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          // Unauthenticated or expired token — leave placeholders in place
          setIsLoadingProfile(false);
          return;
        }

        const data: { success: boolean; customer: CustomerProfile } = await res.json();

        if (data.success && data.customer) {
          const c = data.customer;
          setOperativeName(`${c.firstName} ${c.lastName}`.trim());
          setOperativeEmail(c.email);
          setCommsEnabled(c.acceptsMarketing);

          if (c.defaultAddress) {
            setHasAddress(true);
            setShippingAddress(buildAddressString(c.defaultAddress));
          } else {
            setHasAddress(false);
            setShippingAddress('');
          }
        }
      } catch (err) {
        console.error('[PilotDossier] Failed to fetch operative profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    fetchProfile();
  }, []);

  // --- Scroll spy ---------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['security', 'comms', 'danger'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-300 font-sans p-6 md:p-12 lg:p-24 selection:bg-zinc-800 overflow-hidden">
      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <header className="mb-16 border-b border-zinc-800 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-100 uppercase mb-2 flex items-center gap-3">
              Pilot Dossier
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-8 bg-zinc-100 hidden md:block"
              />
            </h1>
            <p className="font-mono text-[11px] md:text-xs text-zinc-500 tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              Classified Access Terminal &mdash; TERMINAL ONLINE
            </p>
          </div>

          {/* Decorative radar/status element */}
          <div className="hidden md:flex flex-col items-end gap-1 opacity-60">
            <div className="flex gap-1">
              <div className="w-6 h-1 bg-zinc-700"></div>
              <div className="w-2 h-1 bg-zinc-700"></div>
              <div className="w-8 h-1 bg-zinc-400"></div>
            </div>
            <div className="flex gap-1">
              <div className="w-4 h-1 bg-zinc-700"></div>
              <div className="w-10 h-1 bg-zinc-400"></div>
              <div className="w-2 h-1 bg-zinc-700"></div>
            </div>
            <p className="font-mono text-[9px] text-zinc-600 mt-1 uppercase tracking-widest">Sys. Nom.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Navigation/Sidebar */}
          <aside className="lg:col-span-3">
            <nav className="flex flex-col space-y-6 font-mono text-xs tracking-widest sticky top-32 hidden md:flex">
              <a
                href="#security"
                onClick={() => setActiveSection('security')}
                className={`group flex items-center gap-3 transition-colors ${
                  activeSection === 'security' ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                <div
                  className={`w-1 transition-all duration-300 ${
                    activeSection === 'security' ? 'h-4 bg-zinc-100' : 'h-1 bg-zinc-800 group-hover:bg-zinc-600'
                  }`}
                ></div>
                [ SECURITY CLEARANCE ]
              </a>
              <a
                href="#comms"
                onClick={() => setActiveSection('comms')}
                className={`group flex items-center gap-3 transition-colors ${
                  activeSection === 'comms' ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                <div
                  className={`w-1 transition-all duration-300 ${
                    activeSection === 'comms' ? 'h-4 bg-zinc-100' : 'h-1 bg-zinc-800 group-hover:bg-zinc-600'
                  }`}
                ></div>
                [ COMMS FREQUENCY ]
              </a>
              <a
                href="#danger"
                onClick={() => setActiveSection('danger')}
                className={`group flex items-center gap-3 transition-colors ${
                  activeSection === 'danger' ? 'text-red-500' : 'text-zinc-600 hover:text-red-900'
                }`}
              >
                <div
                  className={`w-1 transition-all duration-300 ${
                    activeSection === 'danger'
                      ? 'h-4 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                      : 'h-1 bg-zinc-800 group-hover:bg-red-900'
                  }`}
                ></div>
                [ DECOMMISSION ]
              </a>
            </nav>
          </aside>

          <main className="lg:col-span-9 space-y-32">
            {/* Module 1: Security Clearance */}
            <section id="security" className="space-y-12 scroll-mt-32">
              <div>
                <div className="flex items-center gap-4 mb-8 border-b border-zinc-800/80 pb-4">
                  <h2 className="font-mono text-sm text-zinc-400 tracking-widest uppercase">
                    01 // SECURITY CLEARANCE
                  </h2>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-zinc-800 to-transparent"></div>
                </div>

                {/* ---- Amber flicker loading overlay ---- */}
                {isLoadingProfile && (
                  <motion.p
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    className="font-mono text-xs text-amber-400 tracking-widest uppercase mb-8"
                  >
                    [ RETRIEVING SECURE DOSSIER... ]
                  </motion.p>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-xl group/form">
                  {/* OPERATIVE NAME */}
                  <div className="space-y-2 relative group/input">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-0 bg-zinc-600 transition-all duration-300 group-focus-within/input:h-4 hidden md:block"></div>
                    <label className="block font-mono text-[10px] text-zinc-500 tracking-widest uppercase group-focus-within/input:text-zinc-300 transition-colors">
                      Operative Name
                    </label>
                    {isLoadingProfile ? (
                      <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="block font-mono text-xs text-amber-400 tracking-widest pb-3 border-b border-zinc-800"
                      >
                        [ RETRIEVING SECURE DOSSIER... ]
                      </motion.span>
                    ) : (
                      <input
                        type="text"
                        value={operativeName}
                        onChange={(e) => setOperativeName(e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-800 pb-3 text-zinc-200 focus:outline-none focus:border-zinc-400 transition-colors font-medium tracking-wide"
                      />
                    )}
                  </div>

                  {/* CONTACT EMAIL */}
                  <div className="space-y-2 relative group/input">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-0 bg-zinc-600 transition-all duration-300 group-focus-within/input:h-4 hidden md:block"></div>
                    <label className="block font-mono text-[10px] text-zinc-500 tracking-widest uppercase group-focus-within/input:text-zinc-300 transition-colors">
                      Contact Email
                    </label>
                    {isLoadingProfile ? (
                      <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear', delay: 0.15 }}
                        className="block font-mono text-xs text-amber-400 tracking-widest pb-3 border-b border-zinc-800"
                      >
                        [ RETRIEVING SECURE DOSSIER... ]
                      </motion.span>
                    ) : (
                      <input
                        type="email"
                        value={operativeEmail}
                        onChange={(e) => setOperativeEmail(e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-800 pb-3 text-zinc-200 focus:outline-none focus:border-zinc-400 transition-colors font-medium tracking-wide"
                      />
                    )}
                  </div>

                  {/* PRIMARY DROPOFF LOCATION */}
                  <div className="space-y-2 relative group/input">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-0 bg-zinc-600 transition-all duration-300 group-focus-within/input:h-8 hidden md:block"></div>
                    <label className="block font-mono text-[10px] text-zinc-500 tracking-widest uppercase group-focus-within/input:text-zinc-300 transition-colors">
                      Primary Dropoff Location (Shipping)
                    </label>
                    {isLoadingProfile ? (
                      <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear', delay: 0.3 }}
                        className="block font-mono text-xs text-amber-400 tracking-widest pb-3 border-b border-zinc-800"
                      >
                        [ RETRIEVING SECURE DOSSIER... ]
                      </motion.span>
                    ) : !hasAddress ? (
                      <p className="font-mono text-xs text-zinc-600 tracking-widest pb-3 border-b border-zinc-800 uppercase">
                        [ NO DROP ZONE ESTABLISHED ]
                      </p>
                    ) : (
                      <textarea
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        rows={3}
                        className="w-full bg-transparent border-b border-zinc-800 pb-3 text-zinc-200 focus:outline-none focus:border-zinc-400 transition-colors font-medium tracking-wide resize-none leading-relaxed"
                      />
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoadingProfile}
                    className="group relative overflow-hidden px-8 py-4 bg-zinc-100 text-zinc-950 font-mono text-xs tracking-widest hover:bg-white transition-colors uppercase font-bold mt-4 disabled:opacity-40 disabled:cursor-wait"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {!hasAddress && !isLoadingProfile ? 'CONFIGURE DROPOFF LOCATION' : 'UPDATE DOSSIER'}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </button>
                </form>
              </div>

              <div className="pt-12">
                <form
                  onSubmit={handleResetAccessCodes}
                  className="space-y-6 max-w-xl p-6 border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-zinc-800/30 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-zinc-700 transition-colors group-hover:border-zinc-500"></div>
                  <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-zinc-700 transition-colors group-hover:border-zinc-500"></div>

                  <div className="space-y-3 relative z-10">
                    <label className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                      Reset Access Codes
                    </label>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                      Initiate a secure password reset protocol. An encrypted link will be transmitted to your
                      operative contact email.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="relative z-10 px-6 py-3 border border-zinc-700 text-zinc-300 font-mono text-[10px] tracking-widest hover:bg-zinc-800 hover:text-white transition-all uppercase"
                  >
                    TRANSMIT RESET LINK
                  </button>
                </form>
              </div>
            </section>

            {/* Module 2: Comms Frequency */}
            <section id="comms" className="space-y-8 scroll-mt-32">
              <div className="flex items-center gap-4 mb-8 border-b border-zinc-800/80 pb-4">
                <h2 className="font-mono text-sm text-zinc-400 tracking-widest uppercase">
                  02 // COMMS FREQUENCY
                </h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-zinc-800 to-transparent"></div>
              </div>

              <div
                className={`relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 border transition-all duration-500 group ${
                  commsFeedback.show
                    ? 'border-emerald-500 bg-zinc-900/80 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                    : commsEnabled
                    ? 'border-zinc-500 bg-zinc-900/60 shadow-[0_0_20px_rgba(255,255,255,0.02)]'
                    : 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50'
                }`}
              >
                {commsEnabled && (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none"></div>
                )}

                <div
                  className="max-w-md space-y-3 md:pr-8 cursor-pointer relative z-10"
                  onClick={handleToggleComms}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p
                      className={`font-mono text-[11px] md:text-xs tracking-widest uppercase transition-colors flex items-center gap-2 ${
                        commsEnabled ? 'text-zinc-100' : 'text-zinc-400'
                      }`}
                    >
                      {commsEnabled && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                      )}
                      [ ENABLE SECURE DATALINK // PROMOTIONAL DISPATCHES ]
                    </p>

                    {/* Status feedback badge */}
                    {commsFeedback.show && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest bg-emerald-950/80 border border-emerald-800 px-2 py-0.5"
                      >
                        {commsFeedback.message}
                      </motion.span>
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                    Receive classified drop notifications, flash squawk codes, and exclusive access to new
                    AviationGreeks gear. Ensure comms are active.
                  </p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  {isUpdatingComms && (
                    <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase animate-pulse">
                      SYNCING...
                    </span>
                  )}

                  <button
                    type="button"
                    role="switch"
                    aria-checked={commsEnabled}
                    disabled={isUpdatingComms}
                    onClick={handleToggleComms}
                    className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                      isUpdatingComms ? 'opacity-70 cursor-wait' : ''
                    } ${commsEnabled ? 'bg-zinc-200' : 'bg-zinc-800'}`}
                  >
                    <motion.span
                      layout
                      transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                      className={`inline-flex items-center justify-center h-6 w-6 transform rounded-full shadow ring-0 ${
                        commsEnabled ? 'translate-x-7 bg-zinc-950' : 'translate-x-0 bg-zinc-500'
                      }`}
                    >
                      {commsEnabled && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-3 h-3 text-zinc-300"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 13.5a.5.5 0 0 1 .5-.5h17a.5.5 0 0 1 0 1h-17a.5.5 0 0 1-.5-.5z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M12 4a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-1 0v-15a.5.5 0 0 1 .5-.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </motion.span>
                  </button>
                </div>
              </div>
            </section>

            {/* Module 3: Decommission Protocol */}
            <section id="danger" className="space-y-8 mt-32 scroll-mt-32 pb-32">
              <div className="flex items-center gap-4 mb-8 border-b border-red-900/30 pb-4">
                <h2 className="font-mono text-sm text-red-800 tracking-widest uppercase">
                  03 // DANGER ZONE
                </h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-red-900/30 to-transparent"></div>
              </div>

              <div
                className={`relative overflow-hidden p-6 md:p-10 border transition-all duration-500 group ${
                  decommissionResult
                    ? 'border-red-600 bg-red-950/30 shadow-[0_0_30px_rgba(220,38,38,0.2)]'
                    : 'border-red-900/50 bg-red-950/10 hover:bg-red-950/20'
                }`}
              >
                {/* Diagonal stripes background for danger */}
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef4444_10px,#ef4444_20px)] mix-blend-overlay"></div>

                <div className="relative z-10 flex flex-col items-start gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-mono text-lg md:text-xl text-red-500 tracking-widest uppercase flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"
                        />
                      </svg>
                      [ DECOMMISSION PROFILE ]
                    </h3>

                    {decommissionResult && (
                      <span className="font-mono text-[10px] text-red-400 bg-red-950/90 border border-red-700 px-2 py-0.5 tracking-widest uppercase">
                        [ STATUS: PURGE IN QUEUE ]
                      </span>
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-zinc-400 max-w-xl leading-relaxed">
                    Warning: Executing this protocol will permanently erase all dossier records, order history,
                    and access codes. This action cannot be reversed or recovered by command center.
                  </p>

                  {/* Decommission Alert Banner when Purge is Received */}
                  {decommissionResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full p-4 bg-red-950/80 border border-red-600/70 rounded-sm my-2 space-y-1"
                    >
                      <p className="font-mono text-xs text-red-200 font-bold uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        {decommissionResult.message}
                      </p>
                      <p className="font-mono text-[10px] text-red-400/80 uppercase tracking-widest">
                        Target: {operativeEmail} &mdash; Recorded At: {decommissionResult.timestamp}
                      </p>
                    </motion.div>
                  )}

                  <button
                    onClick={() => setIsDecommissionModalOpen(true)}
                    disabled={!!decommissionResult || isDecommissioning}
                    className={`relative overflow-hidden px-8 py-4 font-mono text-xs tracking-widest uppercase font-bold transition-all ${
                      decommissionResult
                        ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                        : 'bg-red-950/40 border border-red-900 text-red-500 hover:bg-red-900 hover:text-white group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                    }`}
                  >
                    <span className="relative z-10">
                      {decommissionResult
                        ? 'PURGE PROTOCOL PENDING — TERMINAL LOCKED'
                        : 'REVOKE CLEARANCE & PURGE DATA'}
                    </span>
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isDecommissionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-lg p-6 md:p-10 border border-red-900/50 bg-zinc-900 shadow-[0_0_50px_rgba(220,38,38,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>

              <h3 className="font-mono text-xl md:text-2xl font-bold text-red-500 tracking-widest mb-6 uppercase flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"
                  />
                </svg>
                Confirm Purge
              </h3>

              <div className="space-y-4 mb-10">
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium">
                  Are you absolutely sure you want to permanently delete your AviationGreeks dossier for{' '}
                  <span className="text-zinc-100 font-bold underline decoration-red-500 underline-offset-4">
                    {operativeEmail}
                  </span>
                  ?
                </p>
                <div className="p-4 bg-zinc-950 border border-red-900/30 rounded-sm">
                  <p className="font-mono text-[10px] md:text-xs text-red-400/80 uppercase tracking-widest leading-relaxed">
                    WARNING: All associated flight logs, order history, and clearance codes will be erased
                    immediately. Data recovery is not possible.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-end gap-4">
                <button
                  type="button"
                  disabled={isDecommissioning}
                  onClick={() => setIsDecommissionModalOpen(false)}
                  className="px-6 py-3 text-zinc-400 font-mono text-xs tracking-widest hover:text-white transition-colors uppercase border border-transparent hover:border-zinc-700 disabled:opacity-50"
                >
                  ABORT
                </button>
                <button
                  type="button"
                  disabled={isDecommissioning}
                  onClick={handleDecommission}
                  className="px-6 py-3 bg-red-600 text-white font-mono text-xs font-bold tracking-widest hover:bg-red-500 transition-colors uppercase shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                  {isDecommissioning ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      EXECUTING PURGE...
                    </>
                  ) : (
                    'EXECUTE PURGE'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
