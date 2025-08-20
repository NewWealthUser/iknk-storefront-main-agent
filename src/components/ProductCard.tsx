"use client"

import React from "react"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import ProductPrice from "./ProductPrice"
import ProductImageCarousel from "./ProductImageCarousel"
import QuickAdd from "./QuickAdd"
import { isSimpleProduct } from "@lib/util/product"
import { Button } from "@medusajs/ui"

export default function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const simpleProduct = isSimpleProduct(product)

  return (
    <div className="group/card flex h-full w-full flex-col">
      <div className="relative">
        <Link href={`/products/${product.handle}`} className="block">
          <ProductImageCarousel images={product.images || []} />
        </Link>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
          {simpleProduct ? (
            <QuickAdd product={product} />
          ) : (
            <Link href={`/products/${product.handle}`} passHref>
              <Button asChild className="w-full">
                <span>View options</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="pt-4 text-center flex flex-col flex-grow">
        <Link href={`/products/${product.handle}`} className="block">
          <h3 className="font-medium text-sm text-gray-800 hover:text-black transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="mt-2">
          <ProductPrice product={product} />
        </div>
      </div>
    </div>
  )
}