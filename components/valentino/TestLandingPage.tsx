"use client"

import { motion } from "framer-motion"
import { MagneticButton } from "./MagneticButton"

export function TestLandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-12 relative overflow-hidden">
      {/* Paper texture background */}
      <div className="absolute inset-0 opacity-30" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center relative z-10">
        {/* Animated Envelope */}
        <motion.div
          className="mb-12 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-32 h-24 bg-rose-100 rounded-lg shadow-2xl relative overflow-hidden">
            {/* Envelope flap */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-rose-200 transform origin-bottom rotate-x-45" />
            {/* Envelope seal */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-rose-400 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-rose-600 rounded-full" />
            </div>
            {/* Envelope shadow */}
            <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/10 blur-xl rounded-full" />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          <div className="w-full backdrop-blur-sm bg-white/70 shadow-lg rounded-xl p-8 border border-rose-100">
            <div className="text-center">
              <motion.div
                className="inline-block"
                whileHover={{ scale: 1.05 }}
              >
                <h1 className="font-serif text-4xl text-rose-700 sm:text-5xl tracking-tight">
                  Valentino
                </h1>
              </motion.div>
              <p className="mx-auto max-w-md text-base mt-4 text-stone-600">
                Poetry without the personal data.
              </p>
            </div>
            
            <div className="mt-8 mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MagneticButton className="h-12 w-full text-base sm:w-auto bg-rose-600 hover:bg-rose-700">
                  Create for Someone
                </MagneticButton>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MagneticButton variant="outline" className="h-12 w-full text-base sm:w-auto">
                  Try Lucky Random
                </MagneticButton>
              </motion.div>
            </div>

            <div className="mt-6 text-center text-sm text-stone-600">
              <a href="/privacy" className="underline underline-offset-4 hover:text-stone-800">
                Privacy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
