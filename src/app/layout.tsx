import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { CartProvider } from "@/components/cart/CartContext";
import SlideOutCart from "@/components/cart/SlideOutCart";
import AcarsAddToCartModal from "@/components/cart/AcarsAddToCartModal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import LiveMetar from "@/components/layout/LiveMetar";
import NewsletterFlyout from "@/components/newsletter/NewsletterFlyout";
import SmoothScroll from "@/components/layout/SmoothScroll";
import AltimeterScrollbar from "@/components/layout/AltimeterScrollbar";
import { GoogleAnalytics } from "@next/third-parties/google";

export const revalidate = 60; // Revalidate all pages every 60 seconds

export const metadata: Metadata = {
  metadataBase: new URL("https://aviationgreeks-store.web.app"),
  title: "AviationGreeks | Gear for people who actually fly.",
  description: "Aviation merchandise built by aviation people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-tarmac text-cloud antialiased md:pr-16`} suppressHydrationWarning>
        <SmoothScroll>
          <CartProvider>
            <AnnouncementBar />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <SlideOutCart />
            <AcarsAddToCartModal />
            <NewsletterFlyout />
            <AltimeterScrollbar />
          </CartProvider>
        </SmoothScroll>
      </body>
      <GoogleAnalytics gaId="G-BR4DTR1SFX" />
    </html>
  );
}
