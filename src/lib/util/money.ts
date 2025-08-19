import { isEmpty } from "./isEmpty"

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}) => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}

/**
 * Formats a monetary amount into a currency string.
 * @param amount - The amount in cents (or smallest currency unit).
 * @param currencyCode - The 3-letter currency code (e.g., "USD", "ZAR").
 * @returns A formatted currency string.
 */
export function formatMoney(amount: number, currencyCode = "ZAR") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode }).format(amount / 100)
  } catch {
    // fallback (amount is in cents)
    return `${currencyCode.toUpperCase()} ${(amount / 100).toFixed(2)}`
  }
}