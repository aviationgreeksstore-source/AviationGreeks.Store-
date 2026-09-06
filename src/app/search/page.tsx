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

  const products = await searchProducts(query);

  const quickTags = [
    { label: "Flight Gear", query: "Flight" },
    { label: "Hoodies", query: "Hoodie" },
    { label: "T-Shirts", query: "T-Shirt" },
    { label: "Caps", query: "Cap" },
    { label: "Squadron", query: "Squadron" },
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
                  ? 'border-aegean-blue bg-aegean-blue/10 text-sky-300 font-bold'
                  : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-white/30'
              }`}
            >
              {tag.label}
            </Link>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-center uppercase">
          Search Results
        </h1>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto font-mono text-sm">
          Showing results for &quot;{query}&quot;
        </p>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-8">
            {products.map((product: any, idx: number) => (
              <Link href={`/product/${product.handle}`} key={product.id} className="group cursor-pointer block">
                <div className="aspect-[4/5] bg-neutral-800 rounded-sm mb-4 overflow-hidden relative border border-white/10 group-hover:border-aegean-blue transition-colors">
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
            <p className="text-gray-400 max-w-md mx-auto">
              We couldn&apos;t find any products matching &quot;{query}&quot;. Try checking your spelling or using more general terms.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/collections" className="inline-block bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                Explore All Fleet
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
