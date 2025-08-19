import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "types/sort-options"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { fetchFacetsForListing } from "@lib/catalog"
import CategoryFilter from "../components/CategoryFilter"

export default async function CategoryTemplate({
  category,
  searchParams,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  searchParams: URLSearchParams
  countryCode: string
}) {
  const sortBy = (searchParams.get("sort") || "featured") as SortOptions;
  const page = parseInt(searchParams.get("page") || "1");

  const facets = await fetchFacetsForListing({ categoryId: category.id });

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>{category.name}</h1>
        </div>
        <CategoryFilter facets={facets} />
        <Suspense
          fallback={
            <SkeletonProductGrid />
          }
        >
          <PaginatedProducts
            sortBy={sortBy}
            categoryId={category.id}
            searchParams={searchParams}
            countryCode={countryCode}
            page={page}
          />
        </Suspense>
      </div>
    </div>
  )
}