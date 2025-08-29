import { Metadata } from "next"

// import { getCollectionsList, getProductsList } from "@/lib/data"
// import FeaturedProducts from "@/modules/home/components/featured-products"
// import Hero from "@/modules/home/components/hero"
// import { getRegion } from "@/app/actions"
import { StoreProduct } from "@medusajs/types"

export const metadata: Metadata = {
  title: "Medusa Next.js",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

export default async function Home({ 
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  // const { collections, count } = await getCollectionsList(0, 3)
  // const region = await getRegion(countryCode)

  // if (!collections || !region) {
  //   return null
  // }

  // const { products } = await getProductsList({
  //   page: 1,
  //   limit: 3,
  //   countryCode,
  // })

  return (
    <>
      {/* <Hero /> */}
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          {/* <FeaturedProducts
            collections={collections}
            region={region}
            products={products}
          /> */}
        </ul>
      </div>
    </>
  )
}
