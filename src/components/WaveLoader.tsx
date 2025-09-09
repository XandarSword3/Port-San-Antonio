'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Waves, Sun, Anchor, Ship } from 'lucide-react'

const WaveLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [currentWave, setCurrentWave] = useState(0)
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLogo(true), 500)
    const timer2 = setTimeout(() => setCurrentWave(1), 1500)
    const timer3 = setTimeout(() => setCurrentWave(2), 2500)
    const timer4 = setTimeout(() => setCurrentWave(3), 3500)
    const timer5 = setTimeout(() => onComplete(), 4500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [onComplete])

  const waves = [
    { color: '#1e3a8a', height: '25%', delay: 0 },
    { color: '#2563eb', height: '50%', delay: 0.5 },
    { color: '#3b82f6', height: '75%', delay: 1 },
    { color: '#60a5fa', height: '100%', delay: 1.5 }
  ]

  // Predetermined cloud positions to avoid SSR hydration mismatch
  const cloudPositions = [
    { top: '15%', delay: 0 },
    { top: '25%', delay: 0.5 },
    { top: '35%', delay: 1.0 },
    { top: '45%', delay: 1.5 },
    { top: '20%', delay: 2.0 },
    { top: '40%', delay: 2.5 }
  ]

  // Predetermined particle positions for each wave
  const particlePositions = [
    [12, 25, 38, 52, 67, 78, 85, 95], // Wave 1
    [8, 22, 35, 48, 61, 74, 87, 94],  // Wave 2
    [15, 28, 41, 55, 68, 81, 89, 96], // Wave 3
    [5, 18, 32, 45, 58, 71, 84, 92]   // Wave 4
  ]

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-gradient-to-b from-sky-200 via-blue-300 to-blue-800 overflow-hidden"
    >
      {/* Animated clouds */}
      <div className="absolute inset-0">
        {cloudPositions.map((cloud, i) => (
          <motion.div
            key={i}
            initial={{ x: -200, opacity: 0 }}
            animate={{ 
              x: '120vw', // Responsive width using viewport units
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 8,
              delay: cloud.delay,
              ease: 'linear'
            }}
            className="absolute w-20 h-10 bg-white/30 rounded-full"
            style={{
              top: cloud.top,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Logo and text */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.2, opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center text-white"
            >
              {/* Logo */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="mb-6"
              >
                <img 
                  src="/Photos/Logo.jpg" 
                  alt="Port Antonio Resort" 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto rounded-full shadow-2xl border-4 border-white/30"
                />
              </motion.div>

              {/* Site title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 sm:mb-4 drop-shadow-lg"
              >
                Port Antonio Resort
              </motion.h1>

              {/* Loading text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="text-sm sm:text-base md:text-lg font-light drop-shadow-md"
              >
                Welcome to Mediterranean Paradise
              </motion.p>

              {/* Floating icons */}
              <div className="mt-6 sm:mt-8 flex justify-center gap-4 sm:gap-6">
                {[Sun, Waves, Anchor, Ship].map((Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0 }}
                    animate={{ y: [-10, 10, -10] }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <Icon className="w-6 h-6 text-white/70" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rising waves */}
      <div className="absolute bottom-0 left-0 right-0">
        {waves.map((wave, index) => (
          <motion.div
            key={index}
            initial={{ y: '100%' }}
            animate={currentWave >= index ? { y: `${100 - parseInt(wave.height)}%` } : {}}
            transition={{
              duration: 1,
              delay: wave.delay,
              ease: 'easeOut'
            }}
            className="absolute bottom-0 left-0 right-0"
            style={{
              backgroundColor: wave.color,
              height: wave.height,
              opacity: 0.8
            }}
          >
            {/* Wave top animation */}
            <svg
              className="absolute top-0 left-0 w-full h-8"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
                fill={wave.color}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </svg>

            {/* Wave particles */}
            {particlePositions[index]?.map((leftPos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [-50, -100, -150]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.3, // Fixed delay instead of Math.random()
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
                className="absolute w-2 h-2 bg-white/50 rounded-full"
                style={{
                  left: `${leftPos}%`,
                  bottom: '100%'
                }}
              />
            )) || []}
          </motion.div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2">
          {waves.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.5, opacity: 0.3 }}
              animate={currentWave >= index ? { 
                scale: 1, 
                opacity: 1,
                backgroundColor: '#ffffff'
              } : {}}
              transition={{ duration: 0.3, delay: index * 0.5 }}
              className="w-3 h-3 rounded-full bg-white/30"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default WaveLoader
