import FadeIn from '@/components/ui/FadeIn';
import { Metadata } from 'next';
import { Suspense } from 'react';
import FlightLogsFeed from '@/components/media/FlightLogsFeed';

export const metadata: Metadata = {
  title: 'Media | AviationGreeks',
  description: 'Connect with the AviationGreeks crew across all our platforms.',
};

export default async function MediaPage() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  let featuredVideoId = null;

  if (apiKey && channelId) {
    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&order=date&maxResults=50&type=video`,
        { next: { revalidate: 3600 } }
      );
      
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        
        if (searchData.items && searchData.items.length > 0) {
          const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
          
          // 2. Fetch video details to get duration
          const videoRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=contentDetails`,
            { next: { revalidate: 3600 } }
          );

          if (videoRes.ok) {
            const videoData = await videoRes.json();
            
            // 3. Find the first video that is strictly longer than 60 seconds
            const longFormVideo = videoData.items.find((item: any) => {
              const duration = item.contentDetails.duration || '';
              // Simple ISO 8601 duration check for > 60s
              if (duration.includes('H')) return true;
              const matchM = duration.match(/(\d+)M/);
              if (matchM) {
                const mins = parseInt(matchM[1]);
                if (mins > 1) return true;
                if (mins === 1) {
                  const matchS = duration.match(/(\d+)S/);
                  if (matchS && parseInt(matchS[1]) > 0) return true;
                  return false;
                }
              }
              return false;
            });

            if (longFormVideo) {
              featuredVideoId = longFormVideo.id;
            } else {
              featuredVideoId = searchData.items[0].id.videoId;
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch featured video:', e);
    }
  }

  const videoSrc = featuredVideoId 
    ? `https://www.youtube.com/embed/${featuredVideoId}?autoplay=0&rel=0&modestbranding=1`
    : `https://www.youtube.com/embed?listType=playlist&list=UUk02Q4w9FfAxrQZ1Rz7ThXA&autoplay=0&rel=0&modestbranding=1`;

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
                src={videoSrc}
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
