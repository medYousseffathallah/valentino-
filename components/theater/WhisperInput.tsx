"use client"

import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"

interface WhisperInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSubmit?: () => void
  className?: string
  isActive?: boolean
  onActiveChange?: (active: boolean) => void
  position?: "between" | "floating"
}

export function WhisperInput({
  value,
  onChange,
  placeholder = "Their name...",
  onSubmit,
  className,
  isActive = false,
  onActiveChange,
  position = "between",
}: WhisperInputProps) {
  const reducedMotion = useReducedMotion()
  const [isFocused, setIsFocused] = React.useState(false)
  const [shake, setShake] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const prevValueRef = React.useRef(value)
  
  const isExpanded = isFocused || value.length > 0

  React.useEffect(() => {
    if (value.length > prevValueRef.current.length && !reducedMotion) {
      setShake(1)
      const timer = setTimeout(() => setShake(0), 100)
      return () => clearTimeout(timer)
    }
    prevValueRef.current = value
  }, [value, reducedMotion])

  const handleFocus = () => {
    setIsFocused(true)
    onActiveChange?.(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    onActiveChange?.(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit()
    }
  }

  const handleClick = () => {
    inputRef.current?.focus()
  }

  return (
    <motion.div
      className={cn("relative cursor-pointer", className)}
      initial={reducedMotion ? false : { scale: 0.8, opacity: 0, y: 20 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
        x: shake * (Math.random() > 0.5 ? 2 : -2),
      }}
      transition={{
        scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.3 },
        y: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        x: { duration: 0.05 },
      }}
      onClick={handleClick}
    >
      <svg
        viewBox="0 0 200 90"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="whisper-shadow">
            <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#6B2737" floodOpacity="0.15" />
          </filter>
          <linearGradient id="whisper-paper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFEFA" />
            <stop offset="50%" stopColor="#FDF6F0" />
            <stop offset="100%" stopColor="#F8F0E8" />
          </linearGradient>
          <filter id="paper-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
        
        <motion.path
          d={isExpanded 
            ? "M 10 8 Q 15 2 30 2 L 170 2 Q 185 2 190 8 L 190 68 Q 185 82 170 82 L 110 82 L 100 92 L 90 82 L 30 82 Q 15 82 10 68 Z"
            : "M 15 10 Q 20 5 35 5 L 165 5 Q 180 5 185 10 L 185 60 Q 180 72 165 72 L 110 72 L 100 80 L 90 72 L 35 72 Q 20 72 15 60 Z"
          }
          fill="url(#whisper-paper)"
          stroke="rgba(230, 57, 70, 0.2)"
          strokeWidth="1.5"
          filter="url(#whisper-shadow)"
          animate={{ d: isExpanded 
            ? "M 10 8 Q 15 2 30 2 L 170 2 Q 185 2 190 8 L 190 68 Q 185 82 170 82 L 110 82 L 100 92 L 90 82 L 30 82 Q 15 82 10 68 Z"
            : "M 15 10 Q 20 5 35 5 L 165 5 Q 180 5 185 10 L 185 60 Q 180 72 165 72 L 110 72 L 100 80 L 90 72 L 35 72 Q 20 72 15 60 Z"
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        
        <path
          d="M 15 18 Q 20 12 35 12 L 165 12 Q 180 12 185 18"
          stroke="rgba(230, 57, 70, 0.08)"
          strokeWidth="1"
          fill="none"
        />
        
        <ellipse
          cx="100"
          cy="45"
          rx="80"
          ry="30"
          fill="url(#paper-grain)"
          opacity="0.03"
        />
      </svg>

      <div 
        className={cn(
          "relative z-10 flex flex-col items-center justify-center transition-all duration-300",
          isExpanded ? "min-h-[82px] p-4" : "min-h-[72px] p-3"
        )}
      >
        <AnimatePresence mode="wait">
          {!isExpanded && value.length === 0 && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="text-[#6B2737] text-sm font-serif italic"
            >
              {placeholder}
            </motion.div>
          )}
        </AnimatePresence>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder=""
          className={cn(
            "w-full bg-transparent text-center outline-none border-none",
            "text-[#6B2737] selection:bg-[#E63946]/20",
            isExpanded ? "text-lg" : "text-base"
          )}
          style={{
            fontFamily: "'Caveat', 'Patrick Hand', cursive",
            maxWidth: 160,
          }}
          maxLength={30}
        />
        
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                boxShadow: "0 0 0 2px rgba(230, 57, 70, 0.2), 0 0 20px rgba(230, 57, 70, 0.1)",
                borderRadius: "1rem",
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {isFocused && !reducedMotion && (
        <motion.div
          className="absolute -bottom-2 left-1/2 w-1 h-1 rounded-full bg-[#E63946]"
          initial={{ scale: 0, x: "-50%" }}
          animate={{ 
            scale: [0, 1.2, 0],
            y: [0, 10],
            opacity: [1, 0]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  )
}

export function SpeechBubble({
  children,
  position = "center",
  className,
  tailDirection = "down",
}: {
  children: React.ReactNode
  position?: "left" | "center" | "right"
  tailDirection?: "up" | "down" | "left" | "right"
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  
  const tailPaths = {
    down: "M 90 72 L 100 82 L 110 72",
    up: "M 90 8 L 100 -2 L 110 8",
    left: "M 8 35 L -2 45 L 8 55",
    right: "M 192 35 L 202 45 L 192 55",
  }

  return (
    <motion.div
      className={cn("relative", className)}
      initial={reducedMotion ? false : { scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        viewBox="0 0 200 80"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="speech-shadow">
            <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#6B2737" floodOpacity="0.12" />
          </filter>
        </defs>
        
        <rect
          x="10"
          y="5"
          width="180"
          height="65"
          rx="16"
          fill="#FFFEFA"
          stroke="rgba(230, 57, 70, 0.15)"
          strokeWidth="1"
          filter="url(#speech-shadow)"
        />
        
        <path
          d={tailPaths[tailDirection]}
          fill="#FFFEFA"
          stroke="rgba(230, 57, 70, 0.15)"
          strokeWidth="1"
        />
      </svg>
      
      <div className="relative z-10 p-4 min-h-[75px] flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  )
}
