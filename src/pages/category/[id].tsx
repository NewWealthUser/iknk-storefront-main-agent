import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import ProductGrid from "../../components/ProductGrid"
import FiltersBar from "../../components/FiltersBar"
import SortControl from "../../components/SortControl"
import { useRouter } from "next/router"
import { useCallback } from "react"

interface Params extends ParsedUrlQuery {
  id: string
  countryCode: string
}

interface Props {
  products: HttpTypes.StoreProduct[]
  count: number
  category: { id: string; name: string }
  countryCode: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context: GetServerSidePropsContext<Params>
) => {
  const { params, query } = context
  const { id, countryCode } = params as Params

  const region = await getRegion(countryCode)
  if (!region) return { notFound: true }

  const queryParams: any = {
    category_id: [id],
    limit: 24,
    expand: "variants,options,images",
    ...query,
  }

  try {
    const { response } = await listProducts({ queryParams, countryCode })
    return {
      props: {
        products: response.products,
        count: response.count,
        category: { id, name: "Dining Tables" }, // Placeholder name
        countryCode,
      },
    }
  } catch (e) {
    console.error(e)
    return { notFound: true }
  }
}

export default function CategoryPage({ products, count, category }: Props) {
  const router = useRouter()
  const { query } = router

  const handleFilterChange = useCallback((key: string, value: string | null) => {
    const newQuery = { ...query }
    if (value) {
      newQuery[key] = value
    } else {
      delete newQuery[key]
    }
    delete (newQuery as any).page // Reset page on filter change
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true })
  }, [router, query])

  const handleSortChange = useCallback((value: string) => {
    const newQuery = { ...query, sort: value }
    delete (newQuery as any).page // Reset page on sort change
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true })
  }, [router, query])

  const handleClearFilters = useCallback(() => {
    const newQuery: ParsedUrlQuery = {}
    if (query.sort) newQuery.sort = query.sort
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true })
  }, [router, query.sort])

  return (
    <div className="content-container py-12">
      <h1 className="text-[28px] tracking-[0.08em] font-medium uppercase mb-8">
        {category.name}
      </h1>
      <FiltersBar
        products={products}
        queryParams={new URLSearchParams(query as any)}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      <div className="flex justify-end mb-8">
        <SortControl
          value={(query.sort as string) || "featured"}
          onChange={handleSortChange}
        />
      </div>
      <ProductGrid products={products} count={count} />
    </div>
  )
}