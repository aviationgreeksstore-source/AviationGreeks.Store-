import FadeIn from '@/components/ui/FadeIn';
import { Metadata } from 'next';

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, idx) => (
              <FadeIn key={idx} delay={0.1 * (idx + 1)}>
                <div className="group cursor-pointer">
                  <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#333333] group-hover:border-[#2563EB] transition-colors duration-300">
                    {/* Placeholder Thumbnail */}
                    <div className="absolute inset-0 bg-[#111111] group-hover:bg-[#1a1a1a] transition-colors duration-300 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#333333] group-hover:text-[#2563EB] transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <h3 className="text-lg font-bold uppercase tracking-wide group-hover:text-[#2563EB] transition-colors line-clamp-2">
                      Flight Log {idx + 1}: Airborne over the Aegean
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                      AviationGreeks • {12 + idx}K views • {idx + 1} weeks ago
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
