import { Metadata } from "next"

import { listCollections } from "@lib/data/collections" // Corrected import
import { listProducts } from "@lib/data/products" // Corrected import
import FeaturedProducts from "@modules/home/components/featured-products" // Corrected import
import Hero from "@modules/home/components/hero" // Corrected import
import { getRegion } from "@lib/data/regions" // Corrected import
import { StoreProduct } from "@medusajs/types"

export const metadata: Metadata = {
  title: "Medusa Next.js",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

export default async function Home({ 
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params;
  const { collections } = await listCollections( { limit: "3" }) // Re-enabled getCollectionsList
  const region = await getRegion(countryCode) // Re-enabled getRegion

  if (!collections || !region) {
    return null
  }

  const { response: { products } } = await listProducts({ // Re-enabled getProductsList
    pageParam: 1,
    queryParams: { limit: 3 },
    countryCode,
  })

  return (
    <>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts
            collections={collections}
            region={region}
            products={products}
          />
        </ul>
      </div>
    </>
  )
}