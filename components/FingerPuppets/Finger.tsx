"use client"

import { motion } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"

export type AccessoryType = 
  | "top-hat" 
  | "bow" 
  | "flower-crown" 
  | "cat-ears" 
  | "crown" 
  | "beanie"
  | "heart-glasses"
  | "round-glasses"
  | "mustache"
  | "blush"
  | "bowtie"

export type Mood = "happy" | "thinking" | "shy" | "excited" | "typing"

interface FingerProps {
  role: "val" | "tino"
  accessories?: AccessoryType[]
  mood?: Mood
  isTyping?: boolean
  className?: string
  style?: React.CSSProperties
  onMouseMove?: (e: React.MouseEvent) => void
}

const stopMotionSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

export function Finger({ 
  role, 
  accessories = [], 
  mood = "happy", 
  isTyping = false,
  className,
  style,
  onMouseMove
}: FingerProps) {
  const [mousePos, setMousePos] = React.useState({ x: 0.5, y: 0.5 })
  const fingerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!fingerRef.current) return
    const rect = fingerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) })
    onMouseMove?.(e)
  }

  const pupilOffsetX = (mousePos.x - 0.5) * 1.5
  const pupilOffsetY = (mousePos.y - 0.5) * 1.5

  const isVal = role === "val"
  const fingerHeight = isVal ? 85 : 92
  const fingerWidth = isVal ? 38 : 41

  const getMoodAnimation = () => {
    switch (mood) {
      case "typing":
        return { y: [0, -3, 0], transition: { duration: 0.12, repeat: Infinity, ease: [0.4, 0, 1, 1] } }
      case "excited":
        return { rotate: [-3, 3, -3], transition: { duration: 0.25, repeat: Infinity, ease: [0.4, 0, 0.6, 1] } }
      case "shy":
        return { rotate: -8, x: -4 }
      case "thinking":
        return { rotate: 12, x: 8 }
      default:
        return { rotate: isVal ? [-2, 2, -2] : [2, -2, 2], transition: { duration: 3.5, repeat: Infinity, repeatType: "reverse" as const } }
    }
  }

  const skinTone = isVal 
    ? { base: "#F5D0C5", mid: "#E8B8A8", shadow: "#D4A89C" }
    : { base: "#F8D8CE", mid: "#EDC4B8", shadow: "#D9AD9F" }

  return (
    <motion.div
      ref={fingerRef}
      className={cn("relative cursor-pointer", className)}
      style={{ 
        transformOrigin: "bottom center",
        ...style 
      }}
      initial={{ scale: 0, y: 40 }}
      animate={{ 
        scale: 1, 
        y: 0,
        ...getMoodAnimation()
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 1.06, scaleY: 0.9 }}
      transition={stopMotionSpring}
      onMouseMove={handleMouseMove}
    >
      <svg
        width={fingerWidth}
        height={fingerHeight}
        viewBox={`0 0 ${fingerWidth} ${fingerHeight}`}
        style={{ 
          filter: "drop-shadow(3px 4px 5px rgba(0,0,0,0.1))",
          overflow: "visible"
        }}
      >
        <defs>
          <radialGradient 
            id={`finger-skin-simple-${role}`} 
            cx="35%" 
            cy="25%" 
            r="75%"
          >
            <stop offset="0%" stopColor={skinTone.base} />
            <stop offset="45%" stopColor={skinTone.mid} />
            <stop offset="100%" stopColor={skinTone.shadow} />
          </radialGradient>
          <radialGradient 
            id={`nail-simple-${role}`}
            cx="40%"
            cy="30%"
            r="60%"
          >
            <stop offset="0%" stopColor="#FFF0EB" />
            <stop offset="100%" stopColor="#E8D0C8" />
          </radialGradient>
          <filter id={`skin-texture-simple-${role}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
        
        <ellipse
          cx={fingerWidth / 2}
          cy={fingerHeight * 0.43}
          rx={fingerWidth / 2 - 2}
          ry={fingerHeight * 0.4}
          fill={`url(#finger-skin-simple-${role})`}
        />
        
        <ellipse
          cx={fingerWidth / 2}
          cy={fingerHeight * 0.43}
          rx={fingerWidth / 2 - 2}
          ry={fingerHeight * 0.4}
          fill={`url(#skin-texture-simple-${role})`}
          opacity="0.04"
        />

        <ellipse
          cx={fingerWidth / 2}
          cy={fingerHeight * 0.07}
          rx={fingerWidth * 0.32}
          ry={fingerHeight * 0.05}
          fill={`url(#nail-simple-${role})`}
        />
        
        <ellipse
          cx={fingerWidth / 2}
          cy={fingerHeight * 0.05}
          rx={fingerWidth * 0.22}
          ry={fingerHeight * 0.02}
          fill="white"
          opacity="0.2"
        />

        <path
          d={`M ${fingerWidth * 0.12} ${fingerHeight * 0.48} Q ${fingerWidth / 2} ${fingerHeight * 0.46} ${fingerWidth * 0.88} ${fingerHeight * 0.48}`}
          stroke={skinTone.shadow}
          strokeWidth="0.7"
          fill="none"
          opacity="0.35"
        />

        <ellipse
          cx={fingerWidth * 0.22}
          cy={fingerHeight * 0.32}
          rx={fingerWidth * 0.05}
          ry={fingerHeight * 0.07}
          fill="white"
          opacity="0.1"
        />
      </svg>

      <div 
        className="absolute flex"
        style={{ 
          top: 12, 
          left: "50%", 
          transform: "translateX(-50%)",
          gap: 6,
        }}
      >
        <motion.div
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#1a1a1a",
            boxShadow: "0 0.5px 0 rgba(0,0,0,0.15)",
          }}
          animate={{ 
            x: pupilOffsetX,
            y: pupilOffsetY
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.3 }}
        />
        <motion.div
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#1a1a1a",
            boxShadow: "0 0.5px 0 rgba(0,0,0,0.15)",
          }}
          animate={{ 
            x: pupilOffsetX,
            y: pupilOffsetY
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.3 }}
        />
      </div>

      {mood === "happy" && (
        <svg 
          className="absolute"
          style={{ top: 22, left: "50%", transform: "translateX(-50%)" }}
          width="10" 
          height="7" 
          viewBox="0 0 10 7"
        >
          <path 
            d="M 1.5 2 Q 5 8 8.5 2" 
            stroke="#5D4037" 
            strokeWidth="1.5" 
            fill="none" 
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0.3px 0 rgba(0,0,0,0.1))" }}
          />
        </svg>
      )}
      {mood === "excited" && (
        <div 
          className="absolute"
          style={{ 
            top: 21, 
            left: "50%", 
            transform: "translateX(-50%)",
            width: 5,
            height: 4,
            borderRadius: "50%",
            background: "#2a2a2a",
          }}
        />
      )}
      {mood === "shy" && (
        <svg 
          className="absolute"
          style={{ top: 22, left: "50%", transform: "translateX(-50%)" }}
          width="7" 
          height="4" 
          viewBox="0 0 7 4"
        >
          <path 
            d="M 1 3 Q 3.5 1 6 3" 
            stroke="#5D4037" 
            strokeWidth="1.3" 
            fill="none" 
            strokeLinecap="round" 
          />
        </svg>
      )}
      {mood === "thinking" && (
        <div 
          className="absolute"
          style={{ 
            top: 24, 
            left: "50%", 
            transform: "translateX(-50%)",
            width: 5,
            height: 1.5,
            borderRadius: 1,
            background: "#5D4037",
          }}
        />
      )}

      {accessories.includes("top-hat") && (
        <motion.div
          className="absolute"
          style={{ top: -24, left: "50%", transform: "translateX(-50%)" }}
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08, ...stopMotionSpring }}
        >
          <svg width="26" height="22" viewBox="0 0 26 22">
            <rect x="4" y="0" width="18" height="15" rx="1" fill="#2E2E2E" />
            <rect x="0" y="15" width="26" height="3" rx="0.5" fill="#1a1a1a" />
            <rect x="4" y="8" width="18" height="3" fill="#E63946" />
          </svg>
        </motion.div>
      )}

      {accessories.includes("bow") && (
        <motion.div
          className="absolute"
          style={{ top: -10, left: "50%", transform: "translateX(-50%)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.08, ...stopMotionSpring }}
        >
          <svg width="20" height="10" viewBox="0 0 20 10">
            <ellipse cx="5" cy="5" rx="4" ry="3.5" fill="#FFB5BA" />
            <ellipse cx="15" cy="5" rx="4" ry="3.5" fill="#FFB5BA" />
            <circle cx="10" cy="5" r="2.5" fill="#E63946" />
          </svg>
        </motion.div>
      )}

      {accessories.includes("crown") && (
        <motion.div
          className="absolute"
          style={{ top: -16, left: "50%", transform: "translateX(-50%)" }}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08, ...stopMotionSpring }}
        >
          <svg width="24" height="15" viewBox="0 0 24 15">
            <path d="M 0 15 L 3 5 L 7 10 L 12 0 L 17 10 L 21 5 L 24 15 Z" fill="#FFD700" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            <circle cx="12" cy="6" r="1.8" fill="#E63946" />
          </svg>
        </motion.div>
      )}

      {accessories.includes("heart-glasses") && (
        <motion.div
          className="absolute"
          style={{ top: 8, left: "50%", transform: "translateX(-50%)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.08, ...stopMotionSpring }}
        >
          <svg width="22" height="8" viewBox="0 0 22 8">
            <path d="M 2.5 4 C 2.5 2.5, 4 1.5, 5.5 3 L 5.5 5.5 C 4 7, 2.5 5.5, 2.5 4" fill="#E63946" />
            <path d="M 8.5 4 C 8.5 2.5, 7 1.5, 5.5 3 L 5.5 5.5 C 7 7, 8.5 5.5, 8.5 4" fill="#E63946" />
            <line x1="8.5" y1="4" x2="13.5" y2="4" stroke="#333" strokeWidth="1" />
            <path d="M 13.5 4 C 13.5 2.5, 15 1.5, 16.5 3 L 16.5 5.5 C 15 7, 13.5 5.5, 13.5 4" fill="#E63946" />
            <path d="M 19.5 4 C 19.5 2.5, 18 1.5, 16.5 3 L 16.5 5.5 C 18 7, 19.5 5.5, 19.5 4" fill="#E63946" />
          </svg>
        </motion.div>
      )}

      {accessories.includes("blush") && (
        <>
          <div 
            className="absolute"
            style={{ 
              top: 16, 
              left: 3, 
              width: 4, 
              height: 2, 
              borderRadius: "50%", 
              background: "#FFB5BA",
              boxShadow: "1px 1px 0 rgba(0,0,0,0.08)",
              border: "0.5px solid rgba(180,100,110,0.15)",
            }}
          />
          <div 
            className="absolute"
            style={{ 
              top: 16, 
              right: 3, 
              width: 4, 
              height: 2, 
              borderRadius: "50%", 
              background: "#FFB5BA",
              boxShadow: "1px 1px 0 rgba(0,0,0,0.08)",
              border: "0.5px solid rgba(180,100,110,0.15)",
            }}
          />
        </>
      )}

      {accessories.includes("bowtie") && (
        <motion.div
          className="absolute"
          style={{ top: 22, left: "50%", transform: "translateX(-50%)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.08, ...stopMotionSpring }}
        >
          <svg width="16" height="8" viewBox="0 0 16 8">
            <ellipse cx="4" cy="4" rx="3.5" ry="2.5" fill="#E63946" />
            <ellipse cx="12" cy="4" rx="3.5" ry="2.5" fill="#E63946" />
            <circle cx="8" cy="4" r="1.5" fill="#6B2737" />
          </svg>
        </motion.div>
      )}

      {accessories.includes("mustache") && (
        <motion.div
          className="absolute"
          style={{ top: 18, left: "50%", transform: "translateX(-50%)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.08, ...stopMotionSpring }}
        >
          <svg width="16" height="5" viewBox="0 0 16 5">
            <path d="M 0 3 Q 3.5 0, 5.5 2.5 Q 8 4, 8 2.5 Q 8 4, 10.5 2.5 Q 12.5 0, 16 3" fill="#5D4037" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}
