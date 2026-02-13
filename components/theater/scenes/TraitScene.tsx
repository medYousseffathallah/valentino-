"use client"

import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"
import { useHapticFeedback } from "@/hooks/useDeviceCapabilities"
import type { Trait } from "@/lib/valentino"
import type { AccessoryType } from "@/components/characters"

interface TraitSceneProps {
  selected: Trait[]
  onToggle: (trait: Trait) => void
  maxTraits?: number
  className?: string
}

const TRAIT_ICONS: Record<Trait, string> = {
  Funny: "😂",
  Kind: "💝",
  Chaotic: "⚡",
  Creative: "✨",
  Calm: "🌿",
  Brave: "🦁",
  Weird: "🌀",
  Caring: "🤗"
}

const traitStickers: Record<Trait, AccessoryType> = {
  Funny: "mustache",
  Kind: "blush",
  Chaotic: "heart-glasses",
  Creative: "crown",
  Calm: "round-glasses",
  Brave: "top-hat",
  Weird: "cat-ears",
  Caring: "bow"
}

const TRAITS: Trait[] = [
  "Funny",
  "Kind", 
  "Chaotic",
  "Creative",
  "Calm",
  "Brave",
  "Weird",
  "Caring"
]

export function TraitScene({
  selected,
  onToggle,
  maxTraits = 3,
  className,
}: TraitSceneProps) {
  const reducedMotion = useReducedMotion()
  const { triggerHaptic } = useHapticFeedback()
  const [hoveredTrait, setHoveredTrait] = React.useState<Trait | null>(null)

  const handleToggle = (trait: Trait) => {
    const isSelected = selected.includes(trait)
    if (!isSelected && selected.length >= maxTraits) {
      triggerHaptic(50)
      return
    }
    onToggle(trait)
    triggerHaptic(isSelected ? 5 : 10)
  }

  const isFull = selected.length >= maxTraits

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <motion.p
        className="text-sm text-[#6B2737] opacity-70 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
      >
        Pick up to {maxTraits} traits. Each adds a costume piece!
      </motion.p>

      <div className="flex flex-wrap justify-center gap-2 max-w-md">
        {TRAITS.map((trait, index) => {
          const isSelected = selected.includes(trait)
          const isHovered = hoveredTrait === trait
          const isDisabled = !isSelected && isFull
          
          return (
            <motion.button
              key={trait}
              type="button"
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-all",
                "border-2",
                isSelected 
                  ? "border-[#E63946] bg-[#E63946] text-white" 
                  : isDisabled
                    ? "border-[#E63946]/10 bg-white/50 text-[#6B2737]/40 cursor-not-allowed"
                    : "border-[#E63946]/30 bg-white text-[#6B2737] hover:border-[#E63946]/60",
                isHovered && !isSelected && !isDisabled && "border-[#E63946]/50"
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              onHoverStart={() => !isDisabled && setHoveredTrait(trait)}
              onHoverEnd={() => setHoveredTrait(null)}
              onClick={() => !isDisabled && handleToggle(trait)}
              whileHover={reducedMotion || isDisabled ? undefined : { scale: 1.05 }}
              whileTap={reducedMotion || isDisabled ? undefined : { scale: 0.95 }}
              disabled={isDisabled}
            >
              <span className="mr-1">{TRAIT_ICONS[trait]}</span>
              {trait}

              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    className="ml-1 inline-block"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      <motion.div
        className="flex items-center gap-2 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFull ? 1 : 0 }}
      >
        <span className="text-xs text-[#6B2737] opacity-70">
          {selected.length}/{maxTraits} selected
        </span>
        {isFull && (
          <motion.span
            className="text-xs text-[#E63946]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            (maximum)
          </motion.span>
        )}
      </motion.div>

      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            className="flex gap-2 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {selected.map((trait) => (
              <motion.div
                key={trait}
                className="w-8 h-8 rounded-full bg-[#E63946]/10 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                title={traitStickers[trait]}
              >
                <span className="text-sm">{TRAIT_ICONS[trait]}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { traitStickers }
