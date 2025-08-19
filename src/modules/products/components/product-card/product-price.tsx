import React from "react"
import { formatMoney } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type Variant = HttpTypes.StoreProductVariant
type Product = HttpTypes.StoreProduct & { variants?: Variant[] | null }

function minMaxPrice(product: Product) {
  const prices: { amount: number; currency: string }[] = []
  for (const v of product.variants || []) {
    if (v.calculated_price) {
      prices.push({ amount: v.calculated_price.calculated_amount ?? 0, currency: v.calculated_price.currency_code?.toUpperCase?.() || "ZAR" })
    }
  }
  if (!prices.length) return null
  // Group by currency (simple: pick first currency encountered)
  const currency = prices[0].currency
  const amounts = prices.filter(p => p.currency === currency).map(p => p.amount)
  const min = Math.min(...amounts)
  const max = Math.max(...amounts)
  return { min, max, currency }
}

export default function ProductPrice({ product }: { product: Product }) {
  const mm = minMaxPrice(product)
  if (!mm) return null
  const { min, max, currency } = mm
  const same = min === max
  return (
    <div className="text-sm text-gray-900">
      {same ? (
        <span className="font-medium">{formatMoney(min, currency)}</span>
      ) : (
        <span>
          <span className="font-medium">{formatMoney(min, currency)}</span>
          <span className="mx-1 text-gray-500">–</span>
          <span className="font-medium">{formatMoney(max, currency)}</span>
        </span>
      )}
    </div>
  )
}