"use client"

import repeat from "@lib/util/repeat"
// import { HttpTypes } from "@medusajs/types"
import { Table, clx } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { IknkCart } from "@lib/util/iknk-cart-adapter"; // Import IknkCart

type ItemsTemplateProps = {
  cart: IknkCart
}

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.lineItems // Changed from cart.items
  const hasOverflow = items && items.length > 4

  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      <Table>
        <Table.Body data-testid="items-table">
          {items
            ? items
                .sort((a, b) => {
                  // Assuming IknkLineItem has a created_at or similar for sorting
                  return (a.id || "") > (b.id || "") ? -1 : 1 // Simplified sorting by ID
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      type="preview"
                      currencyCode={cart.cartPrice.currencySymbol ?? ''} // Changed from cart.currency_code
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsPreviewTemplate
