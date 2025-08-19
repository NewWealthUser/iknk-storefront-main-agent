import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import FiltersBar from "@modules/store/components/filters-bar"
import { fetchFacetsForListing } from "@lib/catalog"

const StoreTemplate = async ({
  searchParams, // Receive searchParams
  countryCode,
}: {
  searchParams: URLSearchParams // Define searchParams type
  countryCode: string
}) => {
  const sortBy = (searchParams.get("sort") || "featured") as SortOptions; // Get sort from searchParams
  const page = parseInt(searchParams.get("page") || "1"); // Extract page from searchParams

  const facets = await fetchFacetsForListing({}); // Fetch all facets for the store page
  const selectedParams = Object.fromEntries(searchParams.entries());

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        <FiltersBar facets={facets} selected={selectedParams} sort={sortBy} />
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sortBy}
            searchParams={searchParams} // Pass searchParams
            countryCode={countryCode}
            page={page} // Pass page
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate