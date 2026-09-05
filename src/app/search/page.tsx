import { searchProducts } from '@/lib/shopify';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { redirect } from 'next/navigation';

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams?.q;

  if (!query) {
    redirect('/');
  }

  const isAFWQuery = /athens|flying|week|afw|tanagra|airshow|lgtg/i.test(query || '');
  let products = await searchProducts(query);

  // If searching for Athens Flying Week / Airshow keywords and specific keyword returns no exact match, fallback to the full curated fleet
  if (isAFWQuery && products.length === 0) {
    products = await searchProducts('');
  }

  const quickTags = [
    { label: "🛩️ Athens Flying Week", query: "Athens Flying Week" },
    { label: "Tanagra Air Base", query: "Tanagra" },
    { label: "Hoodies", query: "Hoodie" },
    { label: "T-Shirts", query: "T-Shirt" },
    { label: "Caps", query: "Cap" },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gray-800 pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Quick Search Tag Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 mr-2">Trending:</span>
          {quickTags.map((tag) => (
            <Link
              key={tag.label}
              href={`/search?q=${encodeURIComponent(tag.query)}`}
              className={`text-xs font-mono px-3 py-1.5 rounded-sm border transition-all ${
                query?.toLowerCase() === tag.query.toLowerCase()
                  ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-bold'
                  : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-white/30'
              }`}
            >
              {tag.label}
            </Link>
          ))}
        </div>

        {/* Athens Flying Week 2026 Special Airshow Feature Banner */}
        {isAFWQuery && (
          <div className="mb-12 p-6 md:p-8 bg-gradient-to-r from-blue-950/50 via-zinc-900 to-amber-950/40 border border-aegean-blue/40 rounded-sm shadow-[0_0_30px_rgba(37,99,235,0.15)] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xs animate-pulse">
                    AFW 2026 LIVE
                  </span>
                  <span className="text-xs font-mono text-emerald-400 tracking-wider">
                    ● TANAGRA AIR BASE (LGTG) // ACTIVE OPERATION
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mt-1">
                  Athens Flying Week Airshow Fleet
                </h1>
                <p className="text-gray-300 text-sm md:text-base mt-2 max-w-2xl font-medium">
                  Official gear for the flight deck and crowd line at Tanagra. Built for pilots, spotters, and aviation enthusiasts.
                </p>
              </div>

              <div className="bg-black/60 border border-amber-400/40 p-4 rounded-sm text-center md:text-right shrink-0">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">Airshow Discount Code</span>
                <span className="text-xl md:text-2xl font-mono font-black text-amber-400 tracking-widest">AFW2026</span>
                <span className="text-[11px] text-emerald-400 block mt-1 font-mono">15% OFF + EU Free Shipping</span>
              </div>
            </div>
          </div>
        )}

        {!isAFWQuery && (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-center uppercase">
              Search Results
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto font-mono text-sm">
              Showing results for &quot;{query}&quot;
            </p>
          </>
        )}
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-8">
            {products.map((product: any, idx: number) => (
              <Link href={`/product/${product.handle}`} key={product.id} className="group cursor-pointer block">
                <div className="aspect-[4/5] bg-neutral-800 rounded-sm mb-4 overflow-hidden relative border border-white/10 group-hover:border-aegean-blue transition-colors">
                  {isAFWQuery && (
                    <div className="absolute top-2 left-2 z-20 bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-xs shadow-md">
                      AFW Airshow Drop
                    </div>
                  )}
                  {product.featuredImage?.url ? (
                    <OptimizedImage 
                      src={product.featuredImage.url} 
                      alt={product.featuredImage.altText || product.title} 
                      fill
                      priority={idx < 4}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 group-hover:scale-105 transition-transform duration-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-neutral-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-base md:text-lg font-bold tracking-tight mb-1 line-clamp-1 group-hover:text-aegean-blue transition-colors uppercase">{product.title}</h3>
                <p className="text-gray-400 font-mono text-sm">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: product.priceRange?.minVariantPrice?.currencyCode || 'USD',
                  }).format(parseFloat(product.priceRange?.minVariantPrice?.amount || '0'))}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-medium tracking-tight text-white mb-2">No results found</h2>
            <p className="text-gray-400">
              We couldn&apos;t find any products matching &quot;{query}&quot;. Try searching for &quot;Athens Flying Week&quot; or check our trending tags.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/search?q=Athens+Flying+Week" className="inline-block bg-amber-400 text-black px-6 py-3 text-sm font-black uppercase tracking-wider hover:bg-amber-300 transition-colors">
                View AFW 2026 Fleet
              </Link>
              <Link href="/collections" className="inline-block bg-white/10 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white/20 transition-colors">
                All Collections
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
