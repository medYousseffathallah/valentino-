"use client"

import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"
import type { Relationship } from "@/lib/valentino"

interface FloatingTokenProps {
  onRelationshipSelect: (relationship: Relationship) => void
  onHoverChange?: (relationship: Relationship | null) => void
  selectedRelationship: Relationship | null
  className?: string
  centerPoint?: { x: number; y: number }
}

interface TokenConfig {
  key: Relationship
  label: string
  description: string
  icon: React.ReactNode
  color: string
  hoverColor: string
  orbitDelay: number
}

const tokenConfigs: TokenConfig[] = [
  {
    key: "Partner",
    label: "Partner",
    description: "My significant other",
    color: "#E63946",
    hoverColor: "#C9182C",
    orbitDelay: 0,
    icon: <HeartTokenIcon />,
  },
  {
    key: "Crush",
    label: "Crush",
    description: "Someone special",
    color: "#FF6B8A",
    hoverColor: "#E63946",
    orbitDelay: 0.25,
    icon: <CherryTokenIcon />,
  },
  {
    key: "Friend",
    label: "Friend",
    description: "My buddy",
    color: "#4ECDC4",
    hoverColor: "#3DB8B0",
    orbitDelay: 0.5,
    icon: <HandshakeTokenIcon />,
  },
  {
    key: "Family",
    label: "Family",
    description: "My relative",
    color: "#FFB347",
    hoverColor: "#F5A623",
    orbitDelay: 0.75,
    icon: <HouseTokenIcon />,
  },
]

export function FloatingToken({
  onRelationshipSelect,
  onHoverChange,
  selectedRelationship,
  className,
  centerPoint = { x: 50, y: 50 },
}: FloatingTokenProps) {
  const reducedMotion = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [hoveredToken, setHoveredToken] = React.useState<Relationship | null>(null)
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    if (reducedMotion) return
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [reducedMotion])

  const handleHoverStart = (relationship: Relationship) => {
    setHoveredToken(relationship)
    onHoverChange?.(relationship)
  }

  const handleHoverEnd = () => {
    setHoveredToken(null)
    onHoverChange?.(null)
  }

  const handleSelect = (relationship: Relationship) => {
    onRelationshipSelect(relationship)
  }

  const orbitRadius = 35
  const tokenSize = 60

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full min-h-[300px]", className)}
    >
      {tokenConfigs.map((token, index) => {
        const angle = (index / tokenConfigs.length) * Math.PI * 2 - Math.PI / 2
        const baseX = Math.cos(angle) * orbitRadius
        const baseY = Math.sin(angle) * orbitRadius * 0.4
        
        const isSelected = selectedRelationship === token.key
        const isHovered = hoveredToken === token.key
        
        return (
          <motion.div
            key={token.key}
            className="absolute"
            style={{
              left: `${50 + baseX}%`,
              top: `${50 + baseY}%`,
              width: tokenSize,
              height: tokenSize,
              marginLeft: -tokenSize / 2,
              marginTop: -tokenSize / 2,
            }}
            initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
            animate={{
              scale: isSelected ? 1.2 : isHovered ? 1.15 : 1,
              opacity: 1,
              x: isHovered ? 0 : Math.sin(Date.now() / 1000 + token.orbitDelay * 10) * 3,
              y: isHovered ? 0 : Math.cos(Date.now() / 800 + token.orbitDelay * 10) * 2,
              rotate: isSelected ? [0, -5, 5, 0] : 0,
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              scale: { duration: 0.2 },
              x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 0.4 },
            }}
            onHoverStart={() => handleHoverStart(token.key)}
            onHoverEnd={handleHoverEnd}
            onClick={() => handleSelect(token.key)}
          >
            <Token
              config={token}
              isSelected={isSelected}
              isHovered={isHovered}
            />
          </motion.div>
        )
      })}

      <AnimatePresence>
        {hoveredToken && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-4 pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-[#E63946]/10">
              <p className="text-sm font-medium text-[#6B2737]">
                {tokenConfigs.find(t => t.key === hoveredToken)?.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Token({ 
  config, 
  isSelected, 
  isHovered 
}: { 
  config: TokenConfig
  isSelected: boolean
  isHovered: boolean
}) {
  const reducedMotion = useReducedMotion()
  
  return (
    <motion.div
      className={cn(
        "relative w-full h-full rounded-2xl cursor-pointer",
        "flex items-center justify-center",
        "transition-colors duration-200"
      )}
      style={{
        background: isSelected 
          ? `linear-gradient(135deg, ${config.color} 0%, ${config.hoverColor} 100%)`
          : `linear-gradient(135deg, ${config.color}20 0%, ${config.color}10 100%)`,
        boxShadow: isSelected || isHovered
          ? `0 4px 20px ${config.color}40, 0 2px 8px ${config.color}20`
          : `0 2px 8px ${config.color}20`,
      }}
      animate={isSelected && !reducedMotion ? {
        boxShadow: [
          `0 4px 20px ${config.color}40, 0 2px 8px ${config.color}20`,
          `0 6px 30px ${config.color}60, 0 4px 12px ${config.color}30`,
          `0 4px 20px ${config.color}40, 0 2px 8px ${config.color}20`,
        ]
      } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div 
        className="w-8 h-8"
        style={{ 
          color: isSelected ? "white" : config.color,
          filter: isSelected ? "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" : "none"
        }}
      >
        {config.icon}
      </div>

      {isSelected && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="M 2 6 L 5 9 L 10 3"
              stroke={config.color}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      {!reducedMotion && (isHovered || isSelected) && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 30%, white 0%, transparent 60%)`,
          }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

function HeartTokenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

function CherryTokenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C12 2 10 6 10 9c0 1.5.5 2.8 1.3 3.8-.5.1-.9.2-1.3.2-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4c0-1.5-.8-2.8-2-3.5.5-.5 1-1.5 1-2.5 0-2-1-4-1-4s2 .5 3 2c.5-.5 1-1.5 1-2.5 0-1.5-1-3-1-3s-2 2-4 2z"/>
      <circle cx="8" cy="17" r="3"/>
      <circle cx="16" cy="17" r="3"/>
    </svg>
  )
}

function HandshakeTokenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.5 3L8.5 6H5v3l-3 3 3 3v3h3l3 3 3-3h3v-3l3-3-3-3V6h-3l-3-3zm0 4l2 2h2v2l2 2-2 2v2h-2l-2 2-2-2H7.5v-2l-2-2 2-2V9h2l2-2z"/>
    </svg>
  )
}

function HouseTokenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/>
    </svg>
  )
}

export function RelationshipTokens({
  selected,
  onSelect,
  onHover,
  className,
}: {
  selected: Relationship | null
  onSelect: (relationship: Relationship) => void
  onHover?: (relationship: Relationship | null) => void
  className?: string
}) {
  const reducedMotion = useReducedMotion()

  return (
    <div className={cn("grid grid-cols-2 gap-4 w-full max-w-md", className)}>
      {tokenConfigs.map((token, index) => {
        const isSelected = selected === token.key
        
        return (
          <motion.button
            key={token.key}
            type="button"
            className={cn(
              "relative rounded-2xl p-4 text-left transition-all",
              "border-2",
              isSelected 
                ? "border-[#E63946] bg-[#E63946]/10" 
                : "border-[#E63946]/20 bg-white/90 hover:border-[#E63946]/50"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            onHoverStart={() => onHover?.(token.key)}
            onHoverEnd={() => onHover?.(null)}
            onClick={() => onSelect(token.key)}
            whileHover={reducedMotion ? undefined : { scale: 1.02 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ 
                  background: isSelected 
                    ? token.color 
                    : `${token.color}20`,
                }}
              >
                <div 
                  className="w-5 h-5"
                  style={{ color: isSelected ? "white" : token.color }}
                >
                  {token.icon}
                </div>
              </div>
              <div>
                <div className="font-medium text-[#6B2737]">{token.label}</div>
                <div className="text-xs text-[#6B2737]/60">{token.description}</div>
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
  )
}
