"use client"

import { HttpTypes, StoreProduct, StoreProductOptionValue } from "@medusajs/types"
import { useEffect, useMemo, useState } from "react"
import ProductActions from "./product-actions"
import { isEqual } from "lodash";

type ProductActionsClientProps = {
  product: StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

// Updated optionsAsKeymap to expect option_id
const optionsAsKeymap = (
  variantOptions: { option_id: string; value: string }[] | undefined
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActionsClient({
  product,
  region,
  disabled,
}: ProductActionsClientProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | undefined>>({})

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      // Corrected: map StoreProductOptionValue to { option_id, value }
      const variantOptions = product.variants[0].options?.map((optValue: HttpTypes.StoreProductOptionValue) => ({
        option_id: optValue.option_id || '',
        value: optValue.value ?? ""
      })) || [];
      const mappedOptions = optionsAsKeymap(variantOptions) ?? {};
      setSelectedOptions(mappedOptions);
    }
  }, [product.variants])

  const onOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  return (
    <ProductActions
      product={product}
      region={region}
      disabled={disabled}
      selectedOptions={selectedOptions}
      onOptionChange={onOptionChange}
    />
  )
}