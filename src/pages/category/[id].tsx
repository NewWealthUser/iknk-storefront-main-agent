import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"
import { getCategoryByHandle } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import CategoryTemplate from "@modules/categories/templates"
import { HttpTypes } from "@medusajs/types"

interface Params extends ParsedUrlQuery {
  id: string[]
  countryCode: string
}

interface Props {
  category: HttpTypes.StoreProductCategory
  searchParams: URLSearchParams
  countryCode: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context: GetServerSidePropsContext<Params>) => {
  const { params, query } = context;
  const { id, countryCode } = params as { id: string[]; countryCode: string };

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

  const searchParams = new URLSearchParams(query as any);

  return {
    props: {
      category,
      searchParams: searchParams,
      countryCode,
    },
  }
}

export default function CategoryPage({ category, searchParams, countryCode }: Props) {
  return (
    <CategoryTemplate
      category={category}
      searchParams={searchParams}
      countryCode={countryCode}
    />
  )
}