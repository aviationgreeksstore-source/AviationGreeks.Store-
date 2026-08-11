'use client';

import React, { useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from './actions';
import { ArrowRight } from 'lucide-react';

function SubmitButton({ variant }: { variant: 'inline' | 'stacked' }) {
  const { pending } = useFormStatus();

  if (variant === 'inline') {
    return (
      <button
        type="submit"
        disabled={pending}
        className="bg-[#2563EB] text-white px-6 py-4 font-black uppercase tracking-wider hover:bg-blue-700 transition-colors border border-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
          </svg>
        ) : (
          <ArrowRight className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#2563EB] text-white px-8 py-4 font-black uppercase tracking-wider hover:bg-blue-700 transition-colors border border-[#2563EB] mt-4 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Subscribing...' : 'Subscribe'}
    </button>
  );
}

type NewsletterFormProps = {
  /** 'inline' = arrow button (landing page), 'stacked' = text button (community page) */
  variant?: 'inline' | 'stacked';
};

export default function NewsletterForm({ variant = 'inline' }: NewsletterFormProps) {
  const [state, formAction] = useFormState(subscribeToNewsletter, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the input on success
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div>
      <form ref={formRef} action={formAction}>
        <div
          className={`flex ${
            variant === 'stacked'
              ? 'flex-col sm:flex-row w-full max-w-md mx-auto'
              : 'w-full md:w-auto'
          } shadow-[0_0_15px_rgba(37,99,235,0.1)]`}
        >
          <input
            type="email"
            name="email"
            required
            placeholder="EMAIL ADDRESS"
            className={`bg-[#111111] text-white px-6 py-4 outline-none border border-[#333333] focus:border-[#2563EB] transition-colors text-sm font-bold tracking-wider placeholder-gray-600 ${
              variant === 'stacked' ? 'flex-1' : 'w-full md:w-64'
            }`}
          />
          <SubmitButton variant={variant} />
        </div>
      </form>

      {/* Status message */}
      {state && (
        <p
          className={`mt-3 text-sm font-medium tracking-wide ${
            state.success ? 'text-[#2563EB]' : 'text-red-400'
          } ${variant === 'stacked' ? 'text-center' : ''}`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
