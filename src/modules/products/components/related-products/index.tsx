import ProductGrid from "../../../../components/ProductGrid" // Updated import path
import type { HttpTypes } from "@medusajs/types" // Changed from StoreProduct
import { getRegion } from "@lib/data/regions" // Added import for getRegion

type RelatedProductsProps = {
  products: HttpTypes.StoreProduct[]
  countryCode: string // Added countryCode prop
}

export default async function RelatedProducts({ products, countryCode }: RelatedProductsProps) {
  if (!products.length) {
    return null
  }

  const region = await getRegion(countryCode); // Fetch region

  if (!region) {
    return null; // Handle case where region is not found
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Related products
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          You might also want to check out these products.
        </p>
      </div>

      <ProductGrid products={products} region={region} /> {/* Updated to use new ProductGrid */}
    </div>
  )
}