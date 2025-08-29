import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductGrid from "../../../../../components/ProductGrid" // Updated import path


export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const res = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: [collection.id],
      fields: "*variants.calculated_price,*images,*options,*variants.options",
    } as any,
  })

  if (!res.response.products) {
    console.warn(`[product-rail][fallback] Failed to list products for collection '${collection.id}'.`);
    return null
  }

  const pricedProducts = res.response.products;

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/${region.countries?.[0]?.iso_2}/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ProductGrid products={pricedProducts} region={region} /> {/* Updated to use new ProductGrid */}
    </div>
  )
}