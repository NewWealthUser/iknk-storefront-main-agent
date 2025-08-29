import type { StoreProduct, StoreProductVariant } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

export default function ProductPrice({
  product,
  variant,
}: {
  product: StoreProduct
  variant?: StoreProductVariant
}) {
  const price = variant?.calculated_price ?? product.variants?.[0]?.calculated_price
  const currencyCode = variant?.calculated_price?.currency_code ?? product.variants?.[0]?.calculated_price?.currency_code ?? "ZAR"

  if (typeof price === "undefined" || price === null) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse mx-auto" />
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(typeof price === "number" ? price / 100 : 0)

  return (
    <div className="flex flex-col text-gray-700 text-center">
      <span className="text-sm">
        {formattedPrice}
      </span>
    </div>
  )
}
