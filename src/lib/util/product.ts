import { StoreProduct } from "@medusajs/types";

export const isSimpleProduct = (product: StoreProduct): boolean => {
    return (product.variants?.length || 0) <= 1;
}