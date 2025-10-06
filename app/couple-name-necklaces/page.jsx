import Products from "../nopage/home/Products";

export const metadata = {
  title: "Couple Name Necklaces – Personalized Couple Jewelry & Gifts | Erroneous Gold",
  description:
    "Celebrate love with our Couple Name Necklaces at Erroneous Gold. Customize your necklace with both names and make it a timeless symbol of connection and togetherness.",
  keywords: [
    "couple name necklace",
    "personalized couple necklace",
    "custom name jewelry",
    "name pendant for couples",
    "relationship jewelry",
    "gift for couples",
    "custom necklace india",
    "couple jewelry gift",
    "erroneous gold",
  ],
  openGraph: {
    title: "Personalized Couple Name Necklaces | Erroneous Gold",
    description:
      "Design your Couple Name Necklace with Erroneous Gold. A personalized jewelry piece that celebrates love, connection, and meaningful moments.",
    url: "https://erroneousgold.com/couplenamenecklace",
    siteName: "Erroneous Gold",
    images: [
      {
        url: "https://erroneousgold.com/open.png",
        width: 1200,
        height: 630,
        alt: "Couple Name Necklace – Personalized Jewelry by Erroneous Gold",
      },
    ],
    locale: "en_IN",
    type: "product",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Couple Name Necklaces | Erroneous Gold",
    description:
      "Create your personalized Couple Name Necklace – the perfect symbol of love and togetherness. Handcrafted with care by Erroneous Gold.",
    images: ["https://erroneousgold.com/open.png"],
  },
  alternates: {
    canonical: "https://erroneousgold.com/couplenamenecklace",
  },
};

export default function Home() {
  return (
    <>
      <Products
        category="couplenamenecklace"
        title="Couple Name Necklaces"
      />
    </>
  );
}
