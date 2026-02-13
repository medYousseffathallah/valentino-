"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"

interface ParticleFieldProps {
  count?: number
  className?: string
  emoji?: string
  sizeRange?: [number, number]
  durationRange?: [number, number]
}

interface Particle {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function ParticleField({
  count = 15,
  className,
  emoji = "❤️",
  sizeRange = [10, 24],
  durationRange = [3, 8],
}: ParticleFieldProps) {
  const reducedMotion = useReducedMotion()
  
  const particles = React.useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      duration: durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]),
      delay: Math.random() * durationRange[1],
      opacity: 0.3 + Math.random() * 0.4,
    }))
  }, [count, sizeRange, durationRange])

  if (reducedMotion) {
    return null
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--particle-opacity);
          }
          90% {
            opacity: var(--particle-opacity);
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            bottom: `-${particle.size}px`,
            fontSize: `${particle.size}px`,
            lineHeight: 1,
            opacity: particle.opacity,
            "--particle-opacity": particle.opacity,
            animation: `float-up ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          } as React.CSSProperties}
        >
          {emoji}
        </div>
      ))}
    </div>
  )
}

export function HeartParticles({
  count = 10,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <ParticleField
      count={count}
      className={className}
      emoji="❤️"
      sizeRange={[8, 20]}
      durationRange={[4, 10]}
    />
  )
}

export function StarParticles({
  count = 12,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <ParticleField
      count={count}
      className={className}
      emoji="✨"
      sizeRange={[10, 22]}
      durationRange={[3, 7]}
    />
  )
}

export function SparkleField({
  count = 20,
  className,
}: {
  count?: number
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  
  const sparkles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 1.5,
    }))
  }, [count])

  if (reducedMotion) {
    return null
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            animation: `sparkle ${sparkle.duration}s ease-in-out infinite`,
            animationDelay: `${sparkle.delay}s`,
            boxShadow: `0 0 ${sparkle.size * 2}px rgba(255,255,255,0.5)`,
          }}
        />
      ))}
    </div>
  )
}

export function ConfettiBurst({
  active = false,
  className,
}: {
  active?: boolean
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  
  if (!active || reducedMotion) {
    return null
  }

  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: ["#E63946", "#FFB5BA", "#FFD700", "#4CAF50", "#2196F3"][i % 5],
    x: 50,
    y: 50,
    angle: (i / 30) * 360,
    distance: 50 + Math.random() * 100,
    duration: 0.5 + Math.random() * 0.5,
  }))

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      {confetti.map((piece) => {
        const tx = Math.cos((piece.angle * Math.PI) / 180) * piece.distance
        const ty = Math.sin((piece.angle * Math.PI) / 180) * piece.distance - 50
        
        return (
          <div
            key={piece.id}
            className="absolute"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              width: 8,
              height: 8,
              backgroundColor: piece.color,
              borderRadius: "2px",
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
              animation: `confetti-fall ${piece.duration}s ease-out forwards`,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
}
