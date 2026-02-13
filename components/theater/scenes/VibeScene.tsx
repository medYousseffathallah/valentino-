"use client"

import { motion } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"
import { useHapticFeedback } from "@/hooks/useDeviceCapabilities"
import type { Vibe } from "@/lib/valentino"
import { VIBES } from "@/lib/valentino"

interface VibeSceneProps {
  selected: Vibe | null
  onSelect: (vibe: Vibe) => void
  onHoverChange?: (vibe: Vibe | null) => void
  className?: string
}

const vibeDescriptions: Record<Vibe, { 
  bgShift: string
  spotlightSize: string
  lighting: string
}> = {
  Sweet: {
    bgShift: "translateY(-5%)",
    spotlightSize: "400px",
    lighting: "warm",
  },
  Funny: {
    bgShift: "rotate(0.5deg)",
    spotlightSize: "500px",
    lighting: "bright",
  },
  Deep: {
    bgShift: "scale(1.02)",
    spotlightSize: "250px",
    lighting: "focused",
  },
  Confession: {
    bgShift: "scale(1.01)",
    spotlightSize: "200px",
    lighting: "dim",
  },
}

export function VibeScene({
  selected,
  onSelect,
  onHoverChange,
  className,
}: VibeSceneProps) {
  const reducedMotion = useReducedMotion()
  const { triggerHaptic } = useHapticFeedback()
  const [hoveredVibe, setHoveredVibe] = React.useState<Vibe | null>(null)

  const handleHoverStart = (vibe: Vibe) => {
    if (reducedMotion) return
    setHoveredVibe(vibe)
    onHoverChange?.(vibe)
    triggerHaptic(5)
  }

  const handleHoverEnd = () => {
    setHoveredVibe(null)
    onHoverChange?.(null)
  }

  const handleSelect = (vibe: Vibe) => {
    onSelect(vibe)
    triggerHaptic(10)
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <motion.p
        className="text-sm text-[#6B2737] opacity-70 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
      >
        What&apos;s the mood?
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {VIBES.map((v, index) => {
          const isSelected = selected === v.key
          const isHovered = hoveredVibe === v.key
          const vibeConfig = vibeDescriptions[v.key]
          
          return (
            <motion.button
              key={v.key}
              type="button"
              className={cn(
                "relative rounded-2xl p-5 text-left transition-all overflow-hidden",
                "border-2",
                isSelected 
                  ? "border-[#E63946] bg-[#E63946]/10" 
                  : "border-[#E63946]/20 bg-white/90 hover:border-[#E63946]/50",
                isHovered && !isSelected && "border-[#E63946]/40 bg-[#E63946]/5"
              )}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              onHoverStart={() => handleHoverStart(v.key)}
              onHoverEnd={handleHoverEnd}
              onClick={() => handleSelect(v.key)}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              style={{
                transform: isHovered && !reducedMotion ? vibeConfig.bgShift : undefined,
              }}
            >
              {isHovered && !reducedMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  style={{
                    background: vibeConfig.lighting === "warm" 
                      ? "radial-gradient(circle at 50% 50%, #FFB5BA 0%, transparent 60%)"
                      : vibeConfig.lighting === "focused"
                        ? "radial-gradient(circle at 50% 30%, #8B7B8B 0%, transparent 50%)"
                        : vibeConfig.lighting === "dim"
                          ? "radial-gradient(circle at 50% 50%, #D4A5A5 0%, transparent 40%)"
                          : "radial-gradient(circle at 50% 50%, #FFD700 0%, transparent 60%)",
                  }}
                />
              )}

              <div className="relative z-10">
                <div className="font-['Fredoka',system-ui,sans-serif] text-lg font-semibold text-[#E63946]">
                  {v.key}
                </div>
                <div className="mt-1 text-sm text-[#6B2737] opacity-70">
                  {v.preview}
                </div>
              </div>

              {isSelected && (
                <motion.div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#E63946] flex items-center justify-center"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path
                      d="M 3 7 L 6 10 L 11 4"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}

              {isSelected && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#E63946]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export { vibeDescriptions }
