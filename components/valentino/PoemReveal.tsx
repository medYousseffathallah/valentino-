import { motion, useReducedMotion, type Variants } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/utils"

type Props = {
  poem: string
  className?: string
}

export function PoemReveal({ poem, className }: Props) {
  const reduceMotion = useReducedMotion()
  const lines = React.useMemo(() => poem.split("\n"), [poem])

  if (reduceMotion) {
    return (
      <div className={cn("space-y-3", className)}>
        {lines.map((line, idx) => (
          <p key={idx} className="text-base leading-7 text-stone-900">
            {line}
          </p>
        ))}
      </div>
    )
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const line: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  }

  const word: Variants = {
    hidden: { filter: "blur(4px)" },
    show: { 
      filter: "blur(0px)", 
      transition: { 
        duration: 0.4,
        delay: 0.1
      }
    }
  }

  return (
    <div className={cn("relative", className)}>
      <p className="sr-only" aria-live="polite">
        {poem}
      </p>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {lines.map((lineText, lineIdx) => (
          <motion.p
            key={lineIdx}
            variants={line}
            className="text-base leading-7 text-stone-900 group relative"
            whileHover={{ 
              scale: 1.02,
              rotateX: 5,
              transition: { duration: 0.2 }
            }}
          >
            <span className="absolute -inset-1 bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            {lineText.split(" ").map((wordText, wordIdx) => (
              <motion.span
                key={wordIdx}
                variants={word}
                className="inline-block relative z-10 px-0.5"
              >
                {wordText}{wordIdx < lineText.split(" ").length - 1 ? " " : ""}
              </motion.span>
            ))}
          </motion.p>
        ))}
      </motion.div>
    </div>
  )
}


