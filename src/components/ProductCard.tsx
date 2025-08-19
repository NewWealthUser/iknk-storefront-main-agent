"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import ProductPrice from "./ProductPrice"

type Product = HttpTypes.StoreProduct & {
  images?: HttpTypes.StoreProductImage[] | null
  variants?: HttpTypes.StoreProductVariant[] | null
}

// Helper to get unique option values, e.g., all "Finishes"
const getUniqueOptionValues = (product: Product, optionTitle: string) => {
  const option = product.options?.find(o => o.title.toLowerCase() === optionTitle.toLowerCase());
  if (!option) return [];
  return Array.from(new Set(option.values?.map(v => v.value)));
};

export default function ProductCard({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.images?.[0]?.url || product.thumbnail);
  const finishes = getUniqueOptionValues(product, "Finish").slice(0, 6);

  const handleSwatchHover = (finish: string) => {
    // Simple logic: find the first image with metadata matching the finish
    const matchingImage = product.images?.find(img => (img.metadata as any)?.finish === finish);
    if (matchingImage) {
      setActiveImage(matchingImage.url);
    }
  };

  const handleSwatchLeave = () => {
    setActiveImage(product.images?.[0]?.url || product.thumbnail);
  };

  return (
    <div className="group">
      <div className="relative">
        <Link href={`/product/${product.handle}`} className="block">
          <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50 relative rounded-sm">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.title || "Product image"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-gray-400 text-sm">No image</div>
            )}
          </div>
        </Link>
        {(product.images?.length ?? 0) > 1 && (
             <div className="mt-2 flex items-center justify-center gap-1.5">
                {product.images?.slice(0, 5).map((img, i) => (
                    <div key={img.id} className={`h-[3px] w-[3px] rounded-full ${i === 0 ? 'bg-black' : 'bg-gray-300'}`} />
                ))}
            </div>
        )}
      </div>

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
                        onMouseEnter={() => handleSwatchHover(finish)}
                        onMouseLeave={handleSwatchLeave}
                        className="h-6 w-6 rounded-[6px] border border-gray-300 hover:border-gray-500 focus:ring-1 focus:ring-black focus:ring-offset-1"
                        style={{ backgroundColor: finish.toLowerCase() }} // Assumes finish names are valid colors
                        aria-label={`Finish: ${finish}`}
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  )
}