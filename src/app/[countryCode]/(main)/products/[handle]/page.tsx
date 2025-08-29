import { notFound } from "next/navigation"
import { Suspense } from "react"

import { getProductByHandle } from "@lib/medusa" // Corrected imports
import sdk from "@lib/config/sdk"
import NewProductTemplate from "@modules/products/templates/new-product-template" // Updated import

import { HttpTypes, StoreProduct } from "@medusajs/types"
import { Metadata } from "next"
import { getRegion } from "@lib/data/regions" // Corrected import

function SkeletonProductPage() {
  return <div className="animate-pulse w-full h-96 bg-gray-100" />
}

type Props = {
  params: { handle: string; countryCode: string }
}

export async function generateStaticParams() {
  const { products } = await sdk.store.product.list({ // Fixed: Destructured products directly
    limit: 100,
    fields: "handle",
  })

  if (!products) { // Fixed: Checked products directly
    return []
  }

  const staticParams = products.map((product: StoreProduct) => ({ // Fixed: Used products directly
    handle: product.handle,
  }))

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductByHandle(params.handle, params.countryCode)

  if (!product) {
    notFound()
  }

  const safeTitle = typeof product.title === "string" ? product.title.trim() : ""

  return {
    title: `${safeTitle} | Medusa Next.js`,
    description: `${safeTitle}`,
    openGraph: {
      title: `${safeTitle} | Medusa Next.js`,
      description: `${safeTitle}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductByHandle(params.handle, params.countryCode).catch((err: any) => {
    console.error(`[ProductPage] Error fetching product by handle '${params.handle}':`, err); // Added logging
    notFound()
  })
  const region = (await getRegion(params.countryCode)) as HttpTypes.StoreRegion

  if (!product || !region) {
    console.error(`[ProductPage] Product or region not found for handle '${params.handle}' and countryCode '${params.countryCode}'.`); // Added logging
    notFound()
  }

  const { products: relatedProductsData } = await sdk.store.product.list({
    collection_id: product.collection_id ? [product.collection_id] as string[] : [],
    limit: 4,
  })

  const relatedProducts = relatedProductsData?.filter( // Fixed: Used relatedProductsData directly
    (p: StoreProduct) => p.id !== product.id
  ) || []

  return (
    <Suspense fallback={<SkeletonProductPage />}>
      <NewProductTemplate
        product={product}
        relatedProducts={relatedProducts}
        region={region}
        countryCode={params.countryCode}
      />
    </Suspense>
  )
}