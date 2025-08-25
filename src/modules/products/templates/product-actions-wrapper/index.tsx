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
  const product = await listProducts({
    queryParams: { id: [id] } as any,
    regionId: region.id,
  }).then(({ response }) => response.products[0])

  if (!product) {
    return null
  }

  return <ProductActionsClient product={adaptMedusaProductToRhProduct(product)} region={region} />
}