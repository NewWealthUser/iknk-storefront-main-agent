import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { limit, offset, countryCode, collection_id, category_id } = req.query

  const region = await getRegion(countryCode as string)

  if (!region) {
    return res.status(404).json({ message: "Region not found" })
  }

  const queryParams: HttpTypes.StoreProductParams | any = { // Cast to any
    limit: limit ? parseInt(limit as string) : 100,
    offset: offset ? parseInt(offset as string) : 0,
    region_id: region.id,
  }

  if (collection_id) {
    queryParams.collection_id = [collection_id as string]
  }

  if (category_id) {
    queryParams.category_id = [category_id as string]
  }

  const { response } = await listProducts({ queryParams })

  res.status(200).json(response)
}