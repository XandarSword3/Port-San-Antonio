'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

export function useTransitionRouter() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionType, setTransitionType] = useState<'menu' | 'admin'>('menu')

  const navigateWithTransition = useCallback(
    (path: string, type: 'menu' | 'admin' = 'menu') => {
      if (isTransitioning) return

      setIsTransitioning(true)
      setTransitionType(type)

      // Show transition overlay
      const transitionDuration = type === 'menu' ? 800 : 600

      setTimeout(() => {
        router.push(path)
        
        // Hide overlay after navigation
        setTimeout(() => {
          setIsTransitioning(false)
        }, 200)
      }, transitionDuration * 0.6)
    },
    [router, isTransitioning]
  )

  return {
    navigateWithTransition,
    isTransitioning,
    transitionType
  }
}
