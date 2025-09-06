'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Waves, Sun, Palmtree } from 'lucide-react'

const BeachPageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut'
        }}
        className="relative"
      >
        {/* Ocean wave transition overlay */}
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: '-100%' }}
          exit={{ y: 0 }}
          transition={{ duration: 0.6, ease: 'circOut' }}
          className="fixed inset-0 z-[200] bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 pointer-events-none"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-4"
              >
                <Waves className="w-16 h-16 mx-auto" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-2xl font-bold"
              >
                Navigating the waters...
              </motion.h2>
            </div>
          </div>

          {/* Floating beach elements during transition */}
          <div className="absolute inset-0 overflow-hidden">
            {[Sun, Palmtree, Waves].map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ x: -100, y: Math.random() * 800 }} // Fixed height
                animate={{ x: 1500 }} // Fixed width instead of window.innerWidth + 100
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  ease: 'linear'
                }}
                className="absolute"
              >
                <Icon className="w-8 h-8 text-white/30" />
              </motion.div>
            ))}
          </div>

          {/* Wave bottom edge */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-full h-16"
            >
              <motion.path
                d="M0,60 C150,120 350,0 600,60 S1050,120 1200,60 L1200,120 L0,120 Z"
                fill="rgba(255,255,255,0.1)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Page content with beach entrance animation */}
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: 'easeOut'
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BeachPageTransition
