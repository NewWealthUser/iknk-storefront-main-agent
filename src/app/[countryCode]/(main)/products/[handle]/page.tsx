import { notFound } from "next/navigation"
import { Suspense } from "react"

import { getProductByHandle, listProducts } from "@lib/medusa" // Corrected imports
import NewProductTemplate from "@modules/products/templates/new-product-template" // Updated import
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page" // Re-added import
import { HttpTypes, StoreProduct } from "@medusajs/types"
import { Metadata } from "next"
import { getRegion } from "@lib/data/regions" // Corrected import

type Props = {
  params: { handle: string; countryCode: string }
}

export async function generateStaticParams() {
  const { data } = await listProducts({
    pageParam: 1,
    queryParams: { limit: 100, fields: "handle" },
    countryCode: "us", // Default country code for static params generation
  })

  if (!data?.products) {
    return []
  }

  const staticParams = data.products.map((product: StoreProduct) => ({
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
    notFound()
  })
  const region = (await getRegion(params.countryCode)) as HttpTypes.StoreRegion

  if (!product || !region) {
    notFound()
  }

  const { data: relatedProductsData } = await listProducts({
    pageParam: 1,
    queryParams: {
      collection_id: product.collection_id ? [product.collection_id] : undefined,
      limit: 4,
    },
    countryCode: params.countryCode,
  })

  const relatedProducts = relatedProductsData?.products?.filter(
    (p) => p.id !== product.id
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