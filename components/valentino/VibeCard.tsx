import { cn } from '@/lib/utils'
import type { Vibe } from '@/lib/valentino'
import { VIBES } from '@/lib/valentino'

interface VibeCardProps {
  vibe: Vibe
  selected: boolean
  onClick: () => void
}

export function VibeCard({ vibe, selected, onClick }: VibeCardProps) {
  const vibeInfo = VIBES.find(v => v.key === vibe)
  
  if (!vibeInfo) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-[96px] rounded-lg border p-4 text-left shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300',
        selected 
          ? 'border-rose-500 bg-rose-50'
          : 'border-stone-200 bg-white hover:border-rose-300 hover:bg-stone-50'
      )}
    >
      <div className="font-playfair text-lg text-stone-900">{vibeInfo.key}</div>
      <div className="mt-2 text-sm text-stone-600">{vibeInfo.preview}</div>
    </button>
  )
}
