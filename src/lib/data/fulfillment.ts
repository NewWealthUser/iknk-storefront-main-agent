"use server"

import { sdk } from "@lib/config"
import { medusaGet, MedusaGetResult } from "@lib/medusa"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const listCartShippingMethods = async (cartId: string): Promise<HttpTypes.StoreCartShippingOption[] | null> => {
  const res = await medusaGet<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        cart_id: cartId,
        fields:
          "+service_zone.fulfllment_set.type,*service_zone.fulfillment_set.location.address",
      }
    );

  if (!res.ok || !res.data?.shipping_options) {
    console.warn(`[fulfillment][fallback] Failed to list cart shipping methods: ${res.error?.message || 'Unknown error'}`);
    return null;
  }
  // Cast to StoreCartShippingOption[] as the API returns this type when cart_id is provided
  return res.data.shipping_options as HttpTypes.StoreCartShippingOption[];
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
    ...(await getCacheOptions("fulfillment")), // Corrected: closing parenthesis moved
  }

  const body = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  return sdk.client
    .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
      `/store/shipping-options/${optionId}/calculate`,
      {
        method: "POST",
        body,
        headers,
        next,
      }
    )
    .then(({ shipping_option }) => shipping_option)
    .catch((e) => {
      console.error(`[fulfillment][error] Failed to calculate price for shipping option '${optionId}': ${e.message}`);
      return null
    })
}