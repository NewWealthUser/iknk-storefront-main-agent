import type { NextApiRequest, NextApiResponse } from "next"
import { listProducts } from "@lib/medusa"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await listProducts(req.query as any)
    res.status(200).json(data)
  } catch (e: any) {
    res.status(500).json({ message: e.message })
  }
}
