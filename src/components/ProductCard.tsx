"use client"

import React, { useState } from "react"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import ProductPrice from "./ProductPrice"
import ProductImageCarousel from "./ProductImageCarousel"

// Helper to get unique option values, e.g., for finishes
const getUniqueOptionValues = (product: HttpTypes.StoreProduct, optionTitle: string) => {
  const option = product.options?.find(o => o.title.toLowerCase() === optionTitle.toLowerCase());
  if (!option) return [];
  // Get unique values and limit to a max of 6 for display
  return Array.from(new Set(option.values?.map(v => v.value))).slice(0, 6); 
};

export default function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  // We'll assume an option named "Finish" for the swatches
  const finishes = getUniqueOptionValues(product, "Finish");
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);

  const hasMultipleOptions = (product.variants?.length || 0) > 1;

  return (
    <div className="group/card flex h-full w-full flex-col">
      <Link href={`/products/${product.handle}`} className="block">
        <ProductImageCarousel images={product.images || []} />
      </Link>
      <div className="pt-2 text-center flex flex-col flex-grow">
        {hasMultipleOptions && (
          <p className="my-0 pt-1.5 font-thin text-[10px] leading-[13.2px] text-black sm:pt-2.5 sm:text-[13px] sm:leading-5 lg:pt-1.5">
            Available in multiple sizes & finishes
          </p>
        )}
        <div className="mt-1.5 sm:mt-2 md:mt-2.5">
          <Link href={`/products/${product.handle}`} className="block">
            <h3 className="font-thin text-[13px] uppercase leading-[13.2px] text-gray-800 sm:leading-5 tracking-wider">
              {product.title}
            </h3>
          </Link>
        </div>
        <div className="mt-2">
          <ProductPrice product={product} />
        </div>
        
        <div className="flex-grow flex flex-col justify-end">
          {finishes.length > 0 && (
            <div className="mt-5 grid auto-cols-max grid-flow-col gap-1 justify-center">
              {finishes.map(finish => (
                <div key={finish} className="inline-flex flex-col">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFinish(finish);
                    }}
                    className="h-4 w-6 rounded-sm border border-gray-300"
                    // A simple way to map common finish names to colors for the demo
                    style={{ backgroundColor: finish.toLowerCase().replace(/\s/g, '') }}
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