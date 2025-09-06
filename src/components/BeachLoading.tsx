'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Palmtree, Sun, Waves, Shell, Fish, Anchor, Ship } from 'lucide-react'

interface BeachLoadingProps {
  isLoading?: boolean
  message?: string
}

const BeachLoading = ({ isLoading = true, message = "Loading ocean vibes..." }: BeachLoadingProps) => {
  if (!isLoading) return null

  const beachIcons = [
    { Icon: Sun, color: "text-yellow-400", delay: 0 },
    { Icon: Palmtree, color: "text-green-500", delay: 0.2 },
    { Icon: Waves, color: "text-blue-400", delay: 0.4 },
    { Icon: Shell, color: "text-pink-300", delay: 0.6 },
    { Icon: Fish, color: "text-cyan-400", delay: 0.8 },
    { Icon: Anchor, color: "text-gray-600", delay: 1.0 },
    { Icon: Ship, color: "text-indigo-500", delay: 1.2 },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-sky-200 via-blue-300 to-blue-500"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating clouds */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              initial={{ x: -100, y: Math.random() * 200 + 50 }}
              animate={{ x: 1500 }} // Fixed width instead of window.innerWidth
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: i * 3
              }}
              className="absolute w-16 h-8 bg-white/30 rounded-full"
              style={{
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}
            />
          ))}
          
          {/* Beach waves at bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-600 to-blue-400 opacity-50"
          />
        </div>

        <div className="relative z-10 text-center">
          {/* Main loading animation */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {beachIcons.map(({ Icon, color, delay }, index) => (
              <motion.div
                key={index}
                initial={{ y: 0, scale: 1 }}
                animate={{
                  y: [-10, 10, -10],
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Icon className={`w-8 h-8 ${color} drop-shadow-lg`} />
              </motion.div>
            ))}
          </div>

          {/* Loading text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white mb-4 drop-shadow-lg"
          >
            {message}
          </motion.h2>

          {/* Progress bar */}
          <div className="w-64 mx-auto h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full bg-gradient-to-r from-yellow-400 via-blue-400 to-green-400 rounded-full"
            />
          </div>

          {/* Tropical loading dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                className="w-3 h-3 bg-white rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BeachLoading
