"use client"

import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import StripeWrapper from "./stripe-wrapper"
// import { HttpTypes } from "@medusajs/types" // Removed
import { isStripe } from "@lib/constants"
import { IknkCart } from "@lib/util/iknk-cart-adapter"; // Import IknkCart

type PaymentWrapperProps = {
  cart: IknkCart
  children: React.ReactNode
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  // Simplified payment session logic for IknkCart
  const paymentSession = cart.payments?.find(
    (s) => s.status === "pending"
  )

  if (
    isStripe(paymentSession?.provider_id) &&
    paymentSession &&
    stripePromise
  ) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        {children}
      </StripeWrapper>
    )
  }

  return <div>{children}</div>
}

export default PaymentWrapper
