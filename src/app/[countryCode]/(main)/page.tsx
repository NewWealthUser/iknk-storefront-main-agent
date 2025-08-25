import { Metadata } from "next"

import { listProducts } from "@lib/medusa"; // Import our modified listProducts
import { getRegion } from "@lib/data/regions"
import IknkProductGrid from "../../../components/ProductGrid"; // Import our IknkProductGrid

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

  // Fetch products using our adapted listProducts function
  const { products, count } = await listProducts({
    countryCode,
    regionId: region.id, // Pass region.id
    queryParams: { limit: 12 }, // Adjust limit as needed
  });

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
          // Add other props as needed by IknkProductGrid
        />
      </div>
    </>
  )
}