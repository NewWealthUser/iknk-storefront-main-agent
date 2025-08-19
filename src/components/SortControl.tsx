export type SortKey = "featured" | "price_asc" | "price_desc" | "newest"

export default function SortControl({
  value,
  onChange,
}: {
  value: SortKey
  onChange: (val: SortKey) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      className="border px-2 py-1 text-sm"
    >
      <option value="featured">Featured</option>
      <option value="price_asc">Price Low–High</option>
      <option value="price_desc">Price High–Low</option>
      <option value="newest">Newest</option>
    </select>
  )
}
