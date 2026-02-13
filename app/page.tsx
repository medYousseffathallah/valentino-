"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { FingerPuppets, FingerPuppetsPeeking } from "@/components/FingerPuppets"
import { HeartsBackground } from "@/components/PaperHeart"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const router = useRouter()
  const [showContent, setShowContent] = React.useState(false)
  const [isNavigating, setIsNavigating] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleCreatePoem = () => {
    setIsNavigating(true)
    router.push("/wizard")
  }

  const handleLuckyRandom = () => {
    setIsNavigating(true)
    router.push("/wizard?lucky=1")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FDF6F0]">
      {/* Paper texture overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating hearts background */}
      <HeartsBackground count={8} />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Finger puppets */}
        <motion.div
          className="mb-8"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2 
          }}
        >
          <FingerPuppetsPeeking />
        </motion.div>

        {/* Title */}
        <motion.div
          className="mb-4 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.8 
          }}
        >
          <h1 className="font-['Fredoka',system-ui,sans-serif] text-5xl font-bold tracking-tight text-[#E63946] sm:text-6xl md:text-7xl">
            {"Valentino".split("").map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 1 + i * 0.05,
                  type: "spring",
                  stiffness: 400,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: Math.random() * 10 - 5,
                  color: "#FFB5BA"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="mb-8 max-w-md text-center text-lg text-[#6B2737] opacity-80"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.16, 1, 0.3, 1],
            delay: 1.3 
          }}
        >
          Finger puppet poetry for the ones you love.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col gap-3 sm:flex-row"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.16, 1, 0.3, 1],
            delay: 1.5 
          }}
        >
          <MagneticButton
            onClick={handleCreatePoem}
            disabled={isNavigating}
            className="h-12 px-8 text-base font-medium"
          >
            Create Poem
          </MagneticButton>
          <MagneticButton
            variant="outline"
            onClick={handleLuckyRandom}
            disabled={isNavigating}
            className="h-12 px-8 text-base font-medium"
          >
            Lucky Random
          </MagneticButton>
        </motion.div>

        {/* Privacy link */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Link 
            className="text-sm text-[#6B2737] underline-offset-4 opacity-60 transition-opacity hover:opacity-100" 
            href="/privacy"
          >
            Privacy
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

function MagneticButton({ 
  children, 
  className,
  variant = "default",
  ...props 
}: { 
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline"
  disabled?: boolean
  onClick?: () => void
}) {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    
    const maxDistance = 50
    const magnetStrength = 0.3
    
    if (Math.abs(distanceX) < maxDistance && Math.abs(distanceY) < maxDistance) {
      setPosition({
        x: distanceX * magnetStrength,
        y: distanceY * magnetStrength
      })
    }
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        ref={buttonRef}
        variant={variant}
        className={cn(
          "rounded-full transition-all",
          variant === "default" && "bg-[#E63946] text-white hover:bg-[#C41E3A] shadow-lg shadow-[#E63946]/20",
          variant === "outline" && "border-2 border-[#E63946] text-[#E63946] hover:bg-[#E63946]/10",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}
