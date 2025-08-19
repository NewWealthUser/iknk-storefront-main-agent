import { fetchProductsForListing } from "@lib/catalog"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getRegion } from "@lib/data/regions"
import ProductGrid from "@modules/store/components/product-grid"

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

  const { items: products, pagination } = await fetchProductsForListing({
    collectionId,
    categoryId, // Pass categoryId here
    searchParams,
  })

  if (!products) {
    return null
  }

  return (
    <>
      <ProductGrid products={products} />
      {pagination.totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={pagination.page}
          totalPages={pagination.totalPages}
        />
      )}
    </>
  )
}