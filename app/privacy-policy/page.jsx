// pages/privacy-policy.tsx
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Erroneous Gold</title>
        <meta name="description" content="Read the privacy policy for ERRONEOUS GOLD PRIVATE LIMITED." />
      </Head>
      <div className="min-h-screen bg-white text-black px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-c4 mb-8">Privacy Policy</h1>

        <p className="mb-4">
          At <strong>ERRONEOUS GOLD PRIVATE LIMITED</strong>, accessible from <a href="https://erroneousgold.com" className="text-c4 underline">erroneousgold.com</a>,
          one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected
          and recorded by ERRONEOUS GOLD and how we use it.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <p className="mb-4">
          We collect personal information you provide such as your name, email address, shipping address, and payment information.
          This information is used to fulfill your orders and provide customer service.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-4">
          <li>To process and fulfill your orders</li>
          <li>To communicate with you, including updates and support</li>
          <li>To improve our website and services</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Cookies</h2>
        <p className="mb-4">
          Our website uses cookies to enhance your experience. By using our website, you consent to the use of cookies in accordance with our policy.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Third-Party Services</h2>
        <p className="mb-4">
          We may use third-party services (like payment gateways or analytics providers) that collect information under their own privacy policies.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Your Rights</h2>
        <p className="mb-4">
          You have the right to access, modify, or delete your personal data. To do so, please contact us at <a href="mailto:info@erroneousgold.com" className="text-c4 underline">info@erroneousgold.com</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this privacy policy from time to time. We encourage you to review this page periodically for any changes.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p>
          If you have any questions about our Privacy Policy, please contact us at <a href="mailto:info@erroneousgold.com" className="text-c4 underline">info@erroneousgold.com</a>.
        </p>
      </div>
    </>
  );
}
