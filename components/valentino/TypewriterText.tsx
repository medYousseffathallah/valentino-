"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
}

export function TypewriterText({ text, speed = 30, delay = 0 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    setDisplayedText('')
    setIsTyping(true)

    const timer = setTimeout(() => {
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1))
          i++
        } else {
          setIsTyping(false)
          clearInterval(typingInterval)
        }
      }, speed)

      return () => clearInterval(typingInterval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, speed, delay])

  return (
    <div className="relative">
      <span className="whitespace-pre-wrap">{displayedText}</span>
      <AnimatePresence mode="wait">
        {isTyping && (
          <motion.span
            key="cursor"
            className="inline-block w-1 h-5 ml-1 bg-rose-700 align-middle"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
