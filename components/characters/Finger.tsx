"use client"

import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useEyeTracking, useBlink, useBreathing, useReducedMotion } from "@/hooks/useEyeTracking"
import { Accessory, AccessoryType, BlushMarks, accessoryPositions } from "./Accessory"

export type Mood = "happy" | "thinking" | "shy" | "excited" | "typing" | "surprised" | "sleepy"

export interface FingerCharacterProps {
  role: "val" | "tino"
  accessories?: AccessoryType[]
  mood?: Mood
  isTyping?: boolean
  className?: string
  style?: React.CSSProperties
  onSquash?: () => void
  externalLookX?: number
  externalLookY?: number
  useExternalTracking?: boolean
  accessoriesDraggable?: boolean
  size?: "default" | "large" | "theater"
  showArm?: boolean
  armPose?: "default" | "reaching-left" | "reaching-right" | "raised" | "hugging"
}

const stopMotionSpring = {
  type: "spring" as const,
  stiffness: 600,
  damping: 25,
  mass: 0.5,
}

const expressionMap: Record<Mood, {
  eyeExpression: "happy" | "thinking" | "shy" | "excited" | "wide" | "normal"
  mouthType: "smile" | "open" | "line" | "curved" | "none"
}> = {
  happy: { eyeExpression: "happy", mouthType: "smile" },
  thinking: { eyeExpression: "thinking", mouthType: "line" },
  shy: { eyeExpression: "shy", mouthType: "curved" },
  excited: { eyeExpression: "excited", mouthType: "open" },
  typing: { eyeExpression: "normal", mouthType: "line" },
  surprised: { eyeExpression: "wide", mouthType: "open" },
  sleepy: { eyeExpression: "shy", mouthType: "line" },
}

const sizeConfig = {
  default: { height: 100, width: 45 },
  large: { height: 150, width: 65 },
  theater: { height: 220, width: 95 },
}

export function FingerCharacter({
  role,
  accessories = [],
  mood = "happy",
  isTyping = false,
  className,
  style,
  onSquash,
  externalLookX = 0,
  externalLookY = 0,
  useExternalTracking = false,
  accessoriesDraggable = false,
  size = "default",
  showArm = false,
  armPose = "default",
}: FingerCharacterProps) {
  const fingerRef = React.useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  
  const { lookX: internalLookX, lookY: internalLookY } = useEyeTracking(fingerRef, !reducedMotion && !useExternalTracking)
  const { isBlinking, triggerBlink } = useBlink(!reducedMotion)
  const { scale: breatheScale } = useBreathing(!reducedMotion, 5000)
  
  const lookX = useExternalTracking ? externalLookX : internalLookX
  const lookY = useExternalTracking ? externalLookY : internalLookY
  
  const [isSquashed, setIsSquashed] = React.useState(false)
  const expression = expressionMap[mood]
  
  const isVal = role === "val"
  const config = sizeConfig[size]
  const fingerHeight = isVal ? config.height : config.height + 8
  const fingerWidth = isVal ? config.width : config.width + 5
  
  const handlePointerDown = () => {
    setIsSquashed(true)
    onSquash?.()
    triggerBlink()
  }
  
  const handlePointerUp = () => {
    setIsSquashed(false)
  }
  
  const getMoodAnimation = () => {
    if (reducedMotion) return {}
    
    switch (mood) {
      case "typing":
        return { 
          y: [0, -3, 0], 
          transition: { duration: 0.15, repeat: Infinity, ease: [0.4, 0, 1, 1] } 
        }
      case "excited":
        return { 
          rotate: [-4, 4, -4], 
          transition: { duration: 0.3, repeat: Infinity, ease: [0.4, 0, 0.6, 1] } 
        }
      case "shy":
        return { rotate: -6, x: -2 }
      case "thinking":
        return { rotate: 10, x: 4 }
      case "surprised":
        return { scale: 1.03 }
      case "sleepy":
        return { rotate: 4, y: 2 }
      default:
        return { 
          rotate: isVal ? [-2, 2, -2] : [2, -2, 2], 
          transition: { duration: 4, repeat: Infinity, repeatType: "reverse" as const } 
        }
    }
  }

  const eyeSize = size === "theater" ? 7 : size === "large" ? 5 : 4
  const eyeSpacing = size === "theater" ? 14 : size === "large" ? 10 : 7
  const faceTop = size === "theater" ? 35 : size === "large" ? 24 : 14

  const baseRotation = isVal ? 2 : -2

  return (
    <motion.div
      ref={fingerRef}
      className={cn("relative cursor-pointer select-none", className)}
      style={{ 
        transformOrigin: "bottom center",
        ...style 
      }}
      initial={{ scale: 0, y: 40, opacity: 0 }}
      animate={{ 
        scale: breatheScale * (isSquashed ? 1.05 : 1),
        y: 0,
        opacity: 1,
        scaleY: isSquashed ? 0.92 : 1,
        scaleX: isSquashed ? 1.08 : 1,
        ...getMoodAnimation()
      }}
      whileHover={reducedMotion ? undefined : { scale: 1.03 }}
      whileTap={reducedMotion ? undefined : { scale: 1.08, scaleY: 0.88 }}
      transition={stopMotionSpring}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        style={{
          width: fingerWidth,
          height: fingerHeight,
          position: "relative",
        }}
      >
        <FingerSVG 
          width={fingerWidth} 
          height={fingerHeight} 
          role={role}
          isSquashed={isSquashed}
        />

        <div 
          className="absolute flex"
          style={{ 
            top: faceTop, 
            left: "50%", 
            transform: "translateX(-50%)",
            gap: eyeSpacing,
          }}
        >
          <SharpieEye
            lookX={lookX}
            lookY={lookY}
            isBlinking={isBlinking}
            expression={expression.eyeExpression}
            size={eyeSize}
          />
          <SharpieEye
            lookX={lookX}
            lookY={lookY}
            isBlinking={isBlinking}
            expression={expression.eyeExpression}
            size={eyeSize}
            offset={0.5}
          />
        </div>

        <AnimatePresence mode="wait">
          {expression.mouthType === "smile" && (
            <SharpieMouthSmile 
              size={size} 
              top={faceTop + eyeSize * 2.2} 
            />
          )}
          
          {expression.mouthType === "open" && (
            <SharpieMouthOpen 
              size={size} 
              top={faceTop + eyeSize * 2} 
            />
          )}
          
          {expression.mouthType === "line" && (
            <SharpieMouthLine 
              size={size} 
              top={faceTop + eyeSize * 2.4} 
            />
          )}
          
          {expression.mouthType === "curved" && (
            <SharpieMouthCurved 
              size={size} 
              top={faceTop + eyeSize * 2.2} 
            />
          )}
        </AnimatePresence>

        {accessories.includes("blush") && (
          <PaperBlushMarks 
            style={{ 
              top: faceTop + eyeSize * 1.2,
            }} 
            size={size}
          />
        )}

        {accessories
          .filter((a) => a !== "blush")
          .map((accessory, index) => {
            const position = accessoryPositions[accessory]
            const scale = size === "theater" ? 1.8 : size === "large" ? 1.4 : 1
            return (
              <Accessory
                key={accessory}
                type={accessory}
                delay={index * 0.06}
                draggable={accessoriesDraggable}
                style={{
                  top: position.top,
                  left: position.left,
                  transform: `${position.transform} scale(${scale})`,
                }}
              />
            )
          })}
      </div>
    </motion.div>
  )
}

function FingerSVG({ 
  width, 
  height, 
  role,
  isSquashed 
}: { 
  width: number
  height: number
  role: "val" | "tino"
  isSquashed: boolean
}) {
  const skinTone = role === "val" 
    ? { base: "#F5D0C5", mid: "#E8B8A8", shadow: "#D4A89C" }
    : { base: "#F8D8CE", mid: "#EDC4B8", shadow: "#D9AD9F" }
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ 
        filter: "drop-shadow(3px 4px 6px rgba(0,0,0,0.12))",
        overflow: "visible"
      }}
    >
      <defs>
        <radialGradient 
          id={`finger-skin-${role}`} 
          cx="35%" 
          cy="25%" 
          r="75%"
        >
          <stop offset="0%" stopColor={skinTone.base} />
          <stop offset="45%" stopColor={skinTone.mid} />
          <stop offset="100%" stopColor={skinTone.shadow} />
        </radialGradient>
        
        <radialGradient 
          id={`nail-gradient-${role}`}
          cx="40%"
          cy="30%"
          r="60%"
        >
          <stop offset="0%" stopColor="#FFF0EB" />
          <stop offset="50%" stopColor="#F5E0D8" />
          <stop offset="100%" stopColor="#E8D0C8" />
        </radialGradient>
        
        <filter id={`skin-texture-${role}`}>
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>

        <filter id={`fingerprint-${role}`}>
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.03" 
            numOctaves="2"
            seed={role === "val" ? 42 : 87}
          />
          <feDisplacementMap in="SourceGraphic" scale="1.5" />
        </filter>
      </defs>
      
      <motion.ellipse
        cx={width / 2}
        cy={height * 0.45}
        rx={Math.max(1, width / 2 - 3)}
        ry={Math.max(1, height * 0.42)}
        fill={`url(#finger-skin-${role})`}
        animate={{
          ry: isSquashed ? Math.max(1, height * 0.38) : Math.max(1, height * 0.42),
          rx: isSquashed ? Math.max(1, width / 2) : Math.max(1, width / 2 - 3),
        }}
        transition={{ duration: 0.1 }}
      />
      
      <ellipse
        cx={width / 2}
        cy={height * 0.45}
        rx={Math.max(1, width / 2 - 3)}
        ry={Math.max(1, height * 0.42)}
        fill={`url(#skin-texture-${role})`}
        opacity="0.04"
      />

      <ellipse
        cx={width / 2}
        cy={height * 0.08}
        rx={Math.max(1, width * 0.35)}
        ry={Math.max(1, height * 0.06)}
        fill={`url(#nail-gradient-${role})`}
        style={{
          filter: "drop-shadow(0 1px 1px rgba(180,140,120,0.15))"
        }}
      />
      
      <ellipse
        cx={width / 2}
        cy={height * 0.055}
        rx={Math.max(1, width * 0.25)}
        ry={Math.max(1, height * 0.025)}
        fill="white"
        opacity="0.25"
      />

      <path
        d={`M ${width * 0.12} ${height * 0.5} 
            Q ${width / 2} ${height * 0.47} 
            ${width * 0.88} ${height * 0.5}`}
        stroke={skinTone.shadow}
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
        style={{ strokeLinecap: "round" }}
      />
      
      {height > 120 && (
        <path
          d={`M ${width * 0.15} ${height * 0.68} 
              Q ${width / 2} ${height * 0.66} 
              ${width * 0.85} ${height * 0.68}`}
          stroke={skinTone.shadow}
          strokeWidth="0.6"
          fill="none"
          opacity="0.25"
          style={{ strokeLinecap: "round" }}
        />
      )}

      <ellipse
        cx={width * 0.2}
        cy={height * 0.35}
        rx={Math.max(1, width * 0.06)}
        ry={Math.max(1, height * 0.08)}
        fill="white"
        opacity="0.12"
        transform={`rotate(-8 ${width * 0.2} ${height * 0.35})`}
      />
    </svg>
  )
}

function SharpieEye({
  lookX = 0,
  lookY = 0,
  isBlinking = false,
  expression = "normal",
  size = 4,
  offset = 0,
}: {
  lookX?: number
  lookY?: number
  isBlinking?: boolean
  expression?: "happy" | "thinking" | "shy" | "excited" | "wide" | "normal"
  size?: number
  offset?: number
}) {
  const pupilOffsetX = clamp(lookX * 0.15, -size * 0.15, size * 0.15)
  const pupilOffsetY = clamp(lookY * 0.15, -size * 0.1, size * 0.1)
  
  const expressionStyles: Record<string, { scaleY: number; scaleX: number }> = {
    happy: { scaleY: 0.7, scaleX: 1 },
    thinking: { scaleY: 0.6, scaleX: 1 },
    shy: { scaleY: 0.5, scaleX: 1 },
    excited: { scaleY: 1.2, scaleX: 1.1 },
    wide: { scaleY: 1.3, scaleX: 1.1 },
    normal: { scaleY: 1, scaleX: 1 },
  }
  
  const expr = expressionStyles[expression] || expressionStyles.normal
  const scaleY = isBlinking ? 0.08 : expr.scaleY
  const scaleX = expr.scaleX

  const imperfection = offset * 0.3

  return (
    <motion.div
      className="relative"
      style={{
        width: size,
        height: size * scaleY,
        marginLeft: imperfection,
      }}
      animate={{
        scaleY,
        scaleX,
      }}
      transition={{ duration: isBlinking ? 0.05 : 0.15, ease: [0.4, 0, 1, 1] }}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#1a1a1a",
          position: "relative",
          boxShadow: "0 0.5px 0 rgba(0,0,0,0.15)",
        }}
        animate={{
          x: pupilOffsetX,
          y: pupilOffsetY * scaleY,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.3,
        }}
      />
      
      {expression === "happy" && !isBlinking && (
        <motion.div
          style={{
            position: "absolute",
            bottom: -size * 0.1,
            left: -size * 0.1,
            width: size * 1.2,
            height: size * 0.25,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,180,185,0.6), transparent)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
        />
      )}
    </motion.div>
  )
}

function SharpieMouthSmile({ size, top }: { size: "default" | "large" | "theater"; top: number }) {
  const mouthWidth = size === "theater" ? 22 : size === "large" ? 16 : 11
  const mouthHeight = size === "theater" ? 14 : size === "large" ? 10 : 7
  
  return (
    <motion.svg
      className="absolute"
      style={{ top, left: "50%", transform: "translateX(-50%)" }}
      width={mouthWidth}
      height={mouthHeight}
      viewBox="0 0 22 14"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.1, ease: [0.4, 0, 1, 1] }}
    >
      <path 
        d="M 3 5 Q 11 16 19 5" 
        stroke="#5D4037" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0.3px 0 rgba(0,0,0,0.1))" }}
      />
    </motion.svg>
  )
}

function SharpieMouthOpen({ size, top }: { size: "default" | "large" | "theater"; top: number }) {
  const mouthSize = size === "theater" ? 14 : size === "large" ? 10 : 7
  
  return (
    <motion.div
      className="absolute"
      style={{ 
        top, 
        left: "50%", 
        transform: "translateX(-50%)",
        width: mouthSize,
        height: mouthSize * 0.75,
        borderRadius: "50%",
        background: "#2a2a2a",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.1, ease: [0.4, 0, 1, 1] }}
    />
  )
}

function SharpieMouthLine({ size, top }: { size: "default" | "large" | "theater"; top: number }) {
  const lineWidth = size === "theater" ? 12 : size === "large" ? 9 : 6
  
  return (
    <motion.div
      className="absolute"
      style={{ 
        top, 
        left: "50%", 
        transform: "translateX(-50%)",
        width: lineWidth,
        height: 2,
        borderRadius: 1,
        background: "#5D4037",
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ scaleX: 0, opacity: 0 }}
      transition={{ duration: 0.1, ease: [0.4, 0, 1, 1] }}
    />
  )
}

function SharpieMouthCurved({ size, top }: { size: "default" | "large" | "theater"; top: number }) {
  const mouthWidth = size === "theater" ? 16 : size === "large" ? 12 : 8
  
  return (
    <motion.svg
      className="absolute"
      style={{ top, left: "50%", transform: "translateX(-50%)" }}
      width={mouthWidth}
      height={mouthWidth * 0.5}
      viewBox="0 0 16 8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.1, ease: [0.4, 0, 1, 1] }}
    >
      <path 
        d="M 2 6 Q 8 1 14 6" 
        stroke="#5D4037" 
        strokeWidth="1.8" 
        fill="none" 
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0.3px 0 rgba(0,0,0,0.1))" }}
      />
    </motion.svg>
  )
}

function PaperBlushMarks({ 
  style, 
  size 
}: { 
  style?: React.CSSProperties
  size: "default" | "large" | "theater"
}) {
  const blushSize = size === "theater" ? 10 : size === "large" ? 7 : 5
  
  return (
    <>
      <div
        className="absolute"
        style={{ 
          ...style,
          left: "15%",
          width: blushSize,
          height: blushSize * 0.5,
          borderRadius: "50%",
          background: "#FFB5BA",
          boxShadow: "1px 1px 0 rgba(0,0,0,0.08)",
          border: "0.5px solid rgba(180,100,110,0.2)",
        }}
      />
      <div
        className="absolute"
        style={{ 
          ...style,
          right: "15%",
          width: blushSize,
          height: blushSize * 0.5,
          borderRadius: "50%",
          background: "#FFB5BA",
          boxShadow: "1px 1px 0 rgba(0,0,0,0.08)",
          border: "0.5px solid rgba(180,100,110,0.2)",
        }}
      />
    </>
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function FingerCharacterMemo(props: FingerCharacterProps) {
  return React.memo(FingerCharacter)(props)
}
