import { MEDUSA_URL } from "@lib/medusa"

const STORAGE_KEY = "cart_id"

export async function getOrCreateCartId(): Promise<string> {
  if (typeof window === "undefined") {
    // This function is client-side only.
    // If you need a cart ID on the server, you should use the cookie-based method.
    throw new Error("getOrCreateCartId must run in the browser.")
  }

  let id = window.localStorage.getItem(STORAGE_KEY)
  if (id) {
    return id
  }

  // If no cart ID, create a new one
  const res = await fetch(`${MEDUSA_URL}/store/carts`, { method: "POST" })
  if (!res.ok) {
    throw new Error("Failed to create cart.")
  }
  const data = await res.json()
  id = data.cart.id

  if (id) {
    window.localStorage.setItem(STORAGE_KEY, id)
    return id
  }

  throw new Error("Could not retrieve cart ID.")
}