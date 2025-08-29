'use client'

import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import type { StoreProduct } from "@medusajs/types"

type ProductPageClientProps = {
  product: StoreProduct
  relatedProducts: StoreProduct[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default function ProductPageClient({ product, relatedProducts, region, countryCode }: ProductPageClientProps) {
  return (
    <ProductTemplate
      product={product}
      relatedProducts={relatedProducts}
      region={region}
      countryCode={countryCode}
    />
  )
}