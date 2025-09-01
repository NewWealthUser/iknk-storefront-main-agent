"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const retrieveCollection = async (id: string): Promise<HttpTypes.StoreCollection | null> => {
  try {
    const { collection } = await sdk.store.collection.retrieve(id);
    return collection;
  } catch (error: any) {
    console.warn(`[collections][fallback] Failed to retrieve collection '${id}': ${error.message || 'Unknown error'}`);
    return null;
  }
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  try {
    const { collections, count } = await sdk.store.collection.list(queryParams);
    return { collections, count };
  } catch (error: any) {
    console.warn(`[collections][fallback] Failed to list collections: ${error.message || 'Unknown error'}`);
    return { collections: [], count: 0 };
  }
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  try {
    const { collections } = await sdk.store.collection.list({ handle, fields: "*products" });
    if (collections.length === 0) {
      console.warn(`[collections][fallback] Collection with handle '${handle}' not found.`);
      return null;
    }
    return collections[0];
  } catch (error: any) {
    console.warn(`[collections][fallback] Failed to get collection by handle '${handle}': ${error.message || 'Unknown error'}`);
    return null;
  }
}