import Medusa from "@medusajs/js-sdk"

// Use NEXT_PUBLIC_MEDUSA_URL for the storefront SDK
const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

if (!MEDUSA_URL) {
  throw new Error("NEXT_PUBLIC_MEDUSA_URL is not set. Please configure it in your .env.local file.");
}

if (!PUBLISHABLE_API_KEY) {
  throw new Error("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set. Please configure it in your .env.local file.");
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: PUBLISHABLE_API_KEY,
})