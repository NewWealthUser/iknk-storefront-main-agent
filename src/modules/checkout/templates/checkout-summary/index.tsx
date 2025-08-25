import { Heading } from "@medusajs/ui"
import { IknkCart } from "@lib/util/iknk-cart-adapter"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: IknkCart }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-white flex flex-col">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular items-baseline"
        >
          In your Cart
        </Heading>
        <Divider className="my-6" />
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
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
