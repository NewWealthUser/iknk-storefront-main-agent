import { sdk } from "@lib/config"
import { adaptMedusaProductToRhProduct, RhProduct } from "./util/rh-product-adapter";
import { HttpTypes } from "@medusajs/types";
import { resolveMedusaUrl } from "./util/medusa-url";
import { fetchWithTimeout } from "./util/fetch-with-timeout";

const MEDUSA_URL_ENV = process.env.NEXT_PUBLIC_MEDUSA_URL;
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

const BASE_MEDUSA_URL = resolveMedusaUrl(MEDUSA_URL_ENV);
if (!BASE_MEDUSA_URL) {
  throw new Error("[medusa][config] Invalid or missing NEXT_PUBLIC_MEDUSA_URL. Cannot initialize Medusa client.");
}
if (!PUBLISHABLE_API_KEY) {
  throw new Error("[medusa][config] NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set. Cannot initialize Medusa client.");
}

interface MedusaGetError {
  stage: 'config' | 'request' | 'response' | 'parse';
  status?: number;
  url?: string;
  method?: string;
  message: string;
  raw?: any;
  body?: any;
}

export interface MedusaGetResult<T> {
  ok: boolean;
  data?: T;
  error?: MedusaGetError;
}

export async function medusaGet<T>(
  path: string,
  queryParams?: Record<string, any>,
  init?: RequestInit,
  opts?: { throwOnError?: boolean }
): Promise<MedusaGetResult<T>> {
  const url = `${BASE_MEDUSA_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const method = init?.method || "GET";

  try {
    const { headers, ...restInit } = init || {};

    const requestHeaders: Record<string, string> = {
      ...headers as Record<string, string>,
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_API_KEY!,
    };

    const res = await fetchWithTimeout(url, {
      method,
      headers: requestHeaders,
      ...restInit,
    }, 6000);

    if (!res.ok) {
      let body: any = null;
      try {
        body = await res.json();
      } catch (e) {
        body = await res.text().catch(() => null);
      }

      const message = `Medusa responded ${res.status} ${res.statusText} for ${url}` + (body?.message ? `: ${body.message}` : (typeof body === 'string' && body.length > 0 ? `: ${body}` : ""));
      const error: MedusaGetError = {
        stage: "response",
        status: res.status,
        url,
        method,
        message: `[medusa][response][${res.status}] ${message}`,
        body,
      };

      console.error(error.message, error);
      if (opts?.throwOnError) throw new Error(error.message);
      return { ok: false, error };
    }

    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (e: any) {
    let message: string;
    let stage: MedusaGetError['stage'] = "request";
    let rawError: any = e;

    if (e?.name === "AbortError") {
      message = `[medusa][timeout] Medusa request timed out for ${url}`;
    } else if (e instanceof TypeError) {
      message = `[medusa][network] Network error calling Medusa ${url}: ${e.message}`;
    } else if (e?.message) {
      message = `[medusa][request] Error calling Medusa ${url}: ${e.message}`;
    } else {
      message = `[medusa][unknown] An unknown error occurred during request to ${url}: ${String(e)}`;
    }

    const error: MedusaGetError = {
      stage,
      url,
      method,
      message,
      raw: rawError,
    };

    console.error(error.message, error);
    if (opts?.throwOnError) throw new Error(error.message);
    return { ok: false, error };
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
}): Promise<MedusaGetResult<{ products: RhProduct[]; count: number; limit: number; offset: number }>> {
  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  const region_id = regionId;

  const res = await medusaGet<{ products: HttpTypes.StoreProduct[]; count: number }>(`/store/products`, {
    limit,
    offset,
    region_id,
    fields:
      "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
    sales_channel_id: process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID,
    ...queryParams,
  });

  if (!res.ok || !res.data) {
    console.warn(`[products][fallback] Failed to list products: ${res.error?.message || 'Unknown error'}`);
    return { ok: false, error: res.error };
  }

  const adaptedProducts = res.data.products.map(adaptMedusaProductToRhProduct);

  return {
    ok: true,
    data: {
      products: adaptedProducts,
      count: res.data.count,
      limit: limit,
      offset: offset,
    },
  };
}

export async function getProductByHandle(handle: string, countryCode: string): Promise<RhProduct | null> {
  const res = await listProducts({ queryParams: { handle, limit: 1 } as any, countryCode });
  if (!res.ok || !res.data?.products || res.data.products.length === 0) {
    console.warn(`[product][fallback] Failed to get product by handle '${handle}': ${res.error?.message || 'Not found or unknown error'}`);
    return null;
  }
  return res.data.products[0];
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