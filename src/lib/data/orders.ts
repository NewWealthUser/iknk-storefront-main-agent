"use server"

import { sdk } from "@lib/config"
import { medusaGet, MedusaGetResult } from "@lib/medusa"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const retrieveOrder = async (id: string): Promise<HttpTypes.StoreOrder | null> => {
  const res = await medusaGet<HttpTypes.StoreOrderResponse>(
    `/store/orders/${id}`,
    {
      fields:
        "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product",
    }
  );
  if (!res.ok || !res.data?.order) {
    console.warn(`[orders][fallback] Failed to retrieve order '${id}': ${res.error?.message || 'Not found or unknown error'}`);
    return null;
  }
  return res.data.order;
}

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
): Promise<HttpTypes.StoreOrder[] | null> => {
  const res = await medusaGet<HttpTypes.StoreOrderListResponse>(
    `/store/orders`,
    {
      limit,
      offset,
      order: "-created_at",
      fields: "*items,+items.metadata,*items.variant,*items.product",
      ...filters,
    }
  );
  if (!res.ok || !res.data?.orders) {
    console.warn(`[orders][fallback] Failed to list orders: ${res.error?.message || 'Unknown error'}`);
    return null;
  }
  return res.data.orders;
}

export const createTransferRequest = async (
  state: {
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  order: HttpTypes.StoreOrder | null
}> => {
  const id = formData.get("order_id") as string

  if (!id) {
    return { success: false, error: "Order ID is required", order: null }
  }

  const headers = await getAuthHeaders()

  return await sdk.store.order
    .requestTransfer(
      id,
      {},
      {
        fields: "id, email",
      },
      headers
    )
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const acceptTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .acceptTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const declineTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .declineTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}