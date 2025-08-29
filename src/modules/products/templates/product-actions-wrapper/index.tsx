import { HttpTypes } from "@medusajs/types"
import ProductActionsClient from "@modules/products/components/product-actions-client" // Updated import
import { listProducts } from "@lib/medusa" // Added import for listProducts

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
  const { data } = await listProducts({ // Re-enabled product fetching
    queryParams: { id: [id] },
    regionId: region.id,
  })

  const product = data?.products[0];

  if (!product) {
    return null
  }

  return <ProductActionsClient product={product} region={region} /> // Updated to use ProductActionsClient
}
