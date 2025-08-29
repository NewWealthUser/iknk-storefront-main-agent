import React, { FC, memo, useMemo } from "react";
import clsx from "clsx";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import type { StoreProduct } from "@medusajs/types";

// New modular components
import ProductGridImageDisplay from "./ProductGridImageDisplay";
import ProductGridInfoSection from "./ProductGridInfoSection";


interface ProductCardProps {
  data: StoreProduct;
}

export const ProductGridCard: FC<ProductCardProps> = memo(
  ({
    data,
  }) => {
    const imagesArr = data.images?.map(img => img.url) || [];
    const to = `/products/${data.handle}`;

    return (
      <div
        className="relative flex h-full w-full flex-col"
      >
        <ProductGridImageDisplay
          id={data?.id}
          slides={imagesArr}
          imageAlternativeName={data.title || ""}
        />

        <div className="flex h-full w-full flex-col flex-wrap content-around">
          <div
            className="flex h-full flex-col"
          >
            <LocalizedClientLink href={to}>
              <ProductGridInfoSection
                data={data}
              />
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    );
  }
);
