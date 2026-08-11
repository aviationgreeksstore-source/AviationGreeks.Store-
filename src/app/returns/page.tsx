import FadeIn from "@/components/ui/FadeIn";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
      <FadeIn className="max-w-3xl mx-auto prose prose-invert prose-headings:text-white prose-p:text-gray-300">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight sm:text-5xl">Refund policy</h1>
        <div className="space-y-6 text-base leading-relaxed">
          <p>You have the right to return the products you bought and ask for their replacement:</p>
          
          <ul className="list-disc pl-6 space-y-2 text-gray-300 marker:text-gray-500">
            <li>In all cases that with proven fault of aviationgreeks.store they were sold wrongfully products of bad and defective quality (fault in the order, invoicing, consignment, damaged during their transportation or bad packaging) and</li>
            <li>In all cases that there was a problem/ real defect in the product (operation or quality) which the guarantee of the product covers and as long as the guarantee has been given by aviationgreeks.store.</li>
          </ul>
          
          <p>In every case and for all cases mentioned above the maximum time for replacement cannot be extended more than fourteen (14) calendar days, from the day of reception. Furthermore, for all cases the product should be accompanied necessarily by the original proof of purchase. The products which are for replacement - repair should be in the condition that they were received from the client, completed and without wears and their package to be right and in excellent condition. Before of any return it is recommended to communicate with aviationgreeks.store.</p>
          
          <p className="font-semibold text-white mt-8">In every case the return of the product and replacement is feasible under the following conditions:</p>
          
          <ul className="list-disc pl-6 space-y-2 text-gray-300 marker:text-gray-500">
            <li>Communicate the same day or the next working day with the e-shop</li>
            <li>The product has not been used</li>
            <li>The product has all documents needed, which prove the transaction (consignment note, receipt etc.).</li>
          </ul>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <p>The consumer has the right to withdraw without reason within 14 calendar days of receipt of the product in accordance with Law 2551/1994 (as amended by K.Y.A. Z1-891/2013). The refund will be made in the same way as the payment was made. In case they are not returned within 14 days then aviationgreeks.store may not accept any return and replacement. Moreover, the customer is able to cancel their order before their departure from the store. In case you changed your mind the transportation cost will be on you.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
