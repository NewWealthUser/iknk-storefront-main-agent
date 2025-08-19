"use server"

import { medusaGet } from "@lib/medusa"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  const { payment_providers } =
    await medusaGet<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      { region_id: regionId }
    ).catch(() => ({ payment_providers: null }))

  return payment_providers?.sort((a: HttpTypes.StorePaymentProvider, b: HttpTypes.StorePaymentProvider) => {
    return a.id > b.id ? 1 : -1
  })
}