import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import { mapKeys } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"
import { IknkCart, IknkAddress } from "@lib/util/iknk-cart-adapter"; // Import IknkCart and IknkAddress

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: IknkCart | null // Changed cart type
  checked: boolean
  onChange: () => void
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": cart?.shipAddress?.firstName || "",
    "shipping_address.last_name": cart?.shipAddress?.lastName || "",
    "shipping_address.address_1": cart?.shipAddress?.address1 || "",
    "shipping_address.company": cart?.shipAddress?.company || "", // Assuming company is in metadata or similar
    "shipping_address.postal_code": cart?.shipAddress?.postalCode || "",
    "shipping_address.city": cart?.shipAddress?.city || "",
    "shipping_address.country_code": cart?.shipAddress?.country || "", // Assuming country is string
    "shipping_address.province": cart?.shipAddress?.state || "",
    "shipping_address.phone": cart?.shipAddress?.phone || "",
    email: customer?.email || "", // Get email from customer
  })

  const countriesInRegion = useMemo<string[]>(
    () => [], // Simplified: IknkCart doesn't have region directly. Will need to fetch or pass.
    [cart?.id] // Dependency changed to cart.id
  )

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ), // This will need to be adapted for IknkAddress
    [customer?.addresses, countriesInRegion]
  )

  const setFormAddress = (
    address?: IknkAddress, // Changed to IknkAddress
    email?: string
  ) => {
    address &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        "shipping_address.first_name": address?.firstName || "",
        "shipping_address.last_name": address?.lastName || "",
        "shipping_address.address_1": address?.address1 || "",
        "shipping_address.company": address?.company || "",
        "shipping_address.postal_code": address?.postalCode || "",
        "shipping_address.city": address?.city || "",
        "shipping_address.country_code": address?.country || "",
        "shipping_address.province": address?.state || "",
        "shipping_address.phone": address?.phone || "",
      }))

    email &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        email: email,
      }))
  }

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart && cart.shipAddress) {
      setFormAddress(cart?.shipAddress, customer?.email) // Use shipAddress and customer.email
    }

    if (cart && !customer?.email && customer?.email) { // Simplified condition
      setFormAddress(undefined, customer.email)
    }
  }, [cart, customer]) // Added customer as dependency

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect
            addresses={customer.addresses} // This will need to be adapted for IknkAddress
            addressInput={
              mapKeys(formData, (_, key) =>
                key.replace("shipping_address.", "")
              ) as any // This will need to be adapted for IknkAddress
            }
            onSelect={(address, email) => {
              if (address) {
                const iknkAddress: IknkAddress = {
                  firstName: address.first_name || '',
                  lastName: address.last_name || '',
                  address1: address.address_1 || '',
                  address2: address.address_2 || '',
                  city: address.city || '',
                  state: address.province || '',
                  postalCode: address.postal_code || '',
                  country: address.country_code || '',
                  phone: address.phone || '',
                  company: address.company || '',
                }
                setFormAddress(iknkAddress, email)
              }
            }}
          />
        </Container>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label="Last name"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />
        <Input
          label="Address"
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="shipping-address-input"
        />
        <Input
          label="Company"
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="shipping-company-input"
        />
        <Input
          label="Postal code"
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-postal-code-input"
        />
        <Input
          label="City"
          name="shipping_address.city"
          autoComplete="address-level2"
          value={formData["shipping_address.city"]}
          onChange={handleChange}
          required
          data-testid="shipping-city-input"
        />
        <CountrySelect
          name="shipping_address.country_code"
          autoComplete="country"
          // region={cart?.region} // Removed region prop
          value={formData["shipping_address.country_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-country-select"
        />
        <Input
          label="State / Province"
          name="shipping_address.province"
          autoComplete="address-level1"
          value={formData["shipping_address.province"]}
          onChange={handleChange}
          data-testid="shipping-province-input"
        />
      </div>
      <div className="my-8">
        <Checkbox
          label="Billing address same as shipping address"
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
          data-testid="billing-address-checkbox"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
          label="Email"
          name="email"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="shipping-email-input"
        />
        <Input
          label="Phone"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          data-testid="shipping-phone-input"
        />
      </div>
    </>
  )
}

export default ShippingAddress
