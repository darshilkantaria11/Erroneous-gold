import Products from "../nopage/home/Products";

export const metadata = {
  title: "Car Charams – Decorative & Zodiac Charms | Erroneous Gold",
  description:
    "Explore our unique collection of Car Charams at Erroneous Gold. Choose from a variety of decorative and zodiac-inspired charms — perfect for collectors and enthusiasts.",
  keywords: [
    "car charam",
    "decorative charms",
    "zodiac charms",
    "collectible charms",
    "unique car charams",
    "random design charms",
    "gift charms india",
    "Erroneous Gold",
  ],
  openGraph: {
    title: "Car Charams Collection | Erroneous Gold",
    description:
      "Discover stylish Car Charams from Erroneous Gold. Zodiac and decorative charms in a variety of designs — ideal for collecting or gifting.",
    url: "https://erroneousgold.com/carcharam",
    siteName: "Erroneous Gold",
    images: [
      {
        url: "https://erroneousgold.com/open.png",
        width: 1200,
        height: 630,
        alt: "Car Charam – Decorative and Zodiac Charms by Erroneous Gold",
      },
    ],
    locale: "en_IN",
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Decorative & Zodiac Car Charams | Erroneous Gold",
    description:
      "Shop Car Charams from Erroneous Gold — a wide range of decorative and zodiac-inspired charms for collecting or gifting.",
    images: ["https://erroneousgold.com/open.png"],
  },
  alternates: {
    canonical: "https://erroneousgold.com/carcharam",
  },
};

export default function Home() {
  return (
    <>
      <Products category="carcharam" title="Car Charam" />
    </>
  );
}
