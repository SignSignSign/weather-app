import type { FavCity } from '../store/weatherStore'

const STORAGE_KEY = 'weather-fav-cities'

/** 读取收藏城市列表，失败时返回空数组 */
export function loadFavCities(): FavCity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is FavCity =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as FavCity).id === 'string' &&
        typeof (item as FavCity).name === 'string'
    )
  } catch {
    return []
  }
}

/** 保存收藏城市列表 */
export function saveFavCities(cities: FavCity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities))
  } catch {
    // 存储空间不足等异常静默忽略，不影响主流程
  }
}
