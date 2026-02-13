"use client"

import { motion } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"

interface EyeProps {
  lookX?: number
  lookY?: number
  isBlinking?: boolean
  expression?: "happy" | "thinking" | "shy" | "excited" | "wide" | "normal"
  size?: number
  className?: string
  style?: React.CSSProperties
}

export function Eye({
  lookX = 0,
  lookY = 0,
  isBlinking = false,
  expression = "normal",
  size = 4,
  className,
  style,
}: EyeProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const pupilOffsetX = clamp(lookX * 0.15, -size * 0.15, size * 0.15)
  const pupilOffsetY = clamp(lookY * 0.15, -size * 0.1, size * 0.1)

  const expressionStyles: Record<string, { scaleY: number }> = {
    happy: { scaleY: 0.7 },
    thinking: { scaleY: 0.6 },
    shy: { scaleY: 0.5 },
    excited: { scaleY: 1.15 },
    wide: { scaleY: 1.25 },
    normal: { scaleY: 1 },
  }

  const expr = expressionStyles[expression] || expressionStyles.normal
  const scaleY = isBlinking ? 0.1 : expr.scaleY

  const eyeSize = mounted ? size : size
  const rx = Math.max(0.5, eyeSize / 2)
  const ry = Math.max(0.5, eyeSize / 2 * scaleY)

  return (
    <div
      className={cn("relative", className)}
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#1a1a1a",
          boxShadow: "0 0.5px 0 rgba(0,0,0,0.15)",
          transformOrigin: "center",
        }}
        animate={{
          scaleY,
          x: pupilOffsetX,
          y: pupilOffsetY,
        }}
        transition={{
          scaleY: { duration: isBlinking ? 0.06 : 0.15, ease: [0.4, 0, 1, 1] },
          x: { type: "spring", stiffness: 400, damping: 25, mass: 0.3 },
          y: { type: "spring", stiffness: 400, damping: 25, mass: 0.3 },
        }}
      />

      {expression === "happy" && !isBlinking && (
        <motion.div
          style={{
            position: "absolute",
            bottom: -size * 0.15,
            left: -size * 0.15,
            width: size * 1.3,
            height: size * 0.3,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,180,185,0.55), transparent)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
        />
      )}
    </div>
  )
}

export function EyePair({
  lookX = 0,
  lookY = 0,
  isBlinking = false,
  expression = "normal",
  spacing = 7,
  eyeSize = 4,
  className,
}: {
  lookX?: number
  lookY?: number
  isBlinking?: boolean
  expression?: "happy" | "thinking" | "shy" | "excited" | "wide" | "normal"
  spacing?: number
  eyeSize?: number
  className?: string
}) {
  return (
    <div
      className={cn("flex items-center", className)}
      style={{ gap: spacing }}
    >
      <Eye
        lookX={lookX}
        lookY={lookY}
        isBlinking={isBlinking}
        expression={expression}
        size={eyeSize}
        style={{ marginLeft: -0.5 }}
      />
      <Eye
        lookX={lookX}
        lookY={lookY}
        isBlinking={isBlinking}
        expression={expression}
        size={eyeSize}
        style={{ marginLeft: 0.5 }}
      />
    </div>
  )
}

export function SVGEye({
  lookX = 0,
  lookY = 0,
  isBlinking = false,
  expression = "normal",
  size = 4,
  className,
}: EyeProps) {
  const pupilOffsetX = clamp(lookX * 0.1, -1, 1)
  const pupilOffsetY = clamp(lookY * 0.1, -1, 1)

  const scaleY = isBlinking ? 0.1 : expression === "thinking" ? 0.6 : expression === "happy" ? 0.7 : 1

  const rx = Math.max(0.5, size / 2)
  const ry = Math.max(0.5, size / 2 * scaleY)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("overflow-visible", className)}
    >
      <motion.ellipse
        cx={size / 2 + pupilOffsetX}
        cy={size / 2 + pupilOffsetY}
        rx={rx}
        ry={ry}
        fill="#1a1a1a"
        style={{ filter: "drop-shadow(0 0.3px 0 rgba(0,0,0,0.15))" }}
        transition={{ duration: isBlinking ? 0.06 : 0.15, ease: [0.4, 0, 1, 1] }}
      />

      {expression === "happy" && !isBlinking && (
        <ellipse
          cx={size / 2}
          cy={size * 0.85}
          rx={Math.max(0.5, size * 0.4)}
          ry={Math.max(0.5, size * 0.1)}
          fill="rgba(255,180,185,0.5)"
        />
      )}
    </svg>
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
