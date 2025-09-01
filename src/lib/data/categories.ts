import { medusaGet } from "@lib/medusa" // Removed MedusaGetResult
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"

export const listCategories = async (query?: Record<string, any>): Promise<HttpTypes.StoreProductCategory[]> => {
  const limit = query?.limit || 100

  try {
    const { product_categories } = await sdk.store.productCategory.list({
      fields:
        "*category_children, *products, *parent_category, *parent_category.parent_category",
      limit,
      ...query,
    });

    return product_categories;
  } catch (error: any) {
    console.warn(`[categories][fallback] Failed to list categories: ${error.message || 'Unknown error'}`);
    return [];
  }
}

export const getCategoryByHandle = async (categoryHandle: string[]): Promise<HttpTypes.StoreProductCategory | null> => {
  const handle = `${categoryHandle.join("/")}`

  try {
    const { product_categories } = await sdk.store.productCategory.list(
      {
        fields: "*category_children, *products",
        handle,
      }
    );

    if (!product_categories || product_categories.length === 0) {
      console.warn(`[categories][fallback] Category with handle '${handle}' not found.`);
      return null;
    }
    return product_categories[0];
  } catch (error: any) {
    console.warn(`[categories][fallback] Failed to get category by handle '${handle}': ${error.message || 'Not found or unknown error'}`);
    return null;
  }
}