import { useState } from "react"

export const useCartActions = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addItem = async (cartId: string, variantId: string, quantity: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
        body: JSON.stringify({ variant_id: variantId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      const { cart } = await response.json();
      return cart;
    } catch (err: any) {
        setError(err.message ?? "Failed to add item")
        throw err
    } finally {
      setLoading(false)
    }
  }

  return { addItem, loading, error }
}