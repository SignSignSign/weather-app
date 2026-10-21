import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Droplets,
  Moon,
  Star,
  Sun,
  Wind,
} from 'lucide-react'
import type { WeatherInfo } from '../store/weatherStore'

/** 将 OpenWeatherMap 图标编码映射为 lucide 图标 */
export function WeatherIcon({
  icon,
  className,
}: {
  icon: string
  className?: string
}) {
  const cls = className ?? 'h-6 w-6'
  switch (icon) {
    case '01d':
      return <Sun className={`${cls} text-yellow-300`} />
    case '01n':
      return <Moon className={`${cls} text-slate-200`} />
    case '02d':
      return <CloudSun className={`${cls} text-yellow-200`} />
    case '02n':
      return <CloudMoon className={`${cls} text-slate-200`} />
    case '03d':
    case '03n':
      return <Cloud className={`${cls} text-slate-100`} />
    case '04d':
    case '04n':
      return <Cloudy className={`${cls} text-slate-300`} />
    case '09d':
    case '09n':
      return <CloudDrizzle className={`${cls} text-sky-300`} />
    case '10d':
    case '10n':
      return <CloudRain className={`${cls} text-sky-400`} />
    case '11d':
    case '11n':
      return <CloudLightning className={`${cls} text-amber-300`} />
    case '13d':
    case '13n':
      return <CloudSnow className={`${cls} text-white`} />
    case '50d':
    case '50n':
      return <CloudFog className={`${cls} text-slate-300`} />
    default:
      return <Cloud className={`${cls} text-slate-100`} />
  }
}

interface WeatherCardProps {
  weather: WeatherInfo
  isFav: boolean
  onToggleFav: () => void
}

export default function WeatherCard({ weather, isFav, onToggleFav }: WeatherCardProps) {
  return (
    <section className="flex flex-col items-center pt-4 text-white">
      {/* 城市名 + 收藏星标 */}
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-medium tracking-wide">{weather.cityName}</h1>
        <button
          type="button"
          onClick={onToggleFav}
          title={isFav ? '取消收藏' : '收藏该城市'}
          className="rounded-full p-1.5 transition-all hover:bg-white/15 active:scale-90"
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              isFav ? 'fill-yellow-300 text-yellow-300' : 'text-white/70'
            }`}
          />
        </button>
      </div>

      {/* 超大温度，苹果风格细体字 */}
      <p className="mt-1 text-8xl font-extralight leading-none tracking-tighter">
        {weather.temp}°
      </p>

      <div className="mt-3 flex items-center gap-2 text-white/90">
        <WeatherIcon icon={weather.icon} className="h-6 w-6" />
        <p className="text-lg capitalize">{weather.desc}</p>
      </div>

      {/* 湿度 / 风速 玻璃卡片 */}
      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md">
          <Droplets className="h-5 w-5 text-sky-300" />
          <div>
            <p className="text-xs text-white/60">湿度</p>
            <p className="text-lg font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md">
          <Wind className="h-5 w-5 text-teal-200" />
          <div>
            <p className="text-xs text-white/60">风速</p>
            <p className="text-lg font-semibold">{weather.windSpeed} m/s</p>
          </div>
        </div>
      </div>
    </section>
  )
}
