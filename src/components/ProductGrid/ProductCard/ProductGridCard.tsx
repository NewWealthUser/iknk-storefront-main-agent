"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function ProductGridCard({ product, region }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false, duration: 16 })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    onSelect() // Initial call to set selectedIndex
  }, [emblaApi, onSelect])

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index)
  }, [emblaApi])

  const productImages = useMemo(() => {
    const images = product.images?.map(img => img.url).filter(Boolean) as string[] || []
    if (images.length === 0 && product.thumbnail) {
      images.push(product.thumbnail)
    }
    return images.length > 0 ? images : ["/placeholder.png"]
  }, [product.images, product.thumbnail])

  const hasMultipleVariants = (product.variants?.length ?? 0) > 1

  const { minCalculatedPrice, maxCalculatedPrice, minOriginalPrice, maxOriginalPrice, currencyCode } = useMemo(() => {
    const prices = product.variants?.map(v => ({
      calculated: typeof v.calculated_price === 'number' ? v.calculated_price : (v.calculated_price?.calculated_amount ?? 0),
      original: typeof v.original_price === 'number' ? v.original_price : (v.calculated_price?.original_amount ?? 0),
    })) || []

    const calculatedPrices = prices.map(p => p.calculated)
    const originalPrices = prices.map(p => p.original)

    return {
      minCalculatedPrice: calculatedPrices.length ? Math.min(...calculatedPrices) : undefined,
      maxCalculatedPrice: calculatedPrices.length ? Math.max(...calculatedPrices) : undefined,
      minOriginalPrice: originalPrices.length ? Math.min(...originalPrices) : undefined,
      maxOriginalPrice: originalPrices.length ? Math.max(...originalPrices) : undefined,
      currencyCode: region.currency_code,
    }
  }, [product.variants, region.currency_code])

  const showStartingAt = hasMultipleVariants && (minCalculatedPrice !== undefined || minOriginalPrice !== undefined)
  const isOnSale = minCalculatedPrice !== undefined && minOriginalPrice !== undefined && minCalculatedPrice < minOriginalPrice

  const colorOptions = product.options?.find(o => o.title.toLowerCase() === "color" || o.title.toLowerCase() === "finish")

  return (
    <div className="relative flex flex-col w-full h-full group">
      {/* Image Carousel */}
      <div className="overflow-hidden w-full aspect-[4/5] mb-3 relative" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {productImages.map((imgUrl, idx) => (
            <div className="embla__slide flex-[0_0_100%] h-full" key={idx}>
              <Link href={`/${region.countries?.[0]?.iso_2}/products/${product.handle}`} className="block w-full h-full">
                <Image
                  src={imgUrl}
                  alt={product.title ?? "Product image"}
                  fill
                  sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>
          ))}
        </div>
        {/* Carousel Dots */}
        {productImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {productImages.map((_, idx) => (
              <button
                key={idx}
                className={clx("h-1.5 w-1.5 rounded-full transition-colors", {
                  "bg-black": selectedIndex === idx,
                  "bg-gray-400 hover:bg-gray-600": selectedIndex !== idx,
                })}
                onClick={() => scrollTo(idx)}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <Link href={`/${region.countries?.[0]?.iso_2}/products/${product.handle}`} className="flex flex-col items-center text-center px-2">
        {hasMultipleVariants && (
          <p className="text-xs text-gray-600 mb-1 font-sans font-light">Available in multiple sizes & finishes</p>
        )}
        <h3 className="text-sm font-sans font-light uppercase tracking-wider mb-1">{product.title}</h3>

        {/* Price */}
        <div className="flex items-baseline justify-center space-x-1 text-sm mt-1 font-sans">
          {showStartingAt && <span className="text-black font-light">Starting at </span>}
          {minCalculatedPrice !== undefined && (
            <span className={clx("text-black font-medium", { "line-through text-gray-500": isOnSale })}>
              {convertToLocale({ amount: minCalculatedPrice, currency_code: currencyCode })}
            </span>
          )}
          {isOnSale && maxCalculatedPrice !== undefined && (
            <span className="text-red-600 font-medium">
              {convertToLocale({ amount: maxCalculatedPrice, currency_code: currencyCode })}
            </span>
          )}
          {!showStartingAt && minCalculatedPrice !== undefined && (
            <span className="text-black font-medium">
              {convertToLocale({ amount: minCalculatedPrice, currency_code: currencyCode })}
            </span>
          )}
          {maxCalculatedPrice !== undefined && minCalculatedPrice !== maxCalculatedPrice && (
            <span className="text-black font-medium">
              {minCalculatedPrice !== undefined ? " - " : ""}
              {convertToLocale({ amount: maxCalculatedPrice, currency_code: currencyCode })}
            </span>
          )}
        </div>
      </Link>

      {/* Swatches */}
      {colorOptions && (
        <div className="mt-4 flex justify-center space-x-1">
          {product.variants?.slice(0, 5).map((variant) => { // Limit to 5 swatches for display
            const swatchImg = variant.images?.[0]?.url ?? product.thumbnail ?? "/placeholder.png"
            const isSelected = false; // Implement logic to highlight selected swatch if needed

            return (
              <button
                key={variant.id}
                className={clx("h-5 w-5 rounded-full border overflow-hidden transition-all duration-200", {
                  "border-black ring-1 ring-black": isSelected,
                  "border-gray-300 hover:border-gray-500": !isSelected,
                })}
                title={variant.title ?? "Variant"}
                aria-label={`Select ${variant.title ?? "variant"}`}
              >
                <Image
                  src={swatchImg}
                  alt={variant.title ?? "Variant"}
                  width={20}
                  height={20}
                  className="object-cover w-full h-full"
                />
              </button>
            )
          })}
          {product.variants && product.variants.length > 5 && (
            <span className="text-xs text-gray-500 self-end ml-1">+{product.variants.length - 5}</span>
          )}
        </div>
      )}
    </div>
  )
}