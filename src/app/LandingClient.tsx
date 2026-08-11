"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe2, ShieldCheck, Award, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import QuickAddButton from "@/components/cart/QuickAddButton";

export default function LandingClient({ products }: { products: any[] }) {
  // Framer Motion variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-[#000000] text-[#FFFFFF] selection:bg-[#2563EB] selection:text-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#333333]">
        {/* Background Image */}
        <Image
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2000&auto=format&fit=crop"
          alt="Aviation background"
          fill
          priority
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        <motion.div
          className="relative z-20 text-center max-w-4xl px-4 flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white"
          >
            Gear for people <br />
            who actually <br />
            <span className="text-[#2563EB]">
              fly.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl lg:text-2xl text-gray-300 font-medium tracking-wide max-w-2xl mx-auto"
          >
            Premium gear designed for the modern aviator.
            <br className="hidden md:block" /> Engineered for the flight deck, built for the tarmac.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8"
          >
            <Link href="/collections">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-[#2563EB] text-white text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-colors rounded-sm shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                Shop the Fleet
              </motion.button>
            </Link>
            <Link href="/media">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-transparent border-2 border-white text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm"
              >
                Watch Our Channel
              </motion.button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={fadeIn}
            className="mt-12 flex flex-col items-center space-y-2"
          >
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#2563EB] fill-[#2563EB]" />
              ))}
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-300">
              Trusted by 10,000+ Pilots Worldwide
            </p>
          </motion.div>
        </motion.div>
      </section>

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
            <Globe2 className="w-10 h-10 text-[#2563EB]" />
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
            <ShieldCheck className="w-10 h-10 text-[#2563EB]" />
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
            <Award className="w-10 h-10 text-[#2563EB]" />
            <h3 className="text-xl font-bold uppercase tracking-wider">
              Premium Quality
            </h3>
            <p className="text-sm text-gray-400">
              Built to withstand the rigors of the flight deck.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Navigator (Paradox of Choice) */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Shop by Category
          </h2>
          <div className="w-24 h-1 bg-[#2563EB] mx-auto mt-6"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Apparel",
              image:
                "https://images.unsplash.com/photo-1529336953128-a85760f58cb5?q=80&w=2070&auto=format&fit=crop",
              href: "/collections/apparel",
            },
            {
              title: "Accessories",
              image:
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
              href: "/collections/accessories",
            },
            {
              title: "Headwear",
              image:
                "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=2036&auto=format&fit=crop",
              href: "/collections/headwear",
            },
          ].map((cat, idx) => (
            <Link href={cat.href} key={idx}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                whileHover="hover"
                className="relative aspect-square overflow-hidden rounded-sm cursor-pointer group h-full"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <h3 className="text-3xl font-black uppercase tracking-widest text-white mb-4">
                    {cat.title}
                  </h3>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    variants={{
                      hover: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                    className="flex items-center text-sm font-bold uppercase tracking-wider text-[#2563EB]"
                  >
                    Explore <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2563EB]"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                  Selling Fast
                </span>
              </div>
              <div className="w-24 h-1 bg-[#2563EB] mt-4"></div>
            </div>
            <Link
              href="/collections"
              className="hidden md:flex items-center text-sm font-bold uppercase tracking-widest hover:text-[#2563EB] transition-colors"
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
            >
              {products.map(({ node }, idx) => (
                <motion.div
                  key={node.id}
                  variants={fadeIn}
                >
                  <Link href={`/product/${node.handle}`} className="group cursor-pointer flex flex-col h-full">
                    <div className="relative aspect-[4/5] bg-[#111111] mb-6 overflow-hidden rounded-sm border border-[#333333] hover:border-[#2563EB] transition-colors duration-500">
                      {idx === 0 && (
                        <div className="absolute top-4 left-4 z-20 bg-[#2563EB] text-white text-xs font-black uppercase tracking-widest px-3 py-1 shadow-lg">
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
                    <h3 className="text-lg font-bold uppercase tracking-wide mb-2 line-clamp-1 group-hover:text-[#2563EB] transition-colors">
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
