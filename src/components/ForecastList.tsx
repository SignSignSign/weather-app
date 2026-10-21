import type { ForecastItem } from '../store/weatherStore'
import { WeatherIcon } from './WeatherCard'

interface ForecastListProps {
  forecast: ForecastItem[]
}

/** 将日期格式化为「今天/周几」 */
function formatDay(dateStr: string, index: number): string {
  if (index === 0) return '今天'
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const d = new Date(`${dateStr}T00:00:00`)
  return Number.isNaN(d.getTime()) ? dateStr.slice(5) : weekdays[d.getDay()]
}

export default function ForecastList({ forecast }: ForecastListProps) {
  if (forecast.length === 0) return null

  const allMin = Math.min(...forecast.map((f) => f.tempMin))
  const allMax = Math.max(...forecast.map((f) => f.tempMax))
  const range = Math.max(allMax - allMin, 1)

  return (
    <section className="w-full rounded-3xl bg-white/10 p-4 backdrop-blur-md">
      <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-white/60">
        未来 {forecast.length} 天预报
      </p>
      <ul className="divide-y divide-white/10">
        {forecast.map((item, i) => {
          const left = ((item.tempMin - allMin) / range) * 100
          const width = ((item.tempMax - item.tempMin) / range) * 100
          return (
            <li key={item.date} className="flex items-center gap-3 px-2 py-3 text-white">
              <span className="w-10 shrink-0 text-sm font-medium">{formatDay(item.date, i)}</span>
              <span className="flex w-10 shrink-0 justify-center" title={item.desc}>
                <WeatherIcon icon={item.icon} className="h-5 w-5" />
              </span>
              <span className="w-8 shrink-0 text-right text-sm text-white/70">
                {item.tempMin}°
              </span>
              {/* 温度区间条，苹果风格 */}
              <div className="relative h-1 min-w-8 flex-1 rounded-full bg-white/15">
                <div
                  className="absolute h-1 rounded-full bg-gradient-to-r from-sky-400 to-amber-300"
                  style={{ left: `${left}%`, width: `${Math.max(width, 6)}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-medium">
                {item.tempMax}°
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
