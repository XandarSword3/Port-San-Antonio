'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Accessibility } from 'lucide-react'

export default function ReducedMotionToggle() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const savedPreference = localStorage.getItem('reducedMotion')
    
    if (savedPreference !== null) {
      setReducedMotion(savedPreference === 'true')
    } else {
      setReducedMotion(prefersReducedMotion)
    }

    // Apply reduced motion styles
    applyReducedMotion(reducedMotion)
  }, [reducedMotion])

  const applyReducedMotion = (enabled: boolean) => {
    const root = document.documentElement
    if (enabled) {
      root.style.setProperty('--animation-duration', '0.01ms')
      root.style.setProperty('--animation-iteration-count', '1')
      root.classList.add('reduced-motion')
    } else {
      root.style.removeProperty('--animation-duration')
      root.style.removeProperty('--animation-iteration-count')
      root.classList.remove('reduced-motion')
    }
  }

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem('reducedMotion', newValue.toString())
    applyReducedMotion(newValue)
  }

  return (
    <motion.button
      onClick={toggleReducedMotion}
      className={`fixed bottom-20 right-4 z-50 p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
        reducedMotion 
          ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
          : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
      }`}
      title={reducedMotion ? 'Enable animations' : 'Reduce motion'}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Accessibility className="w-5 h-5" />
    </motion.button>
  )
}
