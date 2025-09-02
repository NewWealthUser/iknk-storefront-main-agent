"use server"

import { addToCart } from "@lib/data/cart"
import { revalidateTag } from "next/cache"

export async function addToCartAction(
  variantId: string,
  quantity: number,
  countryCode: string
) {
  try {
    await addToCart({ variantId, quantity, countryCode })
    revalidateTag("cart")
  } catch (e: any) {
    return e.message
  }
}
