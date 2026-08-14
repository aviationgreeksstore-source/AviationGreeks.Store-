import React from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import FadeIn from '@/components/ui/FadeIn';

interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

interface YouTubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: YouTubeThumbnail;
    medium: YouTubeThumbnail;
    high: YouTubeThumbnail;
  };
  channelTitle: string;
  liveBroadcastContent: string;
}

interface YouTubeSearchResult {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: YouTubeSnippet;
}

interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeSearchResult[];
}



export default async function FlightLogsFeed() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  let videos: { id: string; title: string; thumbnail: string; publishedAt: string }[] = [];
  let usingFallback = false;

  if (!apiKey || !channelId) {
    usingFallback = true;
  } else {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6&type=video`,
        { next: { revalidate: 3600 } }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch from YouTube');
      }

      const data: YouTubeSearchResponse = await res.json();
      
      if (data.items && data.items.length > 0) {
        videos = data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          publishedAt: item.snippet.publishedAt,
        }));
      } else {
        usingFallback = true;
      }
    } catch (error) {
      console.error('YouTube API Error:', error);
      usingFallback = true;
    }
  }

  const formatTimecode = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().replace('T', ' ').substring(0, 19) + 'Z';
  };

  return (
    <div className="space-y-8">
      {usingFallback && (
        <div className="bg-[#111111] border border-flight-amber/30 text-flight-amber p-6 rounded-md text-sm font-mono flex flex-col items-center justify-center gap-2 text-center w-full">
          <span className="animate-pulse">●</span>
          <span>[ NEW FLIGHT LOGS STREAMING SOON ]</span>
          <span className="text-xs opacity-70">Awaiting telemetry datalink</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {videos.map((video, idx) => (
          <FadeIn key={video.id} delay={0.1 * (idx + 1)}>
            <a 
              href={usingFallback ? '#' : `https://www.youtube.com/watch?v=${video.id}`}
              target={usingFallback ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="group block cursor-pointer"
            >
              <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#333333] group-hover:border-[#2563EB] transition-colors duration-300">
                {/* Image */}
                <OptimizedImage 
                  src={video.thumbnail} 
                  alt={video.title} 
                  fill 
                  priority={idx < 2}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Spotter's Lens Aesthetic Overlay */}
                <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 group-hover:border-[#2563EB]/50 transition-colors duration-500 rounded-xl z-10" />
                
                {/* Timecode & REC Dot */}
                <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between z-20">
                  <div className="flex justify-between items-start w-full">
                    <span className="font-mono text-[10px] text-white/90 bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 shadow-lg">
                      TCO: {formatTimecode(video.publishedAt)}
                    </span>
                    <span className="flex items-center space-x-2 bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-red-500/30 shadow-lg">
                      <span className="animate-pulse h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                      <span className="font-mono text-[10px] text-red-500 font-bold tracking-widest">REC</span>
                    </span>
                  </div>
                  
                  {/* Viewfinder brackets */}
                  <div className="absolute inset-0 m-4 pointer-events-none">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-white/40 group-hover:border-[#2563EB]/80 transition-colors" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-white/40 group-hover:border-[#2563EB]/80 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-white/40 group-hover:border-[#2563EB]/80 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-white/40 group-hover:border-[#2563EB]/80 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="text-lg font-bold uppercase tracking-wide group-hover:text-[#2563EB] transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: video.title }} />
                <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                  AviationGreeks • Log {idx + 1}
                </p>
              </div>
            </a>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
