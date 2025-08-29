import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

import { HttpTypes, StoreRegion } from "@medusajs/types"

interface Params extends ParsedUrlQuery {
  handle: string
  countryCode: string
}

interface Props {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  relatedProducts: HttpTypes.StoreProduct[]
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  try {
    const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return { paths: [], fallback: "blocking" }
    }

    const promises = countryCodes.map(async (country: string | undefined) => {
      if (!country) return { country: undefined, products: [] };
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    const staticPaths = countryProducts
      .flatMap((countryData: { country: string | undefined; products: HttpTypes.StoreProduct[] }) =>
        countryData.products.map((product: HttpTypes.StoreProduct) => ({
          params: {
            countryCode: countryData.country,
            handle: product.handle,
          },
        }))
      )
      .filter((path): path is { params: Params } =>
        Boolean(path?.params.countryCode && path.params.handle)
      )

    return { paths: staticPaths, fallback: "blocking" }
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return { paths: [], fallback: "blocking" }
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context: GetStaticPropsContext<Params, PreviewData>) => {
  const { handle, countryCode } = context.params as { handle: string; countryCode: string }
  const queryClient = new QueryClient()

  const region = await getRegion(countryCode)

  if (!region) {
    return {
      notFound: true,
    }
  }

  const { response: { products: responseProducts } } = await listProducts({
    countryCode: countryCode,
    queryParams: { handle } as any,
  })

  const product = responseProducts?.[0]

  if (!product) {
    return {
      notFound: true,
    }
  }

  const queryParams: any = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection) {
    queryParams.collection_id = [product.collection.id]
  }
  if (product.tags) {
    queryParams.tags = {
      value: product.tags
        .map((t: HttpTypes.StoreProductTag) => t.id)
        .filter(Boolean) as string[],
    }
  }
  queryParams.is_giftcard = false

  const { response } = await listProducts({
    queryParams,
    countryCode: countryCode,
    regionId: region.id,
  })

  const relatedProducts = response?.products?.filter(
    (responseProduct) => responseProduct.id !== product.id
  ) || []

  return {
    props: {
      product,
      region,
      countryCode,
      relatedProducts,
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default function ProductPage({ product, region, countryCode, relatedProducts }: Props) {
  return (
    <ProductTemplate
      product={product}
      relatedProducts={relatedProducts}
      region={region}
      countryCode={countryCode}
    />
  )
}