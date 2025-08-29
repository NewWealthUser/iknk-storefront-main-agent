import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductCard from "../../../../../components/ProductCard"


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
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-7 lg:gap-y-12">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductCard data={product} />
            </li>
          ))}
      </ul>
    </div>
  )
}