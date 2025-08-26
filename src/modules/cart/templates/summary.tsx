"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { adaptMedusaCartToIknkCart, IknkCart } from "@lib/util/iknk-cart-adapter"

type SummaryProps = {
  cart: IknkCart // Changed to IknkCart
}

function getCheckoutStep(cart: IknkCart) { // Changed to IknkCart
  if (!cart?.shipAddress?.address1 || !cart.metadata?.email) { // Adjusted to IknkCart properties
    return "address"
  } else if (cart?.metadata?.shipping_methods?.length === 0) { // Adjusted to IknkCart properties
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  // No need to adapt here, cart is already IknkCart
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals
        totals={{
          subtotal: cart.cartPrice.subtotal,
          tax: cart.cartPrice.tax,
          totalPrice: cart.cartPrice.totalPrice,
          discount_total: cart.discount_total,
          gift_card_total: cart.gift_card_total,
          shipping_total: cart.shipping_total,
          currency_code: cart.cartPrice.currencySymbol || "",
        }}
      />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="w-full h-10">Go to checkout</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary;