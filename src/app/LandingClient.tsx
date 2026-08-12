"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe2, ShieldCheck, Award, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import QuickAddButton from "@/components/cart/QuickAddButton";
import { takeoffVariant, hudRevealVariant, approachStaggerContainer } from "@/lib/animations";
import CinematicHero from "@/components/hero/CinematicHero";

export default function LandingClient({ products, shopByCategory }: { products: any[], shopByCategory?: React.ReactNode }) {
  // Map local variants to the new global aviation variants
  const fadeIn = hudRevealVariant;
  const staggerContainer = approachStaggerContainer;

  return (
    <div className="bg-[#000000] text-[#FFFFFF] selection:bg-aegean-blue selection:text-white">
      <CinematicHero />

      {/* Benefit Bar (Risk Reversal) */}
      <section className="border-b border-[#333333] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto py-12 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col items-center text-center space-y-4"
          >
            <Globe2 className="w-10 h-10 text-aegean-blue" />
            <h3 className="text-xl font-bold uppercase tracking-wider">
              Global Shipping
            </h3>
            <p className="text-sm text-gray-400">
              We deliver your gear anywhere on the planet.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col items-center text-center space-y-4"
          >
            <ShieldCheck className="w-10 h-10 text-aegean-blue" />
            <h3 className="text-xl font-bold uppercase tracking-wider">
              Secure Checkout
            </h3>
            <p className="text-sm text-gray-400">
              Your payment information is encrypted and safe.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col items-center text-center space-y-4"
          >
            <Award className="w-10 h-10 text-aegean-blue" />
            <h3 className="text-xl font-bold uppercase tracking-wider">
              Premium Quality
            </h3>
            <p className="text-sm text-gray-400">
              Built to withstand the rigors of the flight deck.
            </p>
          </motion.div>
        </div>
      </section>

      {shopByCategory}

      {/* PFD Horizon Divider */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 0.4, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center w-full py-16 space-y-6 bg-tarmac"
      >
        <div className="flex items-end justify-between w-48 opacity-50">
          <div className="w-16 h-[2px] bg-white relative"><div className="absolute right-0 top-0 h-2 w-[2px] bg-white"></div></div>
          <span className="text-xs font-mono font-bold text-white">10</span>
          <div className="w-16 h-[2px] bg-white relative"><div className="absolute left-0 top-0 h-2 w-[2px] bg-white"></div></div>
        </div>
        <div className="flex items-end justify-between w-32 opacity-70">
          <div className="w-10 h-[2px] bg-white relative"><div className="absolute right-0 top-0 h-2 w-[2px] bg-white"></div></div>
          <span className="text-xs font-mono font-bold text-white">5</span>
          <div className="w-10 h-[2px] bg-white relative"><div className="absolute left-0 top-0 h-2 w-[2px] bg-white"></div></div>
        </div>
        <div className="flex items-center justify-between w-64">
          <div className="w-24 h-[3px] bg-aegean-blue"></div>
          <div className="w-2 h-2 rounded-full bg-flight-amber shadow-[0_0_10px_rgba(255,191,0,0.8)]"></div>
          <div className="w-24 h-[3px] bg-aegean-blue"></div>
        </div>
      </motion.div>

      {/* Featured Products / Scarcity */}
      <section className="py-24 px-8 bg-[#0A0A0A] border-t border-[#333333]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex justify-between items-end mb-16 border-b border-[#333333] pb-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                Limited Drops
              </h2>
              <div className="flex items-center mt-2 space-x-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flight-amber opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-flight-amber"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-flight-amber">
                  Selling Fast
                </span>
              </div>
              <div className="w-24 h-1 bg-aegean-blue mt-4"></div>
            </div>
            <Link
              href="/collections"
              className="hidden md:flex items-center text-sm font-bold uppercase tracking-widest hover:text-aegean-blue transition-colors"
            >
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>

          {products.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12"
            >
              {products.map(({ node }, idx) => (
                <motion.div
                  key={node.id}
                  variants={takeoffVariant}
                >
                  <Link href={`/product/${node.handle}`} className="group cursor-pointer flex flex-col h-full relative">
                    <div className="relative aspect-[4/5] bg-[#111111] mb-6 overflow-hidden rounded-sm border border-[#333333] transition-colors duration-500">
                      
                      {/* HUD Hover Locks */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-transparent group-hover:border-aegean-blue transition-colors duration-300 z-30" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-transparent group-hover:border-aegean-blue transition-colors duration-300 z-30" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-transparent group-hover:border-aegean-blue transition-colors duration-300 z-30" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-transparent group-hover:border-aegean-blue transition-colors duration-300 z-30" />
                      {idx === 0 && (
                        <div className="absolute top-4 left-4 z-20 bg-flight-amber text-black text-xs font-black uppercase tracking-widest px-3 py-1 shadow-lg">
                          Best Seller
                        </div>
                      )}
                      {node.featuredImage?.url ? (
                        <Image
                          src={node.featuredImage.url}
                          alt={node.featuredImage.altText || node.title}
                          fill
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#111111] transition-transform duration-700 group-hover:scale-105">
                          <span className="text-[#333333] text-xs uppercase font-bold tracking-widest">
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <QuickAddButton variantId={node.variants?.edges?.[0]?.node?.id} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wide mb-2 line-clamp-1 group-hover:text-aegean-blue transition-colors">
                      {node.title}
                    </h3>
                    <p className="text-gray-400 font-medium mt-auto">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency:
                          node.priceRange?.minVariantPrice?.currencyCode || "USD",
                      }).format(
                        parseFloat(
                          node.priceRange?.minVariantPrice?.amount || "0"
                        )
                      )}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-500 text-center text-lg py-20 font-medium">
              No products found or unable to connect. Please check your Shopify
              credentials.
            </p>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#000000] border-t border-[#333333] py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div>
            <h4 className="text-2xl font-black uppercase tracking-widest mb-4">
              Join the Squadron
            </h4>
            <p className="text-gray-400 text-sm max-w-md">
              Subscribe for exclusive drops, early access, and flight logs.
            </p>
          </div>
          <NewsletterForm variant="inline" />
        </div>
      </section>
    </div>
  );
}
