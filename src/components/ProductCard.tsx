"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import ProductPrice from "./ProductPrice"
import ProductImageCarousel from "./ProductImageCarousel"
import QuickAdd from "./QuickAdd"
import { isSimpleProduct } from "@lib/util/product"
import { Button, Text } from "@medusajs/ui"
import clsx from "clsx"

export default function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const simpleProduct = isSimpleProduct(product)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Check if the product is new based on tags or metadata
  const isNew = product.tags?.some(tag => tag.value.toLowerCase() === "new") || (product.metadata as any)?.is_new === true

  return (
    <div className="group/card flex h-full w-full flex-col">
      <div className="relative">
        <Link href={`/products/${product.handle}`} className="block">
          <ProductImageCarousel images={product.images || []} initialImageIndex={currentImageIndex} />
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
          {isNew && (
            <Text className="font-medium text-xs uppercase text-black mb-1">
              New
            </Text>
          )}
          <h3 className="font-medium text-sm text-gray-800 hover:text-black transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="mt-2">
          <ProductPrice product={product} />
        </div>
        {product.images && product.images.length > 1 && (
          <div className="flex justify-center gap-1 mt-4">
            {product.images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setCurrentImageIndex(index)}
                className={clsx(
                  "relative w-8 h-8 rounded-full overflow-hidden border transition-all",
                  {
                    "border-black": index === currentImageIndex,
                    "border-gray-200 hover:border-gray-400": index !== currentImageIndex,
                  }
                )}
                aria-label={`Select image ${index + 1}`}
              >
                <Image
                  src={img.url || ""}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}