import React, { FC } from "react";
import clsx from "clsx";
import { PD } from "../ProductDetails"; // Placeholder
import { RhProduct } from "@lib/util/rh-product-adapter";
import { Text } from "@medusajs/ui"; // Placeholder replaced with Medusa Text
import { useTypographyStyles } from "@lib/hooks/use-typography-styles"; // Placeholder replaced with local placeholder

// Placeholder for useTypographyStyles
const useTypographyStyles = (props: any) => ({ rhBaseBody1: "" });

interface ProductGridInfoSectionProps {
  data: RhProduct; // Changed from item: { product?: RhProduct; sku?: any };
  productDetails: any; // This should be more specific if possible
  isStockedFilterActive: boolean;
  isRefinementFilterActive: boolean;
  totalNumRecs: number;
  host?: string;
  isSale?: boolean;
  isSaleFilterEnabled?: boolean;
  filterQueries?: string[];
  pageContent: any;
  productTitle?: string;
  inStockFlow?: boolean;
  saleUrl: string;
}

const ProductGridInfoSection: FC<ProductGridInfoSectionProps> = ({
  data, // Changed from item
  productDetails,
  isStockedFilterActive,
  isRefinementFilterActive,
  totalNumRecs,
  host,
  isSale,
  isSaleFilterEnabled,
  filterQueries,
  pageContent,
  productTitle,
  inStockFlow,
  saleUrl,
}) => {
  const typographyStyles = useTypographyStyles({
    keys: ["rhBaseBody1"],
  });

  return (
    <>
      <Text
        className={clsx(
          `my-0 pt-1.5 font-primary-thin text-[10px] leading-[13.2px] text-black sm:pt-2.5 sm:text-[13px] sm:leading-5 lg:pt-1.5 `,
          {
            "text-center": !!data?.metadata?.rhr, // Changed from item?.product?.rhr
            "text-left": !data?.metadata?.rhr, // Changed from item?.product?.rhr
          }
        )}
        style={{
          minHeight: `${productDetails?.captionMinHeight}px`,
          width: `${productDetails?.imageContainerStyle?.width}px`,
        }}
        dangerouslySetInnerHTML={{
          __html: `${data?.galleryDescription} `, // Changed from item?.product?.galleryDescription
        }}
      />

      <PD
        product={data!} // Changed from item?.product!
        isStockedFilterActive={isStockedFilterActive}
        isRefinementFilterActive={isRefinementFilterActive}
        productSku={data?.sku!} // Changed from item?.sku!
        isSale={isSale}
        host={host}
        totalNumRecs={totalNumRecs}
        isSaleFilterEnabled={isSaleFilterEnabled}
        gridColumns={productDetails?.gridColumns} // Assuming gridColumns is part of productDetails
        saleUrl={saleUrl}
        inStockFlow={inStockFlow}
      />
    </>
  );
};

export default ProductGridInfoSection;