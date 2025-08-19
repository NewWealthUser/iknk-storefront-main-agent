import Link from "next/link"
import Image from "next/image"
import ProductPrice from "./ProductPrice"
import { Product } from "@lib/medusa"

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0]?.url
  const colorOption = product.options.find((o) => /color|finish/i.test(o.title))
  const swatches = colorOption?.values.slice(0, 6) || []
  return (
    <div className="group">
      <Link href={`/product/${product.handle}`} className="block">
        <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50 relative">
          {img && (
            <Image
              src={img}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
      </Link>
      <div className="mt-2">
        <div className="flex justify-center gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-[5px] w-[5px] rounded-full ${i === 0 ? "bg-black/70" : "bg-black/20"}`}
            />
          ))}
        </div>
        <p className="text-[12px] text-gray-500 mt-2">Available in multiple finishes</p>
        <Link href={`/product/${product.handle}`} className="block">
          <h3 className="text-[14px] leading-snug line-clamp-2 mt-1">{product.title}</h3>
        </Link>
        <ProductPrice product={product} />
        {swatches.length > 0 && (
          <div className="flex gap-1 mt-2">
            {swatches.map((v) => (
              <span
                key={v.id}
                title={v.value}
                className="h-6 w-6 rounded-[6px] border border-gray-300"
                style={{ backgroundColor: v.value }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
