import { sdk } from "@lib/config"
import { adaptMedusaProductToRhProduct, RhProduct } from "./util/rh-product-adapter";
import { HttpTypes }s from "@medusajs/types"; // Ensure HttpTypes is imported

export const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL as string
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY; // Get key here

if (!MEDUSA_URL) {
  throw new Error("NEXT_PUBLIC_MEDUSA_URL is not set")
}
// Add a check for the publishable key here as well, for robustness
if (!PUBLISHABLE_API_KEY) {
  throw new Error("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set. Please configure it in your .env.local file.");
}


export async function medusaGet<T>(path: string, queryParams?: Record<string, any>, init?: RequestInit): Promise<T> {
  try {
    const { headers, ...restInit } = init || {};

    // Ensure x-publishable-api-key is always present
    const requestHeaders: Record<string, string> = {
      ...headers as Record<string, string>,
      "x-publishable-api-key": PUBLISHABLE_API_KEY!, // Non-null assertion added here
    };

    const data = await sdk.client.fetch<T>(path, {
      method: "GET",
      query: queryParams,
      headers: requestHeaders,
      ...restInit,
    });
    return data;
  } catch (error: any) {
    console.error("Raw error object in medusaGet:", error); // Log the raw error object

    let errorMessage = "An unexpected error occurred during Medusa request.";

    if (error instanceof Error) {
      errorMessage = `Error setting up Medusa request: ${error.message}`;
    } else if (error && typeof error === 'object') {
      if (error.response) {
        // Medusa SDK errors often have a 'response' property with status and data
        const message = error.response.data?.message || error.response.statusText || "An unknown error occurred.";
        errorMessage = `Medusa request failed: ${error.response.status} - ${message}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response received from Medusa backend. Is it running?";
      } else if (error.message) { // Fallback for objects with a message property
        errorMessage = `Error setting up Medusa request: ${error.message}`;
      } else {
        // Fallback for generic objects without a specific message
        errorMessage = `Unknown object error: ${JSON.stringify(error)}`;
      }
    } else if (typeof error === 'string') {
      // If the error is a string
      errorMessage = `String error: ${error}`;
    } else {
      // Fallback for completely unknown or primitive error types (e.g., null, undefined)
      errorMessage = `Non-object/non-string error: ${String(error)}`;
    }
    
    console.error("Processed error in medusaGet:", errorMessage);
    throw new Error(errorMessage);
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