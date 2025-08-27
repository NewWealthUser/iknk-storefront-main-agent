"use server"

import { medusaGet, MedusaGetResult } from "@lib/medusa"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string): Promise<HttpTypes.StorePaymentProvider[] | null> => {
  const res = await medusaGet<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      { region_id: regionId }
    );

  if (!res.ok || !res.data?.payment_providers) {
    console.warn(`[payment][fallback] Failed to list cart payment methods: ${res.error?.message || 'Unknown error'}`);
    return null;
  }

  return res.data.payment_providers?.sort((a: HttpTypes.StorePaymentProvider, b: HttpTypes.StorePaymentProvider) => {
    return a.id > b.id ? 1 : -1
  });
}