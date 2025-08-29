"use client"

import React, { useState, useCallback, useEffect } from "react"
import ProductActions from "@modules/products/components/product-actions"
import IknkSwatchSelector from "@modules/products/components/iknk-swatch-selector"
import IknkPersonalizationOptions from "@modules/products/components/iknk-personalization-options"
import IknkCustomProductConfigurator from "@modules/products/components/iknk-custom-product-configurator"
import IknkProductAddons from "@modules/products/components/iknk-product-addons"
import ProductPrice from "@modules/products/components/product-price"

import { HttpTypes, StoreProduct, StoreProductVariant, StoreProductOptionValue } from "@medusajs/types"
import { isEqual, debounce } from "lodash"

type ProductInteractionClientProps = {
  product: StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  selectedVariant: StoreProductVariant | undefined
  setSelectedVariant: (variant: StoreProductVariant) => void
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

  // Updated optionsAsKeymap to expect option_id
  const optionsAsKeymap = (
    variantOptions: { option_id: string; value: string }[] | undefined
  ) => {
    return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
      acc[varopt.option_id] = varopt.value
      return acc
    }, {})
  }

  useEffect(() => {
    const newVariant = product.variants?.find((v: StoreProductVariant) => {
      // Corrected: map StoreProductOptionValue to { option_id, value }
      const variantOptions =
        v.options?.map((optValue: HttpTypes.StoreProductOptionValue) => ({
          option_id: optValue.option_id || '',
          value: optValue.value ?? ""
        })) ||
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
          {product.title}
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

      {(product.metadata?.swatchData && (
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
      )) as React.ReactNode}

      {(product.metadata?.personalizeInfo && (
        <div className="mt-16 p-6 border border-gray-200 rounded-md">
          <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">
            Personalization Options
          </h2>
          <IknkPersonalizationOptions
            personalizeInfo={product.metadata.personalizeInfo}
          />
        </div>
      )) as React.ReactNode}

      {(product.metadata?.customProductOptions && (
        <div className="mt-16 p-6 border border-gray-200 rounded-md">
          <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">
            Custom Product Options
          </h2>
          <IknkCustomProductConfigurator
            customProductOptions={product.metadata.customProductOptions}
          />
        </div>
      )) as React.ReactNode}

      {(product.metadata?.productAddons && (
        <div className="mt-16 p-6 border border-gray-200 rounded-md">
          <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">
            Product Add-ons
          </h2>
          <IknkProductAddons productAddons={product.metadata.productAddons} />
        </div>
      )) as React.ReactNode}
    </div>
  )
}

export default ProductInteractionClient