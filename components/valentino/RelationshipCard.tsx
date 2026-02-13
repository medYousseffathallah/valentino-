import { cn } from '@/lib/utils'
import type { Relationship } from '@/lib/valentino'
import { RELATIONSHIPS } from '@/lib/valentino'

interface RelationshipCardProps {
  relationship: Relationship
  selected: boolean
  onClick: () => void
}

export function RelationshipCard({ relationship, selected, onClick }: RelationshipCardProps) {
  const relationshipInfo = RELATIONSHIPS.find(r => r.key === relationship)
  
  if (!relationshipInfo) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-[88px] rounded-lg border p-3 text-left shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300',
        selected 
          ? 'border-rose-500 bg-rose-50'
          : 'border-stone-200 bg-white hover:border-rose-300 hover:bg-stone-50'
      )}
    >
      <div className="text-2xl">{relationshipInfo.emoji}</div>
      <div className="mt-2 text-sm font-semibold text-stone-900">{relationshipInfo.key}</div>
      <div className="mt-1 text-xs text-stone-600">{relationshipInfo.description}</div>
    </button>
  )
}
