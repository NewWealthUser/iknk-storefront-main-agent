"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { RhProduct, RhVariant, RhOption } from "@lib/util/rh-product-adapter"; // Import RhProduct and related types

type ProductActionsProps = {
  product: RhProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  selectedOptions: Record<string, string | undefined>; // New prop
  onOptionChange: (optionId: string, value: string) => void; // New prop
}

const optionsAsKeymap = (
  variantOptions: { id: string; value: string }[] | undefined
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
  selectedOptions, // Destructure new prop
  onOptionChange, // Destructure new prop
}: ProductActionsProps) {
  // const [options, setOptions] = useState<Record<string, string | undefined>>({}) // Removed local state
  const [isAdding, setIsAdding] = useState(false)
  const params = useParams()
  const countryCode = typeof params?.countryCode === 'string' ? params.countryCode : '';

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = product.variants[0].options?.map((opt: { id?: string; value?: string }) => ({ id: opt.id as string, value: opt.value as string })) || [];
      // setOptions(optionsAsKeymap(variantOptions) ?? {}) // Use onOptionChange
      const mappedOptions = optionsAsKeymap(variantOptions) ?? {};
      for (const key in mappedOptions) {
        if (mappedOptions.hasOwnProperty(key)) {
          onOptionChange(key, mappedOptions[key]);
        }
      }
    }
  }, [product.variants, onOptionChange])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v: RhVariant) => {
      const variantOptions = v.options?.map((opt: { id?: string; value?: string }) => ({ id: opt.id as string, value: opt.value as string })) || [];
      return isEqual(optionsAsKeymap(variantOptions), selectedOptions) // Use selectedOptions
    })
  }, [product.variants, selectedOptions]) // Use selectedOptions

  // update the options when a variant is selected
  // const setOptionValue = (optionId: string, value: string) => { // Removed local function
  //   setOptions((prev) => ({
  //     ...prev,
  //     [optionId]: value,
  //   }))
  // }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v: RhVariant) => {
      const variantOptions = v.options?.map((opt: { id?: string; value?: string }) => ({ id: opt.id as string, value: opt.value as string })) || [];
      return isEqual(optionsAsKeymap(variantOptions), selectedOptions) // Use selectedOptions
    })
  }, [product.variants, selectedOptions]) // Use selectedOptions

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity ?? 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option: RhOption) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={selectedOptions[option.id]}
                      updateOption={onOptionChange}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !selectedOptions
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button>
        <MobileActions
          product={product}
          options={selectedOptions}
          updateOptions={onOptionChange}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}