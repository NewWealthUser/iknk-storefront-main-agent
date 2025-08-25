import { listProducts } from "@lib/medusa"; // Import our modified listProducts
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "types/sort-options"
import { getRegion } from "@lib/data/regions"
import ProductGrid from "../../../components/ProductGrid"

type PaginatedProductsProps = {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string // Ensure this is here
  productsIds?: string[]
  countryCode: string
  searchParams: URLSearchParams
}

export default async function PaginatedProducts({
  sortBy,
  collectionId,
  categoryId, // Destructure categoryId
  productsIds,
  countryCode,
  searchParams,
}: PaginatedProductsProps) {
  const page = parseInt(searchParams.get("page") || "1");
  const region = await getRegion(countryCode);

  if (!region) {
    return null;
  }

  const queryParams: any = {
    limit: 12, // Default limit
    offset: (page - 1) * 12, // Calculate offset
  };

  if (collectionId) {
    queryParams.collection_id = collectionId;
  }
  if (categoryId) {
    queryParams.category_id = categoryId;
  }
  if (productsIds) {
    queryParams.id = productsIds;
  }
  if (sortBy) {
    if (sortBy === "featured") {
      // Do not add 'order' parameter for 'featured' as it's not a standard Medusa sort option
      // Medusa will use its default sorting (e.g., by creation date)
    } else {
      queryParams.order = sortBy; // Assuming sortBy maps to 'order' in Medusa
    }
  }

  // Add other searchParams to queryParams if needed
  for (const [key, value] of searchParams.entries()) {
    if (!["page", "sort", "collectionId", "categoryId", "productsIds"].includes(key)) {
      queryParams[key] = value;
    }
  }

  const { products, count } = await listProducts({
    countryCode,
    regionId: region.id,
    queryParams,
  });

  

  if (!products) {
    return null
  }

  return (
    <>
      <ProductGrid productList={products} totalNumRecs={count} />
      {/* Pagination logic might need to be adapted for IknkProductGrid if it has its own pagination */}
      {/* {pagination.totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={pagination.page}
          totalPages={pagination.totalPages}
        />
      )} */}
    </>
  )
}