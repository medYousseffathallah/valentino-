import { motion, type Variants } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/utils"

type Props = {
  direction: 1 | -1
  className?: string
  children: React.ReactNode
}

export function WizardStep({ direction, className, children }: Props) {
  const variants: Variants = {
    initial: { opacity: 0, x: direction === 1 ? 24 : -24 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" } },
    exit: { opacity: 0, x: direction === 1 ? -24 : 24, transition: { duration: 0.2 } }
  }

  return (
    <motion.div
      className={cn("w-full", className)}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

