import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/utils"

type Props = {
  active: boolean
}

export function GeneratingOverlay({ active }: Props) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center px-4",
        active ? "pointer-events-auto" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!active}
    >
      <div className="absolute inset-0 bg-stone-50">
        <div className="absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.03)_0,rgba(0,0,0,0.03)_1px,transparent_1px,transparent_10px)]" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(190,18,60,0.10),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(217,119,6,0.12),transparent_55%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-md rounded-lg border border-stone-200 bg-white/80 p-8 shadow-soft-xl backdrop-blur">
        <div className="flex flex-col items-center gap-4 text-center">
          <PenAnimation disabled={reduceMotion} />
          <div className="font-serif text-2xl text-rose-700">Crafting your verse</div>
          <StreamingDots disabled={reduceMotion} />
        </div>
      </div>
    </div>
  )
}

function StreamingDots({ disabled }: { disabled: boolean | null }) {
  const [dots, setDots] = React.useState(".")

  React.useEffect(() => {
    if (disabled) return
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."))
    }, 350)
    return () => clearInterval(id)
  }, [disabled])

  return <div className="text-sm text-stone-600">{disabled ? "..." : dots}</div>
}

function PenAnimation({ disabled }: { disabled: boolean | null }) {
  if (disabled) {
    return (
      <div className="rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-700">
        Writing…
      </div>
    )
  }

  return (
    <div className="relative h-20 w-64 overflow-hidden rounded-lg bg-stone-50">
      <motion.div
        className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-stone-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        className="absolute top-1/2 h-10 w-10 -translate-y-1/2"
        animate={{ x: [0, 220, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm bg-stone-700" />
        <div className="absolute left-1/2 top-[60%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-700" />
      </motion.div>

      <motion.div
        className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-rose-300"
        animate={{ width: ["0%", "86%", "0%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

