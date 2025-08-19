"use server"

import { sdk } from "@lib/config"
import { medusaGet } from "@lib/medusa"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const listCartShippingMethods = async (cartId: string) => {
  const { shipping_options } =
    await medusaGet<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        cart_id: cartId,
        fields:
          "+service_zone.fulfllment_set.type,*service_zone.fulfillment_set.location.address",
      }
    ).catch(() => ({ shipping_options: null }))

  return shipping_options
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
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
      return null
    })
}