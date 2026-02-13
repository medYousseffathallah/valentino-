"use client"

import { motion } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"
import { useHapticFeedback } from "@/hooks/useDeviceCapabilities"
import type { Relationship } from "@/lib/valentino"
import { RELATIONSHIPS } from "@/lib/valentino"
import type { Pose } from "@/components/characters"
import { FloatingScript } from "../FloatingScript"

interface RelationshipSceneProps {
  selected: Relationship | null
  nickname: string
  onRelationshipSelect: (relationship: Relationship) => void
  onNicknameChange: (nickname: string) => void
  onHoverChange?: (pose: Pose | null) => void
  className?: string
}

const relationshipPoses: Record<Relationship, Pose> = {
  Partner: "holding-hands",
  Crush: "peeking",
  Friend: "fist-bump",
  Family: "default",
}

export function RelationshipScene({
  selected,
  nickname,
  onRelationshipSelect,
  onNicknameChange,
  onHoverChange,
  className,
}: RelationshipSceneProps) {
  const reducedMotion = useReducedMotion()
  const { triggerHaptic } = useHapticFeedback()
  const [hoveredCard, setHoveredCard] = React.useState<Relationship | null>(null)

  const handleHoverStart = (relationship: Relationship) => {
    if (reducedMotion) return
    setHoveredCard(relationship)
    onHoverChange?.(relationshipPoses[relationship])
    triggerHaptic(5)
  }

  const handleHoverEnd = () => {
    setHoveredCard(null)
    onHoverChange?.(null)
  }

  const handleSelect = (relationship: Relationship) => {
    onRelationshipSelect(relationship)
    triggerHaptic(10)
  }

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <FloatingScript
          value={nickname}
          onChange={onNicknameChange}
          placeholder="Their nickname..."
          maxWidth={240}
        />
      </motion.div>

      <motion.p
        className="text-sm text-[#6B2737] opacity-70 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.2 }}
      >
        What&apos;s your connection?
      </motion.p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {RELATIONSHIPS.map((r, index) => {
          const isSelected = selected === r.key
          const isHovered = hoveredCard === r.key
          
          return (
            <motion.button
              key={r.key}
              type="button"
              className={cn(
                "relative rounded-2xl p-4 text-left transition-all",
                "border-2",
                isSelected 
                  ? "border-[#E63946] bg-[#E63946]/10" 
                  : "border-[#E63946]/20 bg-white/90 hover:border-[#E63946]/50",
                isHovered && !isSelected && "border-[#E63946]/40 bg-[#E63946]/5"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onHoverStart={() => handleHoverStart(r.key)}
              onHoverEnd={handleHoverEnd}
              onClick={() => handleSelect(r.key)}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            >
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  layoutId="relationship-spotlight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: "radial-gradient(circle at center, #E6394610 0%, transparent 70%)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              <div className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">{r.emoji}</span>
                <div>
                  <div className="font-medium text-[#6B2737]">{r.key}</div>
                  <div className="text-xs text-[#6B2737] opacity-60">{r.description}</div>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#E63946] flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path
                      d="M 2 6 L 5 9 L 10 3"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
