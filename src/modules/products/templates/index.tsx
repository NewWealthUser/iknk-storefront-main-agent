'use client'
import React, { Suspense, useState, useMemo } from "react"
import ProductImageCarousel from "@modules/products/components/product-image-carousel"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import type { StoreProduct, StoreProductVariant } from "@medusajs/types"
import ProductTabs from "@modules/products/components/product-tabs"
import IknkProductGrid from "@modules/products/components/iknk-product-grid"
import ProductActions from "@modules/products/components/product-actions"

import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: StoreProduct
  relatedProducts: StoreProduct[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  relatedProducts,
  region,
  countryCode,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<StoreProductVariant | undefined>(
    undefined
  )

  if (!product || !product.id) {
    return notFound()
  }

  const images = useMemo(() => {
    return product.images?.map((img) => ({ id: img.id, url: img.url })) || []
  }, [product.images])

  return (
    <>
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 relative font-primary-thin"
        data-testid="product-container"
      >
        <div className="block w-full relative">
          <ProductImageCarousel images={images} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          
          {/* <ProductActions product={product} region={region} /> */}
        </div>
      </div>
      <div className="content-container my-16 small:my-32 font-primary-thin">
        <ProductInfo product={product} />

        
        <ProductTabs product={product} />
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <IknkProductGrid productList={relatedProducts} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate