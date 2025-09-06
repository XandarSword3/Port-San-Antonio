'use client'

import { motion } from 'framer-motion'
import { Shell, Waves, Anchor, Fish, StarIcon } from 'lucide-react'

const FloatingBeachElements = () => {
  const elements = [
    { Icon: Shell, delay: 0, duration: 8, x: 10, y: 20 },
    { Icon: Fish, delay: 2, duration: 6, x: 80, y: 10 },
    { Icon: StarIcon, delay: 4, duration: 10, x: 60, y: 70 },
    { Icon: Anchor, delay: 6, duration: 7, x: 20, y: 60 },
    { Icon: Waves, delay: 8, duration: 9, x: 90, y: 40 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {elements.map(({ Icon, delay, duration, x, y }, index) => (
        <motion.div
          key={index}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: `${x}vw`,
            y: `${y}vh`
          }}
          animate={{
            opacity: [0, 0.1, 0.05, 0.15, 0],
            scale: [0, 0.8, 1, 0.8, 0],
            y: [`${y}vh`, `${y - 15}vh`, `${y - 8}vh`, `${y - 20}vh`, `${y - 25}vh`],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute"
        >
          <Icon 
            className="w-6 h-6 text-blue-300/40 drop-shadow-lg" 
            style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
            }}
          />
        </motion.div>
      ))}
      
      {/* Floating bubbles - reduced amount */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          initial={{
            opacity: 0,
            scale: 0,
            x: Math.random() * 1400, // Fixed width instead of window.innerWidth
            y: 900 // Fixed height instead of window.innerHeight + 100
          }}
          animate={{
            opacity: [0, 0.2, 0],
            scale: [0, 0.8, 0],
            y: -100,
            x: Math.random() * 1400 // Fixed width instead of window.innerWidth
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-2 h-2 bg-blue-200/30 rounded-full backdrop-blur-sm"
          style={{
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
          }}
        />
      ))}
    </div>
  )
}

export default FloatingBeachElements
