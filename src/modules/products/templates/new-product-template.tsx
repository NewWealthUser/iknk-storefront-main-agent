"use client"
import React, { useState } from "react"
import Image from "next/image"
import ProductPrice from "../../../components/ProductPrice"
import { HttpTypes } from "@medusajs/types"
import { useCartActions } from "@lib/hooks/use-cart-actions"

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  relatedProducts?: HttpTypes.StoreProduct[]
}

const NewProductTemplate: React.FC<Props> = ({ product, region }) => {
  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.url)
  const [showDetails, setShowDetails] = useState(false)
  const [showCare, setShowCare] = useState(false)

  const { addItem, loading, error } = useCartActions()

  const handleAddToCart = async () => {
    if (!product.variants?.[0]?.id) {
      console.error("No variant selected or variant ID missing.")
      return
    }
    // TODO: Get actual cartId
    const cartId = "some_cart_id"; // Placeholder
    await addItem(cartId, product.variants[0].id, 1)
  }

  if (!product || !product.variants?.length) {
    return <p>Product details unavailable</p>
  }

  return (
    <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
      {/* LEFT COLUMN - IMAGE CAROUSEL */}
      <div>
        <Image
          src={selectedImage || "/placeholder.png"}
          alt={product.title}
          width={800}
          height={800}
          className="object-contain w-full h-auto"
        />
        <div className="flex gap-2 mt-4">
          {product.images?.map((img, i) => (
            <button key={i} onClick={() => setSelectedImage(img.url)}>
              <Image
                src={img.url}
                alt={product.title}
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
        {typeof product.description === "string" &&
  product.description.split("\n").map((d, i) => <p key={i} className="text-gray-600 mt-2">{d}</p>)}

        <div className="mt-6">
          <span className="text-sm text-black mr-2">Starting at</span>
          <div className="flex gap-2 items-baseline">
            <span className="font-serif text-lg">
              {product.variants?.[0]?.calculated_price?.calculated_amount != null ? product.variants?.[0]?.calculated_price?.calculated_amount / 100 : ""}{" "}
              {product.variants?.[0]?.calculated_price?.currency_code?.toUpperCase()}
            </span>
            {product.variants?.[0]?.calculated_price?.original_amount && (
              <span className="line-through text-gray-500 text-sm">
                {product.variants?.[0]?.calculated_price?.original_amount / 100}{" "}
                {product.variants?.[0]?.calculated_price?.currency_code?.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Options (Swatches / Variants) */}
        {product.options?.map((opt) => (
          <div key={opt.id} className="mt-8">
            <h3 className="uppercase text-sm font-medium mb-2">{opt.title}</h3>
            <div className="grid grid-cols-6 gap-3">
              {opt.values?.map((val, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center border p-2 hover:border-black transition"
                >
                  {val.metadata?.swatch && (
                    <img
                      src={String(val.metadata.swatch ?? "")}
                      alt={String(val.value ?? "")}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <span className="text-xs mt-1">{String(val.value ?? "")}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {product.metadata?.dimensions && (
          <div className="mt-8">
            <h3 className="uppercase text-sm font-medium mb-2">Dimensions</h3>
            <ul className="list-disc pl-5 text-sm">
              {String(product.metadata.dimensions ?? "").split(";").map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="w-full bg-black text-white py-3 uppercase tracking-wide"
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

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
              <p>{String(product.metadata?.care ?? "") || "Refer to our Care Guide."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewProductTemplate