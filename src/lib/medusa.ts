import { createClient } from "@medusajs/js-sdk" // Fixed: Changed to named import
import { getBaseURL } from "./util/env"; // Assuming getBaseURL is still needed for the SDK base URL

const MEDUSA_URL_ENV = process.env.NEXT_PUBLIC_MEDUSA_URL;
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

const resolvedMedusaUrl = getBaseURL(); // Using getBaseURL for consistency, assuming it resolves the Medusa backend URL

if (!resolvedMedusaUrl) {
  throw new Error("[medusa][config] Invalid or missing NEXT_PUBLIC_MEDUSA_URL. Please configure it in your .env.local file.");
}

if (!PUBLISHABLE_API_KEY) {
  throw new Error("[medusa][config] NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set. Please configure it in your .env.local file.");
}

export const sdk = createClient({
  baseUrl: resolvedMedusaUrl,
  publishableKey: PUBLISHABLE_API_KEY,
  auth: { type: "session" }, // Assuming session-based auth is desired
});

/**
 * Generic GET wrapper using the SDK client.
 * @param path - The API path (e.g., "/store/products?limit=10").
 * @returns A promise that resolves to the fetched data.
 */
export async function medusaGet<T>(path: string): Promise<T> {
  const res = await sdk.client.fetch<T>(path);
  return res;
}

/**
 * Generic POST wrapper using the SDK client.
 * @param path - The API path (e.g., "/store/carts").
 * @param body - The request body.
 * @returns A promise that resolves to the fetched data.
 */
export async function medusaPost<T>(path: string, body: any): Promise<T> {
  const res = await sdk.client.fetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res;
}