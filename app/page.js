import Home1 from "./nopage/home/home1a"
import Home2 from "./nopage/home/home2"
import Home3 from "./nopage/home/home3"
import Home4 from "./nopage/home/home4"
import Home5 from "./nopage/home/home5"
import Products from "./nopage/home/Products"

export default function Home() {
  return (
   <>
   <Home1/>
   {/* <Home2/> */}
   {/* <Home4/>
   <Home3/>
   <Home5/> */}
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

   </>
  )
}
