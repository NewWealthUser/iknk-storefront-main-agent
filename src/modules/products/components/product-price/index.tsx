import { clx } from "@medusajs/ui"
import { RhProduct, RhVariant } from "@lib/util/rh-product-adapter"
import { convertToLocale } from "@lib/util/money"

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

  const displayPrice = () => {
    if (variant) {
      const price = variant.calculated_price
      const currency = variant.currency_code
      return convertToLocale({ amount: price ?? 0, currency_code: currency ?? "ZAR" })
    } else if (priceRangeDisplay) {
      const minPrice =
        priceRangeDisplay.listPrices?.[0] || priceRangeDisplay.memberPrices?.[0]
      const maxPrice =
        priceRangeDisplay.listPrices?.[0] || priceRangeDisplay.memberPrices?.[0]
      const currency = priceRangeDisplay.currencySymbol

      if (minPrice && maxPrice && minPrice !== maxPrice) {
        return `Starts at ${convertToLocale({ amount: minPrice, currency_code: currency ?? "ZAR" })} to ${convertToLocale({ amount: maxPrice, currency_code: currency ?? "ZAR" })}`
      } else if (minPrice) {
        return `Starts at ${convertToLocale({ amount: minPrice, currency_code: currency ?? "ZAR" })}`
      }
    } else if (skuPriceInfo) {
      const price = skuPriceInfo.salePrice || skuPriceInfo.listPrice
      const currency = skuPriceInfo.currencySymbol
      if (price) {
        return convertToLocale({ amount: price, currency_code: currency ?? "ZAR" })
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
                {convertToLocale({
                  amount: priceRangeDisplay.listPrices[0],
                  currency_code: priceRangeDisplay.currencySymbol ?? "ZAR",
                })}
              </span>
            </p>
            {/* Calculate percentage diff if needed */}
          </>
        )}
    </div>
  )
}