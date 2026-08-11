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
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

export const metadata: Metadata = {
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
      <body className={`${geistSans.variable} ${geistMono.variable} bg-tarmac text-cloud antialiased`} suppressHydrationWarning>
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <SlideOutCart />
        </CartProvider>
      </body>
    </html>
  );
}
