import React, { FC } from "react";
import type { StoreProduct } from "@medusajs/types";

interface ProductGridInfoSectionProps {
  data: StoreProduct;
}

const ProductGridInfoSection: FC<ProductGridInfoSectionProps> = ({
  data,
}) => {
  return (
    <>
      <h3>{data.title}</h3>
      <p>{data.description}</p>
    </>
  );
};

export default ProductGridInfoSection;
