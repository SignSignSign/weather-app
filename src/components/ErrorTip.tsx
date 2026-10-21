import { AlertCircle, X } from 'lucide-react'

interface ErrorTipProps {
  message: string
  onClose: () => void
}

export default function ErrorTip({ message, onClose }: ErrorTipProps) {
  return (
    <div className="flex w-full items-start gap-3 rounded-2xl border border-red-300/40 bg-red-500/25 px-4 py-3 text-white backdrop-blur-md">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-200" />
      <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onClose}
        title="关闭"
        className="rounded-full p-1 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
