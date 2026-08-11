import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/lib/shopify";

export default async function ShopByCategory() {
  // Fetch collections dynamically
  const allCollections = await getCollections();
  
  // Slice to max 4 collections
  const collections = allCollections.slice(0, 4);

  return (
    <section className="py-24 border-t border-neutral-900 bg-black">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-3xl font-bold mb-12 text-center text-white uppercase tracking-wide">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              href={`/search/${collection.handle}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-sm border border-transparent hover:border-white/20 transition-colors duration-500 bg-neutral-900"
            >
              {collection.image?.url ? (
                <Image
                  src={collection.image.url}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-[#111111]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full p-6">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {collection.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
