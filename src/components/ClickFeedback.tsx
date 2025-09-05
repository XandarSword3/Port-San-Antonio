'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ClickFeedbackProps {
  x: number
  y: number
  onComplete: () => void
}

export default function ClickFeedback({ x, y, onComplete }: ClickFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 300) // Wait for animation to complete
    }, 600)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            left: x - 8,
            top: y - 8,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.2, opacity: 0 }}
          exit={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: '#D4A017' }}>
            <motion.div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: '#FFD700' }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to add click feedback to any element
export function useClickFeedback() {
  const [clickFeedback, setClickFeedback] = useState<{
    x: number
    y: number
    id: number
  } | null>(null)

  const addClickFeedback = (event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY

    setClickFeedback({
      x,
      y,
      id: Date.now()
    })
  }

  const clearClickFeedback = () => {
    setClickFeedback(null)
  }

  return {
    clickFeedback,
    addClickFeedback,
    clearClickFeedback
  }
}
