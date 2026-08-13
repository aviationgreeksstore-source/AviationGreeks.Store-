"use client";

import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function AboutPage() {
  return (
    <div className="relative bg-tarmac text-cloud min-h-screen pt-32 pb-32 selection:bg-aegean-blue selection:text-cloud overflow-hidden z-0">
      
      {/* 1. The Environment (Grid & Depth) */}
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        {/* Subtle Dark Technical Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Faint Dark Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            {/* 2. Technical Framing & Metadata */}
            <motion.div variants={fadeUp} className="mb-8">
              <p className="font-mono text-xs md:text-sm text-emerald-500/70 tracking-widest uppercase inline-block border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 rounded-sm">
                [ DATALINK ACTIVE // ORIGIN: LGAV // CLASSIFICATION: EXECUTIVE ]
              </p>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-balance uppercase text-white">
              Built for Success.
            </motion.h1>
          </motion.div>
        </section>

        {/* Manifesto Copy */}
        <section className="px-6 md:px-12 max-w-3xl mx-auto mt-32 relative">
          
          {/* Corner Brackets / UI Crosshairs */}
          <div className="absolute -top-12 -left-12 w-16 h-16 border-t-2 border-l-2 border-white/10 pointer-events-none hidden md:block" />
          <div className="absolute -top-12 -right-12 w-16 h-16 border-t-2 border-r-2 border-white/10 pointer-events-none hidden md:block" />
          <div className="absolute -bottom-12 -left-12 w-16 h-16 border-b-2 border-l-2 border-white/10 pointer-events-none hidden md:block" />
          <div className="absolute -bottom-12 -right-12 w-16 h-16 border-b-2 border-r-2 border-white/10 pointer-events-none hidden md:block" />

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col gap-y-32 text-lg md:text-xl text-neutral-400 font-light leading-relaxed relative"
          >
            {/* Section 1: Who We Are */}
            <div className="relative">
              {/* Typographic Watermark */}
              <div className="absolute -top-16 -left-8 md:-left-16 text-[10rem] md:text-[14rem] text-white/5 -z-10 font-black tracking-tighter leading-none select-none">
                01
              </div>

              <motion.div variants={fadeUp} className="relative flex flex-col gap-6 pl-8 md:pl-12">
                {/* Glowing Left Border */}
                <motion.div 
                  initial={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                  whileInView={{ borderColor: "rgba(255, 255, 255, 0.6)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-0 top-0 bottom-0 border-l-2"
                />

                <h2 className="text-sm font-bold tracking-widest text-[#E5E5E5] uppercase">Who We Are</h2>
                <p>
                  AviationGreeks is not a souvenir shop. It is a premium syndicate of entrepreneurs, content creators, and aviators, building uncompromising gear for those who demand the best. What began as a pure vision for authentic aviation media has rapidly scaled into a global, highly profitable business movement. Over 90 million views later, we are a highly active network of over 80,000 individuals driven by a relentless pursuit of success. Based in Athens and operating globally, this store is the physical extension of that ambition.
                </p>
              </motion.div>
            </div>

            {/* Section 2: Anastasis Koutsoumparis - Founder & Director */}
            <div className="relative">
              {/* Typographic Watermark */}
              <div className="absolute -top-16 -left-8 md:-left-16 text-[10rem] md:text-[14rem] text-white/5 -z-10 font-black tracking-tighter leading-none select-none">
                02
              </div>

              <motion.div variants={fadeUp} className="relative flex flex-col gap-6 pl-8 md:pl-12">
                {/* Glowing Left Border */}
                <motion.div 
                  initial={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                  whileInView={{ borderColor: "rgba(255, 255, 255, 0.6)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-0 top-0 bottom-0 border-l-2"
                />

                <h2 className="text-sm font-bold tracking-widest text-[#E5E5E5] uppercase">Anastasis Koutsoumparis - Founder & Director</h2>
                <p>
                  Forged from a singular obsession with both aviation and enterprise, the brand is directed by Anastasis Koutsoumparis. As a dedicated entrepreneur and elite content creator, Anastasis drove AviationGreeks from a digital footprint to a physical, revenue-generating reality. We never set out to just build a channel; we set out to build an empire. Fueled by an unapologetic passion for money, business growth, and ultimate success, Anastasis sets an absolute standard for every piece of content and gear. No fluff. No compromises.
                </p>
              </motion.div>
            </div>

            {/* Section 3: Themis - Co-Founder & Collaborator */}
            <div className="relative">
              {/* Typographic Watermark */}
              <div className="absolute -top-16 -left-8 md:-left-16 text-[10rem] md:text-[14rem] text-white/5 -z-10 font-black tracking-tighter leading-none select-none">
                03
              </div>

              <motion.div variants={fadeUp} className="relative flex flex-col gap-6 pl-8 md:pl-12">
                {/* Glowing Left Border */}
                <motion.div 
                  initial={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                  whileInView={{ borderColor: "rgba(255, 255, 255, 0.6)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-0 top-0 bottom-0 border-l-2"
                />

                <h2 className="text-sm font-bold tracking-widest text-[#E5E5E5] uppercase">Themis - Co-Founder & Collaborator</h2>
                <p>
                  The initial foundation for AviationGreeks was built alongside fellow entrepreneur, content creator, and collaborator, Themis. Together, the vision was forged on a relentless dedication to documenting the aviation industry and building a highly successful business. Bonded by a mutual drive for financial success and industry dominance, the mission has always been simple: authentic gear and premium media, built by driven people, for driven people.
                </p>
              </motion.div>
            </div>

          </motion.div>
        </section>
      </div>
    </div>
  );
}
