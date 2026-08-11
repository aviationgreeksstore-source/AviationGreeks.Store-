import FadeIn from "@/components/ui/FadeIn";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
      <FadeIn className="max-w-3xl mx-auto prose prose-invert prose-headings:text-white prose-p:text-gray-300">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight sm:text-5xl">Terms of Service</h1>
        <div className="space-y-8 text-base leading-relaxed">
          
          <div>
            <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using aviationgreeks.store (&quot;the Website&quot;), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the Website or use any services provided.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">2. User Responsibilities & Terms of Use</h2>
            <p>When using our Website, you agree to provide accurate, current, and complete information during the purchase process. You are responsible for maintaining the confidentiality of your account and password, and you agree to accept responsibility for all activities that occur under your account. You must not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">3. Intellectual Property</h2>
            <p>All content included on this Website, such as text, graphics, logos, images, designs, and media, is the exclusive property of AviationGreeks and protected by international copyright laws. AviationGreeks retains all intellectual property rights to its media, designs, products, and branding. You may not extract, reproduce, duplicate, copy, sell, resell or exploit any portion of the Website or its content without our express written consent.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">4. Products and Pricing</h2>
            <p>We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time. Prices for our products are subject to change without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">5. Governing Law</h2>
            <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Greece. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Greece.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">6. Contact Information</h2>
            <p>Questions about the Terms of Service should be sent to us at <a href="mailto:aviationgreeks@gmail.com" className="text-[#2563EB] hover:text-[#3b82f6] hover:underline transition-colors duration-200">aviationgreeks@gmail.com</a>.</p>
          </div>

        </div>
      </FadeIn>
    </div>
  );
}
