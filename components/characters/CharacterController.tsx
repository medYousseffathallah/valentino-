"use client"

import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { FingerCharacter, Mood } from "./Finger"
import { AccessoryType } from "./Accessory"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"
import { useTargetTracking, useElementTracking } from "@/hooks/useTargetTracking"

export type Pose = 
  | "default" 
  | "holding-hands" 
  | "peeking" 
  | "fist-bump" 
  | "high-five" 
  | "typing" 
  | "celebrating"
  | "shy"
  | "looking-at-each-other"
  | "back-to-back"
  | "comforting"
  | "presenting"
  | "hugging"
  | "peekaboo"

type LookAtTarget = 
  | "cursor" 
  | "center" 
  | "each-other" 
  | "user"
  | { x: number; y: number }

interface CharacterControllerProps {
  valAccessories?: AccessoryType[]
  tinoAccessories?: AccessoryType[]
  mood?: Mood
  pose?: Pose
  hoverPose?: Pose
  isHovering?: boolean
  isTyping?: boolean
  showHeart?: boolean
  className?: string
  lookAt?: LookAtTarget
  lookAtElement?: React.RefObject<HTMLElement | null>
  scale?: number
  size?: "default" | "large" | "theater"
  onHighFive?: () => void
  onPoseComplete?: (pose: Pose) => void
}

const stopMotionConfig = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.6,
}

const poseConfigs: Record<Pose, {
  val: { x: number; y: number; rotate: number; scale?: number }
  tino: { x: number; y: number; rotate: number; scale?: number }
  heart?: { scale: number; y: number; opacity: number }
}> = {
  default: {
    val: { x: 0, y: 0, rotate: 2 },
    tino: { x: 0, y: 0, rotate: -2 },
    heart: { scale: 1, y: 0, opacity: 1 },
  },
  "holding-hands": {
    val: { x: 20, y: 0, rotate: 10 },
    tino: { x: -20, y: 0, rotate: -10 },
    heart: { scale: 1.15, y: -6, opacity: 1 },
  },
  peeking: {
    val: { x: 0, y: 0, rotate: 0 },
    tino: { x: 18, y: 6, rotate: -8, scale: 0.94 },
    heart: { scale: 0.85, y: 6, opacity: 0.8 },
  },
  peekaboo: {
    val: { x: -12, y: 0, rotate: -4, scale: 0.92 },
    tino: { x: 4, y: 0, rotate: 6 },
    heart: { scale: 0.7, y: 4, opacity: 0.6 },
  },
  "fist-bump": {
    val: { x: 12, y: -6, rotate: -15 },
    tino: { x: -12, y: -6, rotate: 15 },
    heart: { scale: 0, y: 0, opacity: 0 },
  },
  "high-five": {
    val: { x: 8, y: -20, rotate: -12 },
    tino: { x: -8, y: -20, rotate: 12 },
    heart: { scale: 0, y: 0, opacity: 0 },
  },
  typing: {
    val: { x: -6, y: 0, rotate: 0 },
    tino: { x: 6, y: 0, rotate: 0 },
    heart: { scale: 0.75, y: 0, opacity: 0.5 },
  },
  celebrating: {
    val: { x: -12, y: -10, rotate: -10 },
    tino: { x: 12, y: -10, rotate: 10 },
    heart: { scale: 1.2, y: -10, opacity: 1 },
  },
  shy: {
    val: { x: -12, y: 0, rotate: -12 },
    tino: { x: 12, y: 0, rotate: 12 },
    heart: { scale: 0.65, y: 6, opacity: 0.45 },
  },
  "looking-at-each-other": {
    val: { x: 8, y: 0, rotate: 15 },
    tino: { x: -8, y: 0, rotate: -15 },
    heart: { scale: 1.05, y: 0, opacity: 1 },
  },
  "back-to-back": {
    val: { x: 8, y: 0, rotate: -15 },
    tino: { x: -8, y: 0, rotate: 15 },
    heart: { scale: 0, y: 0, opacity: 0 },
  },
  comforting: {
    val: { x: 8, y: 0, rotate: 6 },
    tino: { x: -10, y: 0, rotate: -10 },
    heart: { scale: 0.9, y: 0, opacity: 0.8 },
  },
  presenting: {
    val: { x: 20, y: -6, rotate: -6 },
    tino: { x: -20, y: -6, rotate: 6 },
    heart: { scale: 1.3, y: -16, opacity: 1 },
  },
  hugging: {
    val: { x: 16, y: 0, rotate: 12 },
    tino: { x: -16, y: 0, rotate: -12 },
    heart: { scale: 1.2, y: -8, opacity: 1 },
  },
}

export function CharacterController({
  valAccessories = [],
  tinoAccessories = [],
  mood = "happy",
  pose = "default",
  hoverPose,
  isHovering = false,
  isTyping = false,
  showHeart = true,
  className,
  lookAt = "cursor",
  lookAtElement,
  scale = 1,
  size = "default",
  onHighFive,
  onPoseComplete,
}: CharacterControllerProps) {
  const reducedMotion = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [screenShake, setScreenShake] = React.useState(0)
  
  const activePose = isHovering && hoverPose ? hoverPose : pose
  const poseConfig = poseConfigs[activePose]
  
  const { lookX: cursorLookX, lookY: cursorLookY } = useTargetTracking(
    containerRef,
    lookAt === "cursor" ? "cursor" : "center",
    !reducedMotion && lookAt === "cursor"
  )

  const { lookX: elementLookX, lookY: elementLookY } = useElementTracking(
    containerRef,
    lookAtElement || { current: null },
    !reducedMotion && !!lookAtElement
  )

  const eyeTargetX = lookAtElement ? elementLookX : cursorLookX
  const eyeTargetY = lookAtElement ? elementLookY : cursorLookY
  
  React.useEffect(() => {
    if (activePose === "high-five" && !reducedMotion) {
      setIsAnimating(true)
      setScreenShake(3)
      
      const shakeTimer = setTimeout(() => setScreenShake(0), 120)
      const completeTimer = setTimeout(() => {
        setIsAnimating(false)
        onHighFive?.()
        onPoseComplete?.(activePose)
      }, 350)
      
      return () => {
        clearTimeout(shakeTimer)
        clearTimeout(completeTimer)
      }
    }
  }, [activePose, reducedMotion, onHighFive, onPoseComplete])

  const valLookAt = lookAt === "each-other" ? { x: 5, y: 0 } : 
                     lookAt === "center" ? { x: 0, y: 0 } :
                     { x: eyeTargetX, y: eyeTargetY }
  
  const tinoLookAt = lookAt === "each-other" ? { x: -5, y: 0 } :
                      lookAt === "center" ? { x: 0, y: 0 } :
                      { x: eyeTargetX, y: eyeTargetY }

  const fingerSize = size === "theater" ? "theater" : size === "large" ? "large" : "default"
  const heartSize = size === "theater" ? 42 : size === "large" ? 32 : 22
  const heartTop = size === "theater" ? 85 : size === "large" ? 58 : 38

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative flex items-end justify-center", className)}
      animate={{ x: screenShake }}
      transition={{ duration: 0.04, ease: [0.4, 0, 1, 1] }}
      style={{ transform: `scale(${scale})` }}
    >
      <motion.div
        initial={reducedMotion ? false : { y: 80, opacity: 0 }}
        animate={{ 
          opacity: 1,
          ...poseConfig.val,
        }}
        transition={{ delay: 0, ...stopMotionConfig }}
        style={{ zIndex: activePose === "peeking" || activePose === "peekaboo" ? 2 : 1 }}
      >
        <FingerCharacter
          role="val"
          accessories={valAccessories}
          mood={isTyping ? "typing" : mood}
          isTyping={isTyping}
          size={fingerSize}
          externalLookX={valLookAt.x}
          externalLookY={valLookAt.y}
          useExternalTracking={true}
        />
      </motion.div>

      <AnimatePresence>
        {showHeart && poseConfig.heart && poseConfig.heart.opacity > 0 && (
          <motion.div
            className="absolute z-10"
            style={{ top: heartTop, left: "50%" }}
            initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
            animate={{ 
              scale: poseConfig.heart?.scale ?? 1,
              opacity: poseConfig.heart?.opacity ?? 1,
              y: poseConfig.heart?.y ?? 0,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              scale: { 
                duration: reducedMotion ? 0 : 1.2, 
                repeat: reducedMotion ? 0 : Infinity, 
                ease: "easeInOut",
                repeatType: "reverse",
              },
              opacity: { duration: 0.25 },
              y: { duration: 0.35 },
            }}
          >
            <FeltHeartSVG size={heartSize} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={reducedMotion ? false : { y: 80, opacity: 0 }}
        animate={{ 
          opacity: 1,
          ...poseConfig.tino,
        }}
        transition={{ delay: 0.08, ...stopMotionConfig }}
        style={{ zIndex: 1 }}
      >
        <FingerCharacter
          role="tino"
          accessories={tinoAccessories}
          mood={isTyping ? "typing" : mood}
          isTyping={isTyping}
          size={fingerSize}
          externalLookX={tinoLookAt.x}
          externalLookY={tinoLookAt.y}
          useExternalTracking={true}
        />
      </motion.div>
    </motion.div>
  )
}

function FeltHeartSVG({ size = 22 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size * 0.9} 
      viewBox="0 0 20 18" 
      style={{ 
        display: "block",
        filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.1))"
      }}
    >
      <defs>
        <radialGradient id="felt-heart-gradient" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="50%" stopColor="#E63946" />
          <stop offset="100%" stopColor="#c92a2a" />
        </radialGradient>
        <filter id="felt-texture">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.7" 
            numOctaves="3" 
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>
      <path
        d="M 10 16 L 8.5 14.5 C 3 9.5 0 6.5 0 3.5 C 0 1.5 1.5 0 3.5 0 C 5.5 0 7 1 8 2.5 C 9 1 10.5 0 12.5 0 C 14.5 0 16 1.5 16 3.5 C 16 6.5 13 9.5 7.5 14.5 L 10 16 Z"
        fill="url(#felt-heart-gradient)"
        stroke="rgba(100,20,30,0.15)"
        strokeWidth="0.5"
      />
      <path
        d="M 10 16 L 8.5 14.5 C 3 9.5 0 6.5 0 3.5 C 0 1.5 1.5 0 3.5 0 C 5.5 0 7 1 8 2.5 C 9 1 10.5 0 12.5 0 C 14.5 0 16 1.5 16 3.5 C 16 6.5 13 9.5 7.5 14.5 L 10 16 Z"
        fill="url(#felt-texture)"
        opacity="0.05"
      />
    </svg>
  )
}

export function CharacterEntrance({
  children,
  delay = 0,
  className,
  onComplete,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  onComplete?: () => void
}) {
  const reducedMotion = useReducedMotion()
  const [phase, setPhase] = React.useState<"entering" | "settled">("entering")
  
  React.useEffect(() => {
    if (reducedMotion) {
      setPhase("settled")
      onComplete?.()
      return
    }
    
    const timer = setTimeout(() => {
      setPhase("settled")
      onComplete?.()
    }, (delay + 0.7) * 1000)
    
    return () => clearTimeout(timer)
  }, [delay, onComplete, reducedMotion])

  return (
    <motion.div
      className={cn("relative", className)}
      initial={reducedMotion ? false : { y: "100vh" }}
      animate={{ 
        y: phase === "entering" && !reducedMotion ? -15 : 0 
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.7,
        delay: reducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export function GeneratingCharacters({
  progress = 0,
  className,
}: {
  progress?: number
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  const beatSpeed = Math.max(0.35, 1 - progress * 0.65)
  
  return (
    <div className={cn("relative", className)}>
      <CharacterController
        valAccessories={["bow"]}
        tinoAccessories={["top-hat"]}
        mood="typing"
        pose="typing"
        isTyping={true}
        showHeart={true}
      />
      
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 25 }}
        animate={reducedMotion ? false : {
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: beatSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FeltHeartSVG size={20} />
      </motion.div>
    </div>
  )
}

export function CelebrationCharacters({
  className,
}: {
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  
  return (
    <motion.div
      className={cn("relative", className)}
      initial={reducedMotion ? false : { scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
      }}
    >
      <CharacterController
        valAccessories={["bow", "blush"]}
        tinoAccessories={["top-hat", "bowtie"]}
        mood="excited"
        pose="celebrating"
        showHeart={true}
      />
    </motion.div>
  )
}
