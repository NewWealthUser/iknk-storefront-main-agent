import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse mx-auto" />
  }

  return (
    <div className="flex flex-col text-gray-700 text-center">
      <span
        className={clx("text-sm", {
          "text-rose-600": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && "From "}
        {selectedPrice.calculated_price}
      </span>
      {selectedPrice.price_type === "sale" && (
        <p className="text-xs text-gray-500">
          <span className="line-through">
            {selectedPrice.original_price}
          </span>
        </p>
      )}
    </div>
  )
}