import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { adaptMedusaCartToIknkCart } from "@lib/util/iknk-cart-adapter"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  const iknkCart = adaptMedusaCartToIknkCart(cart)

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={iknkCart} customer={customer} />

      <Shipping cart={iknkCart} availableShippingMethods={shippingMethods} />

      <Payment cart={iknkCart} availablePaymentMethods={paymentMethods} />

      <Review cart={iknkCart} />
    </div>
  )
}
