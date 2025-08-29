import sdk from "@lib/config/sdk"
import { useState } from "react"

export const useCartActions = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addItem = async (cartId: string, variantId: string, quantity: number) => {
    setLoading(true)
    setError(null)

    try {
      const { cart } = await sdk.store.cart.lineItems.create(cartId, {
        variant_id: variantId,
        quantity,
      })
      return cart
    } catch (err: any) {
      setError(err.message ?? "Failed to add item")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { addItem, loading, error }
}