"use client"

import { Product } from "@lib/medusa"
import { getOrCreateCartId } from "@utils/cart"
import { MEDUSA_URL } from "@lib/medusa"

export default function QuickAdd({ product }: { product: Product }) {
  const variant = product.variants.find(
    (v) =>
      !v.manage_inventory ||
      v.allow_backorder ||
      (v.inventory_quantity ?? 0) > 0
  )

  const add = async () => {
    if (!variant) return
    const cartId = await getOrCreateCartId()
    await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ variant_id: variant.id, quantity: 1 }),
    })
    alert("Added to cart")
  }

  return (
    <button
      onClick={add}
      disabled={!variant}
      className="mt-2 px-3 py-1 border text-sm disabled:opacity-50"
    >
      Quick Add
    </button>
  )
}
