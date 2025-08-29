import React, { FC } from "react";
import clsx from "clsx";
// import { ProductGridCard as PC } from "@/components/ProductGrid/ProductCard/ProductGridCard";
import type { StoreProduct } from "@medusajs/types";

interface IknkProductGridProps {
  productList: StoreProduct[];
  gridColumns?: number;
  isSale?: boolean;
  isSaleFilterEnabled?: boolean;
  countryCode: string;
}

const IknkProductGrid: FC<IknkProductGridProps> = ({
  productList = [],
  gridColumns = 4,
  isSale,
  isSaleFilterEnabled,
  countryCode,
}) => {
  const imageFlexBoxWidth = `${100 / gridColumns}%`;

  const flexboxContainerClasses = `inline-flex mb-8 md:mb-9 lg:mb-[60px] flex-wrap gap-x-4 sm:gap-x-8 md:gap-x-10 gap-y-7 sm:gap-y-12 md:gap-y-[60px] lg:gap-y-20 xl:gap-y-24 w-full`;

  return (
    <div id="component-product-grid" className="relative">
      <div className={clsx(flexboxContainerClasses)}>
        {productList.map((item: StoreProduct, index: number) => (
          <div
            key={`innerGrid_item_${item.id || index}`}>
            {/* <PC data={item} /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IknkProductGrid;
