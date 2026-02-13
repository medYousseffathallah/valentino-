"use client"

import * as React from "react"

interface DeviceCapabilities {
  isTouchDevice: boolean
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  prefersReducedMotion: boolean
  supportsHaptic: boolean
  screenWidth: number
  screenHeight: number
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = React.useState<DeviceCapabilities>({
    isTouchDevice: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    prefersReducedMotion: false,
    supportsHaptic: false,
    screenWidth: 1024,
    screenHeight: 768,
  })

  React.useEffect(() => {
    const checkCapabilities = () => {
      const isTouchDevice = 
        "ontouchstart" in window || 
        navigator.maxTouchPoints > 0
      
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      const isMobile = screenWidth < 768
      const isTablet = screenWidth >= 768 && screenWidth < 1024
      const isDesktop = screenWidth >= 1024
      
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      const prefersReducedMotion = motionQuery.matches
      
      const supportsHaptic = "vibrate" in navigator

      setCapabilities({
        isTouchDevice,
        isMobile,
        isTablet,
        isDesktop,
        prefersReducedMotion,
        supportsHaptic,
        screenWidth,
        screenHeight,
      })
    }

    checkCapabilities()

    const handleResize = () => checkCapabilities()
    window.addEventListener("resize", handleResize)

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setCapabilities(prev => ({ ...prev, prefersReducedMotion: e.matches }))
    }
    motionQuery.addEventListener("change", handleMotionChange)

    return () => {
      window.removeEventListener("resize", handleResize)
      motionQuery.removeEventListener("change", handleMotionChange)
    }
  }, [])

  return capabilities
}

export function useHapticFeedback() {
  const { supportsHaptic, prefersReducedMotion } = useDeviceCapabilities()

  const triggerHaptic = React.useCallback((duration: number = 10) => {
    if (supportsHaptic && !prefersReducedMotion) {
      try {
        navigator.vibrate(duration)
      } catch {
        // Vibration not supported or blocked
      }
    }
  }, [supportsHaptic, prefersReducedMotion])

  return { triggerHaptic, isSupported: supportsHaptic }
}

export function useResponsiveLayout() {
  const { isMobile, isTablet, isDesktop, screenWidth } = useDeviceCapabilities()

  const puppetScale = React.useMemo(() => {
    if (isMobile) return 0.65
    if (isTablet) return 0.8
    return 1
  }, [isMobile, isTablet])

  const layoutDirection = React.useMemo(() => {
    if (isMobile) return "vertical"
    return "horizontal"
  }, [isMobile])

  const particleCount = React.useMemo(() => {
    if (isMobile) return 5
    if (isTablet) return 10
    return 15
  }, [isMobile, isTablet])

  return {
    puppetScale,
    layoutDirection,
    particleCount,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
  }
}
