import { useState } from 'react'
import { LocateFixed, Search } from 'lucide-react'

interface SearchBarProps {
  loading: boolean
  onSearch: (city: string) => void
  onLocate: () => void
}

export default function SearchBar({ loading, onSearch, onLocate }: SearchBarProps) {
  const [value, setValue] = useState('')

  const submit = () => {
    onSearch(value)
  }

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md transition-colors focus-within:bg-white/20">
        <Search className="h-4 w-4 shrink-0 text-white/60" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="搜索城市，如：北京 / Beijing"
          disabled={loading}
          className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none disabled:opacity-60"
        />
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        查询
      </button>
      <button
        type="button"
        onClick={onLocate}
        disabled={loading}
        title="使用当前位置"
        className="rounded-2xl bg-white/15 p-2.5 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LocateFixed className="h-4 w-4" />
      </button>
    </div>
  )
}
