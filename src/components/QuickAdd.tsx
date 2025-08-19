"use client"

import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { addToCart } from "@lib/data/cart"
import { useState } from "react"
import { useParams } from "next/navigation"

export default function QuickAdd({ product }: { product: HttpTypes.StoreProduct }) {
  const [isAdding, setIsAdding] = useState(false)
  const params = useParams()
  const countryCode = typeof params?.countryCode === 'string' ? params.countryCode : '';

  const handleAddToCart = async () => {
    if (!product.variants?.[0]?.id) return null

    setIsAdding(true)

    try {
      await addToCart({
        variantId: product.variants[0].id,
        quantity: 1,
        countryCode,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      className="w-full"
      isLoading={isAdding}
      onClick={handleAddToCart}
      disabled={!product.variants?.[0]?.id}
    >
      Add to cart
    </Button>
  )
}