import Medusa from "@medusajs/js-sdk"

// Use NEXT_PUBLIC_MEDUSA_URL as the primary environment variable for the Medusa backend URL.
// Fallback to http://localhost:9000 if not set.
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

console.log("Medusa SDK Initializing with Base URL:", MEDUSA_BACKEND_URL); // Added debug log

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})