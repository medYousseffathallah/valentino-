"use client"

import * as React from "react"

type LookAtTarget = 
  | "cursor" 
  | "center" 
  | "each-other" 
  | "user"
  | { x: number; y: number }

interface TargetTrackingResult {
  lookX: number
  lookY: number
  isTracking: boolean
}

export function useTargetTracking(
  puppetRef: React.RefObject<HTMLElement | null>,
  target: LookAtTarget = "cursor",
  enabled: boolean = true
): TargetTrackingResult {
  const [lookX, setLookX] = React.useState(0)
  const [lookY, setLookY] = React.useState(0)
  const [isTracking, setIsTracking] = React.useState(false)
  
  const targetRef = React.useRef({ x: 0, y: 0 })
  const currentRef = React.useRef({ x: 0, y: 0 })
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!enabled) {
      setIsTracking(false)
      return
    }

    const updateFromCursor = (e: MouseEvent) => {
      if (!puppetRef.current) return
      
      const rect = puppetRef.current.getBoundingClientRect()
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
      setIsTracking(true)
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animateToTarget)
      }
    }

    const updateFromTouch = (e: TouchEvent) => {
      if (!puppetRef.current || e.touches.length === 0) return
      
      const touch = e.touches[0]
      const rect = puppetRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const x = touch.clientX - centerX
      const y = touch.clientY - centerY
      
      const angle = Math.atan2(y, x)
      const distance = Math.min(5, Math.hypot(x, y) / 25)
      
      targetRef.current = {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      }
      setIsTracking(true)
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animateToTarget)
      }
    }

    const updateFromCoordinates = (coords: { x: number; y: number }) => {
      targetRef.current = coords
      setIsTracking(true)
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animateToTarget)
      }
    }

    const animateToTarget = () => {
      const lerp = 0.12
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp
      
      setLookX(currentRef.current.x)
      setLookY(currentRef.current.y)
      
      const threshold = 0.05
      if (
        Math.abs(targetRef.current.x - currentRef.current.x) > threshold ||
        Math.abs(targetRef.current.y - currentRef.current.y) > threshold
      ) {
        rafRef.current = requestAnimationFrame(animateToTarget)
      } else {
        rafRef.current = null
      }
    }

    if (target === "cursor") {
      window.addEventListener("mousemove", updateFromCursor, { passive: true })
      window.addEventListener("touchmove", updateFromTouch, { passive: true })
      
      return () => {
        window.removeEventListener("mousemove", updateFromCursor)
        window.removeEventListener("touchmove", updateFromTouch)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      }
    } else if (target === "center") {
      targetRef.current = { x: 0, y: 0 }
      setIsTracking(true)
    } else if (target === "each-other") {
      targetRef.current = { x: 3, y: 0 }
      setIsTracking(true)
    } else if (target === "user") {
      targetRef.current = { x: 0, y: -2 }
      setIsTracking(true)
    } else if (typeof target === "object") {
      updateFromCoordinates(target)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, target, puppetRef])

  return { lookX, lookY, isTracking }
}

export function useElementTracking(
  puppetRef: React.RefObject<HTMLElement | null>,
  targetElementRef: React.RefObject<HTMLElement | null>,
  enabled: boolean = true
): TargetTrackingResult {
  const [lookX, setLookX] = React.useState(0)
  const [lookY, setLookY] = React.useState(0)
  const [isTracking, setIsTracking] = React.useState(false)
  
  const targetRef = React.useRef({ x: 0, y: 0 })
  const currentRef = React.useRef({ x: 0, y: 0 })
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!enabled || !puppetRef.current || !targetElementRef.current) {
      setIsTracking(false)
      return
    }

    const updateTarget = () => {
      if (!puppetRef.current || !targetElementRef.current) return
      
      const puppetRect = puppetRef.current.getBoundingClientRect()
      const targetRect = targetElementRef.current.getBoundingClientRect()
      
      const puppetCenterX = puppetRect.left + puppetRect.width / 2
      const puppetCenterY = puppetRect.top + puppetRect.height / 2
      const targetCenterX = targetRect.left + targetRect.width / 2
      const targetCenterY = targetRect.top + targetRect.height / 2
      
      const x = targetCenterX - puppetCenterX
      const y = targetCenterY - puppetCenterY
      
      const angle = Math.atan2(y, x)
      const distance = Math.min(5, Math.hypot(x, y) / 30)
      
      targetRef.current = {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      }
      setIsTracking(true)
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animateToTarget)
      }
    }

    const animateToTarget = () => {
      const lerp = 0.1
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp
      
      setLookX(currentRef.current.x)
      setLookY(currentRef.current.y)
      
      const threshold = 0.05
      if (
        Math.abs(targetRef.current.x - currentRef.current.x) > threshold ||
        Math.abs(targetRef.current.y - currentRef.current.y) > threshold
      ) {
        rafRef.current = requestAnimationFrame(animateToTarget)
      } else {
        rafRef.current = null
      }
    }

    updateTarget()

    const handleResize = () => updateTarget()
    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleResize, { passive: true })

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, puppetRef, targetElementRef])

  return { lookX, lookY, isTracking }
}
