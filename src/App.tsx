import { CloudSun } from 'lucide-react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import ForecastList from './components/ForecastList'
import FavCityList from './components/FavCityList'
import LoadingTip from './components/LoadingTip'
import ErrorTip from './components/ErrorTip'
import { useWeatherStore } from './store/weatherStore'

export default function App() {
  const {
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
  } = useWeatherStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1c3d5a] via-[#152e47] to-[#0a1929]">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-6 sm:px-6">
        <SearchBar loading={loading} onSearch={searchByCity} onLocate={searchByLocation} />

        {error && <ErrorTip message={error} onClose={clearError} />}

        {loading && <LoadingTip />}

        {!loading && weather && (
          <>
            <WeatherCard
              weather={weather}
              isFav={favCities.some((c) => c.name === weather.cityName)}
              onToggleFav={() => toggleFav(weather.cityName)}
            />
            <ForecastList forecast={forecast} />
          </>
        )}

        {!loading && !weather && !error && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/50">
            <CloudSun className="h-16 w-16" strokeWidth={1.2} />
            <p className="text-sm">搜索城市或点击定位按钮，查看实时天气</p>
          </div>
        )}

        <FavCityList
          favCities={favCities}
          loading={loading}
          onQuery={searchByCity}
          onRemove={removeFav}
        />
      </div>
    </div>
  )
}
