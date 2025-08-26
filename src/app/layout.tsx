import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { IknkShoppingCartContextProvider } from "@lib/context/iknk-cart-context";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <IknkShoppingCartContextProvider>
          <Toaster position="top-center" />
          <main className="relative">{props.children}</main>
        </IknkShoppingCartContextProvider>
      </body>
    </html>
  )
}