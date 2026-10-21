import type { ForecastItem, WeatherInfo } from '../store/weatherStore'

const API_BASE = 'https://api.openweathermap.org/data/2.5'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string | undefined

export class WeatherApiError extends Error {
  constructor(
    message: string,
    public readonly code: 'NO_KEY' | 'NOT_FOUND' | 'NETWORK' | 'UNKNOWN'
  ) {
    super(message)
    this.name = 'WeatherApiError'
  }
}

// ---------- OpenWeatherMap 原始返回类型 ----------
interface OwmWeatherEntry {
  description: string
  icon: string
  main: string
}

interface OwmCurrentResponse {
  cod: number | string
  name: string
  main: { temp: number; humidity: number }
  weather: OwmWeatherEntry[]
  wind: { speed: number }
}

interface OwmForecastResponse {
  cod: string
  list: Array<{
    dt: number
    dt_txt: string
    main: { temp_min: number; temp_max: number }
    weather: OwmWeatherEntry[]
  }>
}

function requireApiKey(): string {
  if (!API_KEY || API_KEY.trim() === '' || API_KEY.includes('在此填入')) {
    throw new WeatherApiError(
      '尚未配置 API Key，请在 .env.local 中填入 VITE_WEATHER_API_KEY',
      'NO_KEY'
    )
  }
  return API_KEY
}

async function requestJson<T>(url: string): Promise<T> {
  let res: Response
  try {
    res = await fetch(url)
  } catch {
    throw new WeatherApiError('网络连接失败，请检查网络后重试', 'NETWORK')
  }
  if (res.status === 404) {
    throw new WeatherApiError('未找到该城市，请检查城市名称是否正确', 'NOT_FOUND')
  }
  if (!res.ok) {
    throw new WeatherApiError(`天气服务异常（${res.status}），请稍后再试`, 'UNKNOWN')
  }
  return (await res.json()) as T
}

// ---------- 中文城市名映射 ----------
// OpenWeatherMap 不支持中文城市名直接查询，这里将常见中文名映射为英文
const CITY_ALIAS: Record<string, string> = {
  北京: 'Beijing', 上海: 'Shanghai', 天津: 'Tianjin', 重庆: 'Chongqing',
  广州: 'Guangzhou', 深圳: 'Shenzhen', 杭州: 'Hangzhou', 南京: 'Nanjing',
  苏州: 'Suzhou', 武汉: 'Wuhan', 成都: 'Chengdu', 西安: "Xi'an",
  长沙: 'Changsha', 郑州: 'Zhengzhou', 青岛: 'Qingdao', 济南: 'Jinan',
  大连: 'Dalian', 沈阳: 'Shenyang', 哈尔滨: 'Harbin', 长春: 'Changchun',
  厦门: 'Xiamen', 福州: 'Fuzhou', 昆明: 'Kunming', 贵阳: 'Guiyang',
  南宁: 'Nanning', 合肥: 'Hefei', 南昌: 'Nanchang', 太原: 'Taiyuan',
  石家庄: 'Shijiazhuang', 兰州: 'Lanzhou', 乌鲁木齐: 'Urumqi', 拉萨: 'Lhasa',
  呼和浩特: 'Hohhot', 银川: 'Yinchuan', 西宁: 'Xining', 海口: 'Haikou',
  三亚: 'Sanya', 香港: 'Hong Kong', 澳门: 'Macau', 台北: 'Taipei',
}

/**
 * 解析用户输入：命中中文映射时返回英文查询词与中文展示名，
 * 否则原样返回输入
 */
export function resolveCityName(input: string): { query: string; displayName?: string } {
  const trimmed = input.trim()
  const alias = CITY_ALIAS[trimmed]
  return alias ? { query: alias, displayName: trimmed } : { query: trimmed }
}

/** 按城市名查询当前天气 */
export async function fetchWeatherByCity(city: string): Promise<WeatherInfo> {
  const key = requireApiKey()
  const url = `${API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=zh_cn`
  const data = await requestJson<OwmCurrentResponse>(url)
  return parseCurrent(data)
}

/** 按经纬度查询当前天气 */
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherInfo> {
  const key = requireApiKey()
  const url = `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=zh_cn`
  const data = await requestJson<OwmCurrentResponse>(url)
  return parseCurrent(data)
}

/** 按城市名查询未来5天预报 */
export async function fetchForecastByCity(city: string): Promise<ForecastItem[]> {
  const key = requireApiKey()
  const url = `${API_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=zh_cn`
  const data = await requestJson<OwmForecastResponse>(url)
  return parseForecast(data)
}

/** 按经纬度查询未来5天预报 */
export async function fetchForecastByCoords(lat: number, lon: number): Promise<ForecastItem[]> {
  const key = requireApiKey()
  const url = `${API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=zh_cn`
  const data = await requestJson<OwmForecastResponse>(url)
  return parseForecast(data)
}

function parseCurrent(data: OwmCurrentResponse): WeatherInfo {
  return {
    cityName: data.name,
    temp: Math.round(data.main.temp),
    desc: data.weather[0]?.description ?? '未知',
    icon: data.weather[0]?.icon ?? '01d',
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
  }
}

/** 将3小时间隔的预报聚合为按天的最高/最低温 */
function parseForecast(data: OwmForecastResponse): ForecastItem[] {
  const byDay = new Map<string, ForecastItem & { count: number }>()
  for (const item of data.list) {
    const date = item.dt_txt.slice(0, 10)
    const desc = item.weather[0]?.description ?? '未知'
    const icon = item.weather[0]?.icon ?? '01d'
    const existing = byDay.get(date)
    if (!existing) {
      byDay.set(date, {
        date,
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        desc,
        icon,
        count: 1,
      })
    } else {
      existing.tempMin = Math.min(existing.tempMin, Math.round(item.main.temp_min))
      existing.tempMax = Math.max(existing.tempMax, Math.round(item.main.temp_max))
      // 用中午附近(计数过半时)的天气作为当日代表
      existing.count += 1
      const hour = Number(item.dt_txt.slice(11, 13))
      if (hour >= 11 && hour <= 14) {
        existing.desc = desc
        existing.icon = icon
      }
    }
  }
  return Array.from(byDay.values())
    .slice(0, 5)
    .map(({ date, tempMin, tempMax, desc, icon }) => ({ date, tempMin, tempMax, desc, icon }))
}

/** 调用浏览器地理定位，拒绝或失败时抛出带友好信息的错误 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new WeatherApiError('当前浏览器不支持地理定位', 'UNKNOWN'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        reject(new WeatherApiError('定位被拒绝，请在浏览器设置中允许位置权限', 'UNKNOWN'))
      } else {
        reject(new WeatherApiError('定位失败，请稍后重试', 'UNKNOWN'))
      }
    }, { timeout: 10000 })
  })
}
