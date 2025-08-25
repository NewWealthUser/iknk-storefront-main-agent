import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductPageClient from "@modules/products/templates/product-page-client"
import { HttpTypes } from "@medusajs/types"
import { adaptMedusaProductToRhProduct } from "@lib/util/rh-product-adapter"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const { response: { products: responseProducts } } = await listProducts({
    countryCode: params.countryCode,
    regionId: region.id,
    queryParams: { handle } as HttpTypes.StoreProductParams,
  })

  const product = responseProducts?.[0]

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const { response: { products: responseProducts } } = await listProducts({
    countryCode: params.countryCode,
    regionId: region.id,
    queryParams: { handle: params.handle } as HttpTypes.StoreProductParams,
  })

  const pricedProduct = responseProducts?.[0]

  if (!pricedProduct) {
    notFound()
  }

  const adaptedPricedProduct = adaptMedusaProductToRhProduct(pricedProduct);

  const queryParams: any = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (adaptedPricedProduct.collection) {
    queryParams.collection_id = [adaptedPricedProduct.collection.id]
  }
  if (adaptedPricedProduct.tags) {
    queryParams.tags = {
      value: adaptedPricedProduct.tags
        .map((t: HttpTypes.StoreProductTag) => t.id)
        .filter(Boolean) as string[],
    }
  }
  queryParams.is_giftcard = false

  const { response } = await listProducts({
    queryParams,
    countryCode: params.countryCode,
    regionId: region.id,
  })

  const relatedProducts = response?.products?.filter(
    (responseProduct) => responseProduct.id !== pricedProduct.id
  ).map(adaptMedusaProductToRhProduct) || []

  return (
    <ProductPageClient
      product={adaptedPricedProduct}
      relatedProducts={relatedProducts}
      region={region}
      countryCode={params.countryCode}
    />
  )
}