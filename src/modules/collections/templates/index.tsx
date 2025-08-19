import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "types/sort-options"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { fetchFacetsForListing } from "@lib/catalog"
import CollectionFilter from "../components/CollectionFilter"

export default async function CollectionTemplate({
  collection,
  searchParams,
  countryCode,
}: {
  collection: HttpTypes.StoreCollection
  searchParams: URLSearchParams
  countryCode: string
}) {
  const sortBy = (searchParams.get("sort") || "featured") as SortOptions;
  const page = parseInt(searchParams.get("page") || "1");

  const facets = await fetchFacetsForListing({ collectionId: collection.id });

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>{collection.title}</h1>
        </div>
        <CollectionFilter facets={facets} />
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
            searchParams={searchParams}
            countryCode={countryCode}
            page={page}
          />
        </Suspense>
      </div>
    </div>
  )
}