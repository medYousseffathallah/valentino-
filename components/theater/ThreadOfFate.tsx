"use client"

import { motion } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"

interface ThreadOfFateProps {
  progress: number
  className?: string
  startPoint?: { x: number; y: number }
  endPoint?: { x: number; y: number }
  color?: string
  animated?: boolean
}

export function ThreadOfFate({
  progress,
  className,
  startPoint = { x: 30, y: 80 },
  endPoint = { x: 70, y: 80 },
  color = "#C9182C",
  animated = true,
}: ThreadOfFateProps) {
  const reducedMotion = useReducedMotion()
  const [pathLength, setPathLength] = React.useState(0)
  const pathRef = React.useRef<SVGPathElement>(null)

  React.useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [startPoint, endPoint])

  const midX = (startPoint.x + endPoint.x) / 2
  const sagAmount = 15 + progress * 10
  
  const pathD = `M ${startPoint.x} ${startPoint.y} Q ${midX} ${startPoint.y + sagAmount} ${endPoint.x} ${endPoint.y}`

  const strokeDashoffset = pathLength * (1 - progress)

  return (
    <svg
      className={cn("absolute pointer-events-none", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
        
        <filter id="thread-glow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <filter id="thread-shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="#6B2737" floodOpacity="0.2" />
        </filter>
      </defs>

      <path
        d={pathD}
        fill="none"
        stroke="rgba(107, 39, 55, 0.1)"
        strokeWidth="1.5"
        filter="url(#thread-shadow)"
      />

      <motion.path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#thread-gradient)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={strokeDashoffset}
        filter="url(#thread-glow)"
        initial={reducedMotion ? false : { strokeDashoffset: pathLength }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {progress > 0 && !reducedMotion && animated && (
        <motion.ellipse
          cx={midX}
          cy={startPoint.y + sagAmount * progress}
          rx="0.8"
          ry="0.5"
          fill={color}
          opacity="0.6"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {progress >= 1 && (
        <>
          <motion.ellipse
            cx={startPoint.x}
            cy={startPoint.y}
            rx="1"
            ry="0.8"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
          />
          <motion.ellipse
            cx={endPoint.x}
            cy={endPoint.y}
            rx="1"
            ry="0.8"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
          />
        </>
      )}
    </svg>
  )
}

export function BindingThread({
  progress,
  className,
}: {
  progress: number
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 200 120"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="binding-thread" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9182C" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#E63946" />
            <stop offset="100%" stopColor="#C9182C" stopOpacity="0.9" />
          </linearGradient>
          
          <filter id="binding-glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ThreadPath 
          progress={progress} 
          reducedMotion={reducedMotion ?? false}
        />

        {progress > 0.3 && (
          <motion.circle
            cx="100"
            cy={60 + (1 - progress) * 20}
            r="3"
            fill="#E63946"
            filter="url(#binding-glow)"
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              scale: { duration: 0.3 },
              opacity: { duration: 2, repeat: Infinity }
            }}
          />
        )}
      </svg>
    </div>
  )
}

function ThreadPath({ 
  progress, 
  reducedMotion 
}: { 
  progress: number
  reducedMotion: boolean
}) {
  const pathRef = React.useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = React.useState(0)

  React.useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [])

  const sag = 25 * (1 - progress * 0.5)
  const pathD = `M 40 60 Q 100 ${60 + sag} 160 60`

  return (
    <motion.path
      ref={pathRef}
      d={pathD}
      fill="none"
      stroke="url(#binding-thread)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray={pathLength}
      strokeDashoffset={pathLength * (1 - progress)}
      filter="url(#binding-glow)"
      initial={reducedMotion ? false : { strokeDashoffset: pathLength }}
      animate={{ strokeDashoffset: pathLength * (1 - progress) }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  )
}

export function ProgressString({
  value,
  max = 100,
  className,
  showLabel = false,
}: {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}) {
  const progress = value / max
  const reducedMotion = useReducedMotion()

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1 h-1 bg-[#E63946]/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C9182C] to-[#E63946] rounded-full"
          initial={reducedMotion ? false : { width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {showLabel && (
        <motion.span
          className="text-xs font-medium text-[#6B2737]/70 min-w-[2.5rem] text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(progress * 100)}%
        </motion.span>
      )}
    </div>
  )
}
