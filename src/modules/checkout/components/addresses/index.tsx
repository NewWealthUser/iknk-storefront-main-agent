"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import { IknkCart } from "@lib/util/iknk-cart-adapter"
import { HttpTypes } from "@medusajs/types" // Added missing import

const Addresses = ({
  cart,
  customer,
}: {
  cart: IknkCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams?.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipAddress && cart?.billAddress
      ? compareAddresses(cart?.shipAddress, cart?.billAddress)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-white font-primary-thin p-6 lg:p-8">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-primary-thin uppercase tracking-widest flex items-center">
          Shipping Address
          {!isOpen && <CheckCircleSolid className="ml-3 text-green-500" />}
        </h2>
        {!isOpen && cart?.shipAddress && (
          <button
            onClick={handleEdit}
            className="text-gray-600 hover:text-black transition-colors duration-200 uppercase text-sm tracking-wider"
            data-testid="edit-address-button"
          >
            Edit
          </button>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <h3 className="text-2xl lg:text-3xl font-primary-thin uppercase tracking-widest pt-8 pb-6">
                  Billing Address
                </h3>
                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className="mt-6 w-full bg-black text-white py-3 uppercase tracking-wider font-primary-rhroman hover:bg-gray-800 transition-colors duration-300">
              Continue to Delivery
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-base text-gray-700">
            {cart && cart.shipAddress ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-primary-rhroman mb-2">Shipping Address</h3>
                  <p>{cart.shipAddress.firstName} {cart.shipAddress.lastName}</p>
                  <p>{cart.shipAddress.address1}{cart.shipAddress.address2 ? `, ${cart.shipAddress.address2}` : ""}</p>
                  <p>{cart.shipAddress.city}, {cart.shipAddress.postalCode}</p>
                  <p>{cart.shipAddress.country?.toUpperCase()}</p>
                </div>

                <div className="md:col-span-1">
                  <h3 className="text-lg font-primary-rhroman mb-2">Contact</h3>
                  <p>{cart.shipAddress.phone}</p>
                  <p>{customer?.email || "N/A"}</p> {/* Added fallback */}
                </div>

                <div className="md:col-span-1">
                  <h3 className="text-lg font-primary-rhroman mb-2">Billing Address</h3>
                  {sameAsBilling ? (
                    <p>Same as shipping address.</p>
                  ) : (
                    <>
                      <p>{cart.billAddress?.firstName} {cart.billAddress?.lastName}</p>
                      <p>{cart.billAddress?.address1}{cart.billAddress?.address2 ? `, ${cart.billAddress.address2}` : ""}</p>
                      <p>{cart.billAddress?.city}, {cart.billAddress?.postalCode}</p>
                      <p>{cart.billAddress?.country?.toUpperCase()}</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-48">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8 border-gray-200" />
    </div>
  )
}

export default Addresses