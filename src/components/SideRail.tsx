'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X, Waves, Palmtree, Sun, Anchor, Shell } from 'lucide-react'
import { Ad } from '@/types'
import { useTheme } from '@/contexts/ThemeContext'

interface SideRailProps {
  ads: Ad[]
}

export default function SideRail({ ads }: SideRailProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const { isDark } = useTheme()

  useEffect(() => {
    if (ads.length <= 1) return

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length)
    }, 8000) // Rotate every 8 seconds

    return () => clearInterval(interval)
  }, [ads.length])

  // Beach-themed decorative elements
  const beachElements = [
    { icon: Palmtree, delay: 0.2, size: 'h-8 w-8', color: 'text-green-500' },
    { icon: Waves, delay: 0.4, size: 'h-6 w-6', color: 'text-blue-400' },
    { icon: Sun, delay: 0.6, size: 'h-7 w-7', color: 'text-yellow-400' },
    { icon: Shell, delay: 0.8, size: 'h-5 w-5', color: 'text-pink-300' },
    { icon: Anchor, delay: 1.0, size: 'h-6 w-6', color: 'text-blue-600' },
  ]

  return (
    <div className="sticky top-24 space-y-6">
      {/* Beach-themed Decorative Panel */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl p-6 ${
          isDark 
            ? 'bg-gradient-to-br from-blue-900/50 via-teal-800/40 to-cyan-900/50 backdrop-blur-sm border border-cyan-400/20'
            : 'bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 border border-blue-200'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated beach elements */}
        <div className="absolute inset-0 overflow-hidden">
          {beachElements.map((element, index) => (
            <motion.div
              key={index}
              className={`absolute ${element.color} ${element.size}`}
              style={{
                top: `${20 + (index * 15)}%`,
                left: `${10 + (index * 15)}%`,
              }}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ 
                opacity: 0.6, 
                scale: 1, 
                rotate: 0,
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 2,
                delay: element.delay,
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <element.icon />
            </motion.div>
          ))}
          
          {/* Floating wave animation */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-12 ${
              isDark ? 'bg-gradient-to-t from-blue-500/20 to-transparent' : 'bg-gradient-to-t from-blue-200/30 to-transparent'
            }`}
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 0%']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100'%3E%3Cpath d='M0,50 C150,20 350,80 500,50 C650,20 850,80 1000,50 L1000,100 L0,100 Z' fill='${isDark ? '%23338ef7' : '%2393c5fd'}' fill-opacity='0.3'/%3E%3C/svg%3E")`,
              backgroundSize: '200% 100%'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-cyan-100' : 'text-blue-900'
            }`}>
              Coastal Paradise
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-cyan-200/80' : 'text-blue-700/80'
            }`}>
              Experience the serenity of our beachfront location with stunning ocean views
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Ad Content (if any) */}
      {ads.length > 0 && isVisible && (
        <motion.div
          className={`relative overflow-hidden rounded-xl shadow-lg ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 end-3 z-10 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
            aria-label="Close advertisement"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Ad Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={ads[currentAdIndex]?.id || 'no-ad'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {ads[currentAdIndex] && (
                <div className="aspect-square">
                  <img
                    src={ads[currentAdIndex].imageUrl}
                    alt={ads[currentAdIndex].title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {ads[currentAdIndex].title}
                    </h3>
                    <p className="text-sm text-white/90">
                      {ads[currentAdIndex].description}
                    </p>
                    {ads[currentAdIndex].link && (
                      <a
                        href={ads[currentAdIndex].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center text-sm text-blue-300 hover:text-blue-200"
                      >
                        Learn More <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Ad Indicator Dots */}
          {ads.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAdIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentAdIndex
                      ? 'bg-white'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to ad ${index + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
