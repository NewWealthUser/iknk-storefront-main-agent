"use server"

import { medusaGet, MedusaGetResult } from "@lib/medusa"
import { HttpTypes } from "@medusajs/types"

export const retrieveCollection = async (id: string): Promise<HttpTypes.StoreCollection | null> => {
  const res = await medusaGet<{
    collection: HttpTypes.StoreCollection
  }>(`/store/collections/${id}`);
  if (!res.ok || !res.data?.collection) {
    console.warn(`[collections][fallback] Failed to retrieve collection '${id}': ${res.error?.message || 'Not found or unknown error'}`);
    return null;
  }
  return res.data.collection;
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  const res = await medusaGet<{
    collections: HttpTypes.StoreCollection[]
    count: number
  }>("/store/collections", queryParams);

  if (!res.ok || !res.data) {
    console.warn(`[collections][fallback] Failed to list collections: ${res.error?.message || 'Unknown error'}`);
    return { collections: [], count: 0 };
  }

  return { collections: res.data.collections, count: res.data.count ?? res.data.collections.length };
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  const res = await medusaGet<HttpTypes.StoreCollectionListResponse>(
      `/store/collections`,
      { handle, fields: "*products" }
    );
  if (!res.ok || !res.data?.collections || res.data.collections.length === 0) {
    console.warn(`[collections][fallback] Failed to get collection by handle '${handle}': ${res.error?.message || 'Not found or unknown error'}`);
    return null;
  }
  return res.data.collections[0];
}