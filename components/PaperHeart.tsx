"use client"

import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"

interface PaperHeartProps {
  className?: string
  isUnfolding?: boolean
  children?: React.ReactNode
}

export function PaperHeart({ 
  className, 
  isUnfolding = false,
  children 
}: PaperHeartProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      initial={false}
      animate={isUnfolding ? "unfolded" : "folded"}
      variants={{
        folded: {
          scale: 0.6,
          rotateY: 0,
        },
        unfolded: {
          scale: 1,
          rotateY: 180,
        },
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      {/* Front (folded heart) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={{
          folded: { rotateY: 0, opacity: 1 },
          unfolded: { rotateY: 180, opacity: 0 },
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ backfaceVisibility: "hidden" }}
      >
        <svg width="80" height="72" viewBox="0 0 80 72" className="drop-shadow-lg">
          <defs>
            <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E63946" />
              <stop offset="100%" stopColor="#C41E3A" />
            </linearGradient>
          </defs>
          <path
            d="M 40 64 L 34 58 C 12 38 0 26 0 14 C 0 6 6 0 14 0 C 22 0 30 4 36 14 C 38 18 40 22 40 22 C 40 22 42 18 44 14 C 50 4 58 0 66 0 C 74 0 80 6 80 14 C 80 26 68 38 46 58 L 40 64 Z"
            fill="url(#heart-gradient)"
          />
        </svg>
      </motion.div>

      {/* Back (unfolded paper with poem) */}
      <motion.div
        className="relative"
        variants={{
          folded: { rotateY: -180, opacity: 0 },
          unfolded: { rotateY: 0, opacity: 1 },
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ backfaceVisibility: "hidden" }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export function FloatingHeart({ 
  className,
  size = 20,
  delay = 0,
  style,
  rotation = 0
}: { 
  className?: string
  size?: number
  delay?: number
  style?: React.CSSProperties
  rotation?: number
}) {
  return (
    <motion.svg
      width={size}
      height={size * 0.9}
      viewBox="0 0 20 18"
      className={cn("text-rose-500", className)}
      initial={{ y: 0, opacity: 1 }}
      animate={{ 
        y: -100,
        opacity: 0,
        rotate: rotation
      }}
      transition={{ 
        duration: 2 + Math.random(),
        delay,
        ease: "easeOut"
      }}
    >
      <path
        d="M 10 16 L 8.5 14.5 C 3 9.5 0 6.5 0 3.5 C 0 1.5 1.5 0 3.5 0 C 5.5 0 7 1 8 2.5 C 9 1 10.5 0 12.5 0 C 14.5 0 16 1.5 16 3.5 C 16 6.5 13 9.5 7.5 14.5 L 10 16 Z"
        fill="currentColor"
        className="drop-shadow-sm"
      />
    </motion.svg>
  )
}

export function HeartsBackground({ count = 10 }: { count?: number }) {
  const hearts = React.useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 12,
      delay: Math.random() * 2,
      rotation: Math.random() * 30 - 15,
    })),
  [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <FloatingHeart
          key={heart.id}
          size={heart.size}
          delay={heart.delay}
          rotation={heart.rotation}
          className="absolute"
          style={{ left: `${heart.x}%`, bottom: -20 }}
        />
      ))}
    </div>
  )
}
