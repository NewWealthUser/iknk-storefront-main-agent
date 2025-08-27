"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, { StripeCardContainer } from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import { IknkCart } from "@lib/util/iknk-cart-adapter"
import { HttpTypes } from "@medusajs/types" // Added missing import

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: IknkCart
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payments?.find((p: any) => p.status === "pending")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(activeSession?.provider_id ?? "")

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams?.get("step") === "payment"
  const isStripe = isStripeFunc(selectedPaymentMethod)

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    
  }

  const paidByGiftcard = cart?.metadata?.gift_cards?.length > 0 && cart?.cartPrice?.totalPrice === 0
  const paymentReady = (activeSession && cart?.metadata?.shipping_methods?.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), { scroll: false })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      if (!activeSession || activeSession.provider_id !== selectedPaymentMethod) {
        
      }
      router.push(pathname + "?" + createQueryString("step", "review"), { scroll: false })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white font-primary-thin p-6 lg:p-8">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-primary-thin uppercase tracking-widest flex items-center">
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid className="ml-3 text-green-500" />}
        </h2>
        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="text-gray-600 hover:text-black transition-colors duration-200 uppercase text-sm tracking-wider"
            data-testid="edit-payment-button"
          >
            Edit
          </button>
        )}
      </div>

      {isOpen ? (
        <div className="space-y-8">
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <RadioGroup value={selectedPaymentMethod} onChange={setPaymentMethod} className="space-y-4">
              <RadioGroup.Label className="text-lg font-primary-rhroman">Choose a payment method</RadioGroup.Label>
              {availablePaymentMethods.map((paymentMethod) => (
                <RadioGroup.Option
                  key={paymentMethod.id}
                  value={paymentMethod.id}
                  as={React.Fragment}
                >
                  {({ checked }: { checked: boolean }) => (
                    <div className={clx("p-4 border rounded-md transition-colors duration-200 cursor-pointer", { "border-black bg-gray-50": checked, "border-gray-300": !checked })}>
                      {isStripeFunc(paymentMethod.id) ? (
                        <StripeCardContainer
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                          paymentInfoMap={paymentInfoMap}
                          setCardBrand={setCardBrand}
                          setError={setError}
                          setCardComplete={setCardComplete}
                        />
                      ) : (
                        <PaymentContainer
                          paymentInfoMap={paymentInfoMap}
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                        />
                      )}
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          )}

          {paidByGiftcard && (
            <div>
              <h3 className="text-lg font-primary-rhroman mb-2">Payment Method</h3>
              <p>Gift Card</p>
            </div>
          )}

          <ErrorMessage error={error} data-testid="payment-method-error-message" />

          <Button
            size="large"
            className="w-full bg-black text-white py-3 uppercase tracking-wider font-primary-rhroman hover:bg-gray-800 transition-colors duration-300"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={(isStripe && !cardComplete) || (!selectedPaymentMethod && !paidByGiftcard)}
            data-testid="submit-payment-button"
          >
            Continue to Review
          </Button>
        </div>
      ) : (
        <div>
          <div className="text-base text-gray-700">
            {cart && paymentReady && activeSession ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-primary-rhroman mb-2">Payment Method</h3>
                  <p>{paymentInfoMap[activeSession?.provider_id]?.title || activeSession?.provider_id}</p>
                </div>
                <div>
                  <h3 className="text-lg font-primary-rhroman mb-2">Payment Details</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-8 w-12 bg-gray-100 rounded-md">
                      {paymentInfoMap[selectedPaymentMethod]?.icon || <CreditCard />}
                    </div>
                    <p>{isStripeFunc(selectedPaymentMethod) && cardBrand ? cardBrand : "Details will be confirmed on the next step."}</p>
                  </div>
                </div>
              </div>
            ) : paidByGiftcard ? (
              <div>
                <h3 className="text-lg font-primary-rhroman mb-2">Payment Method</h3>
                <p>Gift Card</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <Divider className="mt-8 border-gray-200" />
    </div>
  )
}

export default Payment