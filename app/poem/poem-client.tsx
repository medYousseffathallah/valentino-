"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
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

export function PoemClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { triggerHaptic } = useHapticFeedback()
  const [shareOpen, setShareOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [revealed, setRevealed] = React.useState(false)
  const [hoveredLine, setHoveredLine] = React.useState<number | null>(null)
  const [isCopying, setIsCopying] = React.useState(false)

  const dataParam = searchParams?.get('data')
  
  const initial = React.useMemo(() => {
    if (!dataParam) return null
    try {
      return decodeJsonParam<ShareData>(dataParam)
    } catch {
      return null
    }
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
    return accessories
  }, [data?.traits])

  const tinoAccessories = React.useMemo(() => {
    if (!data?.traits) return [] as AccessoryType[]
    const accessories: AccessoryType[] = []
    data.traits.forEach(trait => {
      const sticker = traitStickers[trait]
      if (sticker && !accessories.includes(sticker)) {
        accessories.push(sticker)
      }
    })
    return accessories
  }, [data?.traits])

  const mood = data?.vibe ? moodByVibe[data.vibe] : "happy"

  const lines = React.useMemo(() => {
    return data?.poem?.split("\n").filter(line => line.trim().length > 0) || []
  }, [data?.poem])

  const shareUrl = React.useMemo(() => {
    if (typeof window === "undefined" || !data) return ""
    const encoded = encodeJsonParam(data)
    return `${window.location.origin}/poem?data=${encoded}`
  }, [data])

  const handleShare = React.useCallback(() => {
    triggerHaptic()
    setShareOpen(true)
  }, [triggerHaptic])

  const handleCopy = React.useCallback(async () => {
    if (!data) return
    triggerHaptic()
    setIsCopying(true)
    try {
      await navigator.clipboard.writeText(data.poem)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy poem:", error)
    } finally {
      setIsCopying(false)
    }
  }, [data, triggerHaptic])

  const handleCreateAnother = React.useCallback(() => {
    triggerHaptic()
    router.push("/wizard")
  }, [router, triggerHaptic])

  if (!data) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-stone-800 mb-4">No poem data found</h2>
          <Button onClick={handleCreateAnother} className="bg-rose-700 hover:bg-rose-800">
            Create a New Poem
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 overflow-hidden">
      <TheaterStage step={5} vibe={data.vibe}>
        <StageFloor />

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
                {data.title}
              </h1>
              <p className="text-lg text-stone-600">
                A poem for {data.nickname}
              </p>
            </motion.div>

            {/* Puppets */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="flex justify-center mb-12"
            >
              <FingerPuppets
                valAccessories={valAccessories}
                tinoAccessories={tinoAccessories}
                mood={mood}
              />
            </motion.div>

            {/* Poem */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8"
            >
              <div className="max-w-2xl mx-auto">
                <AnimatePresence>
                  {lines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`text-center text-lg md:text-xl leading-relaxed mb-3 font-serif text-stone-800 ${
                        hoveredLine === index ? "text-rose-700" : ""
                      }`}
                      onMouseEnter={() => setHoveredLine(index)}
                      onMouseLeave={() => setHoveredLine(null)}
                    >
                      {line}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={handleShare}
                className="bg-rose-700 hover:bg-rose-800 text-white px-6 py-3"
              >
                Share Poem
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-rose-700 text-rose-700 hover:bg-rose-50 px-6 py-3"
                disabled={isCopying}
              >
                {copied ? "Copied!" : "Copy Poem"}
              </Button>
              <Button
                onClick={handleCreateAnother}
                variant="outline"
                className="border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-3"
              >
                Create Another
              </Button>
            </motion.div>
          </div>
        </div>

        <ScriptSeal />
      </TheaterStage>

      {/* Share Modal */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-serif text-stone-800 mb-4">Share Your Poem</h3>
              <p className="text-stone-600 mb-4">Share this link with someone special:</p>
              <div className="bg-stone-50 p-3 rounded-lg mb-4 break-all text-sm">
                {shareUrl}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl)
                    setShareOpen(false)
                  }}
                  className="flex-1 bg-rose-700 hover:bg-rose-800"
                >
                  Copy Link
                </Button>
                <Button
                  onClick={() => setShareOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}