import { GetServerSideProps } from "next"
import { listProducts, Product } from "@lib/medusa"
import { useState } from "react"
import ProductGrid from "../../components/ProductGrid"
import FiltersBar, { FilterOption } from "../../components/FiltersBar"
import SortControl, { SortKey } from "../../components/SortControl"

const minPrice = (p: Product) =>
  Math.min(...p.variants.flatMap((v) => v.prices.map((pr) => pr.amount)))
const maxPrice = (p: Product) =>
  Math.max(...p.variants.flatMap((v) => v.prices.map((pr) => pr.amount)))

interface Props {
  initialProducts: Product[]
  count: number
  options: FilterOption[]
  id: string
}

const CategoryPage = ({ initialProducts, count, options, id }: Props) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [inStock, setInStock] = useState(false)
  const [sort, setSort] = useState<SortKey>("featured")

  const fetchProducts = async (
    nextSelected = selected,
    nextInStock = inStock,
    nextSort = sort
  ) => {
    const params = new URLSearchParams({ category_id: id, limit: "24" })
    Object.entries(nextSelected).forEach(([k, v]) => {
      if (v) params.set(`options[${k}]`, v)
    })
    if (nextInStock) params.set("in_stock", "true")
    if (nextSort === "newest") params.set("order", "created_at:DESC")
    const res = await fetch(`/api/grid?${params.toString()}`)
    const data = await res.json()
    let items: Product[] = data.products
    if (nextSort === "price_asc") {
      items = [...items].sort((a, b) => minPrice(a) - minPrice(b))
    } else if (nextSort === "price_desc") {
      items = [...items].sort((a, b) => maxPrice(b) - maxPrice(a))
    }
    setProducts(items)
  }

  const handleFilterChange = (next: {
    selected?: Record<string, string>
    inStock?: boolean
  }) => {
    const nextSelected = next.selected ?? selected
    const nextInStock = next.inStock ?? inStock
    setSelected(nextSelected)
    setInStock(nextInStock)
    fetchProducts(nextSelected, nextInStock, sort)
  }

  const handleSortChange = (s: SortKey) => {
    setSort(s)
    fetchProducts(selected, inStock, s)
  }

  const clear = () => {
    setSelected({})
    setInStock(false)
    fetchProducts({}, false, sort)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] tracking-[0.08em] font-medium uppercase">
          CATEGORY
        </h1>
        <SortControl value={sort} onChange={handleSortChange} />
      </div>
      <FiltersBar
        options={options}
        selected={selected}
        inStock={inStock}
        onChange={handleFilterChange}
        onClear={clear}
      />
      <ProductGrid products={products} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string
  const { products, count } = await listProducts({ category_id: id, limit: 24 })
  const optionMap: Record<string, Set<string>> = {}
  products.forEach((p) => {
    p.options.forEach((o) => {
      if (!optionMap[o.title]) optionMap[o.title] = new Set()
      o.values.forEach((v) => optionMap[o.title].add(v.value))
    })
  })
  const options: FilterOption[] = Object.entries(optionMap).map(
    ([title, set], idx) => ({
      id: String(idx),
      title,
      values: Array.from(set),
    })
  )
  return { props: { initialProducts: products, count, options, id } }
}

export default CategoryPage
