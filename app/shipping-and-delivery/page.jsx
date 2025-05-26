// pages/shipping-and-delivery.tsx
import Head from 'next/head';

export default function ShippingAndDelivery() {
  return (
    <>
      <Head>
        <title>Shipping & Delivery | Erroneous Gold</title>
        <meta name="description" content="Get details about how Erroneous Gold ships your personalized jewelry." />
      </Head>
      <div className="min-h-screen bg-white text-black px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-c4 mb-8">Shipping & Delivery</h1>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Processing Time</h2>
        <p className="mb-4">
          All personalized products require 3–5 business days for processing before shipment.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Delivery Time</h2>
        <p className="mb-4">
          Standard delivery times are 5–10 business days within India. Delays may occur during peak seasons or due to courier constraints.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Shipping Charges</h2>
        <p className="mb-4">
          Shipping is free across India for all orders. For international shipping, additional charges may apply.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Order Tracking</h2>
        <p className="mb-4">
          Once your order is shipped, you will receive an email with the tracking link. You can also reach out to <a href="mailto:info@erroneousgold.com" className="text-c4 underline">info@erroneousgold.com</a> for updates.
        </p>
      </div>
    </>
  );
}
