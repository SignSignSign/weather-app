import { useEffect, useState } from 'react'
import { loadFavCities, saveFavCities } from '../utils/storage'
import {
  fetchForecastByCity,
  fetchForecastByCoords,
  fetchWeatherByCity,
  fetchWeatherByCoords,
  getCurrentPosition,
  resolveCityName,
  WeatherApiError,
} from '../utils/weatherApi'

// ---------- 数据类型定义 ----------
export interface FavCity {
  id: string
  name: string
}

export interface WeatherInfo {
  cityName: string
  temp: number
  desc: string
  icon: string
  humidity: number
  windSpeed: number
}

export interface ForecastItem {
  date: string
  tempMin: number
  tempMax: number
  desc: string
  icon: string
}

// ---------- 全局状态 Hook ----------
export function useWeatherStore() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [forecast, setForecast] = useState<ForecastItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [favCities, setFavCities] = useState<FavCity[]>(() => loadFavCities())

  // 收藏列表变化时持久化
  useEffect(() => {
    saveFavCities(favCities)
  }, [favCities])

  const handleError = (err: unknown) => {
    if (err instanceof WeatherApiError) {
      setError(err.message)
    } else {
      setError('发生未知错误，请稍后重试')
    }
    setWeather(null)
    setForecast([])
  }

  /** 按城市名查询 */
  const searchByCity = async (city: string) => {
    const keyword = city.trim()
    if (!keyword) {
      setError('请输入城市名称')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { query, displayName } = resolveCityName(keyword)
      const [w, f] = await Promise.all([
        fetchWeatherByCity(query),
        fetchForecastByCity(query),
      ])
      // 中文输入命中映射时，界面展示中文城市名
      if (displayName) w.cityName = displayName
      setWeather(w)
      setForecast(f)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  /** 浏览器定位查询 */
  const searchByLocation = async () => {
    setLoading(true)
    setError(null)
    try {
      const pos = await getCurrentPosition()
      const { latitude, longitude } = pos.coords
      const [w, f] = await Promise.all([
        fetchWeatherByCoords(latitude, longitude),
        fetchForecastByCoords(latitude, longitude),
      ])
      setWeather(w)
      setForecast(f)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  /** 收藏/取消收藏当前城市 */
  const toggleFav = (name: string) => {
    setFavCities((prev) =>
      prev.some((c) => c.name === name)
        ? prev.filter((c) => c.name !== name)
        : [...prev, { id: `${Date.now()}-${name}`, name }]
    )
  }

  const removeFav = (id: string) => {
    setFavCities((prev) => prev.filter((c) => c.id !== id))
  }

  const clearError = () => setError(null)

  return {
    weather,
    forecast,
    loading,
    error,
    favCities,
    searchByCity,
    searchByLocation,
    toggleFav,
    removeFav,
    clearError,
  }
}
