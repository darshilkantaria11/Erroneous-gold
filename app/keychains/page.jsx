import Products from "../nopage/home/Products";

export const metadata = {
  title: "Keychains – Stylish & Decorative Accessories | Erroneous Gold",
  description:
    "Browse our collection of Keychains at Erroneous Gold. Choose from a variety of stylish and decorative keychains — perfect for everyday use or gifting.",
  keywords: [
    "keychains",
    "decorative keychains",
    "stylish keychains",
    "accessory keychains",
    "gift keychains",
    "fashion keychains",
    "collectible keychains",
    "Erroneous Gold",
  ],
  openGraph: {
    title: "Keychains Collection | Erroneous Gold",
    description:
      "Explore stylish and decorative Keychains from Erroneous Gold. Perfect for accessorizing your keys or gifting to someone special.",
    url: "https://erroneousgold.com/keychain",
    siteName: "Erroneous Gold",
    images: [
      {
        url: "https://erroneousgold.com/open.png",
        width: 1200,
        height: 630,
        alt: "Keychains – Decorative and Stylish Accessories by Erroneous Gold",
      },
    ],
    locale: "en_IN",
    type: "product.group",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keychains – Stylish & Decorative Accessories | Erroneous Gold",
    description:
      "Shop stylish and decorative Keychains from Erroneous Gold — ideal for personal use or gifting.",
    images: ["https://erroneousgold.com/open.png"],
  },
  alternates: {
    canonical: "https://erroneousgold.com/keychain",
  },
};

export default function Home() {
  return (
    <>
      <Products category="keychain" title="Keychains" />
    </>
  );
}
