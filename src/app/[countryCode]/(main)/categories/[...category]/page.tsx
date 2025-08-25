import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"

type Props = {
  params: { category: string[]; countryCode: string }
  searchParams: { [key: string]: string | string[] | undefined }
}



export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const category = await getCategoryByHandle(params.category)

  if (!category) {
    notFound()
  }

  return {
    title: `${category.name} | Medusa Store`,
    description: `${category.name} category`,
  }
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const category = await getCategoryByHandle(params.category)

  if (!category) {
    notFound()
  }
  
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      urlSearchParams.set(key, value);
    } else if (Array.isArray(value) && value.length > 0) {
      urlSearchParams.set(key, value[0]);
    }
  }

  return (
    <CategoryTemplate
      category={category}
      searchParams={urlSearchParams}
      countryCode={params.countryCode}
    />
  )
}