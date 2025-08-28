"use client"

import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react" // Corrected import
import type { EmblaCarouselType } from "embla-carousel" // Corrected import
import { RhProduct, RhSwatch } from "@lib/util/rh-product-adapter"
import { convertToLocale } from "@lib/util/money"

export interface IknkProductCardProps {
  data: RhProduct
  className?: string
}

/**
 * RH-style product card with:
 * - Image carousel (Embla) + dots + next/prev (next only on hover like RH)
 * - Subtitle → Title (uppercase) → pricing row (Starting at / Member / Regular)
 * - Swatches (underline on the first/selected)
 * - Matches the structure/classes you provided closely
 */
export const IknkProductCard: FC<IknkProductCardProps> = React.memo(({ data, className }) => {
  if (!data) return null

  const {
    displayName,
    handle,
    imageUrl,            // single fallback image
    imageUrls,           // optional array of images if you have them
    metadata,
    priceRangeDisplay,
    swatchData,
  } = data

  const redirectPath = `/products/${handle}`

  // ---------- Subtitle ----------
  const subtitleText =
    (metadata?.subTitle && metadata.subTitle.trim().length > 0)
      ? metadata.subTitle
      : "Available in multiple sizes & finishes"

  // ---------- Images (carousel) ----------
  const images: string[] = useMemo(() => {
    const list: string[] = []
    if (Array.isArray(imageUrls) && imageUrls.length) list.push(...imageUrls)
    else if (imageUrl) list.push(imageUrl)
    return Array.from(new Set(list)) // dedupe
  }, [imageUrl, imageUrls])

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false, duration: 16 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [canScrollPrev, setCanScrollPrev] = useState(false)

  const onSelect = useCallback((api: EmblaCarouselType) => { // Changed type to EmblaCarouselType
    setSelectedIndex(api.selectedScrollSnap())
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on("select", () => onSelect(emblaApi))
    emblaApi.on("reInit", () => onSelect(emblaApi))
  }, [emblaApi, onSelect])

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index)
  }, [emblaApi])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  // ---------- Pricing ----------
  // Expecting arrays like: priceRangeDisplay.listPrices = [min, max]
  // and priceRangeDisplay.memberPrices = [min, max]
  // Fallback to single value if only min exists.
  const currencyCode =
    priceRangeDisplay?.currencySymbol || "ZAR" // matches your default

  const [listMin, listMax] = priceRangeDisplay?.listPrices ?? []
  const [memberMin, memberMax] = priceRangeDisplay?.memberPrices ?? []

  const memberStart = typeof memberMin === "number" ? memberMin : undefined
  const listStart = typeof listMin === "number" ? listMin : undefined

  // Copy matches RH: "Starting at" + Member <price> "Member /" + Regular <price> "Regular"
  const showStartingAt = typeof memberStart === "number" || typeof listStart === "number"

  const format = (amt?: number) =>
    typeof amt === "number" ? convertToLocale({ amount: amt, currency_code: currencyCode }) : ""

  // ---------- Swatches ----------
  const swatches: RhSwatch[] =
    swatchData?.swatchGroups?.[0]?.stockedSwatches?.slice(0, 5) ?? []

  // First swatch is shown selected (underline visible) like RH
  const isSelectedSwatch = (idx: number) => idx === 0

  return (
    <div
      id={`RH__null__0`}
      className={`productVisible mb-3 flex w-full justify-center visibleViewItem ${className ?? ""}`}
      style={{ width: "30.3%" }}
    >
      <div className="relative flex h-full w-full flex-col unset">
        {/* MEDIA GROUP */}
        <div
          className="group/item group relative flex flex-col items-end justify-center"
          style={{ touchAction: "pan-y", height: "auto" }}
        >
          {/* Embla wrapper (match RH structure/classes closely) */}
          <div
            className={`embla group/item group relative z-10 block w-full overflow-hidden`}
            style={{ height: images.length ? 96.95 : "auto", maxHeight: "350px" }}
            ref={emblaRef}
          >
            <div className="embla__container flex h-full items-center transition-transform">
              {images.length ? (
                images.map((src, idx) => (
                  <div
                    key={src + idx}
                    className="embla__slide relative z-20 min-w-0 flex-[0_0_100%] justify-around"
                    style={{ height: 96.95, cursor: "default" }}
                  >
                    <Link
                      className="cursor-pointer"
                      href={redirectPath}
                      aria-label={displayName || ""}
                      tabIndex={0}
                    >
                      <div className="relative h-full w-full grid content-end" style={{ height: 96.95 }}>
                        {/* Use next/image for perf; preserves your object-fit */}
                        <Image
                          src={src.startsWith("//") ? `https:${src}` : src}
                          alt={displayName || ""}
                          loading="lazy"
                          fill
                          sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
                          className="h-full w-full mx-auto grid content-end"
                          style={{
                            objectFit: "contain",
                            alignSelf: "flex-end",
                          }}
                        />
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="relative h-full w-full grid content-end" style={{ height: 96.95 }}>
                  <Link href={redirectPath}>
                    <img
                      src={imageUrl || ""}
                      loading="lazy"
                      alt={displayName || ""}
                      className="h-full w-full opacity-1 mx-auto grid content-end"
                      style={{
                        objectFit: "contain",
                        alignSelf: "flex-end",
                        maxWidth: "100%",
                        maxHeight: "96.95px",
                        width: "auto",
                        height: "auto",
                        transitionProperty: "opacity",
                      }}
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Dots + Prev/Next controls (mimic RH behavior/opacity) */}
          {images.length > 1 && (
            <div className="embla__controls align-center flex w-full items-center justify-center my-1.5 sm:my-2 md:my-2.5">
              <button
                className={`embla__prev relative m-0 inline-flex p-0 pr-2.5 transition-opacity duration-300
                  ${canScrollPrev ? "opacity-100" : "opacity-0"}
                  group-hover:opacity-100 group-hover:cursor-pointer`}
                aria-label="previous"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="rotate-180" viewBox="0 0 16 16">
                  <path d="M6 4L10 8L6 12" stroke="black" />
                </svg>
              </button>

              <span id={`dots-image-carousel-${handle}`} className="flex h-[8px]">
                <div className="flex items-center justify-center overflow-hidden" data-testid="dots-container" style={{ maxWidth: 45 }}>
                  <div className="flex transition-transform duration-300" data-testid="dots-wrapper" style={{ gap: 4 }}>
                    {images.map((_, idx) => {
                      const active = idx === selectedIndex
                      return (
                        <div
                          key={idx}
                          role="button"
                          aria-label={`Dot ${idx + 1}`}
                          aria-current={active}
                          data-testid={`dot-${idx + 1}`}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: 5,
                            height: 5,
                            backgroundColor: active ? "black" : "rgb(137,136,134)",
                          }}
                          onClick={() => scrollTo(idx)}
                        />
                      )
                    })}
                  </div>
                </div>
              </span>

              <button
                className={`embla__next relative m-0 inline-flex p-0 pl-2.5 transition-opacity duration-300
                  ${canScrollNext ? "opacity-100" : "opacity-0"}
                  group-hover:opacity-100 group-hover:cursor-pointer`}
                aria-label="next"
                onClick={scrollNext}
                disabled={!canScrollNext}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path d="M6 4L10 8L6 12" stroke="black" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* META BLOCK */}
        <div className="flex h-full w-full flex-col flex-wrap content-around">
          <div className="flex h-full flex-col" style={{ width: "284.523px" }}>
            <Link
              id="component-rh-link"
              href={redirectPath}
              aria-label="Link"
              className="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineHover"
            >
              {/* Subtitle */}
              <p
                className="tailwind-typography-root my-0 pt-1.5 font-primary-thin text-[10px] leading-[13.2px] text-black sm:pt-2.5 sm:text-[13px] sm:leading-5 lg:pt-1.5 text-center tailwind-typography-body1"
                style={{ minHeight: "30px", width: "284.523px" }}
              >
                {subtitleText}
              </p>

              {/* Title */}
              <div className="flex flex-col">
                <div className="mt-1.5 sm:mt-2 md:mt-2.5">
                  <div className="uppercase text-center">
                    <span className="font-primary-thin text-[13px] uppercase leading-[13.2px] text-gray-1 sm:leading-5">
                      {displayName}
                    </span>
                  </div>
                </div>

                {/* Pricing row */}
                <div className="box-border flex w-full flex-col justify-center pr-2.5 xs:justify-start items-center">
                  <div className="flex flex-row flex-wrap items-baseline tracking-[0.165px] text-rhBlack justify-center xs:items-center whitespace-nowrap text-[11px]">
                    {showStartingAt && (
                      <>
                        <div>
                          <span className="my-0 mr-1 text-[#000]" id="RHPriceDisplaySale_sale_top_label">
                            Starting at
                          </span>
                        </div>

                        {/* Member price (preferred if exists) */}
                        {typeof memberStart === "number" && (
                          <span id="RHPriceDisplaySale_Member_price_wrapper" className="undefined">
                            <span
                              className="tracking-[0.04em] mr-1 font-primary-rhroman text-[#000]"
                              id="RHPriceDisplaySale_member_price"
                            >
                              {format(memberStart)}
                            </span>
                            <span
                              className="tracking-[0.04em] mr-1 font-primary-rhroman text-[#000]"
                              id="RHPriceDisplaySale_Member_price_label"
                            >
                              Member /
                            </span>
                          </span>
                        )}

                        {/* Regular/list price */}
                        {typeof listStart === "number" && (
                          <span>
                            <span
                              className="tracking-[0.04em] mr-1 font-primary-rhthin text-[#000]"
                              id="RHPriceDisplaySale_list_price"
                            >
                              {format(listStart)}
                            </span>
                            <span
                              className="tracking-[0.04em] font-primary-rhthin text-[#000]"
                              id="RHPriceDisplaySale_regular_price_label"
                            >
                              Regular
                            </span>
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div />
              </div>
            </Link>

            {/* Swatches */}
            <div className="flex grow flex-col justify-end">
              {!!swatches.length && (
                <div className="mt-[20px] grid auto-cols-max grid-flow-col !gap-[3px] gap-x-0.5 md:mt-4 lg:mt-5 mx-auto place-content-center">
                  {swatches.map((swatch: RhSwatch, index: number) => {
                    const imageUrl = swatch.imageUrl ?? "/placeholder.png";
                    return (
                      <div className="inline-flex flex-col" key={swatch?.swatchId || index}>
                        <button
                          className="inline-block aspect-[2/1] !h-3 !p-0 sm:aspect-[2.5/1] lg:!h-4 xl:!h-5"
                          aria-label={swatch?.title || ""}
                          // onClick={() => ... if you want to preview-swap per swatch}
                        >
                          <div className="relative block h-full w-full">
                            {/* Using plain <img> for tiny assets keeps it simple */}
                            <img
                              src={imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl}
                              loading="lazy"
                              alt={swatch?.title || ""}
                              className="h-full w-full opacity-1"
                            />
                          </div>
                        </button>
                        <div
                          className="!mt-[3px] !h-[0.03rem] !border-black !px-[1px] !py-0"
                          style={{
                            border: "0.5px solid",
                            opacity: isSelectedSwatch(index) ? 1 : 0,
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default IknkProductCard