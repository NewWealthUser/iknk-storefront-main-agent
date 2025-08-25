import { convertToLocale } from "@lib/util/money"
import { clx } from "@medusajs/ui"
import React from "react"
import { IknkLineItem } from "@lib/util/iknk-cart-adapter"; // Import IknkLineItem

type LineItemUnitPriceProps = {
  item: IknkLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemUnitPriceProps) => {
  const unitPrice = item.price; // Use item.price as the unit price
  const hasReducedPrice = false; // Simplified for now

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-ui-fg-muted">Original: </span>
            )}
            <span
              className="line-through"
              data-testid="product-unit-original-price"
            >
              {convertToLocale({
                amount: unitPrice, // Using unitPrice as original for now
                currency_code: currencyCode,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className="text-ui-fg-interactive">{/* -{percentage_diff}% */}</span>
          )}
        </>
      )}
      <span
        className={clx("text-base-regular", {
          "text-ui-fg-interactive": hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        {convertToLocale({
          amount: unitPrice,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  )
}

export default LineItemUnitPrice