"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { IknkCart } from "@lib/util/iknk-cart-adapter"
import { retrieveCart } from "@lib/data/cart"
import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"

const Review = ({ cart }: { cart: IknkCart }) => {
  const searchParams = useSearchParams()
  const isOpen = searchParams?.get("step") === "review"
  const [medusaCart, setMedusaCart] = useState<HttpTypes.StoreCart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true)
        const fullCart = await retrieveCart(cart.id)
        setMedusaCart(fullCart)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCart()
  }, [cart.id])

  const paidByGiftcard =
    cart?.metadata?.gift_cards?.length > 0 &&
    cart?.cartPrice?.totalPrice === 0

  const previousStepsCompleted =
    cart.shipAddress &&
    cart.metadata?.shipping_methods?.length > 0 &&
    (cart.payments || paidByGiftcard)

  return (
    <div className="bg-white font-primary-thin p-6 lg:p-8">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2
          className={clx(
            "text-2xl lg:text-3xl font-primary-thin uppercase tracking-widest flex items-center",
            { "opacity-50 pointer-events-none select-none": !isOpen }
          )}
        >
          Review
        </h2>
      </div>
      {isOpen && previousStepsCompleted && !isLoading && medusaCart && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <Text className="text-sm text-gray-700">
              By clicking the Place Order button, you confirm that you have read,
              understand and accept our Terms of Use, Terms of Sale and Returns
              Policy and acknowledge that you have read our Privacy Policy.
            </Text>
          </div>
          <PaymentButton cart={medusaCart} data-testid="submit-order-button" />
        </div>
      )}
    </div>
  )
}

export default Review