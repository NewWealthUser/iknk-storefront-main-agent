import { MEDUSA_URL, medusaGet } from "@lib/medusa" // Added medusaGet import

const STORAGE_KEY = "cart_id"

export async function getOrCreateCartId(): Promise<string> {
  if (typeof window === "undefined") throw new Error("getOrCreateCartId must run in browser")
  let id = window.localStorage.getItem(STORAGE_KEY)
  if (id) return id
  const res = await fetch(`${MEDUSA_URL}/store/carts`, { method: "POST" })
  const data = await res.json()
  id = data.cart.id! // Non-null assertion added here
  window.localStorage.setItem(STORAGE_KEY, id as string) // Ensure id is string
  return id as string // Ensure return type is string
}