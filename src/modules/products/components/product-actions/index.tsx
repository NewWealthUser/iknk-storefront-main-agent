"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes, StoreProduct, StoreProductVariant, StoreProductOptionValue } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { toast } from "react-hot-toast"
import { IknkShoppingCartContext } from "@lib/context/iknk-cart-context" // Import cart context

type ProductActionsProps = {
  product: StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  selectedOptions: Record<string, string | undefined>
  onOptionChange: (optionId: string, value: string) => void
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

export default function ProductActions({
  product,
  disabled,
  selectedOptions,
  onOptionChange,
}: ProductActionsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const params = useParams()
  const countryCode = typeof params?.countryCode === 'string' ? params.countryCode : '';
  const { refetch } = useContext(IknkShoppingCartContext); // Get refetch from context

  useEffect(() => {
    if (product.variants?.length === 1) {
      // Corrected: map StoreProductOptionValue to { option_id, value }
      const variantOptions = product.variants[0].options?.map((optValue: HttpTypes.StoreProductOptionValue) => ({
        option_id: optValue.option_id || '',
        value: optValue.value ?? ""
      })) || [];
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

    return product.variants.find((v: StoreProductVariant) => {
      // Corrected: map StoreProductOptionValue to { option_id, value }
      const variantOptions = v.options?.map((optValue: HttpTypes.StoreProductOptionValue) => ({
        option_id: optValue.option_id || '',
        value: optValue.value ?? ""
      })) || [];
      return isEqual(optionsAsKeymap(variantOptions), selectedOptions)
    })
  }, [product.variants, selectedOptions])

  const isValidVariant = useMemo(() => {
    // A variant is valid if all selected options match an existing variant's options
    if (!product.variants || product.variants.length === 0) {
      return false;
    }

    // Check if all selected options have a value
    const allOptionsSelected = product.options?.every(
      (option) => selectedOptions[option.id] !== undefined
    );

    if (!allOptionsSelected) {
      return false;
    }

    return product.variants.some((v: StoreProductVariant) => {
      const variantOptionsMap = optionsAsKeymap(
        v.options?.map((optValue: HttpTypes.StoreProductOptionValue) => ({
          option_id: optValue.option_id || '',
          value: optValue.value ?? ""
        }))
      );
      return isEqual(variantOptionsMap, selectedOptions);
    });
  }, [product.variants, product.options, selectedOptions])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }
    if (selectedVariant?.allow_backorder) {
      return true
    }
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity ?? 0) > 0
    ) {
      return true
    }
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      toast.error("Please select a valid variant.", { position: "top-center" });
      return null;
    }

    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })
      toast.success("Successfully added to cart!", { position: "top-center" })
      refetch(); // Refetch cart data after successful addition
    } catch (e: any) {
      console.error("Add to cart error:", e); // Log the full error for debugging
      toast.error(e?.message || "Failed to add to cart. Please check variant pricing in Medusa Admin.", { position: "top-center" })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option: HttpTypes.StoreProductOption) => {
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