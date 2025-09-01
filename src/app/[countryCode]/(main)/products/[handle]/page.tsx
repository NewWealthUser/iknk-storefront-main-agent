import { notFound } from "next/navigation"
import { Suspense } from "react"

import { sdk } from "@lib/config" // Import sdk
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
  const { products } = await sdk.store.product.list({
    limit: 100,
    fields: "handle",
  })

  if (!products) {
    return []
  }

  const staticParams = products.map((product: StoreProduct) => ({
    handle: product.handle,
  }))

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch product directly using SDK
  const product = await sdk.store.product.list({ handle: params.handle, limit: 1 })
    .then(({ products }: { products: HttpTypes.StoreProduct[] }) => products[0] || null) // Fixed: Explicitly typed products
    .catch((err: any) => {
      console.error(`[generateMetadata] Error fetching product by handle '${params.handle}':`, err);
      return null;
    });

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
  // Fetch product directly using SDK
  const product = await sdk.store.product.list({ handle: params.handle, limit: 1 })
    .then(({ products }: { products: HttpTypes.StoreProduct[] }) => products[0] || null) // Fixed: Explicitly typed products
    .catch((err: any) => {
      console.error(`[ProductPage] Error fetching product by handle '${params.handle}':`, err);
      notFound()
    })
  const region = (await getRegion(params.countryCode)) as HttpTypes.StoreRegion

  if (!product || !region) {
    console.error(`[ProductPage] Product or region not found for handle '${params.handle}' and countryCode '${params.countryCode}'.`);
    notFound()
  }

  const { products: relatedProductsData } = await sdk.store.product.list({
    collection_id_in: product.collection_id ? [product.collection_id] as string[] : [], // v2 param
    limit: 4,
  })

  const relatedProducts = relatedProductsData?.filter(
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