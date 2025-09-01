import { sdk } from "@lib/config" // Corrected import
import { HttpTypes, StoreProduct, StoreCollection } from "@medusajs/types" // Import necessary types
import { SortOptions } from "types/sort-options"

/**
 * Fetches a collection by its handle.
 * @param handle - The handle of the collection.
 * @returns The collection object or null if not found.
 */
export async function fetchCollectionByHandle(handle: string): Promise<StoreCollection | null> {
  try {
    const { collections } = await sdk.store.collection.list({ handle, limit: 1 });
    if (collections.length === 0) {
      console.warn(`[catalog][fallback] Collection with handle '${handle}' not found.`);
      return null;
    }
    return collections[0];
  } catch (error: any) {
    console.error(`[catalog][fallback] Failed to fetch collection by handle '${handle}':`, error);
    return null;
  }
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
  categoryId,
  searchParams,
  pageSizeDefault = 24,
}: FetchProductsForListingOptions) {
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || String(pageSizeDefault));
  const sortOption = (searchParams.get("sort") || "featured") as SortOptions;
  const inStock = searchParams.get("in_stock") === "true";

  let resolvedCollectionId: string | undefined;
  let resolvedCategoryId: string | undefined;

  if (handle) {
    const collection = await fetchCollectionByHandle(handle);
    if (!collection) {
      throw new Error(`Collection with handle ${handle} not found.`);
    }
    resolvedCollectionId = collection.id;
  } else if (collectionId) {
    resolvedCollectionId = collectionId;
  } else if (categoryId) {
    resolvedCategoryId = categoryId;
  }

  const queryParams: HttpTypes.StoreProductParams | any = { // Fixed: Cast to any
    fields: "id,title,handle,thumbnail,*images,*variants,*variants.prices,*variants.options,metadata,*tags",
  };

  if (resolvedCollectionId) {
    queryParams.collection_id_in = [resolvedCollectionId]; // Fixed: Access as any
  } else if (resolvedCategoryId) {
    queryParams.category_id_in = [resolvedCategoryId]; // Fixed: Access as any
  }

  if (inStock) {
    queryParams.inventory_quantity = { gt: 0 }; // Fixed: Access as any
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
    queryParams.tags_in = tags; // Fixed: Access as any
  }

  let products: HttpTypes.StoreProduct[] = [];
  let count: number = 0;

  try {
    if (sortOption === "featured") {
      const res = await sdk.store.product.list({
        ...queryParams,
        limit: 100, // Fetch all to sort by featured_rank
        offset: 0,
      });

      products = res.products;
      count = res.count;

      products.sort((a, b) => {
        const rankA = (a.metadata as any)?.featured_rank ?? Infinity;
        const rankB = (b.metadata as any)?.featured_rank ?? Infinity;
        return rankA - rankB;
      });

      products = products.slice((page - 1) * pageSize, page * pageSize);

    } else {
      const res = await sdk.store.product.list({
        ...queryParams,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        order: sortOption === "price_asc" ? "calculated_price" : sortOption === "price_desc" ? "-calculated_price" : sortOption === "newest" ? "-created_at" : undefined,
      });

      products = res.products;
      count = res.count;
    }
  } catch (error: any) {
    console.error("[catalog][fallback] Failed to fetch products for listing:", error);
    // Return empty data in case of error
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
  categoryId?: string;
}

/**
 * Fetches products to build unique facet values for filtering.
 * @param options - Options for fetching products, including collection handle/ID.
 * @returns An object containing arrays of unique facet values for material, seating, shape, and size.
 */
export async function fetchFacetsForListing({
  handle,
  collectionId,
  categoryId,
}: FetchFacetsForListingOptions) {
  let resolvedCollectionId: string | undefined;
  let resolvedCategoryId: string | undefined;

  if (handle) {
    const collection = await fetchCollectionByHandle(handle);
    if (!collection) {
      throw new Error(`Collection with handle ${handle} not found.`);
    }
    resolvedCollectionId = collection.id;
  } else if (collectionId) {
    resolvedCollectionId = collectionId;
  } else if (categoryId) {
    resolvedCategoryId = categoryId;
  }

  const queryParams: HttpTypes.StoreProductParams | any = { // Fixed: Cast to any
    limit: 200,
    fields: "id,tags,metadata",
  };

  if (resolvedCollectionId) {
    queryParams.collection_id_in = [resolvedCollectionId]; // Fixed: Access as any
  } else if (resolvedCategoryId) {
    queryParams.category_id_in = [resolvedCategoryId]; // Fixed: Access as any
  }

  let products: HttpTypes.StoreProduct[] = [];
  try {
    const res = await sdk.store.product.list(queryParams);
    products = res.products;
  } catch (error: any) {
    console.error("[catalog][fallback] Failed to fetch facets:", error);
    // Continue with empty products array
  }

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