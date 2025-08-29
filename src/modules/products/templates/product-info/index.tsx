import type { StoreProduct } from "@medusajs/types"
import { Text } from "@medusajs/ui"

const ProductInfo = ({ product }: { product: StoreProduct }) => {
  if (!product) return null

  return (
    <section>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <ul>
        {product.variants?.map(v => (
          <li key={v.id}>
            Price: {String(v.calculated_price ?? "N/A")}
            <br />
            Dimensions: {(v.metadata?.width as string) ?? "-"} x {(v.metadata?.height as string) ?? "-"}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProductInfo