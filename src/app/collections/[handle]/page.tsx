import { getCollection } from '@/lib/shopify';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: { handle: string } }) {
  const collection = await getCollection(params.handle);

  if (!collection) {
    return notFound();
  }

  const products = collection.products?.edges || [];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gray-800 pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-center uppercase">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            {collection.description}
          </p>
        )}
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 md:gap-8">
            {products.map(({ node }: any) => (
              <Link href={`/product/${node.handle}`} key={node.id} className="group cursor-pointer block">
                <div className="aspect-[4/5] bg-neutral-800 rounded-sm mb-4 overflow-hidden relative">
                  {node.featuredImage?.url ? (
                    <Image 
                      src={node.featuredImage.url} 
                      alt={node.featuredImage.altText || node.title} 
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
                <h3 className="text-lg font-medium tracking-tight mb-1">{node.title}</h3>
                <p className="text-gray-400">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: node.priceRange?.minVariantPrice?.currencyCode || 'USD',
                  }).format(parseFloat(node.priceRange?.minVariantPrice?.amount || '0'))}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">No products found in this collection.</p>
        )}
      </div>
    </div>
  );
}
