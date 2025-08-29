import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
  products, // Added products prop
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
  products: HttpTypes.StoreProduct[] // Added products prop
}) {
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} region={region} />
    </li>
  ))
}