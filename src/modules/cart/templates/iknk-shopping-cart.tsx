"use client"

import React, { FC, useContext } from "react";
import Link from "next/link";
import { IknkShoppingCartContext } from "@lib/context/iknk-cart-context";
import { updateLineItem, deleteLineItem } from "@lib/data/cart";
import { TrashIcon } from "@radix-ui/react-icons"; 
import { IknkLineItem } from "@lib/util/iknk-cart-adapter"; // Import IknkLineItem

type IknkShoppingCartProps = {};

const IknkShoppingCart: FC<IknkShoppingCartProps> = () => {
  const { cart, loading, refetch } = useContext(IknkShoppingCartContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!cart || cart.lineItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-primary-thin mb-4">Your Shopping Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Explore our collections to find something you love.</p>
        <Link href="/" className="bg-black text-white font-primary-rhroman py-3 px-8 uppercase tracking-wider">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    if (quantity < 1) return;
    await updateLineItem({ lineId, quantity });
    refetch();
  };

  const handleRemoveItem = async (lineId: string) => {
    await deleteLineItem(lineId);
    refetch();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-primary-thin">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-primary-thin uppercase tracking-widest">Shopping Cart</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="grid grid-cols-6 gap-4 text-sm uppercase text-gray-500">
              <div className="col-span-3">Product</div>
              <div className="col-span-1 text-center">Price</div>
              <div className="col-span-1 text-center">Quantity</div>
              <div className="col-span-1 text-right">Total</div>
            </div>
          </div>
          {cart.lineItems.map((item: IknkLineItem) => (
            <div key={item.sku} className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 py-4">
              <div className="col-span-3 flex items-center">
                <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-contain mr-6" />
                <div>
                  <h2 className="text-lg font-primary-rhroman">{item.title}</h2>
                  <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                  <button
                    className="mt-2 text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center text-sm"
                    onClick={() => handleRemoveItem(item.sku)}
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
              <div className="col-span-1 text-center font-primary-rhroman">{item.price}</div>
              <div className="col-span-1 flex justify-center items-center">
                <button
                  className="px-3 py-1 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleUpdateQuantity(item.sku, item.quantity - 1)}
                >
                  -
                </button>
                <span className="mx-4 font-primary-rhroman">{item.quantity}</span>
                <button
                  className="px-3 py-1 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleUpdateQuantity(item.sku, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="col-span-1 text-right font-primary-rhroman"></div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1 bg-gray-50 p-6">
          <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">Order Summary</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-primary-rhroman">{cart.cartPrice.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="font-primary-rhroman">{cart.cartPrice.tax}</span>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between text-lg font-primary-rhroman text-black">
              <span>Total</span>
              <span>{cart.cartPrice.totalPrice}</span>
            </div>
          </div>
          <Link href="/checkout">
            <button className="mt-8 w-full bg-black text-white py-3 uppercase tracking-wider font-primary-rhroman hover:bg-gray-800 transition-colors duration-300">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IknkShoppingCart;