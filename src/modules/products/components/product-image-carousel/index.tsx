"use client"

import React, { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

type ImageType = HttpTypes.StoreProductImage
export default function ProductImageCarousel({ images }: { images: ImageType[] }) {
  const [idx, setIdx] = useState(0)
  if (!images?.length) return <div className="aspect-[4/5] bg-gray-100 rounded-lg" />

  const active = images[Math.min(idx, images.length - 1)]
  return (
    <div className="w-full">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-50 relative">
        <Image src={active.url || ""} alt="Product image" fill className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((im, i) => (
            <button
              key={im.id}
              onClick={() => setIdx(i)}
              className={`aspect-square rounded-md overflow-hidden border relative ${i === idx ? "border-black" : "border-gray-200"}`}
              aria-label={`Show image ${i + 1}`}
            >
              <Image src={im.url || ""} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}