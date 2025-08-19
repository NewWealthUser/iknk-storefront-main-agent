import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: { [key: string]: string | string[] | undefined };
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(props.searchParams)) {
    if (typeof value === 'string') {
      urlSearchParams.set(key, value);
    } else if (Array.isArray(value) && value.length > 0) {
      urlSearchParams.set(key, value[0]); // Take the first value if it's an array
    }
  }

  return (
    <StoreTemplate
      searchParams={urlSearchParams}
      countryCode={params.countryCode}
    />
  )
}