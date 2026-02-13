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
  | "monocle"
  | "party-hat"
  | "flower"

interface AccessoryProps {
  type: AccessoryType
  className?: string
  style?: React.CSSProperties
  color?: string
  delay?: number
  draggable?: boolean
  onDragEnd?: () => void
}

const paperSpring = {
  type: "spring" as const,
  stiffness: 600,
  damping: 30,
}

export function Accessory({ 
  type, 
  className, 
  style, 
  color, 
  delay = 0,
  draggable = false,
  onDragEnd,
}: AccessoryProps) {
  const accessory = getAccessoryContent(type, color)
  
  return (
    <motion.div
      className={cn("absolute", className)}
      style={style}
      initial={{ scale: 0, opacity: 0, y: -8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay, ...paperSpring }}
      drag={draggable}
      dragConstraints={{ left: -6, right: 6, top: -4, bottom: 4 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.08, cursor: "grabbing" }}
      onDragEnd={onDragEnd}
    >
      {accessory}
    </motion.div>
  )
}

function getAccessoryContent(type: AccessoryType, color?: string) {
  const primaryColor = color || "#E63946"
  
  switch (type) {
    case "top-hat":
      return (
        <svg width="32" height="26" viewBox="0 0 32 26" style={{ display: "block" }}>
          <rect 
            x="5" y="0" width="22" height="18" rx="1" 
            fill="#2E2E2E" 
            stroke="rgba(0,0,0,0.15)" 
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.12))" }}
          />
          <rect 
            x="0" y="18" width="32" height="4" rx="1" 
            fill="#1a1a1a"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.5"
          />
          <rect 
            x="5" y="10" width="22" height="4" 
            fill={primaryColor}
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="0.5"
          />
        </svg>
      )
      
    case "bow":
      return (
        <svg width="24" height="12" viewBox="0 0 24 12" style={{ display: "block" }}>
          <ellipse 
            cx="6" cy="6" rx="5" ry="4" 
            fill="#FFB5BA"
            stroke="rgba(180,100,110,0.2)"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.1))" }}
          />
          <ellipse 
            cx="18" cy="6" rx="5" ry="4" 
            fill="#FFB5BA"
            stroke="rgba(180,100,110,0.2)"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.1))" }}
          />
          <circle 
            cx="12" cy="6" r="2.5" 
            fill={primaryColor}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.5"
          />
        </svg>
      )
      
    case "crown":
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" style={{ display: "block" }}>
          <path 
            d="M 0 18 L 4 6 L 10 12 L 14 0 L 18 12 L 24 6 L 28 18 Z" 
            fill="#FFD700"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.12))" }}
          />
          <circle cx="14" cy="8" r="2" fill={primaryColor} />
          <circle cx="6" cy="12" r="1.5" fill={primaryColor} opacity="0.8" />
          <circle cx="22" cy="12" r="1.5" fill={primaryColor} opacity="0.8" />
        </svg>
      )
      
    case "flower-crown":
      return (
        <svg width="36" height="14" viewBox="0 0 36 14" style={{ display: "block" }}>
          {[0, 7, 14, 21, 28].map((x, i) => (
            <g key={i}>
              {[0, 72, 144, 216, 288].map((rot, j) => (
                <ellipse
                  key={j}
                  cx={x + 4 + Math.cos((rot * Math.PI) / 180) * 2.5}
                  cy={7 + Math.sin((rot * Math.PI) / 180) * 2.5}
                  rx="2.5"
                  ry="1.8"
                  fill={i % 2 === 0 ? "#FFB5BA" : "#90EE90"}
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="0.3"
                />
              ))}
              <circle 
                cx={x + 4} 
                cy={7} 
                r="1.5" 
                fill={i % 2 === 0 ? primaryColor : "#4CAF50"} 
              />
            </g>
          ))}
        </svg>
      )
      
    case "cat-ears":
      return (
        <svg width="40" height="16" viewBox="0 0 40 16" style={{ display: "block" }}>
          <path 
            d="M 4 16 L 7 2 L 12 16 Z" 
            fill="#FFB5BA"
            stroke="rgba(180,100,110,0.2)"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.1))" }}
          />
          <path 
            d="M 7 12 L 8.5 5 L 10 12 Z" 
            fill="#FFD1D5" 
          />
          <path 
            d="M 28 16 L 33 2 L 36 16 Z" 
            fill="#FFB5BA"
            stroke="rgba(180,100,110,0.2)"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.1))" }}
          />
          <path 
            d="M 30 12 L 31.5 5 L 33 12 Z" 
            fill="#FFD1D5" 
          />
        </svg>
      )
      
    case "beanie":
      return (
        <svg width="34" height="20" viewBox="0 0 34 20" style={{ display: "block" }}>
          <ellipse 
            cx="17" cy="14" rx="15" ry="6" 
            fill={primaryColor}
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.1))" }}
          />
          <path 
            d="M 2 14 Q 2 3 17 3 Q 32 3 32 14" 
            fill={primaryColor}
          />
          <circle cx="17" cy="2" r="3" fill={primaryColor} />
          <rect 
            x="2" y="12" width="30" height="3" 
            fill="rgba(0,0,0,0.15)"
            rx="0.5"
          />
        </svg>
      )
      
    case "heart-glasses":
      return (
        <svg width="28" height="10" viewBox="0 0 28 10" style={{ display: "block" }}>
          <path 
            d="M 3 5 C 3 3, 5 2, 7 4 L 7 7 C 5 9, 3 7, 3 5" 
            fill={primaryColor}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.3"
          />
          <path 
            d="M 11 5 C 11 3, 9 2, 7 4 L 7 7 C 9 9, 11 7, 11 5" 
            fill={primaryColor}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.3"
          />
          <line x1="11" y1="5" x2="17" y2="5" stroke="#333" strokeWidth="1" />
          <path 
            d="M 17 5 C 17 3, 19 2, 21 4 L 21 7 C 19 9, 17 7, 17 5" 
            fill={primaryColor}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.3"
          />
          <path 
            d="M 25 5 C 25 3, 23 2, 21 4 L 21 7 C 23 9, 25 7, 25 5" 
            fill={primaryColor}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.3"
          />
        </svg>
      )
      
    case "round-glasses":
      return (
        <svg width="26" height="10" viewBox="0 0 26 10" style={{ display: "block" }}>
          <circle 
            cx="5" cy="5" r="4" 
            fill="none" 
            stroke="#333" 
            strokeWidth="1.2"
            style={{ filter: "drop-shadow(0.5px 0.5px 0 rgba(0,0,0,0.08))" }}
          />
          <circle 
            cx="21" cy="5" r="4" 
            fill="none" 
            stroke="#333" 
            strokeWidth="1.2"
          />
          <line x1="9" y1="5" x2="17" y2="5" stroke="#333" strokeWidth="1" />
        </svg>
      )
      
    case "mustache":
      return (
        <svg width="20" height="7" viewBox="0 0 20 7" style={{ display: "block" }}>
          <path 
            d="M 0 4 Q 4 0, 6 3 Q 10 5, 10 3 Q 10 5, 14 3 Q 16 0, 20 4" 
            fill="#5D4037"
            style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.12))" }}
          />
        </svg>
      )
      
    case "blush":
      return null
      
    case "bowtie":
      return (
        <svg width="20" height="10" viewBox="0 0 20 10" style={{ display: "block" }}>
          <ellipse 
            cx="5" cy="5" rx="4" ry="3" 
            fill={primaryColor}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.3"
            style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.1))" }}
          />
          <ellipse 
            cx="15" cy="5" rx="4" ry="3" 
            fill={primaryColor}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.3"
          />
          <circle cx="10" cy="5" r="2" fill="#6B2737" />
        </svg>
      )
      
    case "monocle":
      return (
        <svg width="16" height="20" viewBox="0 0 16 20" style={{ display: "block" }}>
          <circle 
            cx="8" cy="8" r="6" 
            fill="none" 
            stroke="#8B7355" 
            strokeWidth="1.5"
            style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.1))" }}
          />
          <circle cx="8" cy="8" r="4" fill="rgba(200,220,255,0.08)" />
          <line x1="8" y1="14" x2="8" y2="20" stroke="#8B7355" strokeWidth="1" />
        </svg>
      )
      
    case "party-hat":
      return (
        <svg width="24" height="28" viewBox="0 0 24 28" style={{ display: "block" }}>
          <path 
            d="M 3 28 L 12 0 L 21 28 Z" 
            fill={primaryColor}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.1))" }}
          />
          <circle cx="12" cy="0" r="2.5" fill="#FFD700" />
          {[6, 14, 22].map((y, i) => (
            <circle 
              key={i}
              cx={3 + (y / 28) * 18}
              cy={28 - y}
              r="1.5"
              fill={i % 2 === 0 ? "#4CAF50" : "#2196F3"}
            />
          ))}
        </svg>
      )
      
    case "flower":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: "block" }}>
          {[0, 60, 120, 180, 240, 300].map((rot, i) => (
            <ellipse
              key={i}
              cx={7 + Math.cos((rot * Math.PI) / 180) * 3}
              cy={7 + Math.sin((rot * Math.PI) / 180) * 3}
              rx="3"
              ry="2"
              fill="#FFB5BA"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="0.3"
              transform={`rotate(${rot} 7 7)`}
            />
          ))}
          <circle cx="7" cy="7" r="2.5" fill="#FFD700" />
        </svg>
      )
      
    default:
      return null
  }
}

export function BlushMarks({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <>
      <div
        className={cn("absolute", className)}
        style={{ 
          ...style, 
          width: 5,
          height: 2.5,
          borderRadius: "50%",
          background: "#FFB5BA",
          left: "4px",
          boxShadow: "1px 1px 0 rgba(0,0,0,0.08)",
          border: "0.5px solid rgba(180,100,110,0.15)",
        }}
      />
      <div
        className={cn("absolute", className)}
        style={{ 
          ...style, 
          width: 5,
          height: 2.5,
          borderRadius: "50%",
          background: "#FFB5BA",
          right: "4px",
          boxShadow: "1px 1px 0 rgba(0,0,0,0.08)",
          border: "0.5px solid rgba(180,100,110,0.15)",
        }}
      />
    </>
  )
}

export const accessoryPositions: Record<AccessoryType, { top: string; left: string; transform?: string }> = {
  "top-hat": { top: "-28px", left: "50%", transform: "translateX(-50%)" },
  "bow": { top: "-12px", left: "50%", transform: "translateX(-50%)" },
  "flower-crown": { top: "-14px", left: "50%", transform: "translateX(-50%)" },
  "cat-ears": { top: "-16px", left: "50%", transform: "translateX(-50%)" },
  "crown": { top: "-18px", left: "50%", transform: "translateX(-50%)" },
  "beanie": { top: "-20px", left: "50%", transform: "translateX(-50%)" },
  "heart-glasses": { top: "10px", left: "50%", transform: "translateX(-50%)" },
  "round-glasses": { top: "10px", left: "50%", transform: "translateX(-50%)" },
  "mustache": { top: "20px", left: "50%", transform: "translateX(-50%)" },
  "blush": { top: "16px", left: "50%", transform: "translateX(-50%)" },
  "bowtie": { top: "32px", left: "50%", transform: "translateX(-50%)" },
  "monocle": { top: "6px", left: "50%", transform: "translateX(-50%)" },
  "party-hat": { top: "-30px", left: "50%", transform: "translateX(-50%)" },
  "flower": { top: "-6px", left: "50%", transform: "translateX(-50%)" },
}
