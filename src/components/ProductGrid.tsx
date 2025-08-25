"use client"

import React, { FC } from "react";
import { RhProduct } from "@lib/util/rh-product-adapter";
import IknkProductCard from "./ProductCard";

interface IknkProductGridProps {
  productList: RhProduct[];
  totalNumRecs: number;
}

const IknkProductGrid: FC<IknkProductGridProps> = ({
  productList,
  totalNumRecs,
}) => {
  if (!productList || productList.length === 0) {
    return <div className="text-center py-10">No products to display.</div>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {productList.map((product) => (
        <IknkProductCard key={product.id} data={product} />
      ))}
    </div>
  );
};

export default IknkProductGrid;
