import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActionsClient from "@modules/products/components/product-actions-client"
import { adaptMedusaProductToRhProduct } from "@lib/util/rh-product-adapter"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region: HttpTypes.StoreRegion
}) {
  const res = await listProducts({
    queryParams: { id: [id] } as any,
    regionId: region.id,
  })

  if (!res.response.products || res.response.products.length === 0) {
    console.warn(`[product-actions-wrapper][fallback] Failed to fetch product '${id}': ${res.error?.message || 'Not found or unknown error'}`);
    return null;
  }

  const product = res.response.products[0];

  return <ProductActionsClient product={adaptMedusaProductToRhProduct(product)} region={region} />
}