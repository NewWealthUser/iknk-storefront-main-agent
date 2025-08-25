import React, { Suspense, useState, useMemo } from "react"
import ProductImageCarousel from "@modules/products/components/product-image-carousel"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { RhProduct, RhVariant } from "@lib/util/rh-product-adapter"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInteractionClient from "@modules/products/components/product-interaction-client"
import ProductPrice from "@modules/products/components/product-price"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: RhProduct
  relatedProducts: RhProduct[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

const NewProductTemplate: React.FC<ProductTemplateProps> = ({
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
      ? product.alternateImages.map((img: { imageUrl: string }) => ({ id: img.imageUrl, url: img.imageUrl }))
      : []
    return imgs
  }, [product.alternateImages, selectedVariant])

  return (
    <main id="main" className="flex-1 relative z-1099 min-h-[80vh]">
      <div id="product-page-undefined" data-testid="product-page">
        <div className="grid grid-cols-1 md:grid-cols-2 !m-[0_auto] !block !w-auto bg-rh-buff [&>div]:p-8">
          {/* Left Column: Image Gallery */}
          <div className="gridItem !print:none !mx-auto !my-0 w-full max-w-[1920px] !pb-0 !pt-0 xl:!px-[90px] xl:pb-[29.6px]">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-0 pt-[8px]">
              <div className="relative px-4 pb-2 pt-0 sm:px-6 sm:pt-0 md:px-0 md:pb-4 md:pt-0 print:hidden">
                <div className="relative w-full pdpImageWrapper">
                  <ProductImageCarousel images={images} />
                </div>
              </div>
              {/* Thumbnail Image List - Assuming ProductImageCarousel handles this internally or we add a separate component */}
              {/* The HTML provided has a separate thumbnail list, but our ProductImageCarousel already handles thumbnails. */}
              {/* If the provided HTML's thumbnail list is desired, ProductImageCarousel would need to be modified or replaced. */}
            </div>
          </div>

          {/* Right Column: Product Information */}
          <div className="md:col-span-1">
            <div className="animate-[fadeInUp_0s_ease-in_0s_1_normal_none_running] opacity-0 delay-0 duration-0 animate-none opacity-100">
              <div className="grid grid-cols-1">
                <div className="md:mt-0 mt-4">
                  <h1 className="uppercase text-2xl md:text-3xl font-primary-thin tracking-widest">
                    {product.displayName}
                  </h1>
                  <h3 className="text-lg font-primary-rhroman">{product.subtitle}</h3>
                </div>
                <div className="pt-0.5" data-testid="price-display">
                  <ProductPrice product={product} variant={selectedVariant} />
                </div>
                <div className="my-5">
                  <p className="normal-case text-base">
                    {product.productDescription}
                  </p>
                  {/* Additional links from HTML */}
                  {product.metadata?.alsoAvailableInAluminum && (
                    <div className="sku-info link-wrapper">
                      <a className="sku-info link text-blue-600 hover:underline" href={product.metadata.alsoAvailableInAluminum}>
                        ALSO AVAILABLE IN ALUMINUM
                      </a>
                    </div>
                  )}
                  {product.metadata?.shopEntireCollection && (
                    <div className="sku-info link-wrapper">
                      <a className="sku-info link text-blue-600 hover:underline" href={product.metadata.shopEntireCollection}>
                        SHOP THE ENTIRE COLLECTION
                      </a>
                    </div>
                  )}
                </div>

                {/* Options (Width, Finish, Fabric, Color) */}
                <ProductInteractionClient
                  product={product}
                  region={region}
                  countryCode={countryCode}
                  selectedVariant={selectedVariant}
                  setSelectedVariant={setSelectedVariant}
                />

                {/* Additional Details/Tabs */}
                <div className="mt-16">
                  <ProductTabs product={product} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mx-auto w-full bg-rh-buff p-2.5 lg:px-[32px] xl:px-0 xl:py-[32px]">
          <div className="animate-[fadeInUp_0s_ease-in_0s_1_normal_none_running] opacity-0 delay-0 duration-0 animate-none opacity-100">
            <p className="!pb-[15px] !uppercase text-base font-primary-thin">
              YOU MIGHT ALSO LIKE
            </p>
            <Suspense fallback={<SkeletonRelatedProducts />}>
              <RelatedProducts products={relatedProducts} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NewProductTemplate