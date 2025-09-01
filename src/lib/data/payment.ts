"use server"

import { sdk } from "@lib/config"
import { medusaGet } from "@lib/medusa" // Removed MedusaGetResult
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string): Promise<HttpTypes.StorePaymentProvider[] | null> => {
  try {
    const { payment_providers } = await sdk.store.paymentProvider.list(
      { region_id: regionId }
    );

    return payment_providers?.sort((a: HttpTypes.StorePaymentProvider, b: HttpTypes.StorePaymentProvider) => {
      return a.id > b.id ? 1 : -1
    });
  } catch (error: any) {
    console.warn(`[payment][fallback] Failed to list cart payment methods: ${error.message || 'Unknown error'}`);
    return null;
  }
}