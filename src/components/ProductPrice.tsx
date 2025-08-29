"use client"
import React from "react"
import { HttpTypes } from "@medusajs/types"

type Props = {
  variant?: HttpTypes.StoreProductVariant
  className?: string
}

const ProductPrice: React.FC<Props> = ({ variant, className }) => {
  if (!variant?.calculated_price) return null

  const { calculated_price } = variant
  const original_price = calculated_price?.original_amount

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {calculated_price?.calculated_amount != null
        ? <span className="text-base font-semibold text-black">
            {(calculated_price.calculated_amount / 100).toFixed(2)} {calculated_price?.currency_code?.toUpperCase()}
          </span>
        : "Price unavailable"}
      {original_price && (
        <span className="line-through text-gray-500 text-sm">
          {original_price / 100} {calculated_price?.currency_code?.toUpperCase()}
        </span>
      )}
    </div>
  )
}

export default ProductPrice