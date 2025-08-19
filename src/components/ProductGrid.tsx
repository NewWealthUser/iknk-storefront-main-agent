"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import ProductCard from "./ProductCard"
import { Button } from "@medusajs/ui"

type ProductGridProps = {
  products: HttpTypes.StoreProduct[]
  count?: number
  limit?: number
  offset?: number
  onLoadMore?: () => void
}

export default function ProductGrid({ products, count, limit, offset, onLoadMore }: ProductGridProps) {
  if (!products?.length) {
    return <div className="py-10 text-center text-gray-500">No products found.</div>
  }

  const hasMore = count && limit && offset !== undefined ? offset + limit < count : false

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 lg:gap-x-7 lg:gap-y-12">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {hasMore && onLoadMore && (
        <div className="text-center mt-12">
          <Button onClick={onLoadMore} variant="secondary">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}