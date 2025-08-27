import { medusaGet } from "./medusa";
import { HttpTypes } from "@medusajs/types";
import { SortOptions } from "types/sort-options";
import { MedusaGetResult } from "./medusa"; // Import MedusaGetResult

/**
 * Fetches a collection by its handle.
 * @param handle - The handle of the collection.
 * @returns The collection object or null if not found.
 */
export async function fetchCollectionByHandle(handle: string) {
  const res = await medusaGet<HttpTypes.StoreCollectionListResponse>(
    `/store/collections`,
    { handle }
  );
  if (!res.ok || !res.data?.collections) {
    console.warn(`[catalog][fallback] Failed to fetch collection by handle '${handle}': ${res.error?.message || 'Not found or unknown error'}`);
    return null;
  }
  return res.data.collections[0] || null;
}

interface FetchProductsForListingOptions {
  handle?: string; // Collection handle
  collectionId?: string;
  categoryId?: string; // Added categoryId
  searchParams: URLSearchParams;
  pageSizeDefault?: number;
}

/**
 * Fetches products for a listing page, handling pagination, sorting, and filtering.
 * @param options - Options for fetching products, including collection handle/ID, search parameters, and default page size.
 * @returns An object containing items, pagination details, and the applied sort option.
 */
export async function fetchProductsForListing({
  handle,
  collectionId,
  categoryId, // Destructure categoryId
  searchParams,
  pageSizeDefault = 24,
}: FetchProductsForListingOptions) {
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || String(pageSizeDefault));
  const sortOption = (searchParams.get("sort") || "featured") as SortOptions;
  const inStock = searchParams.get("in_stock") === "true";

  let resolvedCollectionId: string | undefined;
  let resolvedCategoryId: string | undefined; // New variable for category ID

  if (handle) {
    const collection = await fetchCollectionByHandle(handle);
    if (!collection) {
      throw new Error(`Collection with handle ${handle} not found.`);
    }
    resolvedCollectionId = collection.id;
  } else if (collectionId) {
    resolvedCollectionId = collectionId;
  } else if (categoryId) { // Handle categoryId
    resolvedCategoryId = categoryId;
  }

  const queryParams: any = {
    fields: "id,title,handle,thumbnail,*images,*variants,*variants.prices,*variants.options,metadata,*tags",
  };

  if (resolvedCollectionId) {
    queryParams.collection_id = [resolvedCollectionId];
  } else if (resolvedCategoryId) { // Use category_id if resolved
    queryParams.category_id = [resolvedCategoryId];
  }

  if (inStock) {
    queryParams.inventory_quantity = { gt: 0 };
  }

  // Apply filters via tags convention
  const facetKeys = ["material", "seating", "shape", "size"];
  const tags: string[] = [];
  facetKeys.forEach(key => {
    const value = searchParams.get(key);
    if (value) {
      tags.push(`${key}:${value}`);
    }
  });
  if (tags.length > 0) {
    queryParams.tags = { value: tags };
  }

  let products: HttpTypes.StoreProduct[] = [];
  let count: number = 0;

  if (sortOption === "featured") {
    const res = await medusaGet<{
      products: HttpTypes.StoreProduct[];
      count: number;
    }>(`/store/products`, {
      ...queryParams,
      limit: 100,
      offset: 0,
    });

    if (!res.ok || !res.data) {
      console.warn(`[catalog][fallback] Failed to fetch featured products: ${res.error?.message || 'Unknown error'}`);
      return { items: [], pagination: { page, pageSize, total: 0, totalPages: 0 }, sort: sortOption };
    }
    products = res.data.products;
    count = res.data.count;

    products.sort((a, b) => {
      const rankA = (a.metadata as any)?.featured_rank ?? Infinity;
      const rankB = (b.metadata as any)?.featured_rank ?? Infinity;
      return rankA - rankB;
    });

    products = products.slice((page - 1) * pageSize, page * pageSize);

  } else {
    queryParams.limit = pageSize;
    queryParams.offset = (page - 1) * pageSize;

    if (sortOption === "price_asc") {
      queryParams.order_by = "calculated_price";
      queryParams.order = "asc";
    } else if (sortOption === "price_desc") {
      queryParams.order_by = "calculated_price";
      queryParams.order = "desc";
    } else if (sortOption === "newest") {
      queryParams.order_by = "created_at";
      queryParams.order = "desc";
    }

    const res = await medusaGet<{
      products: HttpTypes.StoreProduct[];
      count: number;
    }>(`/store/products`, queryParams);

    if (!res.ok || !res.data) {
      console.warn(`[catalog][fallback] Failed to fetch products for listing: ${res.error?.message || 'Unknown error'}`);
      return { items: [], pagination: { page, pageSize, total: 0, totalPages: 0 }, sort: sortOption };
    }
    products = res.data.products;
    count = res.data.count;
  }

  const totalPages = Math.ceil(count / pageSize);

  return {
    items: products,
    pagination: { page, pageSize, total: count, totalPages },
    sort: sortOption,
  };
}

interface FetchFacetsForListingOptions {
  handle?: string; // Collection handle
  collectionId?: string;
  categoryId?: string; // Added categoryId
}

/**
 * Fetches products to build unique facet values for filtering.
 * @param options - Options for fetching products, including collection handle/ID.
 * @returns An object containing arrays of unique facet values for material, seating, shape, and size.
 */
export async function fetchFacetsForListing({
  handle,
  collectionId,
  categoryId, // Destructure categoryId
}: FetchFacetsForListingOptions) {
  let resolvedCollectionId: string | undefined;
  let resolvedCategoryId: string | undefined; // New variable for category ID

  if (handle) {
    const collection = await fetchCollectionByHandle(handle);
    if (!collection) {
      throw new Error(`Collection with handle ${handle} not found.`);
    }
    resolvedCollectionId = collection.id;
  } else if (collectionId) {
    resolvedCollectionId = collectionId;
  } else if (categoryId) { // Handle categoryId
    resolvedCategoryId = categoryId;
  }

  const queryParams: any = {
    limit: 200,
    fields: "id,tags,metadata",
  };

  if (resolvedCollectionId) {
    queryParams.collection_id = [resolvedCollectionId];
  } else if (resolvedCategoryId) {
    queryParams.category_id = [resolvedCategoryId];
  }

  const res = await medusaGet<{
    products: HttpTypes.StoreProduct[];
    count: number;
  }>(`/store/products`, queryParams);

  if (!res.ok || !res.data) {
    console.warn(`[catalog][fallback] Failed to fetch facets: ${res.error?.message || 'Unknown error'}`);
    return { material: [], seating: [], shape: [], size: [] };
  }
  const products = res.data.products;

  const materials = new Set<string>();
  const seatingCapacities = new Set<number>();
  const shapes = new Set<string>();
  const sizes = new Set<string>();

  products.forEach((product: HttpTypes.StoreProduct) => {
    if ((product.metadata as any)?.material) {
      materials.add(String((product.metadata as any).material));
    }
    if ((product.metadata as any)?.seating) {
      seatingCapacities.add(Number((product.metadata as any).seating));
    }
    if ((product.metadata as any)?.shape) {
      shapes.add(String((product.metadata as any).shape));
    }
    if ((product.metadata as any)?.size) {
      sizes.add(String((product.metadata as any).size));
    }

    product.tags?.forEach((tag: HttpTypes.StoreProductTag) => {
      const [key, value] = tag.value.split(":");
      if (key && value) {
        if (key === "material") materials.add(value);
        if (key === "seating") seatingCapacities.add(Number(value));
        if (key === "shape") shapes.add(value);
        if (key === "size") sizes.add(value);
      }
    });
  });

  return {
    material: Array.from(materials).sort(),
    seating: Array.from(seatingCapacities).sort((a, b) => a - b).map(String),
    shape: Array.from(shapes).sort(),
    size: Array.from(sizes).sort(),
  };
}