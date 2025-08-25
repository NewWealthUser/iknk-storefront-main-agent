import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

// import { getProductPrice } from "@lib/util/get-product-price" // Removed
import OptionSelect from "./option-select"
// import { HttpTypes } from "@medusajs/types" // Removed
import { isSimpleProduct } from "@lib/util/product"
import { RhProduct, RhVariant, RhOption } from "@lib/util/rh-product-adapter"; // Import RhProduct and RhVariant

type MobileActionsProps = {
  product: RhProduct
  // variant?: HttpTypes.StoreProductVariant // Removed
  options: Record<string, string | undefined>
  updateOptions: (optionId: string, value: string) => void // Changed type of updateOptions
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  // variant, // Removed
  options, // Use options prop
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()

  // Adapt pricing logic to use RhProduct
  const selectedPrice = useMemo(() => {
    const priceInfo = product.skuPriceInfo;
    const priceRangeDisplay = product.priceRangeDisplay;

    if (!priceInfo && !priceRangeDisplay) {
      return null;
    }

    const displayPrice = priceInfo?.salePrice || priceInfo?.listPrice || priceRangeDisplay?.listPrices?.[0];
    const originalPrice = priceInfo?.listPrice || priceRangeDisplay?.listPrices?.[0];
    const isOnSale = priceInfo?.onSale || priceRangeDisplay?.nextGenDrivenOnSale;

    return {
      calculated_price: displayPrice,
      original_price: originalPrice,
      price_type: isOnSale ? "sale" : "default",
    };
  }, [product.skuPriceInfo, product.priceRangeDisplay]);

  const isSimple = isSimpleProduct(product)

  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="bg-white flex flex-col gap-y-3 justify-center items-center text-large-regular p-4 h-full w-full border-t border-gray-200"
            data-testid="mobile-actions"
          >
            <div className="flex items-center gap-x-2">
              <span data-testid="mobile-title">{product.displayName}</span>
              <span>—</span>
              {selectedPrice ? (
                <div className="flex items-end gap-x-2 text-ui-fg-base">
                  {selectedPrice.price_type === "sale" && (
                    <p>
                      <span className="line-through text-small-regular">
                        {selectedPrice.original_price}
                      </span>
                    </p>
                  )}
                  <span
                    className={clx({
                      "text-ui-fg-interactive":
                        selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className={clx("grid grid-cols-2 w-full gap-x-4", {
              "!grid-cols-1": isSimple
            })}>
              {!isSimple && <Button
                onClick={open}
                variant="secondary"
                className="w-full"
                data-testid="mobile-actions-button"
              >
                <div className="flex items-center justify-between w-full">
                  <span>
                    {/* Use product.variants[0].options for display if needed */}
                    {product.variants?.[0]?.options?.[0]?.value
                      ? product.variants[0].options.map((opt: { id?: string; value?: string }) => opt.value).join(" / ")
                      : "Select Options"}
                  </span>
                  <ChevronDown />
                </div>
              </Button>}
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || !product.variants?.[0]?.id} // Check if a variant exists
                className="w-full"
                isLoading={isAdding}
                data-testid="mobile-cart-button"
              >
                {!product.variants?.[0]?.id
                  ? "Select variant"
                  : !inStock
                  ? "Out of stock"
                  : "Add to cart"}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-12">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option: RhOption) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
