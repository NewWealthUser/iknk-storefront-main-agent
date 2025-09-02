"use server"

import { addToCart } from "@lib/data/cart"
import { revalidateTag } from "next/cache"

export async function addToCartAction(
  variantId: string,
  quantity: number,
  countryCode: string
) {
  console.log("DEBUG: addToCartAction received - Variant ID:", variantId, "Quantity:", quantity, "Country Code:", countryCode); // Added debug log
  try {
    await addToCart({ variantId, quantity, countryCode })
    revalidateTag("cart")
  } catch (e: any) {
    return e.message
  }
}