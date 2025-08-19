import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "types/sort-options"
import PaginatedProducts from "./paginated-products"
import { fetchFacetsForListing } from "@lib/catalog"
import StoreFilter from "../components/StoreFilter"

const StoreTemplate = async ({
  searchParams,
  countryCode,
}: {
  searchParams: URLSearchParams
  countryCode: string
}) => {
  const sortBy = (searchParams.get("sort") || "featured") as SortOptions;
  const page = parseInt(searchParams.get("page") || "1");

  const facets = await fetchFacetsForListing({});
  
  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        <StoreFilter facets={facets} />
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sortBy}
            searchParams={searchParams}
            countryCode={countryCode}
            page={page}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate