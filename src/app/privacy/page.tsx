import FadeIn from "@/components/ui/FadeIn";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
      <FadeIn className="max-w-3xl mx-auto prose prose-invert prose-headings:text-white prose-p:text-gray-300">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy policy</h1>
        <div className="space-y-6 text-base leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold mb-3">What we collect</h2>
            <p>We may collect the following information: Name, Contact information including email address, Demographic information such as postcode, preferences and interests, Other information relevant to customer surveys and/or offers.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">What we do with the information we gather</h2>
            <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons: Internal record keeping. We may use the information to improve our products and services. We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided. From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customize the website according to your interests.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">Security</h2>
            <p>We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">How we use cookies</h2>
            <p>A cookie is a small file which asks permission to be placed on your computer&apos;s hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. We use traffic log cookies to identify which pages are being used. This helps us analyze data about web page traffic and improve our website. Overall, cookies help us provide you with a better website. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">Links to other websites</h2>
            <p>Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">Controlling your personal information</h2>
            <p>You may choose to restrict the collection or use of your personal information. If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at <a href="mailto:aviationgreeks@gmail.com" className="text-[#2563EB] hover:text-[#3b82f6] hover:underline transition-colors duration-200">aviationgreeks@gmail.com</a>. We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
