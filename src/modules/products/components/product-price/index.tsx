import { clx } from "@medusajs/ui"
import { RhProduct, RhVariant } from "@lib/util/rh-product-adapter"

export default function ProductPrice({
  product,
  variant,
}: {
  product: RhProduct
  variant?: RhVariant
}) {
  const { priceRangeDisplay, skuPriceInfo } = product

  if (!priceRangeDisplay && !skuPriceInfo) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const formatPrice = (
    amount: number | undefined | null,
    currencyCode: string | undefined
  ) => {
    if (typeof amount !== "number" || !currencyCode) return ""
    // Always use "R" for ZAR
    if (currencyCode === "ZAR" || currencyCode === "R") {
      return `R${(amount / 100).toFixed(2)}`
    }
    return `${currencyCode}${(amount / 100).toFixed(2)}`
  }

  const displayPrice = () => {
    if (variant) {
      const price = variant.calculated_price
      const currency = variant.currency_code
      return formatPrice(price, currency)
    } else if (priceRangeDisplay) {
      const minPrice =
        priceRangeDisplay.listPrices?.[0] || priceRangeDisplay.memberPrices?.[0]
      const maxPrice =
        priceRangeDisplay.listPrices?.[0] || priceRangeDisplay.memberPrices?.[0]
      const currency = priceRangeDisplay.currencySymbol

      if (minPrice && maxPrice && minPrice !== maxPrice) {
        return `Starts at ${formatPrice(
          minPrice,
          currency
        )} to ${formatPrice(maxPrice, currency)}`
      } else if (minPrice) {
        return `Starts at ${formatPrice(minPrice, currency)}`
      }
    } else if (skuPriceInfo) {
      const price = skuPriceInfo.salePrice || skuPriceInfo.listPrice
      const currency = skuPriceInfo.currencySymbol
      if (price) {
        return formatPrice(price, currency)
      }
    }
    return ""
  }

  return (
    <div className="flex flex-col text-ui-fg-base font-primary-thin">
      <span className="text-xl-semi">
        <span data-testid="product-price">{displayPrice()}</span>
      </span>
      {/* Add sale price display if needed, based on priceRangeDisplay.nextGenDrivenOnSale or skuPriceInfo.onSale */}
      {priceRangeDisplay?.nextGenDrivenOnSale &&
        priceRangeDisplay.listPrices?.[0] &&
        priceRangeDisplay.memberPrices?.[0] && (
          <>
            <p>
              <span className="text-ui-fg-subtle">Original: </span>
              <span
                className="line-through"
                data-testid="original-product-price"
              >
                {formatPrice(
                  priceRangeDisplay.listPrices[0],
                  priceRangeDisplay.currencySymbol
                )}
              </span>
            </p>
            {/* Calculate percentage diff if needed */}
          </>
        )}
    </div>
  )
}