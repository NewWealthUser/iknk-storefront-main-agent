import { Metadata } from "next"

import { listShippingOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCart, StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Header from "@modules/layout/components/header"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import { adaptMedusaCartToIknkCart, IknkCart } from "@lib/util/iknk-cart-adapter"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// Feature flag to bypass cart/region SSR if unstable
const BYPASS_CART_ON_SSR = process.env.BYPASS_CART_ON_SSR === "true";

export default async function PageLayout(props: { children: React.ReactNode }) {
  let customer = null;
  let cart: StoreCart | null = null;
  let shippingOptions: StoreCartShippingOption[] = [];
  let iknkCart: IknkCart | null = null;

  if (!BYPASS_CART_ON_SSR) {
    try {
      customer = await retrieveCustomer();
      cart = await retrieveCart();

      if (cart) {
        const res = await listShippingOptions(cart.id);
        if (res) {
          shippingOptions = res.shipping_options;
        }
        iknkCart = adaptMedusaCartToIknkCart(cart);
      }
    } catch (e: any) {
      console.warn("[layout] Cart/customer bootstrap failed, using fallbacks:", e.message);
      // Fallback to null/empty values
      customer = null;
      cart = null;
      shippingOptions = [];
      iknkCart = null;
    }
  } else {
    console.log("[layout] BYPASS_CART_ON_SSR is true. Skipping cart/customer SSR.");
  }

  return (
    <>
      <Header />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      <div className="pt-[136px]">
        {props.children}
      </div>
      <Footer />
    </>
  )
}