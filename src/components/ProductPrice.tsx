import React from "react"
import { formatMoney } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type Variant = HttpTypes.StoreProductVariant
type Product = HttpTypes.StoreProduct & { variants?: Variant[] | null }

function getMinPrice(product: Product) {
  if (!product.variants?.length) return null

  const cheapestVariant = product.variants.reduce((min, v) => {
    const price = v.calculated_price?.calculated_amount ?? Infinity
    const minPrice = min.calculated_price?.calculated_amount ?? Infinity
    return price < minPrice ? v : min
  })

  return cheapestVariant.calculated_price
}

export default function ProductPrice({ product }: { product: Product }) {
  const cheapestPrice = getMinPrice(product)

  if (!cheapestPrice) return null

  const regularAmount = cheapestPrice.calculated_amount ?? 0
  const memberAmount = regularAmount * 0.9 // Assuming 10% member discount
  const currency = cheapestPrice.currency_code || "USD"

  return (
    <div className="text-xs text-gray-700">
      Starting at {formatMoney(memberAmount, currency)} Member /{" "}
      {formatMoney(regularAmount, currency)} Regular
    </div>
  )
}