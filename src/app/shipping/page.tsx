import FadeIn from "@/components/ui/FadeIn";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
      <FadeIn className="max-w-3xl mx-auto prose prose-invert prose-headings:text-white prose-p:text-gray-300">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight sm:text-5xl">Shipping policy</h1>
        <div className="space-y-8 text-base leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold mb-3">Shipping to Greece</h2>
            <p>aviationgreeks.store is cooperating with courier companies ACS and ELTA Courier to assure the instant delivery of your products, everywhere in Greece. All products are shipped usually at the next working day, if they are in stock and the shipping costs is: To everywhere in Greece: 5,00 € VAT included. In case that your order is too heavy or the shipping address is hard to reach for the transportation companies, we will contact you to inform you about the final shipping cost.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">Shipping to other countries</h2>
            <p>To other countries, the payment is realized through the use of credit, debit or prepaid card, or bank deposit. The charge of the shipping costs for orders towards other countries is formed according to the catalogue of the DHL courier company. For orders weighing up to 3kgs the shipping cost for countries of the European Union amounts to 25,00€. Shipping to Cyprus take place through the Easy Courier company with the cost of 13,00€ for orders weighing up to 3kgs within 5-7 working days. In case the total weight is larger than 3kgs the store will contact the customer for the final shipping cost.</p>
          </div>
          
          <div className="p-6 bg-[#0A0A0A] rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-2">Receipt from our eshop</h2>
            <p className="mb-0">Filiaton 73, Ilion 13123, tel: <a href="tel:6980056105" className="text-[#2563EB] hover:text-[#3b82f6] hover:underline transition-colors duration-200">6980056105</a></p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
