"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import * as React from "react"
import { FingerPuppets, AccessoryType, Mood } from "@/components/FingerPuppets"
import { Button } from "@/components/ui/button"
import type { GeneratedPoem, WizardState, Trait, Vibe, Relationship } from "@/lib/valentino"
import { encodeJsonParam, decodeJsonParam } from "@/lib/encoding"
import { useAI } from "@/lib/use-ai"
import { TheaterStage, StageFloor, ScriptSeal } from "@/components/theater"
import { useResponsiveLayout, useHapticFeedback } from "@/hooks/useDeviceCapabilities"
import { traitStickers } from "@/components/theater/scenes/TraitScene"

type ShareData = WizardState & GeneratedPoem

const moodByVibe: Record<Vibe, Mood> = {
  Sweet: "happy",
  Funny: "excited",
  Deep: "thinking",
  Confession: "shy"
}

export function PoemClient({ dataParam }: { dataParam?: string }) {
  const router = useRouter()
  const { puppetScale } = useResponsiveLayout()
  const { triggerHaptic } = useHapticFeedback()
  const [shareOpen, setShareOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [revealed, setRevealed] = React.useState(false)
  const [hoveredLine, setHoveredLine] = React.useState<number | null>(null)
  const [isCopying, setIsCopying] = React.useState(false)

  const initial = React.useMemo(() => {
    if (!dataParam) return null
    return decodeJsonParam<ShareData>(dataParam)
  }, [dataParam])

  const [data, setData] = React.useState<ShareData | null>(initial)

  React.useEffect(() => {
    setData(initial)
  }, [initial])

  React.useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const { complete, isLoading, setCompletion } = useAI({ api: "/api/poem" })

  const valAccessories = React.useMemo(() => {
    if (!data?.traits) return ["bow"] as AccessoryType[]
    const accessories: AccessoryType[] = ["bow"]
    data.traits.forEach(trait => {
      const sticker = traitStickers[trait]
      if (sticker && !accessories.includes(sticker)) {
        accessories.push(sticker)
      }
    })
    return accessories.slice(0, 4)
  }, [data?.traits])

  const currentMood = React.useMemo(() => {
    if (isLoading) return "typing"
    if (copied || isCopying) return "excited"
    if (hoveredLine !== null) return "happy"
    return data?.vibe ? moodByVibe[data.vibe] : "happy"
  }, [isLoading, copied, isCopying, hoveredLine, data?.vibe])

  const shareUrl = React.useMemo(() => {
    if (!data) return ""
    const encoded = encodeJsonParam(data)
    if (typeof window === "undefined") return `/poem?data=${encoded}`
    return `${window.location.origin}/poem?data=${encoded}`
  }, [data])

  async function copyPoem() {
    if (!data) return
    setIsCopying(true)
    triggerHaptic(20)
    try {
      await navigator.clipboard.writeText(data.poem)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setIsCopying(false)
      }, 1500)
    } catch {
      setIsCopying(false)
    }
  }

  async function remix() {
    if (!data) return
    if (!data.relationship || !data.vibe) return

    triggerHaptic(15)
    setCompletion("")
    const nextText = await complete("", {
      body: {
        nickname: data.nickname,
        relationship: data.relationship,
        traits: data.traits,
        vibe: data.vibe
      }
    })

    if (!nextText) return
    const parsed = safeParseJson<GeneratedPoem>(nextText)
    if (!parsed) return

    const nextData: ShareData = { ...data, title: parsed.title, poem: parsed.poem }
    setData(nextData)
    router.replace(`/poem?data=${encodeJsonParam(nextData)}`)
  }

  if (!data) {
    return (
      <TheaterStage step={0}>
        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="rounded-2xl border border-[#E63946]/10 bg-white/80 p-6 shadow-lg">
            <h1 className="mb-4 font-['Fredoka',system-ui,sans-serif] text-2xl font-bold text-[#E63946]">
              No poem found
            </h1>
            <p className="mb-4 text-[#6B2737]">
              This link may be incomplete. Poems exist only in the URL and your browser state.
            </p>
            <Button asChild className="bg-[#E63946] hover:bg-[#C41E3A]">
              <Link href="/wizard">Create a poem</Link>
            </Button>
          </div>
        </div>
      </TheaterStage>
    )
  }

  const nicknameLabel = data.nickname.trim().length > 0 ? data.nickname.trim() : "someone"
  const poemLines = data.poem.split("\n").filter(line => line.trim())

  return (
    <TheaterStage step={0} vibe={data.vibe} isTransitioning={isLoading}>
      <StageFloor />

      {isLoading && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#FDF6F0]/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <div style={{ transform: `scale(${puppetScale})` }}>
              <FingerPuppets isTyping mood="typing" valAccessories={valAccessories} tinoAccessories={["top-hat"]} />
            </div>
            <p className="mt-4 font-['Fredoka',system-ui,sans-serif] text-lg text-[#E63946]">
              Val & Tino are writing...
            </p>
          </div>
        </motion.div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 py-8">
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="font-['Fredoka',system-ui,sans-serif] text-3xl font-bold text-[#E63946] sm:text-4xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            For {nicknameLabel}
          </motion.h1>
          <motion.p
            className="mt-1 text-sm text-[#6B2737] opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.4 }}
          >
            {data.title}
          </motion.p>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-2xl border border-[#E63946]/10 bg-white/90 p-6 sm:p-8 shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="font-serif text-base sm:text-lg leading-relaxed text-[#6B2737]">
            {poemLines.map((line, i) => (
              <motion.p
                key={i}
                className="mb-2 cursor-default"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={revealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ 
                  delay: 0.5 + i * 0.08, 
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ 
                  scale: 1.01, 
                  color: "#E63946",
                  x: 3,
                  transition: { duration: 0.2 }
                }}
                onHoverStart={() => setHoveredLine(i)}
                onHoverEnd={() => setHoveredLine(null)}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + poemLines.length * 0.08 }}
          >
            <Button 
              type="button" 
              onClick={copyPoem} 
              className="w-full bg-[#E63946] hover:bg-[#C41E3A] sm:w-auto"
            >
              {copied ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    ✓
                  </motion.span>
                  Copied!
                </motion.span>
              ) : "Copy Poem"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShareOpen(true)
                triggerHaptic(10)
              }}
              className="w-full border-[#E63946] text-[#E63946] hover:bg-[#E63946]/10 sm:w-auto"
            >
              Share Link
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={remix} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Writing..." : "Remix"}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ transform: `scale(${puppetScale})` }}
        >
          <FingerPuppets
            valAccessories={valAccessories}
            tinoAccessories={["top-hat"]}
            mood={currentMood}
            pose={copied ? "celebrating" : "default"}
          />
        </motion.div>

        {copied && (
          <motion.div
            className="flex justify-center mt-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <ScriptSeal text="Shared with love" />
          </motion.div>
        )}
      </div>

      <motion.div
        className="fixed bottom-4 left-4 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Button
          asChild
          variant="ghost"
          className="rounded-xl border border-[#E63946]/20 bg-white/80 px-4 shadow-lg backdrop-blur-sm hover:bg-white"
        >
          <Link href="/wizard">Start Over</Link>
        </Button>
      </motion.div>

      <AnimatePresence>
        {shareOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="mb-4 font-['Fredoka',system-ui,sans-serif] text-xl font-bold text-[#E63946]">
                Share this poem
              </h2>
              <div className="mb-4 break-all rounded-lg bg-[#FDF6F0] p-3 text-sm text-[#6B2737]">
                {shareUrl}
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[#E63946] hover:bg-[#C41E3A]"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl)
                    triggerHaptic(15)
                    setCopied(true)
                    setTimeout(() => setShareOpen(false), 500)
                  }}
                >
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  className="border-[#E63946] text-[#E63946]"
                  onClick={() => setShareOpen(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TheaterStage>
  )
}

function safeParseJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}
