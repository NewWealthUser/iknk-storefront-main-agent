import { Text } from "@medusajs/ui"
import { IknkLineItem } from "@lib/util/iknk-cart-adapter"; // Import IknkLineItem

type LineItemOptionsProps = {
  item: IknkLineItem // Changed from variant
  "data-testid"?: string
  "data-value"?: string // Changed from HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  item, // Changed from variant
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis"
    >
      Variant: {item.sku} {/* Using SKU as variant identifier */}
    </Text>
  )
}

export default LineItemOptions
