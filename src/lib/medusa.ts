import qs from "qs"

export const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL as string

if (!MEDUSA_URL) {
  throw new Error("NEXT_PUBLIC_MEDUSA_URL is not set")
}

export async function medusaGet<T>(path: string, queryParams?: Record<string, any>, init?: RequestInit): Promise<T> {
  const queryString = queryParams ? `?${qs.stringify(queryParams, { encodeValuesOnly: true })}` : "";
  const url = `${MEDUSA_URL}${path}${queryString}`;
  const res = await fetch(url, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`Medusa request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
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