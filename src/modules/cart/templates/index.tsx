"use client"

import { useContext } from "react"
import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { IknkShoppingCartContext } from "@lib/context/iknk-cart-context"
import { IknkCart } from "@lib/util/iknk-cart-adapter" // Import IknkCart

const CartTemplate = () => {
  const { cart, loading } = useContext(IknkShoppingCartContext)
  // const customer = {} as HttpTypes.StoreCustomer | null // Placeholder for customer logic - removed as not used

  if (loading) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }
  
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {/* Changed from cart?.items?.length */}
        {cart?.lineItems?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 gap-y-6">
              {/* {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )} */}
              <ItemsTemplate cart={cart} /> {/* Pass IknkCart directly */}
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {/* Changed from cart.region */}
                {cart && cart.cartPrice && (
                  <>
                    <div className="bg-white py-6">
                      <Summary cart={cart} /> {/* Pass IknkCart directly */}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate