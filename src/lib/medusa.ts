import { sdk } from "@lib/config" // Import sdk

export const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL as string

if (!MEDUSA_URL) {
  throw new Error("NEXT_PUBLIC_MEDUSA_URL is not set")
}

export async function medusaGet<T>(path: string, queryParams?: Record<string, any>, init?: RequestInit): Promise<T> {
  try {
    // Separate headers and query from init to pass them as FetchArgs
    const { headers, ...restInit } = init || {};

    const data = await sdk.client.fetch<T>(path, {
      method: "GET",
      query: queryParams,
      headers: headers as Record<string, string>, // Cast HeadersInit to Record<string, string>
    }, restInit); // Pass remaining RequestInit properties as the third argument
    return data;
  } catch (error: any) {
    // The sdk.client.fetch already handles non-2xx responses by throwing an error
    // We can re-throw it or wrap it for more context if needed.
    if (error.response) {
      // Medusa SDK errors often have a 'response' property with status and data
      throw new Error(`Medusa request failed: ${error.response.status} ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response received from Medusa backend. Is it running?");
    } else {
      // Something else happened in setting up the request
      throw new Error(`Error setting up Medusa request: ${error.message}`);
    }
  }
}

export interface Price {
  amount: number
  currency_code: string
}

export interface Variant {
  id: string
  title: string
  prices: Price[]
  inventory_quantity?: number
  manage_inventory?: boolean
  allow_backorder?: boolean
  options?: { option_id: string; value: string }[]
}

export interface OptionValue {
  id: string
  value: string
}

export interface Option {
  id: string
  title: string
  values: OptionValue[]
}

export interface Image {
  id: string
  url: string
  rank?: number // Added rank property
}

export interface Product {
  id: string
  title: string
  handle: string
  description?: string
  options: Option[]
  variants: Variant[]
  images: Image[]
  collections?: { id: string }[]
  categories?: { id: string }[]
}

export async function listProducts(
  params: Record<string, string | number>
): Promise<{ products: Product[]; count: number; limit: number; offset: number }> {
  // Pass the params object directly to medusaGet, it will handle stringification
  return await medusaGet(`/store/products`, { ...params, expand: "variants,options,images,collections,categories" })
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const data = await listProducts({ handle, limit: 1 })
  return data.products[0] || null
}

export function formatMoney(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100)
}

export default { listProducts, getProductByHandle, formatMoney }