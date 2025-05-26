// pages/terms-and-conditions.tsx
import Head from 'next/head';

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms and Conditions | Erroneous Gold</title>
        <meta name="description" content="Terms and conditions for using Erroneous Gold's services." />
      </Head>
      <div className="min-h-screen bg-white text-black px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-c4 mb-8">Terms and Conditions</h1>

        <p className="mb-4">
          Welcome to <strong>ERRONEOUS GOLD PRIVATE LIMITED</strong>. By accessing our website at <a href="https://erroneousgold.com" className="text-c4 underline">erroneousgold.com</a>, you agree to be bound by these Terms and Conditions.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Use of Website</h2>
        <p className="mb-4">
          You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the site.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Product Information</h2>
        <p className="mb-4">
          All products are custom made based on your input. We strive for accuracy in product visuals, but slight variations may occur.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Pricing & Payment</h2>
        <p className="mb-4">
          Prices are listed in INR. We reserve the right to update prices at any time. Payments are processed securely via third-party gateways.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Intellectual Property</h2>
        <p className="mb-4">
          All content, designs, and images are the property of ERRONEOUS GOLD PRIVATE LIMITED and protected by copyright laws.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Contact</h2>
        <p>
          For any queries, reach out to us at <a href="mailto:info@erroneousgold.com" className="text-c4 underline">info@erroneousgold.com</a>.
        </p>
      </div>
    </>
  );
}
