import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"


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
  // const { response } = await listProducts({
  //   queryParams: { id: [id] },
  //   regionId: region.id,
  // })

  // const product = response.products[0];

  // if (!product) {
  //   return null
  // }

  return <></>
  // return <ProductActions product={product} region={region} />
}
