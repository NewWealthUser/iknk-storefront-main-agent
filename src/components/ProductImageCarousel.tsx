"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"

type ImageType = { id: string; url: string | null }

export default function ProductImageCarousel({ images }: { images: ImageType[] }) {
  const [idx, setIdx] = useState(0)

  if (!images?.length) {
    return <div className="aspect-[4/5] bg-gray-100 rounded-lg" />
  }

  const activeImage = images[idx]

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + 1) % images.length)
  }
  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i - 1 + images.length) % images.length)
  }

  return (
    <div className="w-full relative group/carousel">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-50 relative">
        {activeImage.url && (
          <Image
            src={activeImage.url}
            alt="Product image"
            fill
            className="object-cover transition-transform duration-300 group-hover/carousel:scale-105"
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          />
        )}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIdx(i)
                }}
                className={`h-[5px] w-[5px] rounded-full transition-colors ${
                  i === idx ? "bg-black" : "bg-gray-300 hover:bg-gray-500"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}