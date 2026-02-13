import * as React from "react"

import { cn } from "@/lib/utils"

type Props = {
  className?: string
  count?: number
}

export function HeartParticles({ className, count = 14 }: Props) {
  const hearts = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100
      const top = Math.random() * 100
      const delay = Math.random() * 6
      const duration = 8 + Math.random() * 6
      const size = 10 + Math.random() * 16
      const opacity = 0.12 + Math.random() * 0.18
      return { i, left, top, delay, duration, size, opacity }
    })
  }, [count])

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {hearts.map((h) => (
        <div
          key={h.i}
          className="absolute text-rose-400"
          style={{
            left: `${h.left}%`,
            top: `${h.top}%`,
            opacity: h.opacity,
            fontSize: `${h.size}px`,
            animation: `valentino-float ${h.duration}s ease-in-out ${h.delay}s infinite`
          }}
        >
          ♥
        </div>
      ))}
    </div>
  )
}

