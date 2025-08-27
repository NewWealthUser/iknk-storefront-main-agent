import { medusaGet, MedusaGetResult } from "@lib/medusa"
import { HttpTypes } from "@medusajs/types"

export const listCategories = async (query?: Record<string, any>): Promise<HttpTypes.StoreProductCategory[]> => {
  const limit = query?.limit || 100

  const res = await medusaGet<{
    product_categories: HttpTypes.StoreProductCategory[]
  }>("/store/product-categories", {
    fields:
      "*category_children, *products, *parent_category, *parent_category.parent_category",
    limit,
    ...query,
  })

  if (!res.ok || !res.data?.product_categories) {
    console.warn(`[categories][fallback] Failed to list categories: ${res.error?.message || 'Unknown error'}`);
    return [];
  }
  return res.data.product_categories;
}

export const getCategoryByHandle = async (categoryHandle: string[]): Promise<HttpTypes.StoreProductCategory | null> => {
  const handle = `${categoryHandle.join("/")}`

  const res = await medusaGet<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        fields: "*category_children, *products",
        handle,
      }
    )

  if (!res.ok || !res.data?.product_categories || res.data.product_categories.length === 0) {
    console.warn(`[categories][fallback] Failed to get category by handle '${handle}': ${res.error?.message || 'Not found or unknown error'}`);
    return null;
  }
  return res.data.product_categories[0];
}