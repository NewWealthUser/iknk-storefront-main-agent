"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import ProductGridCard from "./ProductCard/ProductGridCard"

type Props = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

export default function ProductGrid({ products, region }: Props) {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500 py-10">No products available.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
      {products.map((product) => (
        <ProductGridCard key={product.id} product={product} region={region} />
      ))}
    </div>
  )
}