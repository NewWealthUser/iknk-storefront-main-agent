import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { getRegion, listRegions } from "@lib/data/regions"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { fetchProductsForListing } from "@lib/catalog"
import { HttpTypes, StoreRegion } from "@medusajs/types"

interface Params extends ParsedUrlQuery {
  id: string[]
  countryCode: string // Ensure countryCode is part of params
}

interface Props {
  category: HttpTypes.StoreProductCategory
  searchParams: URLSearchParams // Changed to searchParams
  page: number
  countryCode: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const product_categories = await listCategories()

  if (!product_categories) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticPaths = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        params: {
          countryCode,
          id: handle.split("/"),
        },
      }))
    )
    .flat()
    .filter((path): path is { params: Params } =>
      Boolean(path?.params.countryCode && path.params.id)
    )

  return { paths: staticPaths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context: GetStaticPropsContext<Params, PreviewData>) => {
  const { id, countryCode, query } = context.params as { id: string[]; countryCode: string; query: ParsedUrlQuery } // Destructure query directly
  const queryClient = new QueryClient()

  const category = await getCategoryByHandle(id)

  if (!category) {
    return {
      notFound: true,
    }
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return {
      notFound: true,
    }
  }

  const page = parseInt(query.page as string) || 1 // Access from destructured query

  const searchParams = new URLSearchParams(query as any); // Construct URLSearchParams

  await queryClient.prefetchQuery({
    queryKey: ["products", id, region.id, searchParams.toString(), page], // Use object syntax for queryKey
    queryFn: () =>
      fetchProductsForListing({
        categoryId: category.id,
        searchParams: searchParams, // Pass constructed searchParams
      })
  })

  return {
    props: {
      category,
      searchParams: searchParams, // Pass searchParams
      page,
      countryCode,
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default function CategoryPage({ category, searchParams, page, countryCode }: Props) {
  return (
    <CategoryTemplate
      category={category}
      searchParams={searchParams} // Pass searchParams
      countryCode={countryCode}
      // Removed page={page} as it's handled internally by CategoryTemplate
    />
  )
}