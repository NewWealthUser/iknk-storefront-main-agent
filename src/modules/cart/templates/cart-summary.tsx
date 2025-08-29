import React from "react"
import { HttpTypes } from "@medusajs/types"

type CartSummaryProps = {
  cart: HttpTypes.StoreCart
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  if (!cart || !cart.items) {
    return null // Or some loading/empty state
  }

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover" />
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">{item.variant?.title}</p>
              <p className="text-sm">Qty: {item.quantity}</p>
            </div>
          </div>
          <p className="font-medium">
            {item.unit_price / 100} {cart.region?.currency_code?.toUpperCase() ?? ""}
          </p>
        </div>
      ))}

      <div className="border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{cart.subtotal / 100} {cart.region?.currency_code?.toUpperCase() ?? ""}</span>
        </div>
        <div className="flex justify-between">
          <span>Total</span>
          <span>{cart.total / 100} {cart.region?.currency_code?.toUpperCase() ?? ""}</span>
        </div>
        <button className="w-full bg-black text-white py-3 mt-4 uppercase tracking-wide">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default CartSummary