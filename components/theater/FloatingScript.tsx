"use client"

import { motion } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"

interface FloatingScriptProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSubmit?: () => void
  className?: string
  maxWidth?: number
}

export function FloatingScript({
  value,
  onChange,
  placeholder = "Enter a nickname...",
  onSubmit,
  className,
  maxWidth = 280,
}: FloatingScriptProps) {
  const reducedMotion = useReducedMotion()
  const [isFocused, setIsFocused] = React.useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit()
    }
  }

  return (
    <motion.div
      className={cn("relative", className)}
      initial={reducedMotion ? false : { y: -20, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        rotateX: isFocused ? 0 : 5,
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      style={{
        perspective: 1000,
        maxWidth,
      }}
    >
      <svg
        viewBox="0 0 200 80"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="paper-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" />
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
          <linearGradient id="paper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFEF9" />
            <stop offset="50%" stopColor="#FDF6F0" />
            <stop offset="100%" stopColor="#F8F0E8" />
          </linearGradient>
          <filter id="script-shadow">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>
        
        <path
          d="M 5 10 Q 10 5 20 5 L 180 5 Q 190 5 195 10 L 195 70 Q 190 75 180 75 L 20 75 Q 10 75 5 70 Z"
          fill="url(#paper-gradient)"
          stroke="#E6394620"
          strokeWidth="1"
          filter="url(#script-shadow)"
        />
        
        <path
          d="M 10 15 Q 15 10 25 10 L 175 10 Q 185 10 190 15"
          stroke="#E6394615"
          strokeWidth="1"
          fill="none"
        />
        
        <path
          d="M 10 65 Q 15 70 25 70 L 175 70 Q 185 70 190 65"
          stroke="#E6394615"
          strokeWidth="1"
          fill="none"
        />
        
        <motion.path
          d="M 20 20 L 180 20"
          stroke="#E6394610"
                          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.path
          d="M 20 60 L 180 60"
          stroke="#E6394610"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </svg>

      <div className="relative z-10 p-4 flex flex-col items-center justify-center min-h-[80px]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent text-center text-lg font-serif",
            "text-[#6B2737] placeholder:text-[#6B2737]40",
            "outline-none border-none",
            "selection:bg-[#E63946]20"
          )}
          style={{
            maxWidth: maxWidth - 40,
          }}
          maxLength={40}
        />
      </div>

      {isFocused && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            boxShadow: "0 0 0 2px #E6394630, 0 0 20px #E6394620",
          }}
        />
      )}
    </motion.div>
  )
}

export function ScriptSeal({
  isVisible = true,
  text,
}: {
  isVisible?: boolean
  text?: string
}) {
  const reducedMotion = useReducedMotion()

  if (!isVisible) return null

  return (
    <motion.div
      className="relative w-16 h-16"
      initial={reducedMotion ? false : { scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 20 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <defs>
          <linearGradient id="seal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C41E3A" />
            <stop offset="50%" stopColor="#E63946" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
        </defs>
        
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="url(#seal-gradient)"
          stroke="#8B0000"
          strokeWidth="2"
        />
        
        <circle
          cx="30"
          cy="30"
          r="20"
          fill="none"
          stroke="#FFD700"
          strokeWidth="1"
          opacity="0.5"
        />
        
        {text && (
          <text
            x="30"
            y="34"
            textAnchor="middle"
            fontSize="10"
            fill="#FFD700"
            fontFamily="serif"
          >
            {text.slice(0, 6)}
          </text>
        )}
      </svg>
    </motion.div>
  )
}
