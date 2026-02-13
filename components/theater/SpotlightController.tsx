"use client"

import { motion } from "framer-motion"
import * as React from "react"
import { useReducedMotion } from "@/hooks/useEyeTracking"

interface SpotlightControllerProps {
  target: { x: number; y: number }
  color?: string
  size?: number
  intensity?: number
  className?: string
}

export function SpotlightController({
  target,
  color = "#E63946",
  size = 300,
  intensity = 0.15,
  className,
}: SpotlightControllerProps) {
  const reducedMotion = useReducedMotion()
  const [smoothTarget, setSmoothTarget] = React.useState(target)

  React.useEffect(() => {
    if (reducedMotion) return
    
    const lerp = 0.08
    let rafId: number
    let currentTarget = { ...smoothTarget }
    
    const animate = () => {
      currentTarget = {
        x: currentTarget.x + (target.x - currentTarget.x) * lerp,
        y: currentTarget.y + (target.y - currentTarget.y) * lerp,
      }
      setSmoothTarget(currentTarget)
      
      const threshold = 1
      if (
        Math.abs(target.x - currentTarget.x) > threshold ||
        Math.abs(target.y - currentTarget.y) > threshold
      ) {
        rafId = requestAnimationFrame(animate)
      }
    }
    
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reducedMotion])

  if (reducedMotion) {
    return null
  }

  const hexIntensity = Math.round(intensity * 255).toString(16).padStart(2, '0')

  return (
    <motion.div
      className={`pointer-events-none absolute ${className || ''}`}
      style={{
        left: smoothTarget.x - size / 2,
        top: smoothTarget.y - size / 2,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}${hexIntensity} 0%, transparent 70%)`,
        filter: "blur(20px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  )
}

export function VignetteEffect({ 
  intensity = 0.3,
  color = "#6B2737",
}: { 
  intensity?: number
  color?: string
}) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20"
      style={{
        background: `radial-gradient(ellipse at center, transparent 40%, ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 100%)`,
      }}
    />
  )
}

export function FocusRing({
  children,
  isActive = false,
  color = "#E63946",
}: {
  children: React.ReactNode
  isActive?: boolean
  color?: string
}) {
  return (
    <motion.div
      className="relative"
      animate={{
        boxShadow: isActive 
          ? `0 0 0 3px ${color}40, 0 0 20px ${color}30`
          : "0 0 0 0 transparent",
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
