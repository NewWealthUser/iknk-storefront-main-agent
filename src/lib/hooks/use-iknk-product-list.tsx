import { useMemo, useCallback } from "react";
import { RhProduct, RhSkuPriceInfo, RhPriceRangeDisplay } from "@lib/util/rh-product-adapter";

// Placeholder for RH.COM specific utilities/hooks
// const getPriceUserType = (userType: string, price: any) => { /* ... */ }; // Will need to be implemented based on Medusa pricing
// const getUrl = (item: any, host: string, stocked: boolean, isRefinementFilterActive: boolean, totalNumRecs: number, isSale: boolean, isConcierge?: boolean, filterQueries?: string[], selectedSwatch?: string | null, isNextGen?: boolean, inStockFlow?: boolean, isNewURLFeatureEnabled?: boolean, category?: string) => { /* ... */ }; // Will need to be implemented based on Next.js routing
// const useEnv = () => ({ FEATURE_URL_CHANGE: "false" }); // Simplified
// const useNewURLStructureParams = () => ({ category: "" }); // Simplified
// const currencySymbolToCurrencyCodeMapper = {}; // Simplified
// const yn = (val: any) => val === "true"; // Simplified

// Simplified placeholders for RH.COM specific functions/data
const getPriceUserType = (userType: string, price: RhSkuPriceInfo | undefined) => {
  if (!price) return undefined;
  switch (userType) {
    case "CONTRACT":
      return price.contractPrice;
    case "TRADE":
      return price.tradePrice;
    default:
      return price.memberPrice;
  }
};

const getUrl = (item: RhProduct) => {
  // Simplified URL generation for Medusa storefront
  return { to: `/products/${item.handle}` };
};

const useEnv = () => ({ FEATURE_URL_CHANGE: "false" });
const useNewURLStructureParams = () => ({ category: "" });
const currencySymbolToCurrencyCodeMapper: { [key: string]: string } = {};
const yn = (val: any) => val === "true";

interface UseIknkProductListProps {
  hostName?: string;
  prefix?: string;
  isStockedFilterActive?: boolean;
  isRefinementFilterActive?: boolean;
  totalNumRecs: number;
  isSale?: boolean;
  isSaleFilterEnabled?: boolean;
  isConcierge?: boolean;
  search?: { filterQueries?: string[]; inStockFlow?: boolean };
  nextgenCookie?: string;
  productList: RhProduct[]; // Changed to RhProduct[]
  rhUser?: { userType?: string };
}

const useIknkProductList = ({
  hostName = "",
  prefix = "",
  isStockedFilterActive = false,
  isRefinementFilterActive = false,
  totalNumRecs,
  isSale = false,
  isSaleFilterEnabled = false,
  isConcierge = false,
  search,
  nextgenCookie,
  productList,
  rhUser
}: UseIknkProductListProps) => {
  const env = useEnv();
  const isNewURLFeatureEnabled = yn(env.FEATURE_URL_CHANGE);
  const { category } = useNewURLStructureParams();

  const getProductListItemUrl = useCallback(
    (product: RhProduct) => {
      // Simplified URL generation for Medusa storefront
      return `/products/${product.handle}`;
    },
    []
  );

  const metaProductItemList = useMemo(() => {
    // const isNewPriceComponent =
    //   !isStockedFilterActive && search?.inStockFlow
    //     ? true
    //     : !!!search?.inStockFlow;
    const isNewPriceComponent = false; // Simplified for now

    return productList.map((product, index) => {
      // Directly use properties from RhProduct
      const { displayName, imageUrl, alternateImages, skuPriceInfo, priceRangeDisplay, onSale } = product;

      const showSaleMessage =
        Number(priceRangeDisplay?.saleInfo?.percentSaleSkus) !== 0 && Number(priceRangeDisplay?.saleInfo?.percentSaleSkus) !== 100;
      // const onSale = isNewPriceComponent
      //   ? priceInfo?.nextGenDrivenOnSale
      //   : skuPriceInfo?.onSale;

      const isOnSale =
        isSaleFilterEnabled && onSale ? true : onSale && !showSaleMessage;

      const lowPrice = isOnSale
        ? priceRangeDisplay?.skulowestMemberPrice
        : priceRangeDisplay?.memberPrices?.[0];

      return {
        position: index + 1,
        name: displayName,
        image: imageUrl || alternateImages?.[0]?.imageUrl || "",
        lowPrice: isOnSale
          ? lowPrice
          : getPriceUserType(rhUser?.userType || "", skuPriceInfo),
        highPrice: isNewPriceComponent
          ? priceRangeDisplay?.listPrices?.[0]
          : skuPriceInfo?.listPrice,
        currencySymbol:
          currencySymbolToCurrencyCodeMapper[priceRangeDisplay?.currencySymbol || ""] ||
          "USD",
        url: getProductListItemUrl(product)
      };
    });
  }, [
    productList,
    isSaleFilterEnabled,
    // isStockedFilterActive,
    // search?.inStockFlow,
    rhUser?.userType,
    getProductListItemUrl
  ]);

  return { productItemList: metaProductItemList };
};

export default useIknkProductList;
