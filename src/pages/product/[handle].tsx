import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes, StoreRegion } from "@medusajs/types"

interface Params extends ParsedUrlQuery {
  handle: string
  countryCode: string // Ensure countryCode is part of params
}

interface Props {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
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
  const { handle, countryCode } = context.params as { handle: string; countryCode: string } // Assert countryCode as string
  const queryClient = new QueryClient()

  const region = await getRegion(countryCode) // Use asserted countryCode

  if (!region) {
    return {
      notFound: true,
    }
  }

  const product = await listProducts({
    countryCode: countryCode, // Use asserted countryCode
    queryParams: { handle } as any,
  }).then(({ response }) => response.products[0])

  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      product,
      region,
      countryCode,
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default function ProductPage({ product, region, countryCode }: Props) {
  return (
    <ProductTemplate
      product={product}
      region={region}
      countryCode={countryCode}
    />
  )
}