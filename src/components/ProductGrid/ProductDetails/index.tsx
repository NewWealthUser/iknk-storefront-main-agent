import React, { FC } from "react";
import type { StoreProduct } from "@medusajs/types";

interface ProductDetailsProps {
  product: StoreProduct;
}

const ProductDetails: FC<ProductDetailsProps> = ({ product }) => {
  return (
    <>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
    </>
  );
};

export const PD = ProductDetails; // Renamed from memoize(ProductDetails)
