import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategoryByHandle } from "@lib/data/categories";
import CategoryTemplate from "@modules/categories/templates";

type Props = {
  params: { countryCode: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const productCategory = await getCategoryByHandle(["dining-tables"]);

    if (!productCategory) {
      notFound();
    }

    const title = productCategory.name + " | Medusa Store";
    const description = productCategory.description ?? `${title} category.`;

    return {
      title: title,
      description: description,
      alternates: {
        canonical: `/category/dining-tables`,
      },
    };
  } catch (error) {
    notFound();
  }
}

export default async function DiningTablesPage(props: Props) {
  const { params, searchParams } = props;
  const { countryCode } = params;

  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      urlSearchParams.set(key, value);
    } else if (Array.isArray(value) && value.length > 0) {
      urlSearchParams.set(key, value[0]); // Take the first value if it's an array
    }
  }

  const productCategory = await getCategoryByHandle(["dining-tables"]);

  if (!productCategory) {
    notFound();
  }

  return (
    <CategoryTemplate
      category={productCategory}
      searchParams={urlSearchParams}
      countryCode={countryCode}
    />
  );
}