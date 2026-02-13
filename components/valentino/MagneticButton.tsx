"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button, ButtonProps } from "@/components/ui/button"

interface MagneticButtonProps extends ButtonProps {
  attractionRadius?: number
  maxTilt?: number
}

export function MagneticButton({ 
  children, 
  attractionRadius = 50, 
  maxTilt = 15, 
  ...props 
}: MagneticButtonProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      if (distance < attractionRadius) {
        const intensity = 1 - distance / attractionRadius
        const tiltX = (deltaY / rect.height) * maxTilt * intensity
        const tiltY = -(deltaX / rect.width) * maxTilt * intensity
        setTilt({ x: tiltX, y: tiltY })
      } else {
        setTilt({ x: 0, y: 0 })
      }
    }

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [attractionRadius, maxTilt])

  return (
    <motion.div
      style={{
        perspective: 1000,
      }}
    >
      <motion.button
        ref={buttonRef}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button 
          {...props}
          className={`relative z-10 ${props.className}`}
        >
          {children}
        </Button>
        <motion.div
          className="absolute -inset-0.5 bg-rose-200 rounded-lg blur-sm"
          style={{
            transform: `translateZ(-1px)`,
            opacity: tilt.x !== 0 || tilt.y !== 0 ? 0.5 : 0,
          }}
          animate={{
            scale: tilt.x !== 0 || tilt.y !== 0 ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    </motion.div>
  )
}
