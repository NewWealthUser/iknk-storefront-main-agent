import Medusa from "@medusajs/js-sdk"
import { resolveMedusaUrl } from "./util/medusa-url"; // Import the new utility

const MEDUSA_URL_ENV = process.env.NEXT_PUBLIC_MEDUSA_URL;
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

const resolvedMedusaUrl = resolveMedusaUrl(MEDUSA_URL_ENV);

if (!resolvedMedusaUrl) {
  throw new Error("[medusa][config] Invalid or missing NEXT_PUBLIC_MEDUSA_URL. Please configure it in your .env.local file.");
}

if (!PUBLISHABLE_API_KEY) {
  throw new Error("[medusa][config] NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set. Please configure it in your .env.local file.");
}

export const sdk = new Medusa({
  baseUrl: resolvedMedusaUrl,
  debug: process.env.NODE_ENV === "development",
  publishableKey: PUBLISHABLE_API_KEY,
})