import { Product } from "@lib/medusa"
import { formatMoney } from "@lib/medusa"

export default function ProductPrice({ product }: { product: Product }) {
  const amounts = product.variants.flatMap((v) => v.prices.map((p) => p.amount))
  if (!amounts.length) return null
  const min = Math.min(...amounts)
  const max = Math.max(...amounts)
  return (
    <p className="text-sm">
      Starting at <span className="font-semibold">{formatMoney(min)}</span> /
      <span className="italic text-gray-500">{formatMoney(max)}</span>
    </p>
  )
}
