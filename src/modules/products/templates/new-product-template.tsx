"use client"
import React, { useState, useContext } from "react"
import Image from "next/image"
import ProductPrice from "../../../components/ProductPrice"
import { HttpTypes } from "@medusajs/types"
import { useCartActions } from "@lib/hooks/use-cart-actions"
import { IknkShoppingCartContext } from "@lib/context/iknk-cart-context"
import ProductActions from "@modules/products/components/product-actions" // Import ProductActions

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  relatedProducts?: HttpTypes.StoreProduct[]
}

const NewProductTemplate: React.FC<Props> = ({ product, region, countryCode }) => {
  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.url)
  const [showDetails, setShowDetails] = useState(false)
  const [showCare, setShowCare] = useState(false)

  // Add state for selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Handler for option changes
  const onOptionChange = (optionId: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionId]: value }));
  };

  // Product check as per user's previous instruction
  if (!product || !product.variants?.length) {
    return <p>Product details unavailable</p>
  }

  return (
    <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
      {/* LEFT COLUMN - IMAGE CAROUSEL */}
      <div>
        <Image
          src={selectedImage || "/placeholder.png"}
          alt={product.title || "Product image"}
          width={800}
          height={800}
          className="object-contain w-full h-auto"
        />
        <div className="flex gap-2 mt-4">
          {product.images?.map((img, i) => (
            <button key={i} onClick={() => setSelectedImage(img.url)}>
              <Image
                src={img.url || "/placeholder.png"}
                alt={product.title || "Product thumbnail"}
                width={100}
                height={100}
                className="object-contain border border-gray-300"
              />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN - PRODUCT INFO */}
      <div>
        <h1 className="text-3xl font-light uppercase">{product.title}</h1>
        {/* Description - using typeof check and map for paragraphs */}
        {typeof product.description === "string" &&
          product.description.split("\n").map((d, i) => (
            <p key={i} className="text-gray-600 mt-2">
              {d}
            </p>
          ))}

        {/* Dimensions Section */}
        {typeof product.metadata?.dimensions === "string" && product.metadata.dimensions && (
          <div className="mt-8">
            <h3 className="uppercase text-sm font-medium mb-2">Dimensions</h3>
            <ul className="list-disc pl-5 text-sm">
              {product.metadata.dimensions.split(";").map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ProductActions Component - Pass selectedOptions and onOptionChange */}
        <ProductActions
          product={product}
          region={region}
          selectedOptions={selectedOptions}
          onOptionChange={onOptionChange}
        />

        {/* Details Accordion */}
        <div className="mt-8 border-t border-gray-300 pt-4">
          <button
            className="flex justify-between w-full text-left font-medium"
            onClick={() => setShowDetails(!showDetails)}
          >
            Details
            <span>{showDetails ? "-" : "+"}</span>
          </button>
          {showDetails && (
            <div className="mt-2 text-sm text-gray-700">
              <p>{product.description}</p>
            </div>
          )}
        </div>

        {/* Care Accordion */}
        <div className="mt-4 border-t border-gray-300 pt-4">
          <button
            className="flex justify-between w-full text-left font-medium"
            onClick={() => setShowCare(!showCare)}
          >
            Care
            <span>{showCare ? "-" : "+"}</span>
          </button>
          {showCare && (
            <div className="mt-2 text-sm text-gray-700">
              <p>{String(product.metadata?.care || "Refer to our Care Guide.")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewProductTemplate