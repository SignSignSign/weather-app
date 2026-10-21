import { MapPin, X } from 'lucide-react'
import type { FavCity } from '../store/weatherStore'

interface FavCityListProps {
  favCities: FavCity[]
  loading: boolean
  onQuery: (name: string) => void
  onRemove: (id: string) => void
}

export default function FavCityList({ favCities, loading, onQuery, onRemove }: FavCityListProps) {
  if (favCities.length === 0) return null

  return (
    <section className="w-full">
      <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-white/60">
        收藏城市
      </p>
      <div className="flex flex-wrap gap-2">
        {favCities.map((city) => (
          <div
            key={city.id}
            className="group flex items-center gap-1 rounded-full bg-white/10 py-1.5 pl-3 pr-1.5 backdrop-blur-md transition-all hover:bg-white/20"
          >
            <button
              type="button"
              onClick={() => onQuery(city.name)}
              disabled={loading}
              className="flex items-center gap-1.5 text-sm text-white disabled:opacity-50"
            >
              <MapPin className="h-3.5 w-3.5 text-white/60" />
              {city.name}
            </button>
            <button
              type="button"
              onClick={() => onRemove(city.id)}
              title="删除收藏"
              className="rounded-full p-1 text-white/50 transition-all hover:bg-white/20 hover:text-white active:scale-90"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
