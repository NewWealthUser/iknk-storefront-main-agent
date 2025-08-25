import { RhProduct } from "@lib/util/rh-product-adapter"
import { clx } from "@medusajs/ui"
import React from "react"

export default function ProductPrice({
  product,
}: {
  product: RhProduct
}) {
  // Use the price information from RhProduct directly
  const selectedPrice = product.skuPriceInfo;
  const priceRangeDisplay = product.priceRangeDisplay;

  if (!selectedPrice && !priceRangeDisplay) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse mx-auto" />
  }

  const displayPrice = selectedPrice?.salePrice || selectedPrice?.listPrice || priceRangeDisplay?.listPrices?.[0];
  const originalPrice = selectedPrice?.listPrice || priceRangeDisplay?.listPrices?.[0];
  const isOnSale = selectedPrice?.onSale || priceRangeDisplay?.nextGenDrivenOnSale;

  return (
    <div className="flex flex-col text-gray-700 text-center">
      <span
        className={clx("text-sm", {
          "text-rose-600": isOnSale,
        })}
      >
        {priceRangeDisplay?.overridePriceLabel || ""}
        {displayPrice}
      </span>
      {isOnSale && originalPrice && (
        <p className="text-xs text-gray-500">
          <span className="line-through">
            {originalPrice}
          </span>
        </p>
      )}
    </div>
  )
}