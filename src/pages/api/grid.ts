import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { limit, offset, countryCode, collection_id, category_id, sort, ...options } = req.query

  if (!countryCode || typeof countryCode !== 'string') {
    return res.status(400).json({ message: "countryCode is required." });
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return res.status(404).json({ message: "Region not found" })
  }

  const queryParams: HttpTypes.StoreProductParams | any = {
    limit: limit ? parseInt(limit as string) : 24,
    offset: offset ? parseInt(offset as string) : 0,
    region_id: region.id,
  }

  if (collection_id) {
    queryParams.collection_id_in = Array.isArray(collection_id) ? collection_id : [collection_id as string] // Ensure it's an array, v2 param
  }

  if (category_id) {
    queryParams.category_id_in = Array.isArray(category_id) ? category_id : [category_id as string] // Ensure it's an array, v2 param
  }

  // Handle sorting
  if (sort) {
    if (sort === 'price_asc') {
      queryParams.order = 'variants.prices.amount'
    }
    if (sort === 'price_desc') {
      queryParams.order = '-variants.prices.amount'
    }
    if (sort === 'created_at') {
      queryParams.order = '-created_at'
    }
  }

  // Handle option filters (assuming these map to tags_in or metadata filters in v2)
  const tags_in: string[] = [];
  for (const key in options) {
    if (key.startsWith('options[')) {
      const optionName = key.substring(8, key.length - 1);
      tags_in.push(`${optionName}:${options[key]}`); // Assuming options map to tags
    }
  }
  if (tags_in.length > 0) {
    queryParams.tags_in = tags_in; // v2 param
  }

  try {
    const { response } = await listProducts({ queryParams, countryCode })
    res.status(200).json(response)
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products." });
  }
}