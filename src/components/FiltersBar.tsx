
export type FilterOption = { id: string; title: string; values: string[] }

interface Props {
  options: FilterOption[]
  selected: Record<string, string>
  inStock: boolean
  onChange: (next: { selected?: Record<string, string>; inStock?: boolean }) => void
  onClear: () => void
}

export default function FiltersBar({
  options,
  selected,
  inStock,
  onChange,
  onClear,
}: Props) {
  const hasActive = inStock || Object.values(selected).some(Boolean)
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => onChange({ inStock: e.target.checked })}
        />
        In-Stock
      </label>
      {options.map((opt) => (
        <select
          key={opt.id}
          value={selected[opt.title] || ""}
          onChange={(e) =>
            onChange({ selected: { ...selected, [opt.title]: e.target.value } })
          }
          className="border px-2 py-1"
        >
          <option value="">{opt.title}</option>
          {opt.values.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      ))}
      {hasActive && (
        <button onClick={onClear} className="underline text-xs">
          Clear All
        </button>
      )}
    </div>
  )
}
