"use client"

import React from "react"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import ProductPrice from "./ProductPrice"
import ProductImageCarousel from "./ProductImageCarousel"

export default function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const hasMultipleOptions = (product.variants?.length || 0) > 1;

  return (
    <div className="group/card flex flex-col h-full">
      <Link href={`/products/${product.handle}`} className="block">
        <ProductImageCarousel images={product.images || []} />
      </Link>
      <div className="pt-4 text-center flex flex-col flex-grow">
        <Link href={`/products/${product.handle}`} className="block">
          <h3 className="text-sm uppercase font-thin leading-tight text-gray-800 tracking-wider">
            {product.title}
          </h3>
        </Link>
        
        {hasMultipleOptions && (
          <p className="text-xs text-gray-500 leading-tight mt-1.5">
            Available in multiple sizes & finishes
          </p>
        )}

        <div className="mt-2 flex-grow flex flex-col justify-end">
          <ProductPrice product={product} />
        </div>
      </div>
    </div>
  )
}