"use client"

import React from "react"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import ProductPrice from "./ProductPrice"
import ProductImageCarousel from "./ProductImageCarousel"

const getUniqueOptionValues = (product: HttpTypes.StoreProduct, optionTitle: string) => {
  const option = product.options?.find(o => o.title.toLowerCase() === optionTitle.toLowerCase());
  if (!option) return [];
  return Array.from(new Set(option.values?.map(v => v.value)));
};

export default function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const finishes = getUniqueOptionValues(product, "Finish").slice(0, 6);

  return (
    <div className="group">
      <Link href={`/product/${product.handle}`} className="block">
        <ProductImageCarousel images={product.images || []} />
      </Link>
      <div className="pt-2 text-left">
        {finishes.length > 0 && (
            <p className="text-[12px] text-gray-500">Available in {finishes.length > 1 ? 'multiple finishes' : 'one finish'}</p>
        )}
        <Link href={`/product/${product.handle}`} className="block">
          <h3 className="text-sm font-medium line-clamp-2 mt-1">{product.title}</h3>
        </Link>
        <div className="mt-1">
            <ProductPrice product={product} />
        </div>
        {finishes.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
                {finishes.map(finish => (
                    <button
                        key={finish}
                        className="h-6 w-6 rounded-[6px] border border-gray-300"
                        style={{ backgroundColor: finish.toLowerCase() }}
                        aria-label={`Finish: ${finish}`}
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  )
}