import Medusa from "@medusajs/js-sdk"

// Use NEXT_PUBLIC_MEDUSA_URL for the storefront SDK
const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

export const sdk = new Medusa({
  baseUrl: MEDUSA_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})