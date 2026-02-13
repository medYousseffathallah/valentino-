"use client"

import { motion } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"

interface StageCurtainProps {
  isClosed: boolean
  color?: string
  className?: string
}

export function StageCurtain({ 
  isClosed, 
  color = "#E63946",
  className 
}: StageCurtainProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return null
  }

  return (
    <>
      <motion.div
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 pointer-events-none",
          className
        )}
        style={{ width: "50%" }}
        initial={{ x: "-100%" }}
        animate={{ x: isClosed ? "0%" : "-100%" }}
        transition={{ 
          duration: 0.3, 
          ease: [0.16, 1, 0.3, 1] 
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="curtain-left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B0000" />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor="#B22222" />
            </linearGradient>
            <filter id="curtain-shadow-left">
              <feDropShadow dx="5" dy="0" stdDeviation="10" floodOpacity="0.3" />
            </filter>
          </defs>
          <path
            d="M 0 0 Q 5 20 0 40 Q 5 60 0 80 Q 5 90 0 100 L 100 100 L 100 0 Z"
            fill="url(#curtain-left)"
            filter="url(#curtain-shadow-left)"
          />
          <path
            d="M 20 0 Q 25 10 20 20 Q 25 30 20 40 Q 25 50 20 60 Q 25 70 20 80 Q 25 90 20 100"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 50 0 Q 55 15 50 30 Q 55 45 50 60 Q 55 75 50 90 Q 55 95 50 100"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </motion.div>

      <motion.div
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50 pointer-events-none",
          className
        )}
        style={{ width: "50%" }}
        initial={{ x: "100%" }}
        animate={{ x: isClosed ? "0%" : "100%" }}
        transition={{ 
          duration: 0.3, 
          ease: [0.16, 1, 0.3, 1] 
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
          style={{ transform: "scaleX(-1)" }}
        >
          <defs>
            <linearGradient id="curtain-right" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B0000" />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor="#B22222" />
            </linearGradient>
            <filter id="curtain-shadow-right">
              <feDropShadow dx="-5" dy="0" stdDeviation="10" floodOpacity="0.3" />
            </filter>
          </defs>
          <path
            d="M 0 0 Q 5 20 0 40 Q 5 60 0 80 Q 5 90 0 100 L 100 100 L 100 0 Z"
            fill="url(#curtain-right)"
            filter="url(#curtain-shadow-right)"
          />
          <path
            d="M 20 0 Q 25 10 20 20 Q 25 30 20 40 Q 25 50 20 60 Q 25 70 20 80 Q 25 90 20 100"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 50 0 Q 55 15 50 30 Q 55 45 50 60 Q 55 75 50 90 Q 55 95 50 100"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </motion.div>
    </>
  )
}

export function CurtainOverlay({ 
  isVisible,
  onComplete,
}: { 
  isVisible: boolean
  onComplete?: () => void 
}) {
  const reducedMotion = useReducedMotion()

  React.useEffect(() => {
    if (isVisible && !reducedMotion) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete, reducedMotion])

  if (reducedMotion) {
    return null
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-gradient-to-b from-[#8B0000] via-[#B22222] to-[#8B0000]"
      initial={{ scaleY: 0, transformOrigin: "top" }}
      animate={{ 
        scaleY: isVisible ? 1 : 0,
        transformOrigin: isVisible ? "top" : "bottom",
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}
