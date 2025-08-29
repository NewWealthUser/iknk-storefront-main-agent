import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "types/sort-options"
// import { getRegion } from "@/lib/data/regions"
import ProductGrid from "../../../components/ProductGrid"
import { HttpTypes } from "@medusajs/types" // Added missing import

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
  // const region = await getRegion(countryCode);

  // if (!region) {
  //   return null;
  // }

  const queryParams: any = {
    limit: 12,
    offset: (page - 1) * 12,
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
    } else {
      queryParams.order = sortBy;
    }
  }

  for (const [key, value] of searchParams.entries()) {
    if (!["page", "sort", "collectionId", "categoryId", "productsIds"].includes(key)) {
      queryParams[key] = value;
    }
  }

  // const res = await listProducts({
  //   countryCode,
  //   regionId: region.id,
  //   queryParams,
  // });

  // if (!res.ok || !res.data?.products) {
  //   console.warn(`[paginated-products][fallback] Failed to list products: ${res.error?.message || 'Unknown error'}`);
  //   return null;
  // }

  // const products = res.data.products;
  // const count = res.data.count;
  // const totalPages = Math.ceil(count / queryParams.limit);


  // if (!products) {
  //   return null
  // }

  return (
    <>
      {/* <ProductGrid productList={products} /> */}
      {/* {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )} */}
    </>
  )
}
