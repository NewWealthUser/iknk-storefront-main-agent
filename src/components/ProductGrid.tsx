"use client"

import React, { FC } from "react";
import ProductGridCard from "./ProductGrid/ProductCard/ProductGridCard"; // Corrected import path
import type { StoreProduct, StoreRegion } from "@medusajs/types";
import { getRegion } from "@lib/data/regions"; // Added import for getRegion

type ProductGridProps = { products: StoreProduct[]; region: StoreRegion }

export default function ProductGrid({ products = [], region }: ProductGridProps) {
  return (
    <div
      id="component-product-grid"
      className="relative"
    >
      <div>
        <div className="inline-flex mb-8 md:mb-9 lg:mb-[60px] flex-wrap gap-x-4 sm:gap-x-8 md:gap-x-10 gap-y-7 sm:gap-y-12 md:gap-y-[60px] lg:gap-y-20 xl:gap-y-24 w-full">
          {products?.map((item: StoreProduct, index: number) => {
            return (
              <React.Fragment key={item.id}>
                <div
                  key={`innerGrid_item_${index}`}
                  id={`${item?.id}__${index}`}
                  className="productVisible mb-3 flex justify-center"
                  style={{
                    width: "30.3%"
                  }}
                >
                  <ProductGridCard product={item} region={region} /> {/* Updated to use new ProductGridCard */}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

