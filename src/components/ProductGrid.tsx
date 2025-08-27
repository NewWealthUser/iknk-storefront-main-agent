"use client"

import React, { FC } from "react";
import clsx from "clsx";

import { ProductGridCard as PC } from "./ProductGrid/ProductCard/ProductGridCard";
import { RhProduct } from "@lib/util/rh-product-adapter";

// Simplified getUrl function for Medusa storefront
export const getUrl = (item: RhProduct) => { // Removed countryCode parameter
  const urlPath = `/products/${item?.handle}`;
  return { to: urlPath };
};

interface ProductGridProps {
  productList: RhProduct[];
  totalNumRecs: number; // Kept for potential future use or context, but not used for internal pagination here
  gridColumns?: number; // Simplified to a direct number
  isStockedFilterActive?: boolean;
  isRefinementFilterActive?: boolean;
  isSale?: boolean;
  isSaleFilterEnabled?: boolean;
  productTitle?: string;
  filterQueries?: string[];
  inStockFlow?: boolean;
  countryCode: string; // Added countryCode prop
  // Removed all other props related to internal pagination, infinite scroll, etc.
}

const ProductGrid: FC<ProductGridProps> = ({
  productList = [],
  gridColumns = 4, // Default to 4 columns
  isStockedFilterActive = false,
  isRefinementFilterActive = false,
  isSale,
  isSaleFilterEnabled,
  productTitle,
  filterQueries,
  inStockFlow,
  countryCode, // Destructure countryCode
}) => {
  // Simplified imageFlexBoxWidth for basic grid layout
  const imageFlexBoxWidth = `${100 / gridColumns}%`;

  const flexboxContainerClasses = `inline-flex mb-8 md:mb-9 lg:mb-[60px] flex-wrap gap-x-4 sm:gap-x-8 md:gap-x-10 gap-y-7 sm:gap-y-12 md:gap-y-[60px] lg:gap-y-20 xl:gap-y-24 w-full`;

  return (
    <div id="component-product-grid" className="relative">
      <div className={clsx(flexboxContainerClasses)}>
        {productList.map((item: RhProduct, index: number) => (
          <div
            key={`innerGrid_item_${item.id || index}`} // Use item.id for key if available
            id={`${item.id || 'product'}__${item?.fullSkuId || index}__${index}`}
            className="productVisible mb-3 flex justify-center"
            style={{
              width: imageFlexBoxWidth,
            }}
          >
            <PC
              data={item}
              isSale={isSale}
              isSaleFilterEnabled={isSaleFilterEnabled}
              totalNumRecs={0} // Not used internally by PC in this simplified context
              isStockedFilterActive={isStockedFilterActive}
              isRefinementFilterActive={isRefinementFilterActive}
              gridColumns={gridColumns}
              filterQueries={filterQueries}
              pageContent={{ NEW: "New", STARTING_AT: "Starting At" }} // Simplified placeholder
              productTitle={productTitle}
              onProductClick={() => {}} // Simplified placeholder
              inStockFlow={inStockFlow}
              isSelectedItem={false} // Simplified
              countryCode={countryCode} // Pass countryCode to ProductGridCard
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;