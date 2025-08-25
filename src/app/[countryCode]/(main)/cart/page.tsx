import IknkShoppingCart from "@modules/cart/templates/iknk-shopping-cart";
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart() {
  return <IknkShoppingCart />
}
