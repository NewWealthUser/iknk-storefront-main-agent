import ProductCard from "../../../../components/ProductCard"
import type { StoreProduct } from "@medusajs/types"

type RelatedProductsProps = {
  products: StoreProduct[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Related products
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          You might also want to check out these products.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard data={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}