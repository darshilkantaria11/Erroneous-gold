import Home1 from "./nopage/home/home1a"
import Home6 from "./nopage/home/home1b"

import Products from "./nopage/home/Products"

export default function Home() {
  return (
    <>
      <Home1 />
      <Home6 />
      <Products
        category="singlenamenecklace"
        title="Single Name Necklaces"
      />
      <Products
        category="rakhi"
        title="Rakhi"
      />

      <Products
        category="couplenamenecklace"
        title="Couple Name Necklaces"
      />
      <Products
        category="keychain"
        title="Keychains"
      />
      <Products
        category="carcharam"
        title="Car Charam"
      />

    </>
  )
}
