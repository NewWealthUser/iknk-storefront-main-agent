"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import FiltersBar from "../../../../components/FiltersBar"
import SortControl from "../../../../components/SortControl"
import { SortOptions } from "types/sort-options"

type StoreFilterProps = {
  facets: {
    material: string[]
    seating: string[]
    shape: string[]
    size: string[]
  }
}

const StoreFilter = ({ facets }: StoreFilterProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sortBy = (searchParams?.get("sort") || "featured") as SortOptions
  const selectedParams = Object.fromEntries(searchParams?.entries() || [])

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams?.toString() || "")
    newParams.set("sort", value)
    router.push(`${pathname}?${newParams.toString()}`)
  }

  return (
    <div className="flex justify-between w-full mb-8">
      <FiltersBar facets={facets} selected={selectedParams} />
      <SortControl value={sortBy} onChange={handleSortChange} />
    </div>
  )
}

export default StoreFilter