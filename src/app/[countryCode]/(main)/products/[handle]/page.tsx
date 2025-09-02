import { notFound } from "next/navigation"
import { Suspense } from "react"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import NewProductTemplate from "@modules/products/templates/new-product-template"
import { HttpTypes, StoreProduct } from "@medusajs/types"
import { Metadata } from "next"

function SkeletonProductPage() {
  return <div className="animate-pulse w-full h-96 bg-gray-100" />
}

type Props = {
  params: { handle: string; countryCode: string }
}

export async function generateStaticParams() {
  // Using the centralized listProducts function
  const { response } = await listProducts({ queryParams: { limit: 100 }, countryCode: "us" })

  if (!response.products) {
    return []
  }

  const staticParams = response.products.map((product: StoreProduct) => ({
    handle: product.handle,
  }))

  return staticParams
}

export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> {
  const { handle, countryCode } = await paramsPromise;
  // Using the centralized listProducts function
  const { response } = await listProducts({
    queryParams: { handle: handle, limit: 1 } as any,
    countryCode: countryCode,
  })

  const product = response.products[0]

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

export default async function ProductPage(props: { params: Promise<{ handle: string; countryCode: string }> }) {
  const { params } = props;
  const { handle, countryCode } = await params;
  // Using the centralized listProducts function
  const { response } = await listProducts({
    queryParams: { handle: handle, limit: 1 } as any,
    countryCode: countryCode,
  })

  const product = response.products[0]
  const region = await getRegion(countryCode)

  if (!product || !region) {
    notFound()
  }

  const { response: relatedProductsResponse } = await listProducts({
    queryParams: {
      collection_id: [product.collection_id!],
      limit: 4,
    } as any,
    countryCode: countryCode,
  })

  const relatedProducts = relatedProductsResponse.products.filter(
    (p: StoreProduct) => p.id !== product.id
  )

  return (
    <Suspense fallback={<SkeletonProductPage />}>
      <NewProductTemplate
        product={product}
        relatedProducts={relatedProducts}
        region={region}
        countryCode={countryCode}
      />
    </Suspense>
  )
}
