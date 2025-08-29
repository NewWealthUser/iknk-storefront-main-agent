import { HttpTypes } from "@medusajs/types"
import ProductActionsClient from "@modules/products/components/product-actions-client" // Updated import
import sdk from "@lib/config/sdk"

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
  const { products: data } = await sdk.store.product.list({
    id: id ? [id] as string[] : [],
  })

  const product = data?.products[0];

  if (!product) {
    return null
  }

  return <ProductActionsClient product={product} region={region} /> // Updated to use ProductActionsClient
}
