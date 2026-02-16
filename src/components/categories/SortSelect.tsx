'use client'

interface SortSelectProps {
  defaultValue?: string
}

export function SortSelect({ defaultValue = 'popularity' }: SortSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href)
    url.searchParams.set('sortera', e.target.value)
    window.location.href = url.toString()
  }

  return (
    <select
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
      defaultValue={defaultValue}
      onChange={handleChange}
    >
      <option value="popularity">Popularitet</option>
      <option value="price_asc">Pris (lägst först)</option>
      <option value="price_desc">Pris (högst först)</option>
      <option value="newest">Nyast</option>
    </select>
  )
}
