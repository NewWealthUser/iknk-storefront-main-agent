import { RhProduct } from "@lib/util/rh-product-adapter";

export const isSimpleProduct = (product: RhProduct): boolean => {
    return (product.variants?.length || 0) <= 1;
}