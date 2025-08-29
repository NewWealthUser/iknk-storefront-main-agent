import { useMemo } from "react";
import type { StoreProduct } from "@medusajs/types";

interface UseIknkProductListProps {
  productList: StoreProduct[];
}

const useIknkProductList = ({
  productList,
}: UseIknkProductListProps) => {
  const metaProductItemList = useMemo(() => {
    return productList.map((product, index) => {
      const price = product.variants?.[0]?.calculated_price ?? 0;
      const currencyCode = product.variants?.[0]?.calculated_price?.currency_code ?? "USD"; // Default to USD

      const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
      }).format(typeof price === "number" ? price / 100 : 0); // Assuming price is in cents

      return {
        position: index + 1,
        name: product.title,
        image: product.thumbnail || "",
        price: formattedPrice,
        url: `/products/${product.handle}`,
      };
    });
  }, [productList]);

  return { productItemList: metaProductItemList };
};

export default useIknkProductList;
