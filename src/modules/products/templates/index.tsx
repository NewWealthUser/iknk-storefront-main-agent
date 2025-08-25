'use client'
import React, { Suspense, useState, useMemo } from "react"
import ProductImageCarousel from "@modules/products/components/product-image-carousel"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { RhProduct, RhVariant, RhImage, RhCtaLink } from "@lib/util/rh-product-adapter"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInteractionClient from "@modules/products/components/product-interaction-client"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: RhProduct
  relatedProducts: RhProduct[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  relatedProducts,
  region,
  countryCode,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<RhVariant | undefined>(
    undefined
  )

  if (!product || !product.id) {
    return notFound()
  }

  const images = useMemo(() => {
    const imgs = selectedVariant && selectedVariant.images?.length
      ? selectedVariant.images.map((img: { id: string; url: string }) => ({ id: img.id, url: img.url }))
      : product.alternateImages?.length
      ? product.alternateImages.map((img: RhImage) => ({ id: img.imageUrl, url: img.imageUrl }))
      : []
    console.log("ProductTemplate images:", imgs)
    return imgs
  }, [product.alternateImages, selectedVariant])

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
          <ProductOnboardingCta />
          <ProductInteractionClient
            product={product}
            region={region}
            countryCode={countryCode}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />
        </div>
      </div>
      <div className="content-container my-16 small:my-32 font-primary-thin">
        <ProductInfo product={product} />

        {(product.videoUrl ||
          product.dimensions ||
          product.careInstructions ||
          product.romanceHeader ||
          product.ctaLinks) && (
          <div className="mt-16 p-6 border border-gray-200 rounded-md">
            <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">
              Additional Product Details
            </h2>
            {product.videoUrl && (
              <div className="mb-4">
                <h3 className="text-lg font-primary-rhroman mb-2">Video URL</h3>
                <p className="text-gray-700">
                  <a
                    href={product.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {product.videoUrl}
                  </a>
                </p>
              </div>
            )}
            {product.dimensions && (
              <div className="mb-4">
                <h3 className="text-lg font-primary-rhroman mb-2">
                  Dimensions
                </h3>
                <p className="text-gray-700">
                  W: {product.dimensions.width || "N/A"}, H:{" "}
                  {product.dimensions.height || "N/A"}, L:{" "}
                  {product.dimensions.length || "N/A"}, Wt:{" "}
                  {product.dimensions.weight || "N/A"}
                </p>
              </div>
            )}
            {product.careInstructions && (
              <div className="mb-4">
                <h3 className="text-lg font-primary-rhroman mb-2">
                  Care Instructions
                </h3>
                <p className="text-gray-700">{product.careInstructions}</p>
              </div>
            )}
            {product.romanceHeader && (
              <div className="mb-4">
                <h3 className="text-lg font-primary-rhroman mb-2">
                  {product.romanceHeader}
                </h3>
                {product.romanceSubheader && (
                  <p className="text-gray-700 mb-2">
                    {product.romanceSubheader}
                  </p>
                )}
                {product.romanceBody && (
                  <p className="text-gray-700">{product.romanceBody}</p>
                )}
              </div>
            )}
            {product.ctaLinks && product.ctaLinks.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-primary-rhroman mb-2">CTA Links</h3>
                <ul className="list-disc list-inside ml-4 text-gray-700">
                  {product.ctaLinks.map((link: RhCtaLink, index: number) => (
                    <li key={index}>
                      <a
                        href={link.path || link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.label || link.path || link.link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <ProductTabs product={product} />
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts products={relatedProducts} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate