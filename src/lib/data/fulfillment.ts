"use server"

import { sdk } from "@lib/config"
import { medusaGet } from "@lib/medusa" // Removed MedusaGetResult
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const listCartShippingMethods = async (cartId: string): Promise<HttpTypes.StoreCartShippingOption[] | null> => {
  try {
    const { shipping_options } = await sdk.store.shippingOption.list(
      {
        cart_id: cartId,
        fields:
          "+service_zone.fulfllment_set.type,*service_zone.fulfillment_set.location.address",
      }
    );

    // Cast to StoreCartShippingOption[] as the API returns this type when cart_id is provided
    return shipping_options as HttpTypes.StoreCartShippingOption[];
  } catch (error: any) {
    console.warn(`[fulfillment][fallback] Failed to list cart shipping methods: ${error.message || 'Unknown error'}`);
    return null;
  }
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
): Promise<HttpTypes.StoreCartShippingOption | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  const body = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  try {
    const { shipping_option } = await sdk.store.shippingOption.calculate(
      optionId,
      body,
      {},
      headers
    );
    return shipping_option;
  } catch (e: any) {
    console.error(`[fulfillment][error] Failed to calculate price for shipping option '${optionId}': ${e.message}`);
    return null
  }
}