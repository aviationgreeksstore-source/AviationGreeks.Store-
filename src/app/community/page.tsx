import React from 'react';
import Link from 'next/link';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import FadeIn from '@/components/ui/FadeIn';

export const metadata = {
  title: 'Community | AviationGreeks',
  description: 'Join the AviationGreeks squadron and connect with aviation enthusiasts worldwide.',
};

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#FFFFFF] selection:bg-[#2563EB] selection:text-white pt-24 pb-16 px-6 md:px-12 lg:px-24 font-sans">
      <FadeIn>
        <div className="max-w-4xl mx-auto text-center mt-12 mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
            Join the <span className="text-[#2563EB]">Squadron</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium tracking-wide">
            AviationGreeks is more than a store. It&apos;s a global community of aviation enthusiasts, pilots, and creatives. Join the conversation, share your passion, and stay connected.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {[
            {
              title: "YouTube",
              desc: "Watch 4K plane spotting, reviews, and detailed showcases.",
              href: "https://youtube.com/@AviationGreeks",
              stat: "60K+ Subs",
            },
            {
              title: "Instagram",
              desc: "Daily aviation photography and behind-the-scenes.",
              href: "https://instagram.com/aviationgreeks",
              stat: "5.2K+ Followers",
            },
            {
              title: "X (Twitter)",
              desc: "Real-time aviation news and community discussions.",
              href: "https://x.com/aviationgreeks",
              stat: "Join Discussion",
            },
            {
              title: "Discord",
              desc: "Our official hub. Chat with the crew and talk aviation.",
              href: "https://discord.gg/aviationgreeks",
              stat: "Join Server",
            }
          ].map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-8 rounded-sm bg-[#0a0a0a] border border-[#333333] transition-all duration-300 hover:border-[#2563EB] hover:shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold uppercase tracking-widest text-white group-hover:text-[#2563EB] transition-colors">
                  {social.title}
                </h3>
                <span className="text-xs font-black bg-[#111111] text-[#2563EB] px-3 py-1 rounded-sm border border-[#333333]">
                  {social.stat}
                </span>
              </div>
              <p className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                {social.desc}
              </p>
            </a>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.4}>
        <div className="max-w-3xl mx-auto bg-[#0a0a0a] border border-[#333333] p-10 md:p-14 text-center rounded-sm">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">
            Get The Flight Logs
          </h2>
          <p className="text-gray-400 mb-8 font-medium">
            Join the inner circle. We send exclusive drops, restock alerts, and aviation news directly to your comms.
          </p>
          <NewsletterForm variant="stacked" />
        </div>
      </FadeIn>
    </main>
  );
}
