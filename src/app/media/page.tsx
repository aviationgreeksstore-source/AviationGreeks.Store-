import FadeIn from '@/components/ui/FadeIn';
import { Metadata } from 'next';
import { Suspense } from 'react';
import FlightLogsFeed from '@/components/media/FlightLogsFeed';

export const metadata: Metadata = {
  title: 'Media | AviationGreeks',
  description: 'Connect with the AviationGreeks crew across all our platforms.',
};

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#FFFFFF] pt-32 pb-24 px-6 md:px-12 lg:px-24 font-sans selection:bg-[#2563EB] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Header Section */}
        <section className="text-center space-y-6">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none">
              AviationGreeks <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#2563EB]">Media</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto tracking-wide font-light">
              Experience the world of aviation through our lens. Cinematic plane spotting, exclusive reviews, and the latest news across our network.
            </p>
          </FadeIn>
        </section>

        {/* Active Video Embed */}
        <section>
          <FadeIn delay={0.2}>
            <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] group">
              <iframe
                className="absolute top-0 left-0 w-full h-full scale-[1.01] transition-transform duration-700 group-hover:scale-100"
                src="https://www.youtube.com/embed/?listType=user_uploads&list=AviationGreeks&autoplay=0&rel=0&modestbranding=1"
                title="AviationGreeks Featured Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              {/* Optional glowing effect around the embed on hover */}
              <div className="absolute inset-0 border-[2px] border-transparent group-hover:border-[#2563EB]/30 rounded-[2rem] transition-colors duration-500 pointer-events-none" />
            </div>
          </FadeIn>
        </section>

        {/* Video Grid */}
        <section>
          <FadeIn delay={0.3}>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-8 uppercase">
              Latest Dispatches
            </h2>
          </FadeIn>

          <Suspense fallback={<div className="animate-pulse h-64 bg-[#0a0a0a] rounded-xl border border-[#333333]"></div>}>
            <FlightLogsFeed />
          </Suspense>
        </section>

      </div>
    </main>
  );
}
