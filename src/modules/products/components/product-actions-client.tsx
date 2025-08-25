"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect, useMemo, useState } from "react"
import ProductActions from "./product-actions"
import { RhProduct, RhVariant } from "@lib/util/rh-product-adapter";
import { isEqual } from "lodash";

type ProductActionsClientProps = {
  product: RhProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: { option_id: string; value: string }[] | undefined
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
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
      const variantOptions = product.variants[0].options?.map((opt: { id?: string; value?: string }) => ({ option_id: opt.id || '', value: opt.value })) || [];
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