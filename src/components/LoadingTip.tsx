import { Loader2 } from 'lucide-react'

export default function LoadingTip() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-white/80">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-sm">正在查询天气…</p>
    </div>
  )
}
