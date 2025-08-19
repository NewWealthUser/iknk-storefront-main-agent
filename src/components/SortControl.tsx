"use client"

import { Listbox, Transition } from "@headlessui/react"
import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Fragment } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type SortOption = {
  value: string
  label: string
}

const sortOptions: SortOption[] = [
  { value: "created_at", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
]

export default function SortControl({ initialSort }: { initialSort?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = initialSort || searchParams?.get("sort") || "created_at"

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set("sort", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  const selectedOption = sortOptions.find(
    (option) => option.value === currentSort
  ) || sortOptions[0]

  return (
    <Listbox value={selectedOption.value} onChange={handleSortChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full flex justify-between items-center px-4 py-[10px] text-left bg-white cursor-default focus:outline-none border rounded-rounded focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-gray-300 focus-visible:ring-offset-2 focus-visible:border-gray-300 text-base-regular">
          {({ open }) => (
            <>
              <span className="block truncate">Sort by: {selectedOption.label}</span>
              <ChevronUpDown
                className={clx("transition-rotate duration-200", {
                  "transform rotate-180": open,
                })}
              />
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 w-full overflow-auto text-small-regular bg-white border border-top-0 max-h-60 focus:outline-none sm:text-sm">
            {sortOptions.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                    active ? "text-amber-900 bg-amber-100" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}