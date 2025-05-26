// pages/cancellation-and-refund.tsx
import Head from 'next/head';

export default function CancellationAndRefund() {
  return (
    <>
      <Head>
        <title>Cancellation & Refund | Erroneous Gold</title>
        <meta name="description" content="Learn about our cancellation and refund policies at Erroneous Gold." />
      </Head>
      <div className="min-h-screen bg-white text-black px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-c4 mb-8">Cancellation & Refund Policy</h1>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Order Cancellation</h2>
        <p className="mb-4">
          Since our products are personalized and made to order, cancellations are only accepted within 2 hours of placing the order.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Refunds</h2>
        <p className="mb-4">
          Due to the custom nature of our items, refunds are only provided if:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>The item is damaged upon arrival</li>
          <li>The wrong product was delivered</li>
        </ul>

        <p className="mb-4">
          In such cases, please email us within 48 hours of delivery with images at <a href="mailto:info@erroneousgold.com" className="text-c4 underline">info@erroneousgold.com</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Non-refundable Situations</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Change of mind after the 2-hour cancellation window</li>
          <li>Incorrect name or spelling provided by the customer</li>
        </ul>
      </div>
    </>
  );
}
