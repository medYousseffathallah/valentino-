"use client"

import * as React from "react"

interface EyeTrackingResult {
  lookX: number
  lookY: number
  isTracking: boolean
  reducedMotion: boolean
}

export function useEyeTracking(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean = true
): EyeTrackingResult {
  const [lookX, setLookX] = React.useState(0)
  const [lookY, setLookY] = React.useState(0)
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const rafRef = React.useRef<number | null>(null)
  const targetRef = React.useRef({ x: 0, y: 0 })
  const currentRef = React.useRef({ x: 0, y: 0 })

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  React.useEffect(() => {
    if (!enabled || reducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const x = e.clientX - centerX
      const y = e.clientY - centerY
      
      const angle = Math.atan2(y, x)
      const distance = Math.min(5, Math.hypot(x, y) / 20)
      
      targetRef.current = {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      }

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updatePosition)
      }
    }

    const updatePosition = () => {
      const lerp = 0.15
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp
      
      setLookX(currentRef.current.x)
      setLookY(currentRef.current.y)
      
      const threshold = 0.01
      if (
        Math.abs(targetRef.current.x - currentRef.current.x) > threshold ||
        Math.abs(targetRef.current.y - currentRef.current.y) > threshold
      ) {
        rafRef.current = requestAnimationFrame(updatePosition)
      } else {
        rafRef.current = null
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [enabled, reducedMotion, containerRef])

  return {
    lookX,
    lookY,
    isTracking: enabled && !reducedMotion,
    reducedMotion
  }
}

export function useBlink(
  enabled: boolean = true,
  minInterval: number = 2000,
  maxInterval: number = 5000
): { isBlinking: boolean; triggerBlink: () => void } {
  const [isBlinking, setIsBlinking] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const reducedMotion = useReducedMotion()

  const scheduleBlink = React.useCallback(() => {
    if (!enabled || reducedMotion) return
    
    const delay = minInterval + Math.random() * (maxInterval - minInterval)
    timeoutRef.current = setTimeout(() => {
      setIsBlinking(true)
      setTimeout(() => {
        setIsBlinking(false)
        scheduleBlink()
      }, 150)
    }, delay)
  }, [enabled, minInterval, maxInterval, reducedMotion])

  const triggerBlink = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsBlinking(true)
    setTimeout(() => {
      setIsBlinking(false)
      scheduleBlink()
    }, 150)
  }, [scheduleBlink])

  React.useEffect(() => {
    scheduleBlink()
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [scheduleBlink])

  return { isBlinking, triggerBlink }
}

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  return reducedMotion
}

export function useBreathing(
  enabled: boolean = true,
  duration: number = 3000
): { scale: number } {
  const [scale, setScale] = React.useState(1)
  const rafRef = React.useRef<number | null>(null)
  const startTimeRef = React.useRef<number | null>(null)
  const reducedMotion = useReducedMotion()

  React.useEffect(() => {
    if (!enabled || reducedMotion) {
      setScale(1)
      return
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }
      
      const elapsed = timestamp - startTimeRef.current
      const progress = (elapsed % duration) / duration
      const sineValue = Math.sin(progress * Math.PI * 2)
      const newScale = 1 + sineValue * 0.02
      
      setScale(newScale)
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [enabled, duration, reducedMotion])

  return { scale }
}
