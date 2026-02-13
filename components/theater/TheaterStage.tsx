"use client"

import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"
import type { Vibe } from "@/lib/valentino"
import { StageCurtain } from "./StageCurtain"
import { SpotlightController } from "./SpotlightController"

interface TheaterStageProps {
  step: number
  vibe?: Vibe | null
  isTransitioning?: boolean
  spotlightTarget?: { x: number; y: number } | null
  children: React.ReactNode
  className?: string
}

const vibeBackgrounds: Record<Vibe, { bg: string; accent: string; overlay: string }> = {
  Sweet: {
    bg: "linear-gradient(180deg, #FFE4E1 0%, #FDF6F0 50%, #FFF5F3 100%)",
    accent: "#FFB5BA",
    overlay: "rgba(255, 181, 186, 0.1)",
  },
  Funny: {
    bg: "linear-gradient(180deg, #FFF9E6 0%, #FDF6F0 50%, #FFFBF0 100%)",
    accent: "#FFD700",
    overlay: "rgba(255, 215, 0, 0.05)",
  },
  Deep: {
    bg: "linear-gradient(180deg, #E8E0E8 0%, #FDF6F0 50%, #F5F0F5 100%)",
    accent: "#8B7B8B",
    overlay: "rgba(139, 123, 139, 0.08)",
  },
  Confession: {
    bg: "linear-gradient(180deg, #F0E0E0 0%, #FDF6F0 50%, #F8F0F0 100%)",
    accent: "#D4A5A5",
    overlay: "rgba(212, 165, 165, 0.1)",
  },
}

export function TheaterStage({
  step,
  vibe,
  isTransitioning = false,
  spotlightTarget,
  children,
  className,
}: TheaterStageProps) {
  const reducedMotion = useReducedMotion()
  const [curtainClosed, setCurtainClosed] = React.useState(false)
  const prevStepRef = React.useRef(step)
  
  const vibeStyle = vibe ? vibeBackgrounds[vibe] : null

  React.useEffect(() => {
    if (prevStepRef.current !== step && !reducedMotion) {
      setCurtainClosed(true)
      const timer = setTimeout(() => setCurtainClosed(false), 600)
      prevStepRef.current = step
      return () => clearTimeout(timer)
    }
  }, [step, reducedMotion])

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: vibeStyle?.bg || "linear-gradient(180deg, #FDF6F0 0%, #FFF9F5 100%)",
        }}
        animate={{
          opacity: isTransitioning ? 0.8 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {vibeStyle && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: vibeStyle.overlay }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {spotlightTarget && (
        <SpotlightController
          target={spotlightTarget}
          color={vibeStyle?.accent || "#E63946"}
        />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {children}
      </div>

      <StageCurtain 
        isClosed={curtainClosed} 
        color={vibeStyle?.accent || "#E63946"}
      />
    </div>
  )
}

export function StageFloor({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 h-32 pointer-events-none",
        className
      )}
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(139, 123, 139, 0.05) 100%)",
      }}
    />
  )
}

export function StageBacklight({
  intensity = 0.5,
  color = "#E63946",
  className,
}: {
  intensity?: number
  color?: string
  className?: string
}) {
  return (
    <motion.div
      className={cn("absolute pointer-events-none", className)}
      style={{
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        height: "40%",
        background: `radial-gradient(ellipse at center, ${color}${Math.round(intensity * 20).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
      }}
      animate={{
        opacity: [0.5, 0.7, 0.5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}
