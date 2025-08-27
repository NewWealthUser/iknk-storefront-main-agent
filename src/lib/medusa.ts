import { sdk } from "@lib/config"
import { adaptMedusaProductToRhProduct, RhProduct } from "./util/rh-product-adapter";
import { HttpTypes } from "@medusajs/types"; // Ensure HttpTypes is imported

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
      ...restInit,
    });
    return data;
  } catch (error: any) {
    let parsedError = error;

    // Attempt to parse the error if it's a stringified JSON
    if (typeof error === 'string') {
      try {
        parsedError = JSON.parse(error);
      } catch (e) {
        // Not a JSON string, keep original error
      }
    }

    if (parsedError.response) {
      // Medusa SDK errors often have a 'response' property with status and data
      const message = parsedError.response.data?.message || parsedError.response.statusText || "An unknown error occurred.";
      throw new Error(`Medusa request failed: ${parsedError.response.status} - ${message}`);
    } else if (parsedError.request) {
      // The request was made but no response was received
      throw new Error("No response received from Medusa backend. Is it running?");
    } else {
      // Fallback for generic or unknown error structures
      const errorMessage = parsedError.message || JSON.stringify(parsedError) || "An unknown error occurred.";
      console.error("Unknown error in medusaGet:", errorMessage);
      throw new Error(`Error setting up Medusa request: ${errorMessage}`);
    }
  }
}

export async function listProducts({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{ products: RhProduct[]; count: number; limit: number; offset: number }> {
  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  // For now, we'll assume regionId is passed or derived elsewhere if needed
  // In a real scenario, you'd fetch the region based on countryCode here
  const region_id = regionId;

  const data = await medusaGet<{ products: HttpTypes.StoreProduct[]; count: number }>(`/store/products`, {
    limit,
    offset,
    region_id,
    fields:
      "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
    sales_channel_id: process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID,
    ...queryParams,
  });

  const adaptedProducts = data.products.map(adaptMedusaProductToRhProduct);

  return {
    products: adaptedProducts,
    count: data.count,
    limit: limit,
    offset: offset,
  };
}

export async function getProductByHandle(handle: string, countryCode: string): Promise<RhProduct | null> {
  const data = await listProducts({ queryParams: { handle, limit: 1 } as any, countryCode });
  return data.products[0] || null;
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