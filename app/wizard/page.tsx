"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { FingerPuppets, AccessoryType, Mood, Pose } from "@/components/FingerPuppets"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  RELATIONSHIPS,
  VIBES,
  type GeneratedPoem,
  type Relationship,
  type Trait,
  type Vibe,
  type WizardState
} from "@/lib/valentino"
import { encodeJsonParam } from "@/lib/encoding"
import { usePoem } from "@/lib/use-poem"
import { cn } from "@/lib/utils"
import { 
  TheaterStage, 
  StageFloor, 
  StageBacklight,
  RelationshipScene,
  TraitScene,
  VibeScene,
  traitStickers,
  MarionetteStage,
  StageShelf,
  WhisperInput,
  FloatingToken,
  ThreadOfFate
} from "@/components/theater"
import { useResponsiveLayout, useHapticFeedback } from "@/hooks/useDeviceCapabilities"
import { CharacterController } from "@/components/characters"
import { createHeartBurst } from "@/lib/animations"

type ShareData = WizardState & GeneratedPoem

const TOTAL_STEPS = 3

const moodByVibe: Record<Vibe, Mood> = {
  Sweet: "happy",
  Funny: "excited",
  Deep: "thinking",
  Confession: "shy"
}

const poseByRelationship: Record<Relationship, Pose> = {
  Partner: "holding-hands",
  Crush: "peeking",
  Friend: "fist-bump",
  Family: "default"
}

function WizardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lucky = searchParams.get("lucky") === "1"
  const { puppetScale } = useResponsiveLayout()
  const { triggerHaptic } = useHapticFeedback()

  const [step, setStep] = React.useState(0)
  const [direction, setDirection] = React.useState<1 | -1>(1)
  const [state, setState] = React.useState<WizardState>({
    nickname: "",
    relationship: null,
    traits: [],
    vibe: null
  })
  const [fieldError, setFieldError] = React.useState<string | null>(null)
  const [valAccessories, setValAccessories] = React.useState<AccessoryType[]>(["bow"])
  const [tinoAccessories] = React.useState<AccessoryType[]>(["top-hat"])
  const [hoverPose, setHoverPose] = React.useState<Pose | null>(null)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [isInputActive, setIsInputActive] = React.useState(false)
  const [showConfetti, setShowConfetti] = React.useState(false)
  const confettiRef = React.useRef<HTMLDivElement>(null)

  const { generate: generatePoem, isLoading, error: poemError } = usePoem()

  const progressValue = Math.round(((step + 1) / TOTAL_STEPS) * 100)
  const threadProgress = step === 0 
    ? (state.nickname ? 0.3 : 0) + (state.relationship ? 0.7 : 0)
    : step === 1 
      ? 0.5 + (state.traits.length / 3) * 0.5
      : state.vibe ? 1 : 0.7

  React.useEffect(() => {
    if (!lucky) return
    const relationship = RELATIONSHIPS[Math.floor(Math.random() * RELATIONSHIPS.length)]?.key ?? "Friend"
    const vibe = VIBES[Math.floor(Math.random() * VIBES.length)]?.key ?? "Sweet"
    const shuffledTraits = shuffle<Trait>(["Funny", "Kind", "Chaotic", "Creative", "Calm", "Brave", "Weird", "Caring"])
    setState({
      nickname: "",
      relationship,
      traits: shuffledTraits.slice(0, 3),
      vibe
    })
  }, [lucky])

  React.useEffect(() => {
    const newAccessories: AccessoryType[] = ["bow"]
    state.traits.forEach(trait => {
      const sticker = traitStickers[trait]
      if (sticker && !newAccessories.includes(sticker)) {
        newAccessories.push(sticker)
      }
    })
    setValAccessories(newAccessories.slice(0, 4))
  }, [state.traits])

  async function generate() {
    setFieldError(null)
    if (!state.relationship) {
      setFieldError("Choose a relationship.")
      setStepWithDirection(0)
      return
    }
    if (state.traits.length === 0) {
      setFieldError("Pick at least one trait.")
      setStepWithDirection(1)
      return
    }
    if (!state.vibe) {
      setFieldError("Choose a vibe.")
      setStepWithDirection(2)
      return
    }

    const result = await generatePoem({
      nickname: state.nickname.trim(),
      relationship: state.relationship,
      traits: state.traits,
      vibe: state.vibe
    })

    if (!result) {
      setFieldError("Something went wrong generating the poem. Try again.")
      return
    }

    const data: ShareData = {
      ...state,
      relationship: state.relationship,
      vibe: state.vibe,
      title: result.title,
      poem: result.poem
    }

    router.push(`/poem?data=${encodeJsonParam(data)}`)
  }

  function setStepWithDirection(nextStep: number) {
    setDirection(nextStep >= step ? 1 : -1)
    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), 400)
    setStep(nextStep)
    triggerHaptic(15)
  }

  function next() {
    setFieldError(null)
    setStepWithDirection(Math.min(TOTAL_STEPS - 1, step + 1))
  }

  function back() {
    setFieldError(null)
    setStepWithDirection(Math.max(0, step - 1))
  }

  function handleRelationshipSelect(relationship: Relationship) {
    setState(s => ({ ...s, relationship }))
    triggerHaptic(20)
    
    if (confettiRef.current) {
      setShowConfetti(true)
      createHeartBurst(confettiRef.current, 15)
      setTimeout(() => setShowConfetti(false), 1000)
    }
  }

  function handleRelationshipHover(relationship: Relationship | null) {
    if (relationship) {
      setHoverPose(poseByRelationship[relationship])
    } else {
      setHoverPose(null)
    }
  }

  const currentPose = state.relationship ? poseByRelationship[state.relationship] : "default"
  const currentMood = state.vibe ? moodByVibe[state.vibe] : "happy"
  const activePose = hoverPose || currentPose

  const stepTitle = ["Who is it for?", "What are they like?", "What's the vibe?"][step]

  if (step === 0) {
    return (
      <MarionetteStage className="min-h-screen">
        <div className="relative z-10 flex flex-col min-h-screen">
          <motion.div
            className="flex items-center justify-between p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="font-['Fredoka',system-ui,sans-serif] text-2xl font-bold text-[#E63946]">
                Valentino
              </h1>
              <p className="text-sm text-[#6B2737] opacity-70">Step 1 of {TOTAL_STEPS}</p>
            </div>
            <ThreadOfFate 
              progress={threadProgress} 
              className="w-24 h-6"
            />
          </motion.div>

          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
            <div 
              ref={confettiRef}
              className="relative mb-8"
            >
              <StageShelf>
                <CharacterController
                  valAccessories={valAccessories}
                  tinoAccessories={tinoAccessories}
                  mood={isLoading ? "typing" : currentMood}
                  pose={activePose}
                  isTyping={isLoading}
                  size="theater"
                  scale={puppetScale}
                  lookAt="each-other"
                />
              </StageShelf>
            </div>

            <div className="relative mb-6" style={{ marginTop: "-40px" }}>
              <WhisperInput
                value={state.nickname}
                onChange={(n) => setState(s => ({ ...s, nickname: n }))}
                placeholder="Their nickname..."
                isActive={isInputActive}
                onActiveChange={setIsInputActive}
              />
            </div>

            <motion.div
              className="w-full max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-center text-sm text-[#6B2737] opacity-70 mb-4">
                What&apos;s your connection?
              </p>
              
              <FloatingToken
                selectedRelationship={state.relationship}
                onRelationshipSelect={handleRelationshipSelect}
                onHoverChange={handleRelationshipHover}
                className="h-64"
              />
            </motion.div>

            {(fieldError || poemError) && (
              <motion.div
                className="mt-4 rounded-xl border border-[#E63946]/30 bg-[#E63946]/10 p-3 text-center text-sm text-[#E63946]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {fieldError || String(poemError)}
              </motion.div>
            )}

            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="button"
                onClick={next}
                disabled={isLoading || !state.relationship}
                className="bg-[#E63946] hover:bg-[#C41E3A] px-8 py-6 text-lg rounded-2xl shadow-lg"
              >
                Next
              </Button>
            </motion.div>

            <motion.p
              className="mt-6 text-center text-xs text-[#6B2737] opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.6 }}
            >
              No accounts. No storage. Everything lives in your browser.
            </motion.p>
          </div>
        </div>
      </MarionetteStage>
    )
  }

  return (
    <TheaterStage
      step={step}
      vibe={state.vibe}
      isTransitioning={isTransitioning}
      className="min-h-screen"
    >
      <StageFloor />
      
      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 py-6">
        <motion.div
          className="mb-4 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="font-['Fredoka',system-ui,sans-serif] text-2xl font-bold text-[#E63946]">
              Valentino
            </h1>
            <p className="text-sm text-[#6B2737] opacity-70">Step {step + 1} of {TOTAL_STEPS}</p>
          </div>
          <Progress value={progressValue} className="w-28" />
        </motion.div>

        <motion.div 
          className="mb-6 flex justify-center"
          layout
          style={{ transform: `scale(${puppetScale})` }}
        >
          <FingerPuppets
            valAccessories={valAccessories}
            tinoAccessories={tinoAccessories}
            mood={isLoading ? "typing" : currentMood}
            pose={activePose}
            isTyping={isLoading}
          />
        </motion.div>

        <motion.div
          className="rounded-2xl border border-[#E63946]/10 bg-white/80 p-5 shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <StepContent key="step-1" direction={direction}>
                <StepTitle>{stepTitle}</StepTitle>
                <TraitScene
                  selected={state.traits}
                  onToggle={(trait) => {
                    const isSelected = state.traits.includes(trait)
                    setState(s => ({
                      ...s,
                      traits: isSelected 
                        ? s.traits.filter(t => t !== trait)
                        : s.traits.length < 3 
                          ? [...s.traits, trait]
                          : s.traits
                    }))
                  }}
                  maxTraits={3}
                />
              </StepContent>
            )}

            {step === 2 && (
              <StepContent key="step-2" direction={direction}>
                <StepTitle>{stepTitle}</StepTitle>
                <VibeScene
                  selected={state.vibe}
                  onSelect={(v) => setState(s => ({ ...s, vibe: v }))}
                />
              </StepContent>
            )}
          </AnimatePresence>

          {(fieldError || poemError) && (
            <motion.div
              className="mt-4 rounded-xl border border-[#E63946]/30 bg-[#E63946]/10 p-3 text-center text-sm text-[#E63946]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {fieldError || String(poemError)}
            </motion.div>
          )}

          <div className="mt-5 flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={step === 0 || isLoading}
              className="text-[#6B2737]"
            >
              Back
            </Button>

            {step < TOTAL_STEPS - 1 ? (
              <Button
                type="button"
                onClick={next}
                disabled={isLoading}
                className="bg-[#E63946] hover:bg-[#C41E3A]"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={generate}
                disabled={isLoading}
                className="bg-[#E63946] hover:bg-[#C41E3A]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ✨
                    </motion.span>
                    Writing...
                  </span>
                ) : (
                  "Generate"
                )}
              </Button>
            )}
          </div>
        </motion.div>

        <motion.p
          className="mt-4 text-center text-xs text-[#6B2737] opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
        >
          No accounts. No storage. Everything lives in your browser.
        </motion.p>
      </div>
    </TheaterStage>
  )
}

function StepContent({ 
  children, 
  direction 
}: { 
  children: React.ReactNode
  direction: 1 | -1
}) {
  return (
    <motion.div
      custom={direction}
      variants={{
        enter: (d: number) => ({
          x: d > 0 ? 100 : -100,
          opacity: 0,
        }),
        center: {
          x: 0,
          opacity: 1,
        },
        exit: (d: number) => ({
          x: d < 0 ? 100 : -100,
          opacity: 0,
        }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-center font-['Fredoka',system-ui,sans-serif] text-xl font-bold text-[#E63946]">
      {children}
    </h2>
  )
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = copy[i]
    copy[i] = copy[j] as T
    copy[j] = tmp as T
  }
  return copy
}

export default function WizardPage() {
  return (
    <React.Suspense fallback={
      <TheaterStage step={0}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-[#E63946]">Loading...</div>
        </div>
      </TheaterStage>
    }>
      <WizardContent />
    </React.Suspense>
  )
}
