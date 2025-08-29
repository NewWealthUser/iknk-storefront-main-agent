"use client"

import { RadioGroup, Radio } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { IknkCart } from "@lib/util/iknk-cart-adapter"
import { HttpTypes } from "@medusajs/types" // Added missing import

const PICKUP_OPTION_ON = "true"
const PICKUP_OPTION_OFF = "false"

type ShippingProps = {
  cart: IknkCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: HttpTypes.AdminStockLocationAddress | string | undefined) { // Updated type
  if (!address) return ""
  if (typeof address === 'string') return address; // If it's already a string, return it

  let ret = ""
  if (address.address_1) ret += ` ${address.address_1}`
  if (address.address_2) ret += `, ${address.address_2}`
  if (address.postal_code) ret += `, ${address.postal_code} ${address.city}`
  if (address.country_code) ret += `, ${address.country_code.toUpperCase()}`
  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [showPickupOptions, setShowPickupOptions] = useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.metadata?.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams?.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm: any) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )
  const _pickupMethods = availableShippingMethods?.filter(
    (sm: any) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )
  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)
    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p: any) => (pricesMap[p.value?.id || ""] = p.value?.amount!))
          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }
    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods, _pickupMethods, _shippingMethods, cart.id, shippingMethodId])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (id: string, variant: "shipping" | "pickup") => {
    setError(null)
    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }
    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })
    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white font-primary-thin p-6 lg:p-8">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-primary-thin uppercase tracking-widest flex items-center">
          Delivery
          {!isOpen && (cart.metadata?.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid className="ml-3 text-green-500" />
          )}
        </h2>
        {!isOpen && cart?.shipAddress && cart?.billAddress && cart?.metadata?.email && (
          <button
            onClick={handleEdit}
            className="text-gray-600 hover:text-black transition-colors duration-200 uppercase text-sm tracking-wider"
            data-testid="edit-delivery-button"
          >
            Edit
          </button>
        )}
      </div>
      {isOpen ? (
        <div className="space-y-8">
          {hasPickupOptions && (
            <RadioGroup
              value={showPickupOptions}
              onChange={(value) => {
                const id = _pickupMethods.find((option) => !option.insufficient_inventory)?.id
                if (id) {
                  handleSetShippingMethod(id, "pickup")
                }
              }}
              className="space-y-4"
            >
              <RadioGroup.Label className="text-lg font-primary-rhroman">Delivery Method</RadioGroup.Label>
              <div className="flex gap-4">
                <RadioGroup.Option value={PICKUP_OPTION_OFF}>
                  {({ checked }) => (
                    <button className={clx("flex-1 text-left p-4 border transition-colors duration-200", { "border-black bg-gray-50": !checked, "border-gray-300": checked })}>
                      Ship
                    </button>
                  )}
                </RadioGroup.Option>
                <RadioGroup.Option value={PICKUP_OPTION_ON}>
                  {({ checked }) => (
                    <button className={clx("flex-1 text-left p-4 border transition-colors duration-200", { "border-black bg-gray-50": checked, "border-gray-300": !checked })}>
                      Pick Up
                    </button>
                  )}
                </RadioGroup.Option>
              </div>
            </RadioGroup>
          )}

          <RadioGroup
            value={shippingMethodId}
            onChange={(v) => handleSetShippingMethod(v!, showPickupOptions === PICKUP_OPTION_ON ? "pickup" : "shipping")}
            className="space-y-4"
          >
            <RadioGroup.Label className="text-lg font-primary-rhroman">
              {showPickupOptions === PICKUP_OPTION_ON ? "Choose a store near you" : "Shipping Method"}
            </RadioGroup.Label>
            {(showPickupOptions === PICKUP_OPTION_ON ? _pickupMethods : _shippingMethods)?.map((option) => {
              const isDisabled = (showPickupOptions === PICKUP_OPTION_OFF && option.price_type === "calculated" && typeof calculatedPricesMap[option.id] !== "number") || option.insufficient_inventory;
              return (
                <RadioGroup.Option
                  key={option.id}
                  value={option.id}
                  disabled={isDisabled}
                >
                  {({ checked }) => (
                    <div className={clx("p-4 border flex justify-between items-center transition-colors duration-200 cursor-pointer", { "border-black bg-gray-50": checked, "border-gray-300": !checked, "opacity-50 cursor-not-allowed": isDisabled })}>
                      <div className="flex items-center gap-x-4">
                        <div className={clx("w-5 h-5 border-2 rounded-full flex items-center justify-center", { "border-black": checked, "border-gray-300": !checked })}>
                          {checked && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-primary-rhroman">{option.name}</span>
                          {showPickupOptions === PICKUP_OPTION_ON && (
                            <span className="text-sm text-gray-600">{formatAddress((option as any).service_zone?.fulfillment_set?.location?.address ?? '')}</span>
                          )}
                        </div>
                      </div>
                      <span className="font-primary-rhroman">
                        {option.price_type === "flat" ? convertToLocale({ amount: option.amount!, currency_code: cart?.cartPrice?.currencySymbol ?? 'USD' }) : calculatedPricesMap[option.id] ? convertToLocale({ amount: calculatedPricesMap[option.id], currency_code: cart?.cartPrice?.currencySymbol ?? 'USD' }) : isLoadingPrices ? <Loader /> : "-"}
                      </span>
                    </div>
                  )}
                </RadioGroup.Option>
              )
            })}
          </RadioGroup>

          <ErrorMessage error={error} data-testid="delivery-option-error-message" />

          <Button
            size="large"
            className="w-full bg-black text-white py-3 uppercase tracking-wider font-primary-rhroman hover:bg-gray-800 transition-colors duration-300"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!cart.metadata?.shipping_methods?.[0]}
            data-testid="submit-delivery-option-button"
          >
            Continue to Payment
          </Button>
        </div>
      ) : (
        <div>
          <div className="text-base text-gray-700">
            {cart && (cart.metadata?.shipping_methods?.length ?? 0) > 0 && (
              <div>
                <h3 className="text-lg font-primary-rhroman mb-2">Method</h3>
                <p>
                  {cart.metadata?.shipping_methods?.at(-1)?.name ?? ''}{" "}
                  <span className="font-primary-rhroman">
                    {convertToLocale({
                      amount: cart.metadata?.shipping_methods?.at(-1)?.amount ?? 0,
                      currency_code: cart?.cartPrice?.currencySymbol ?? 'USD',
                    })}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8 border-gray-200" />
    </div>
  )
}

export default Shipping;