import * as React from "react"

import { Button } from "@/components/ui/button"
import { TRAITS, type Trait } from "@/lib/valentino"
import { cn } from "@/lib/utils"

type Props = {
  value: Trait[]
  onChange: (next: Trait[]) => void
  max?: number
}

export function TraitSelector({ value, onChange, max = 3 }: Props) {
  const [touchedMax, setTouchedMax] = React.useState(false)

  function toggle(trait: Trait) {
    const isSelected = value.includes(trait)
    if (isSelected) {
      setTouchedMax(false)
      onChange(value.filter((t) => t !== trait))
      return
    }
    if (value.length >= max) {
      setTouchedMax(true)
      return
    }
    setTouchedMax(false)
    onChange([...value, trait])
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TRAITS.map((trait) => {
          const isSelected = value.includes(trait)
          const isDisabled = !isSelected && value.length >= max

          return (
            <Button
              key={trait}
              type="button"
              variant="outline"
              disabled={isDisabled}
              className={cn(
                "h-11 w-full justify-center border-stone-200 text-sm",
                isSelected && "border-rose-500 bg-rose-100 text-rose-800 hover:bg-rose-100"
              )}
              onClick={() => toggle(trait)}
              aria-pressed={isSelected}
            >
              {trait}
            </Button>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-stone-600">
        <span>
          Pick up to {max} traits ({value.length}/{max})
        </span>
        {touchedMax ? <span className="text-rose-700">Max {max} traits</span> : null}
      </div>
    </div>
  )
}

