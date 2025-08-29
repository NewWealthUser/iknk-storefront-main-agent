import { notFound } from "next/navigation"
import { Suspense } from "react"

// import { getProductsByHandle, getProductsList } from "@/lib/data"
// import ProductTemplate from "@/modules/products/templates"
// import SkeletonProductPage from "@/modules/skeletons/templates/skeleton-product-page"
import { HttpTypes, StoreProduct } from "@medusajs/types"
import { Metadata } from "next"
// import { getRegion } from "@/app/actions"

type Props = {
  params: { handle: string; countryCode: string }
}

// export async function generateStaticParams() {
//   const { products } = await getProductsList({
//     page: 1,
//     limit: 100,
//   })

//   if (!products) {
//     return []
//   }

//   const staticParams = products.map((product: StoreProduct) => ({
//     handle: product.handle,
//   }))

//   return staticParams
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { products } = await getProductsByHandle(params.handle)

//   const product = products[0]

//   if (!product) {
//     notFound()
//   }

//   const safeTitle = typeof product.title === "string" ? product.title.trim() : ""

//   return {
//     title: `${safeTitle} | Medusa Next.js`,
//     description: `${safeTitle}`,
//     openGraph: {
//       title: `${safeTitle} | Medusa Next.js`,
//       description: `${safeTitle}`,
//       images: product.thumbnail ? [product.thumbnail] : [],
//     },
//   }
// }

export default async function ProductPage({ params }: Props) {
  // const { products } = await getProductsByHandle(params.handle).catch((err: any) => {
  //   notFound()
  // })
  // const region = (await getRegion(params.countryCode)) as HttpTypes.StoreRegion

  // if (!products || !products[0] || !region) {
  //   notFound()
  // }

  // const { products: relatedProducts } = await getProductsList({
  //   page: 1,
  //   limit: 4,
  //   queryParams: {
  //     collection_id: [products[0].collection_id],
  //   },
  // })

  return (
    // <Suspense fallback={<SkeletonProductPage />}>
    //   <ProductTemplate
    //     product={products[0]}
    //     relatedProducts={relatedProducts}
    //     region={region}
    //     countryCode={params.countryCode}
    //   />
    // </Suspense>
    <></>
  )
}
