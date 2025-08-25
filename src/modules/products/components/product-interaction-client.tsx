"use client"

import React, { useState, useCallback, useEffect } from "react"
import ProductActions from "@modules/products/components/product-actions"
import IknkSwatchSelector from "@modules/products/components/iknk-swatch-selector"
import IknkPersonalizationOptions from "@modules/products/components/iknk-personalization-options"
import IknkCustomProductConfigurator from "@modules/products/components/iknk-custom-product-configurator"
import IknkProductAddons from "@modules/products/components/iknk-product-addons"
import ProductPrice from "@modules/products/components/product-price"

import { RhProduct, RhVariant } from "@lib/util/rh-product-adapter"
import { HttpTypes } from "@medusajs/types"
import { isEqual, debounce } from "lodash"

type ProductInteractionClientProps = {
  product: RhProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  selectedVariant: RhVariant | undefined
  setSelectedVariant: (variant: RhVariant) => void
}

const ProductInteractionClient: React.FC<ProductInteractionClientProps> = ({
  product,
  region,
  countryCode,
  selectedVariant,
  setSelectedVariant,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | undefined>
  >({})

  const handleOptionChange = useCallback(
    (optionId: string, value: string) => {
      setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    },
    [setSelectedOptions]
  )

  useEffect(() => {
    const newVariant = product.variants?.find((v: RhVariant) => {
      const variantOptions =
        v.options?.map((opt: { id?: string; value?: string; option_id?: string }) => ({ option_id: opt.option_id || opt.id, value: opt.value })) ||
        []
      const selected = { ...selectedOptions }
      // delete selected.undefined
      const variantMap = variantOptions.reduce(
        (acc: Record<string, string>, opt: any) => {
          acc[opt.option_id] = opt.value
          return acc
        },
        {}
      )

      return isEqual(variantMap, selected)
    })
    if (newVariant && newVariant.id !== selectedVariant?.id) {
      setSelectedVariant(newVariant)
    }
  }, [product.variants, selectedOptions, selectedVariant, setSelectedVariant])

  return (
    <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
      {/* ProductOnboardingCta removed from here */}
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl md:text-3xl font-primary-thin uppercase tracking-widest">
          {product.displayName}
        </h1>
        <div className="mt-2">
          <ProductPrice product={product} variant={selectedVariant} />
        </div>
      </div>
      {/* ProductActions is a Client Component, so it can use state from here */}
      <ProductActions
        product={product}
        region={region}
        selectedOptions={selectedOptions}
        onOptionChange={handleOptionChange}
      />

      {product.swatchData && (
        <div className="mt-16 p-6 border border-gray-200 rounded-md">
          <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">
            Product Swatches
          </h2>
          <IknkSwatchSelector
            product={product}
            onOptionChange={handleOptionChange}
            selectedOptions={selectedOptions}
          />
        </div>
      )}

      {product.personalizeInfo && (
        <div className="mt-16 p-6 border border-gray-200 rounded-md">
          <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">
            Personalization Options
          </h2>
          <IknkPersonalizationOptions
            personalizeInfo={product.personalizeInfo}
          />
        </div>
      )}

      {product.customProductOptions && (
        <div className="mt-16 p-6 border border-gray-200 rounded-md">
          <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">
            Custom Product Options
          </h2>
          <IknkCustomProductConfigurator
            customProductOptions={product.customProductOptions}
          />
        </div>
      )}

      {product.productAddons && (
        <div className="mt-16 p-6 border border-gray-200 rounded-md">
          <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">
            Product Add-ons
          </h2>
          <IknkProductAddons productAddons={product.productAddons} />
        </div>
      )}
    </div>
  )
}

export default ProductInteractionClient
