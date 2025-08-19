import { GetServerSideProps } from "next"
import { getProductByHandle, listProducts, Product, MEDUSA_URL } from "@lib/medusa"
import { useState } from "react"
import ProductImageCarousel from "../../components/ProductImageCarousel"
import ProductPrice from "../../components/ProductPrice"
import ProductCard from "../../components/ProductCard"
import QuickAdd from "../../components/QuickAdd"
import { getOrCreateCartId } from "@utils/cart"

const resolveVariant = (
  product: Product,
  selections: Record<string, string>
) => {
  return (
    product.variants.find((v) =>
      v.options?.every((o) => selections[o.option_id] === o.value)
    ) || null
  )
}

interface Props {
  product: Product
  related: Product[]
}

const ProductPage = ({ product, related }: Props) => {
  const [selected, setSelected] = useState<Record<string, string>>({})
  const variant = resolveVariant(product, selected)

  const changeOption = (optionId: string, value: string) =>
    setSelected({ ...selected, [optionId]: value })

  const addToCart = async () => {
    if (!variant) return
    const cartId = await getOrCreateCartId()
    await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ variant_id: variant.id, quantity: 1 }),
    })
    alert("Added to cart")
  }

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ProductImageCarousel images={product.images} />
      <div>
        <h1 className="text-2xl font-medium mb-2">{product.title}</h1>
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {product.description}
        </p>
        <ProductPrice product={product} />
        {product.options.map((opt) => (
          <div key={opt.id} className="mt-4">
            <p className="text-sm mb-1">{opt.title}</p>
            {opt.title.match(/color|finish/i) ? (
              <div className="flex gap-2">
                {opt.values.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => changeOption(opt.id, v.value)}
                    className={`h-7 w-7 rounded-[6px] border ${
                      selected[opt.id] === v.value
                        ? "outline outline-2 outline-black"
                        : ""
                    }`}
                    style={{ backgroundColor: v.value }}
                    aria-label={v.value}
                  />
                ))}
              </div>
            ) : (
              <select
                value={selected[opt.id] || ""}
                onChange={(e) => changeOption(opt.id, e.target.value)}
                className="border px-2 py-1"
              >
                <option value="">Select {opt.title}</option>
                {opt.values.map((v) => (
                  <option key={v.id} value={v.value}>
                    {v.value}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
        <button
          disabled={!variant}
          onClick={addToCart}
          className="mt-6 px-4 py-2 bg-black text-white disabled:bg-gray-400"
        >
          {variant ? "Add to Cart" : "Select options"}
        </button>
      </div>
      {related.length > 0 && (
        <div className="mt-10 lg:col-span-2">
          <h2 className="text-xl mb-4">Recommended</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {related.map((p) => (
              <div key={p.id} className="min-w-[200px]">
                <ProductCard product={p} />
                <QuickAdd product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const handle = ctx.params?.handle as string
  const product = await getProductByHandle(handle)
  if (!product) return { notFound: true }
  let related: Product[] = []
  const collectionId = product.collections?.[0]?.id
  if (collectionId) {
    const data = await listProducts({ collection_id: collectionId, limit: 8 })
    related = data.products.filter((p) => p.id !== product.id)
  }
  return { props: { product, related } }
}

export default ProductPage