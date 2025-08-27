import { Metadata } from "next"

import { listProducts } from "@lib/medusa";
import { getRegion } from "@lib/data/regions"
import IknkProductGrid from "../../../components/ProductGrid";
import { HttpTypes } from "@medusajs/types" // Added missing import

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const res = await listProducts({
    countryCode,
    regionId: region.id,
    queryParams: { limit: 12 },
  });

  if (!res.ok || !res.data?.products) {
    console.warn(`[home][fallback] Failed to list products: ${res.error?.message || 'Unknown error'}`);
    return null;
  }

  const products = res.data.products;
  const count = res.data.count;

  if (!products) {
    return null
  }

  return (
    <>
      {/* <Hero /> */}
      <div className="py-12">
        <IknkProductGrid
          productList={products}
          totalNumRecs={count}
          countryCode={countryCode} // Pass countryCode here
        />
      </div>
    </>
  )
}