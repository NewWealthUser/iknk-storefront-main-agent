"use client"

import React, { FC } from "react"
import Link from "next/link"
import { RhProduct, RhSwatch } from "@lib/util/rh-product-adapter"

export interface IknkProductCardProps {
  data: RhProduct
}

export const IknkProductCard: FC<IknkProductCardProps> = React.memo(({ data }) => {
  if (!data) {
    return null
  }

  const {
    displayName,
    handle,
    imageUrl,
    metadata,
    priceRangeDisplay,
    swatchData,
  } = data

  const redirectPath = `/products/${handle}`

  // Determine the subtitle text
  const subtitleText = metadata?.subTitle || "Available in multiple sizes & colours"

  // Format price display
  const formatPrice = (price: number | undefined, currencySymbol: string | undefined) => {
    if (typeof price !== 'number' || !currencySymbol) return ""
    return `${currencySymbol}${price.toFixed(2)}`
  }

  const minPrice = priceRangeDisplay?.listPrices?.[0] || priceRangeDisplay?.memberPrices?.[0]
  const maxPrice = priceRangeDisplay?.listPrices?.[0] || priceRangeDisplay?.memberPrices?.[0]
  const currencySymbol = priceRangeDisplay?.currencySymbol || "$"

  const priceText = (minPrice && maxPrice && minPrice !== maxPrice)
    ? `Starts at ${formatPrice(minPrice, currencySymbol)} to ${formatPrice(maxPrice, currencySymbol)}`
    : (minPrice ? `Starts at ${formatPrice(minPrice, currencySymbol)}` : "")

  return (
    <div
      id={`RH__null__0`}
      className="productVisible mb-3 flex w-full justify-center visibleViewItem"
      style={{ width: "30.3%" }}
    >
      <div className="relative flex h-full w-full flex-col unset ">
        <div
          className="group/item group relative flex flex-col items-end justify-center"
          style={{ touchAction: "pan-y", height: "auto" }}
        >
          <div
            className="group/item group relative z-10 block w-full overflow-hidden"
            style={{
              height: "auto",
              maxHeight: "350px", // Adjust as needed
            }}
          >
            <Link href={redirectPath}>
              <div className="relative h-full w-full grid content-end">
                <img
                  src={imageUrl || ""}
                  loading="lazy"
                  alt={displayName || ""}
                  className="h-full w-full opacity-1 mx-auto grid content-end"
                  style={{
                    objectFit: "contain",
                    alignSelf: "flex-end",
                    maxWidth: "100%",
                    maxHeight: "350px", // Adjust as needed
                    width: "auto",
                    height: "auto",
                    transitionProperty: "opacity",
                  }}
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="flex h-full w-full flex-col flex-wrap content-around">
          <div className="flex h-full flex-col" style={{ width: "345.126px" }}>
            <Link href={redirectPath}>
              <p
                className="tailwind-typography-root my-0 pt-1.5 font-primary-thin text-[10px] leading-[13.2px] text-black sm:pt-2.5 sm:text-[13px] sm:leading-5 lg:pt-1.5  text-center tailwind-typography-body1"
                style={{ minHeight: "30px", width: "345.126px" }}
              >
                {subtitleText}
              </p>
              <div className="flex flex-col">
                <div className="mt-1.5 sm:mt-2 md:mt-2.5">
                  <div className="uppercase jss7449 text-center">
                    <span className=" font-primary-thin text-[13px] uppercase leading-[13.2px] text-gray-1 sm:leading-5">
                      {displayName}
                    </span>
                  </div>
                </div>
                <div className="box-border flex w-full flex-col justify-center pr-2.5 xs:justify-start items-center">
                  <div className="flex flex-row flex-wrap items-baseline tracking-[0.165px] text-rhBlack justify-center xs:items-center whitespace-nowrap text-[11px]">
                    {priceText && (
                      <span className="my-0 mr-1 text-[#000]">
                        {priceText}
                      </span>
                    )}
                  </div>
                </div>
                <div></div>
              </div>
            </Link>
            <div className="flex grow flex-col justify-end">
              <div className="mt-[20px] grid auto-cols-max grid-flow-col !gap-[3px] gap-x-0.5 md:mt-4 lg:mt-5 mx-auto  place-content-center">
                {swatchData?.swatchGroups?.[0]?.stockedSwatches?.slice(0, 5) 
                  .map((swatch: RhSwatch, index: number) => (
                    <div className="inline-flex flex-col" key={index}>
                      <button
                        className="inline-block aspect-[2/1] !h-3 !p-0 sm:aspect-[2.5/1] lg:!h-4 xl:!h-5"
                        aria-label={swatch.title}
                      >
                        <div className="relative block h-full w-full">
                          <img
                            src={swatch.imageUrl}
                            loading="lazy"
                            alt={swatch.title}
                            className="h-full w-full opacity-1"
                          />
                        </div>
                      </button>
                      <div
                        className="!mt-[3px] !h-[0.03rem] !border-black !px-[1px] !py-0"
                        style={{
                          border: "0.5px solid",
                          opacity: index === 0 ? 1 : 0, 
                        }}
                      ></div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default IknkProductCard
