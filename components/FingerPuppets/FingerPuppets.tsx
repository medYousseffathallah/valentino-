"use client"

import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useEyeTracking"
import { 
  FingerCharacter, 
  AccessoryType, 
  Mood,
  CharacterController,
  CharacterEntrance,
  GeneratingCharacters,
  CelebrationCharacters,
  HeartParticles,
  SparkleField,
  ConfettiBurst,
  Pose
} from "@/components/characters"

export { FingerCharacter } from "@/components/characters"
export type { AccessoryType, Mood } from "@/components/characters"
export type { Pose } from "@/components/characters"

interface FingerPuppetsProps {
  valAccessories?: AccessoryType[]
  tinoAccessories?: AccessoryType[]
  mood?: Mood
  pose?: Pose
  isTyping?: boolean
  showHeart?: boolean
  className?: string
}

const springConfig = {
  type: "spring" as const,
  stiffness: 400,
  damping: 15,
}

export function FingerPuppets({
  valAccessories = [],
  tinoAccessories = [],
  mood = "happy",
  pose = "default",
  isTyping = false,
  showHeart = true,
  className,
}: FingerPuppetsProps) {
  return (
    <CharacterController
      valAccessories={valAccessories}
      tinoAccessories={tinoAccessories}
      mood={mood}
      pose={pose}
      isTyping={isTyping}
      showHeart={showHeart}
      className={className}
    />
  )
}

export function FingerPuppetsPeeking({
  className,
  onReveal,
}: {
  className?: string
  onReveal?: () => void
}) {
  const [revealed, setRevealed] = React.useState(false)
  const reducedMotion = useReducedMotion()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true)
      onReveal?.()
    }, reducedMotion ? 0 : 500)
    return () => clearTimeout(timer)
  }, [onReveal, reducedMotion])

  return (
    <CharacterEntrance
      className={className}
      delay={0}
      onComplete={onReveal}
    >
      <FingerPuppets 
        showHeart={revealed} 
        valAccessories={["bow"]}
        tinoAccessories={["top-hat"]}
      />
    </CharacterEntrance>
  )
}

export function FingerPuppetsWithEffects({
  valAccessories = [],
  tinoAccessories = [],
  mood = "happy",
  pose = "default",
  showHeart = true,
  showParticles = false,
  showSparkles = false,
  className,
}: FingerPuppetsProps & {
  showParticles?: boolean
  showSparkles?: boolean
}) {
  return (
    <div className={cn("relative", className)}>
      {showParticles && <HeartParticles count={8} />}
      {showSparkles && <SparkleField count={15} />}
      <FingerPuppets
        valAccessories={valAccessories}
        tinoAccessories={tinoAccessories}
        mood={mood}
        pose={pose}
        showHeart={showHeart}
      />
    </div>
  )
}

export function FingerPuppetsLanding({
  onCreateClick,
  onLuckyClick,
  className,
}: {
  onCreateClick?: () => void
  onLuckyClick?: () => void
  className?: string
}) {
  const [showConfetti, setShowConfetti] = React.useState(false)
  const [currentPose, setCurrentPose] = React.useState<Pose>("default")
  
  const handleHighFive = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1000)
    onLuckyClick?.()
  }
  
  return (
    <div className={cn("relative", className)}>
      <ConfettiBurst active={showConfetti} />
      <HeartParticles count={5} />
      
      <CharacterController
        valAccessories={["bow"]}
        tinoAccessories={["top-hat"]}
        mood="happy"
        pose={currentPose}
        showHeart={true}
        onHighFive={handleHighFive}
      />
    </div>
  )
}

export function FingerPuppetsGenerating({
  progress = 0,
  className,
}: {
  progress?: number
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <GeneratingCharacters progress={progress} />
      <HeartParticles count={3} />
    </div>
  )
}

export function FingerPuppetsCelebration({
  className,
}: {
  className?: string
}) {
  const [showConfetti, setShowConfetti] = React.useState(false)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 200)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className={cn("relative", className)}>
      <ConfettiBurst active={showConfetti} />
      <CelebrationCharacters />
    </div>
  )
}

export function FingerPuppetsWizard({
  step,
  valAccessories = [],
  tinoAccessories = ["top-hat"],
  relationship,
  vibe,
  isTyping = false,
  className,
}: {
  step: number
  valAccessories?: AccessoryType[]
  tinoAccessories?: AccessoryType[]
  relationship?: "Partner" | "Crush" | "Friend" | "Family" | null
  vibe?: "Sweet" | "Funny" | "Deep" | "Confession" | null
  isTyping?: boolean
  className?: string
}) {
  const poseByRelationship: Record<string, Pose> = {
    Partner: "holding-hands",
    Crush: "peeking",
    Friend: "fist-bump",
    Family: "default",
  }
  
  const moodByVibe: Record<string, Mood> = {
    Sweet: "happy",
    Funny: "excited",
    Deep: "thinking",
    Confession: "shy",
  }
  
  const currentPose = relationship ? poseByRelationship[relationship] || "default" : "default"
  const currentMood = vibe ? moodByVibe[vibe] || "happy" : "happy"
  
  return (
    <div className={cn("relative", className)}>
      <CharacterController
        valAccessories={["bow", ...valAccessories]}
        tinoAccessories={tinoAccessories}
        mood={isTyping ? "typing" : currentMood}
        pose={currentPose}
        isTyping={isTyping}
        showHeart={!isTyping}
      />
    </div>
  )
}
