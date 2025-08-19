"use server"

import { medusaGet } from "@lib/medusa"
import { HttpTypes } from "@medusajs/types"

export const retrieveCollection = async (id: string) => {
  const { collection } = await medusaGet<{
    collection: HttpTypes.StoreCollection
  }>(`/store/collections/${id}`)
  return collection
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  const { collections, count } = await medusaGet<{
    collections: HttpTypes.StoreCollection[]
    count: number
  }>("/store/collections", queryParams)

  return { collections, count: count ?? collections.length }
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  const { collections } =
    await medusaGet<HttpTypes.StoreCollectionListResponse>(
      `/store/collections`,
      { handle, fields: "*products" }
    )
  return collections[0]
}