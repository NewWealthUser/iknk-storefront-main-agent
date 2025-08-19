"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@medusajs/ui"
import CheckboxWithLabel from "@modules/common/components/checkbox"

type FiltersBarProps = {
  facets: {
    material: string[]
    seating: string[]
    shape: string[]
    size: string[]
  }
  selected: { [k: string]: string }
}

export default function FiltersBar({ facets, selected }: FiltersBarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleFilterChange = (key: string, value: string | null) => {
    const currentParams = new URLSearchParams(window.location.search)
    if (value) {
      currentParams.set(key, value)
    } else {
      currentParams.delete(key)
    }
    currentParams.delete("page") // Reset page on filter change
    router.push(`${pathname}?${currentParams.toString()}`)
  }

  const handleClearFilters = () => {
    const currentParams = new URLSearchParams(window.location.search)
    const sort = currentParams.get("sort")
    const newParams = new URLSearchParams()
    if (sort) {
      newParams.set("sort", sort)
    }
    router.push(`${pathname}?${newParams.toString()}`)
  }

  const hasActiveFilters = Object.keys(selected).some(
    (k) => k !== "sort" && k !== "page"
  )

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
      <div className="flex flex-wrap items-center gap-4">
        <CheckboxWithLabel
          label="In-Stock"
          checked={selected.in_stock === "true"}
          onChange={() =>
            handleFilterChange(
              "in_stock",
              selected.in_stock ? null : "true"
            )
          }
        />
        {Object.entries(facets).map(([key, values]) => (
          <div key={key}>
            <select
              value={selected[key] || ""}
              onChange={(e) => handleFilterChange(key, e.target.value || null)}
              className="px-3 py-1.5 border rounded-md text-sm bg-white capitalize"
            >
              <option value="">{key}</option>
              {values.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
        {hasActiveFilters && (
          <Button variant="secondary" size="small" onClick={handleClearFilters}>
            Clear All
          </Button>
        )}
      </div>
    </div>
  )
}