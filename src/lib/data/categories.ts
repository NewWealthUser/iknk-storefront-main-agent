import { medusaGet } from "@lib/medusa"
import { HttpTypes } from "@medusajs/types"

export const listCategories = async (query?: Record<string, any>) => {
  const limit = query?.limit || 100

  const { product_categories } = await medusaGet<{
    product_categories: HttpTypes.StoreProductCategory[]
  }>("/store/product-categories", {
    fields:
      "*category_children, *products, *parent_category, *parent_category.parent_category",
    limit,
    ...query,
  })

  return product_categories
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const { product_categories } =
    await medusaGet<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        fields: "*category_children, *products",
        handle,
      }
    )

  return product_categories[0]
}