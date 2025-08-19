import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import FiltersBar from "@modules/store/components/filters-bar"
import { fetchFacetsForListing } from "@lib/catalog"

export default async function CollectionTemplate({
  collection,
  searchParams, // Receive searchParams
  countryCode,
}: {
  collection: HttpTypes.StoreCollection
  searchParams: URLSearchParams // Define searchParams type
  countryCode: string
}) {
  const sortBy = (searchParams.get("sort") || "featured") as SortOptions; // Get sort from searchParams
  const page = parseInt(searchParams.get("page") || "1"); // Extract page from searchParams

  const facets = await fetchFacetsForListing({ collectionId: collection.id });
  const selectedParams = Object.fromEntries(searchParams.entries());

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>{collection.title}</h1>
        </div>
        <FiltersBar facets={facets} selected={selectedParams} sort={sortBy} />
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sortBy}
            collectionId={collection.id}
            searchParams={searchParams} // Pass searchParams
            countryCode={countryCode}
            page={page} // Pass page
          />
        </Suspense>
      </div>
    </div>
  )
}