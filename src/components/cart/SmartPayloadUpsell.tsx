'use client';

import { useEffect, useState } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/cart/CartContext';
import { fetchAIRecommendation } from './upsell-actions';

export default function SmartPayloadUpsell() {
  const { cart, addToCart } = useCart();
  
  const [recommendedProduct, setRecommendedProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [secured, setSecured] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    async function loadMatch() {
      // Get the most recently added item (assuming the first item in the lines edges array)
      const latestItem = cart?.lines?.edges?.[0]?.node;
      if (!latestItem) {
        setLoading(false);
        return;
      }

      const productId = latestItem.merchandise?.product?.id;
      if (!productId) {
        setLoading(false);
        return;
      }
      
      const productMatch = await fetchAIRecommendation(productId);
      
      setRecommendedProduct(productMatch);
      setLoading(false);
    }

    if (cart?.lines?.edges?.length) {
      loadMatch();
    } else {
      setVisible(false);
    }
  }, [cart]);

  const handleAddToManifest = async () => {
    if (!recommendedProduct) return;
    
    setAdding(true);
    const variantId = recommendedProduct.variants?.edges?.[0]?.node?.id;
    
    if (variantId) {
      await addToCart(variantId, 1, {
        title: recommendedProduct.title,
        price: recommendedProduct.priceRange?.minVariantPrice?.amount
      });
      
      setAdding(false);
      setSecured(true);
      
      // Flash the success state briefly, then collapse the component
      setTimeout(() => {
        setVisible(false);
      }, 1500);
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
          className="mt-4 mb-4 mx-6"
        >
          {loading ? (
            /* LOADING STATE */
            <div className="relative overflow-hidden bg-zinc-950 border border-zinc-800 p-4 rounded-sm flex items-center justify-center">
              {/* Sweeping Scanner Line */}
              <motion.div 
                className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent border-t border-emerald-500/50"
                initial={{ top: '-100%' }}
                animate={{ top: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              <span className="font-mono text-xs text-emerald-500/70 tracking-widest uppercase z-10 animate-pulse">
                [ SYSTEM COMPUTING PAYLOAD MATCH... ]
              </span>
            </div>
          ) : recommendedProduct && !secured ? (
            /* LOADED STATE */
            <div className="bg-zinc-950 border border-emerald-500/30 rounded-sm overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              {/* Tactical Header */}
              <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-3 py-1.5 flex items-center">
                <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse mr-2" />
                <span className="font-mono text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
                  [ AI LOADMASTER // SUGGESTED ADDITION ]
                </span>
              </div>
              
              <div className="p-3 flex gap-4 items-center">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 bg-zinc-900 border border-zinc-800 flex-shrink-0">
                  {recommendedProduct.featuredImage?.url && (
                    <OptimizedImage 
                      src={recommendedProduct.featuredImage.url} 
                      alt={recommendedProduct.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Info & CTA */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-zinc-100 text-sm font-semibold truncate">
                      {recommendedProduct.title}
                    </h4>
                    <p className="font-mono text-emerald-500 text-xs mt-1">
                      {recommendedProduct.priceRange?.minVariantPrice?.currencyCode === 'EUR' ? '€' : '$'}{recommendedProduct.priceRange?.minVariantPrice?.amount}
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleAddToManifest}
                    disabled={adding}
                    className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold uppercase tracking-wider text-[10px] py-2 px-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {adding ? 'PROCESSING...' : '[ + ADD TO MANIFEST ]'}
                  </button>
                </div>
              </div>
            </div>
          ) : secured ? (
            /* SUCCESS STATE */
            <motion.div 
              initial={{ backgroundColor: 'rgba(24, 24, 27, 1)' }}
              animate={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
              className="border border-emerald-500 bg-emerald-950/50 p-4 rounded-sm flex items-center justify-center"
            >
              <span className="font-mono text-sm text-emerald-400 font-bold tracking-widest uppercase">
                [ PAYLOAD SECURED ]
              </span>
            </motion.div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
