import React from "react"
import Link from "next/link"
import ProductPrice from "./product-price"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

type Product = HttpTypes.StoreProduct & {
  images?: HttpTypes.StoreProductImage[] | null
  variants?: HttpTypes.StoreProductVariant[] | null
}

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0]?.url || product.thumbnail
  return (
    <div className="group rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50 relative">
          {img ? (
            <Image
              src={img}
              alt={product.title || "Product image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-gray-400 text-sm">No image</div>
          )}
        </div>
      </Link>
      <div className="p-4 space-y-1">
        <Link href={`/products/${product.handle}`} className="block">
          <h3 className="text-base font-medium line-clamp-2">{product.title}</h3>
        </Link>
        <ProductPrice product={product} />
        {/* Optional metadata pills */}
        {product.metadata?.tagline ? (
          <div className="text-xs text-gray-500">{String(product.metadata.tagline)}</div>
        ) : null}
      </div>
    </div>
  )
}