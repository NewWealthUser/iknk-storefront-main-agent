import { adaptMedusaLineItemToIknkLineItem } from "@lib/util/iknk-cart-adapter"
import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { IknkCart, IknkLineItem } from "@lib/util/iknk-cart-adapter" // Import IknkCart and IknkLineItem

type ItemsTemplateProps = {
  cart: IknkCart | null // Changed to IknkCart | null
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.lineItems // Changed from cart?.items
  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a: IknkLineItem, b: IknkLineItem) => { // Explicitly type a and b
                  return (a.id || "") > (b.id || "") ? -1 : 1 // Simplified sorting by ID
                })
                .map((item: IknkLineItem) => { // Explicitly type item
                  // No need to adapt here, as item is already IknkLineItem
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.cartPrice.currencySymbol ?? ''} // Changed from cart?.currency_code
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

export default ItemsTemplate