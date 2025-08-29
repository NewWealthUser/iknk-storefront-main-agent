import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "types/sort-options"
import { getRegion } from "@lib/data/regions" // Re-added import for getRegion
import ProductGrid from "../../../components/ProductGrid" // Updated import path
import { HttpTypes } from "@medusajs/types" // Added missing import
import { listProductsWithSort } from "@lib/data/products" // Re-added import for listProductsWithSort

type PaginatedProductsProps = {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  searchParams: URLSearchParams
}

export default async function PaginatedProducts({
  sortBy,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  searchParams,
}: PaginatedProductsProps) {
  const page = parseInt(searchParams.get("page") || "1");
  const region = await getRegion(countryCode); // Re-enabled getRegion

  if (!region) {
    return null;
  }

  const queryParams: any = {
    limit: 12,
    offset: (page - 1) * 12,
  };

  if (collectionId) {
    queryParams.collection_id = [collectionId]; // Changed to array for collection_id
  }
  if (categoryId) {
    queryParams.category_id = [categoryId]; // Changed to array for category_id
  }
  if (productsIds) {
    queryParams.id = productsIds;
  }
  // Sort is handled by listProductsWithSort, no need to add 'order' here directly

  for (const [key, value] of searchParams.entries()) {
    if (!["page", "sort", "collectionId", "categoryId", "productsIds"].includes(key)) {
      queryParams[key] = value;
    }
  }

  const { response, nextPage } = await listProductsWithSort({ // Re-enabled product fetching
    page,
    queryParams,
    sortBy: sortBy || "created_at", // Ensure sortBy is always provided
    countryCode,
  });

  const products = response.products;
  const count = response.count;
  const totalPages = Math.ceil(count / queryParams.limit);


  if (!products) {
    return null
  }

  return (
    <>
      <ProductGrid productList={products} region={region} /> {/* Updated to use new ProductGrid */}
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}