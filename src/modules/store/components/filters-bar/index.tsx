"use client"

import React, { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import { SortOptions } from "../refinement-list/sort-products"
import CheckboxWithLabel from "@modules/common/components/checkbox"

type Props = {
  facets: {
    material: string[];
    seating: string[];
    shape: string[];
    size: string[];
  };
  selected: Record<string, string>;
  sort: SortOptions;
}

export default function FiltersBar({ facets, selected, sort }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setParam = useCallback(
    (key: string, value?: string | number) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
      // Reset page to 1 when filters or sort change
      if (key !== 'page') {
        params.delete('page');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleInStockChange = () => {
    const inStock = searchParams?.get("in_stock") === "true";
    if (inStock) {
      setParam("in_stock", undefined); // remove param
    } else {
      setParam("in_stock", "true"); // add param
    }
  };

  const getFacetValue = (key: string) => searchParams?.get(key);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: Low -> High" },
    { value: "price_desc", label: "Price: High -> Low" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-12">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {facets.shape.length > 0 && (
          <FilterRadioGroup
            title="SHAPE"
            items={facets.shape.map(s => ({ value: s, label: s }))}
            value={getFacetValue("shape")}
            handleChange={(value) => setParam("shape", value)}
          />
        )}
        {facets.material.length > 0 && (
          <FilterRadioGroup
            title="MATERIAL"
            items={facets.material.map(m => ({ value: m, label: m }))}
            value={getFacetValue("material")}
            handleChange={(value) => setParam("material", value)}
          />
        )}
        {facets.size.length > 0 && (
          <FilterRadioGroup
            title="SIZE"
            items={facets.size.map(s => ({ value: s, label: s }))}
            value={getFacetValue("size")}
            handleChange={(value) => setParam("size", value)}
          />
        )}
        {facets.seating.length > 0 && (
          <FilterRadioGroup
            title="SEATING CAPACITY"
            items={facets.seating.map(s => ({ value: String(s), label: String(s) }))}
            value={getFacetValue("seating")}
            handleChange={(value) => setParam("seating", value)}
          />
        )}
        <CheckboxWithLabel
          label="In Stock"
          name="in_stock"
          checked={searchParams?.get("in_stock") === "true"}
          onChange={handleInStockChange}
        />
      </div>

      <div className="flex items-center" style={{ flex: '0 0 auto' }}>
        <FilterRadioGroup
          title="sort:"
          items={sortOptions}
          value={sort}
          handleChange={(value) => setParam("sort", value)}
        />
      </div>
    </div>
  )
}