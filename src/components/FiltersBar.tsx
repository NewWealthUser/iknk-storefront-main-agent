"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import CheckboxWithLabel from "@modules/common/components/checkbox"
import { Button } from "@medusajs/ui"

type FiltersBarProps = {
  products: HttpTypes.StoreProduct[]
  queryParams: URLSearchParams
  onFilterChange: (key: string, value: string | null) => void
  onClearFilters: () => void
}

const getUniqueOptions = (products: HttpTypes.StoreProduct[]) => {
  const optionsMap = new Map<string, Set<string>>()
  products.forEach(p => {
    p.options?.forEach(o => {
      if (!optionsMap.has(o.title)) {
        optionsMap.set(o.title, new Set())
      }
      const values = optionsMap.get(o.title)!
      o.values?.forEach(v => values.add(v.value))
    })
  })
  return Array.from(optionsMap.entries()).map(([title, values]) => ({
    title,
    values: Array.from(values).sort(),
  }))
}

export default function FiltersBar({ products, queryParams, onFilterChange, onClearFilters }: FiltersBarProps) {
  const uniqueOptions = getUniqueOptions(products)
  const hasActiveFilters = Array.from(queryParams.keys()).some(k => k !== 'sort' && k !== 'page' && k !== 'limit' && k !== 'offset');

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
      <div className="flex flex-wrap items-center gap-4">
        <CheckboxWithLabel
          label="In-Stock"
          checked={queryParams.get("in_stock") === "true"}
          onChange={() => onFilterChange("in_stock", queryParams.get("in_stock") ? null : "true")}
        />
        {uniqueOptions.map(option => (
          <div key={option.title}>
            <select
              value={queryParams.get(`options[${option.title}]`) || ""}
              onChange={(e) => onFilterChange(`options[${option.title}]`, e.target.value || null)}
              className="px-3 py-1.5 border rounded-md text-sm bg-white"
            >
              <option value="">{option.title}</option>
              {option.values.map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
        ))}
        {hasActiveFilters && (
          <Button variant="secondary" size="sm" onClick={onClearFilters}>Clear All</Button>
        )}
      </div>
    </div>
  )
}