"use client"

import React from "react"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"

type SortOption = {
  value: string
  label: string
}

const sortOptions: SortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "created_at", label: "Newest" },
]

export default function SortControl({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const selectedOption = sortOptions.find((o) => o.value === value) || sortOptions[0]

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-48">
        <ListboxButton className="relative w-full flex justify-between items-center px-3 py-1.5 text-left bg-white cursor-default focus:outline-none border rounded-md text-sm">
          <span className="block truncate">{selectedOption.label}</span>
          <ChevronUpDown className="h-5 w-5 text-gray-400" />
        </ListboxButton>
        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-10 mt-1 w-full overflow-auto text-sm bg-white border rounded-md shadow-lg max-h-60 focus:outline-none">
            {sortOptions.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  clx(
                    "cursor-default select-none relative py-2 pl-3 pr-9",
                    active ? "bg-gray-100" : ""
                  )
                }
              >
                {({ selected }) => (
                  <span className={clx("block truncate", selected ? "font-semibold" : "")}>
                    {option.label}
                  </span>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  )
}