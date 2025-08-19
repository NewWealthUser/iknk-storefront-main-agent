import React from "react"
import ProductCard from "@modules/products/components/product-card"
import { HttpTypes } from "@medusajs/types"

export default function ProductGrid({ products }: { products: HttpTypes.StoreProduct[] }) {
  if (!products?.length) return <div className="py-10 text-gray-500">No products found.</div>
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}