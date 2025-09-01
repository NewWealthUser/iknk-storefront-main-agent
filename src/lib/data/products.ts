"use server"

import { sdk } from "@lib/config"
import { medusaGet } from "@lib/medusa" // Removed MedusaGetResult
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "types/sort-options"
import { getRegion, retrieveRegion } from "./regions"

export async function listProducts({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  // Map queryParams to v2 conventions
  const v2QueryParams: HttpTypes.StoreProductParams | any = { // Fixed: Cast to any
    limit,
    offset,
    region_id: region?.id,
    fields:
      "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
    ...queryParams,
  };

  if ((queryParams as any).collection_id) {
    v2QueryParams.collection_id_in = (queryParams as any).collection_id; // Fixed: Access as any
    delete (v2QueryParams as any).collection_id;
  }
  if ((queryParams as any).category_id) {
    v2QueryParams.category_id_in = (queryParams as any).category_id; // Fixed: Access as any
    delete (v2QueryParams as any).category_id;
  }
  if ((queryParams as any).tags) {
    v2QueryParams.tags_in = (queryParams as any).tags.value; // Fixed: Access as any
    delete (v2QueryParams as any).tags;
  }
  if ((queryParams as any).inventory_quantity) {
    v2QueryParams.inventory_quantity = (queryParams as any).inventory_quantity; // Fixed: Access as any
  }

  try {
    const { products, count } = await sdk.store.product.list(v2QueryParams);

    const nextPage = count > offset + limit ? pageParam + 1 : null

    return {
      response: {
        products,
        count,
      },
      nextPage: nextPage,
      queryParams,
    }
  } catch (error: any) {
    console.warn(`[products][fallback] Failed to list products: ${error.message || 'Unknown error'}`);
    return { response: { products: [], count: 0 }, nextPage: null };
  }
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100, // Fetch more to sort locally if needed
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}