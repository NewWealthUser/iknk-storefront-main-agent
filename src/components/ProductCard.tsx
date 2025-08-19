"use client"

import React, { useState } from "react"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import ProductPrice from "./ProductPrice"
import ProductImageCarousel from "./ProductImageCarousel"

const getUniqueOptionValues = (product: HttpTypes.StoreProduct, optionTitle: string) => {
  const option = product.options?.find(o => o.title.toLowerCase() === optionTitle.toLowerCase());
  if (!option) return [];
  return Array.from(new Set(option.values?.map(v => v.value))).slice(0, 6); // Limit to 6
};

export default function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const finishes = getUniqueOptionValues(product, "Finish");
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);

  const hasMultipleOptions = (product.variants?.length || 0) > 1;

  return (
    <div className="group/card flex flex-col h-full">
      <Link href={`/products/${product.handle}`} className="block">
        <ProductImageCarousel images={product.images || []} />
      </Link>
      <div className="pt-2 text-center flex flex-col flex-grow">
        {hasMultipleOptions && (
          <p className="text-[11px] text-gray-500 leading-tight">
            Available in multiple sizes & finishes
          </p>
        )}
        <Link href={`/products/${product.handle}`} className="block mt-1.5">
          <h3 className="text-[13px] uppercase font-thin leading-tight text-gray-800 tracking-wider">
            {product.title}
          </h3>
        </Link>
        <div className="mt-2.5">
          <ProductPrice product={product} />
        </div>
        
        <div className="flex-grow flex flex-col justify-end">
          {finishes.length > 0 && (
            <div className="mt-5 flex items-center justify-center gap-1">
              {finishes.map(finish => (
                <div key={finish} className="inline-flex flex-col">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFinish(finish);
                    }}
                    className="h-4 w-6 rounded-sm border border-gray-300"
                    style={{ backgroundColor: finish.toLowerCase() }}
                    aria-label={`Finish: ${finish}`}
                  />
                  <div
                    className={`mt-1 h-[1px] transition-opacity duration-200 ${
                      selectedFinish === finish ? "bg-black opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}