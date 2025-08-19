import React from "react"
import { formatMoney } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type Variant = HttpTypes.StoreProductVariant
type Product = HttpTypes.StoreProduct & { variants?: Variant[] | null }

function getMinMaxPrices(product: Product) {
  if (!product.variants?.length) return null

  const prices = product.variants
    .map((v) => v.calculated_price?.calculated_amount)
    .filter((p): p is number => typeof p === 'number');

  if (prices.length === 0) return null;

  const minAmount = Math.min(...prices);
  const maxAmount = Math.max(...prices);
  
  const currencyCode = product.variants[0].calculated_price?.currency_code || "USD";

  return { minAmount, maxAmount, currencyCode };
}

export default function ProductPrice({ product }: { product: Product }) {
  const priceRange = getMinMaxPrices(product);

  if (!priceRange) return null;

  const { minAmount, maxAmount, currencyCode } = priceRange;

  if (minAmount === maxAmount) {
    return (
      <div className="text-center text-sm tracking-wide">
        <span>{formatMoney(minAmount, currencyCode)}</span>
      </div>
    )
  }

  return (
    <div className="text-center text-sm tracking-wide text-gray-700">
      <span>Starting at {formatMoney(minAmount, currencyCode)}</span>
      <span> / </span>
      <span>{formatMoney(maxAmount, currencyCode)}</span>
    </div>
  )
}