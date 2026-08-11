import { searchProducts } from '@/lib/shopify';
import Link from 'next/link';
import Image from 'next/image';
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gray-800 pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-center uppercase">
          Search Results
        </h1>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Showing results for &quot;{query}&quot;
        </p>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-8">
            {products.map((product: any) => (
              <Link href={`/product/${product.handle}`} key={product.id} className="group cursor-pointer block">
                <div className="aspect-[4/5] bg-neutral-800 rounded-sm mb-4 overflow-hidden relative">
                  {product.featuredImage?.url ? (
                    <Image 
                      src={product.featuredImage.url} 
                      alt={product.featuredImage.altText || product.title} 
                      fill
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
                <h3 className="text-lg font-medium tracking-tight mb-1">{product.title}</h3>
                <p className="text-gray-400">
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
              We couldn&apos;t find any products matching &quot;{query}&quot;. Try checking your spelling or using more general terms.
            </p>
            <div className="mt-8">
              <Link href="/collections" className="inline-block bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
