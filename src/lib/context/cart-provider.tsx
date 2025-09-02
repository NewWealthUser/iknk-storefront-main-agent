"use client"

import { useParams } from "next/navigation"
import { IknkShoppingCartContextProvider } from "./iknk-cart-context"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const countryCode = typeof params?.countryCode === "string" ? params.countryCode : "us"

  return (
    <IknkShoppingCartContextProvider countryCode={countryCode}>
      {children}
    </IknkShoppingCartContextProvider>
  )
}
