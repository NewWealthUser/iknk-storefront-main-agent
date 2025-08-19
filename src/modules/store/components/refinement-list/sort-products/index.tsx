"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at" | "featured" | "newest"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "newest", // This value will be mapped to "created_at" in catalog.ts
    label: "Newest",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sort", value) // Changed from 'sortBy' to 'sort' to match URL param convention
  }

  return (
    <FilterRadioGroup
      title="Sort by"
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts