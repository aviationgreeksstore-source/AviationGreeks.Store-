import { getCollections } from '@/lib/shopify';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gray-800 pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12 text-center uppercase">
          Collections
        </h1>
        
        {collections.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 md:gap-8">
            {collections.map((collection, idx) => (
              <Link href={`/collections/${collection.handle}`} key={collection.id} className="group cursor-pointer block">
                <div className="aspect-square bg-neutral-800 rounded-sm mb-4 overflow-hidden relative">
                  {collection.image?.url ? (
                    <OptimizedImage 
                      src={collection.image.url} 
                      alt={collection.image.altText || collection.title}
                      fill
                      priority={idx < 4}
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 group-hover:scale-105 transition-transform duration-500">
                      <span className="text-neutral-500 text-lg uppercase tracking-wider">{collection.title}</span>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2 uppercase">{collection.title}</h2>
                {collection.description && (
                  <p className="text-gray-400 line-clamp-2">{collection.description}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">No collections found.</p>
        )}
      </div>
    </div>
  );
}
