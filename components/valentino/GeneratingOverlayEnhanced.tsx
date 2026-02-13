import { motion } from "framer-motion"
import { TypewriterText } from "./TypewriterText"

type Props = {
  isVisible: boolean
}

export function GeneratingOverlayEnhanced({ isVisible }: Props) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      {/* Gold Dust Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: [0, window.innerHeight + 20],
              opacity: [0, 0.6, 0],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating Envelope */}
      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-36 h-28 bg-rose-100 rounded-lg shadow-2xl relative overflow-hidden transform-style-preserve-3d">
          {/* Envelope flap */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-14 bg-rose-200 transform origin-bottom"
            animate={{
              rotateX: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Envelope seal with typewriter text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-rose-400 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-rose-600 rounded-full" />
          </div>

          {/* Typewriter text on envelope */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-rose-700 font-serif text-sm font-medium">
            <TypewriterText text="Sealing your words..." />
          </div>

          {/* Envelope shadow */}
          <motion.div
            className="absolute -bottom-6 left-6 right-6 h-6 bg-black/10 blur-xl rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
