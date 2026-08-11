import { getProductRecommendations } from '@/lib/shopify';
import Link from 'next/link';
import Image from 'next/image';

export default async function ProductRecommendations({ productId }: { productId: string }) {
  let products: any[] = [];
  try {
    products = await getProductRecommendations(productId);
  } catch (error) {
    console.error('Failed to fetch product recommendations:', error);
  }

  if (!products || products.length === 0) {
    return null;
  }

  // Optionally limit the number of recommendations
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-24 border-t border-neutral-900">
      <h2 className="text-3xl font-bold mb-12 text-center uppercase tracking-wide">You Might Also Like</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayProducts.map((product) => (
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
    </section>
  );
}
