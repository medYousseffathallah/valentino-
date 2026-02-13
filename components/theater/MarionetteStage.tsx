"use client"

import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"

interface MarionetteStageProps {
  children: React.ReactNode
  className?: string
  spotlightTarget?: { x: number; y: number } | null
  onStageClick?: (e: React.MouseEvent) => void
  isInteractive?: boolean
}

export function MarionetteStage({
  children,
  className,
  spotlightTarget,
  onStageClick,
  isInteractive = true,
}: MarionetteStageProps) {
  const reducedMotion = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [cursorPos, setCursorPos] = React.useState({ x: 50, y: 50 })
  
  React.useEffect(() => {
    if (!isInteractive || reducedMotion) return
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      
      setCursorPos({ x, y })
    }
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isInteractive, reducedMotion])
  
  const spotlightX = spotlightTarget?.x ?? cursorPos.x
  const spotlightY = spotlightTarget?.y ?? cursorPos.y

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative min-h-screen w-full overflow-hidden",
        "bg-[#FDF6F0]",
        className
      )}
      onClick={onStageClick}
    >
      {/* Paper grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: "multiply",
        }}
      />

      {/* Subtle warm gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #FFF9F5 0%, transparent 60%)",
        }}
      />

      {/* Spotlight effect following cursor */}
      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute"
          style={{
            width: "60vmax",
            height: "60vmax",
            left: `${spotlightX}%`,
            top: `${spotlightY}%`,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse at center, rgba(230, 57, 70, 0.04) 0%, transparent 60%)",
          }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Top stage decoration - curtain valance */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          viewBox="0 0 1200 64"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="curtain-valance" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C9182C" />
              <stop offset="100%" stopColor="#8B0000" />
            </linearGradient>
            <filter id="curtain-fold">
              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" />
              <feDisplacementMap in="SourceGraphic" scale="3" />
            </filter>
          </defs>
          <path
            d="M 0 0 L 1200 0 L 1200 40 Q 1150 64 1100 40 Q 1050 16 1000 40 Q 950 64 900 40 Q 850 16 800 40 Q 750 64 700 40 Q 650 16 600 40 Q 550 64 500 40 Q 450 16 400 40 Q 350 64 300 40 Q 250 16 200 40 Q 150 64 100 40 Q 50 16 0 40 Z"
            fill="url(#curtain-valance)"
            filter="url(#curtain-fold)"
            opacity="0.15"
          />
        </svg>
      </div>

      {/* Main content area */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>

      {/* Bottom stage - velvet shelf for puppets */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: `
            linear-gradient(180deg, 
              transparent 0%, 
              rgba(139, 0, 0, 0.03) 20%,
              rgba(139, 0, 0, 0.08) 50%,
              rgba(107, 39, 55, 0.15) 100%
            )
          `,
        }}
      />

      {/* Shelf highlight line */}
      <div
        className="pointer-events-none absolute bottom-32 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(230, 57, 70, 0.2), transparent)",
        }}
      />

      {/* Ambient dust particles */}
      {!reducedMotion && <DustParticles />}
    </div>
  )
}

function DustParticles() {
  const particles = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
    }))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#E63946]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.1,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export function StageShelf({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Shadow under puppets */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-[50%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(107, 39, 55, 0.2) 0%, transparent 70%)",
        }}
      />
      {children}
    </div>
  )
}

export function StageSpotlight({
  target,
  intensity = 0.5,
  className,
}: {
  target: React.RefObject<HTMLElement | null>
  intensity?: number
  className?: string
}) {
  const [position, setPosition] = React.useState({ x: 50, y: 50 })
  
  React.useEffect(() => {
    if (!target.current) return
    
    const updatePosition = () => {
      if (!target.current) return
      const rect = target.current.getBoundingClientRect()
      setPosition({
        x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
        y: ((rect.top + rect.height / 2) / window.innerHeight) * 100,
      })
    }
    
    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, { passive: true })
    
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [target])

  return (
    <motion.div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        background: `radial-gradient(ellipse at ${position.x}% ${position.y}%, rgba(230, 57, 70, ${intensity * 0.08}) 0%, transparent 40%)`,
      }}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}
