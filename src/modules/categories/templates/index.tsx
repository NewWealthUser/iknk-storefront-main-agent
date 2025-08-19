import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import FiltersBar from "@modules/store/components/filters-bar"
import { fetchFacetsForListing } from "@lib/catalog"

export default async function CategoryTemplate({
  category,
  searchParams, // Receive searchParams
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  searchParams: URLSearchParams // Define searchParams type
  countryCode: string
}) {
  const sortBy = (searchParams.get("sort") || "featured") as SortOptions; // Get sort from searchParams
  const page = parseInt(searchParams.get("page") || "1"); // Extract page from searchParams

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  const facets = await fetchFacetsForListing({ categoryId: category.id });
  const selectedParams = Object.fromEntries(searchParams.entries());

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <FiltersBar facets={facets} selected={selectedParams} sort={sortBy} />
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sortBy}
            categoryId={category.id}
            searchParams={searchParams} // Pass searchParams
            countryCode={countryCode}
            page={page} // Pass page
          />
        </Suspense>
      </div>
    </div>
  )
}