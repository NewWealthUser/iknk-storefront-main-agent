"use server"

import { sdk } from "@lib/config"

import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const retrieveOrder = async (id: string): Promise<HttpTypes.StoreOrder | null> => {
  try {
    const { order } = await sdk.store.order.retrieve(
      id,
      {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product",
      }
    );
    return order;
  } catch (error: any) {
    console.warn(`[orders][fallback] Failed to retrieve order '${id}': ${error.message || 'Not found or unknown error'}`);
    return null;
  }
}

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
): Promise<HttpTypes.StoreOrder[] | null> => {
  try {
    const { orders } = await sdk.store.order.list(
      {
        limit,
        offset,
        order: "-created_at",
        fields: "*items,+items.metadata,*items.variant,*items.product",
        ...filters,
      }
    );
    return orders;
  } catch (error: any) {
    console.warn(`[orders][fallback] Failed to list orders: ${error.message || 'Unknown error'}`);
    return null;
  }
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
    .then(({ order }: { order: HttpTypes.StoreOrder }) => ({ success: true, error: null, order })) // Fixed: Explicitly typed order
    .catch((err: any) => ({ success: false, error: err.message, order: null })) // Fixed: Explicitly typed err as any
}

export const acceptTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .acceptTransfer(id, { token }, {}, headers)
    .then(({ order }: { order: HttpTypes.StoreOrder }) => ({ success: true, error: null, order })) // Fixed: Explicitly typed order
    .catch((err: any) => ({ success: false, error: err.message, order: null })) // Fixed: Explicitly typed err as any
}

export const declineTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .declineTransfer(id, { token }, {}, headers)
    .then(({ order }: { order: HttpTypes.StoreOrder }) => ({ success: true, error: null, order })) // Fixed: Explicitly typed order
    .catch((err: any) => ({ success: false, error: err.message, order: null })) // Fixed: Explicitly typed err as any
}