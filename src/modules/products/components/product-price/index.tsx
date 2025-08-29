import { clx } from "@medusajs/ui"
import { StoreProduct, StoreProductVariant } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

export default function ProductPrice({
  product,
  variant,
}: {
  product: StoreProduct
  variant?: StoreProductVariant
}) {
  const priceSet = variant?.calculated_price ?? product.variants?.[0]?.calculated_price
  const currencyCode = variant?.calculated_price?.currency_code ?? product.variants?.[0]?.calculated_price?.currency_code ?? "ZAR"

  if (typeof priceSet === "undefined" || priceSet === null) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const calculatedPrice = typeof priceSet === 'number' ? priceSet : (priceSet.calculated_amount ?? 0);
  const originalPrice = typeof priceSet === 'number' ? priceSet : (priceSet.original_amount ?? 0);

  const isOnSale = originalPrice > 0 && calculatedPrice < originalPrice;

  return (
    <div className="flex flex-col text-ui-fg-base font-primary-thin">
      <span className="text-xl-semi">
        {isOnSale && (
          <span className="line-through text-ui-fg-muted mr-2" data-testid="product-original-price">
            {convertToLocale({ amount: originalPrice, currency_code: currencyCode })}
          </span>
        )}
        <span className={clx({ "text-ui-fg-interactive": isOnSale })} data-testid="product-price">
          {convertToLocale({ amount: calculatedPrice, currency_code: currencyCode })}
        </span>
      </span>
    </div>
  )
}
