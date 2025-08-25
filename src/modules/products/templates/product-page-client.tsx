'use client'

import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { RhProduct } from "@lib/util/rh-product-adapter"

type ProductPageClientProps = {
  product: RhProduct
  relatedProducts: RhProduct[]
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