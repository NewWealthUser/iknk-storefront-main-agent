import React, { FC } from "react";
import clsx from "clsx";
import ProductGridCard from "@/components/ProductGrid/ProductCard/ProductGridCard"; // Corrected import path
import type { HttpTypes } from "@medusajs/types"; // Changed from StoreProduct
import { getRegion } from "@lib/data/regions"; // Added import for getRegion

interface IknkProductGridProps {
  productList: HttpTypes.StoreProduct[];
  gridColumns?: number;
  isSale?: boolean;
  isSaleFilterEnabled?: boolean;
  countryCode: string;
}

const IknkProductGrid: FC<IknkProductGridProps> = async ({ // Made component async
  productList = [],
  gridColumns = 4,
  isSale,
  isSaleFilterEnabled,
  countryCode,
}) => {
  const imageFlexBoxWidth = `${100 / gridColumns}%`;
  const region = await getRegion(countryCode); // Fetch region

  if (!region) {
    return null; // Handle case where region is not found
  }

  const flexboxContainerClasses = `inline-flex mb-8 md:mb-9 lg:mb-[60px] flex-wrap gap-x-4 sm:gap-x-8 md:gap-x-10 gap-y-7 sm:gap-y-12 md:gap-y-[60px] lg:gap-y-20 xl:gap-y-24 w-full`;

  return (
    <div id="component-product-grid" className="relative">
      <div className={clsx(flexboxContainerClasses)}>
        {productList.map((item: HttpTypes.StoreProduct, index: number) => (
          <div
            key={`innerGrid_item_${item.id || index}`}
            style={{ width: imageFlexBoxWidth }}
          >
            <ProductGridCard product={item} region={region} /> {/* Updated to use new ProductGridCard */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IknkProductGrid;