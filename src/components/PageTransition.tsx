'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { ReactNode, useEffect, useState } from 'react'
import { 
  getPerformanceManager, 
  getAdaptiveDuration,
  getAdaptiveStagger,
  isFeatureEnabled,
  type DeviceTier 
} from '@/lib/hardwareDetection'

interface PageTransitionProps {
  children: ReactNode
  type?: 'menu' | 'admin' | 'default'
}

export default function PageTransition({ children, type = 'default' }: PageTransitionProps) {
  const { isDark } = useTheme()
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('medium')

  useEffect(() => {
    const perfManager = getPerformanceManager()
    setDeviceTier(perfManager.getCurrentTier())

    const handleTierChange = (e: CustomEvent) => {
      setDeviceTier(e.detail.tier)
    }

    window.addEventListener('performance-tier-changed', handleTierChange as EventListener)
    return () => {
      window.removeEventListener('performance-tier-changed', handleTierChange as EventListener)
    }
  }, [])

  // Menu page transition - tech/minimal with adaptive blur
  const menuTransition = {
    initial: isDark 
      ? { 
          opacity: 0, 
          scale: 0.95,
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          filter: isFeatureEnabled('enableBlur', deviceTier) ? 'blur(10px)' : 'none'
        }
      : { 
          opacity: 0, 
          scale: 0.95,
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          filter: isFeatureEnabled('enableBlur', deviceTier) ? 'blur(10px)' : 'none'
        },
    animate: { 
      opacity: 1, 
      scale: 1,
      background: isDark 
        ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
        : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      filter: 'blur(0px)'
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      filter: isFeatureEnabled('enableBlur', deviceTier) ? 'blur(5px)' : 'none'
    }
  }

  // Admin page transition - secure/professional with adaptive 3D
  const adminTransition = {
    initial: { 
      opacity: 0,
      x: isFeatureEnabled('enableTransforms3D', deviceTier) ? (isDark ? -50 : 50) : 0,
      y: !isFeatureEnabled('enableTransforms3D', deviceTier) ? 20 : 0,
      rotateY: isFeatureEnabled('enableTransforms3D', deviceTier) ? (isDark ? -15 : 15) : 0,
      background: isDark 
        ? 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)'
        : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
    },
    animate: { 
      opacity: 1,
      x: 0,
      y: 0,
      rotateY: 0,
      background: isDark 
        ? 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)'
        : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
    },
    exit: { 
      opacity: 0,
      x: isFeatureEnabled('enableTransforms3D', deviceTier) ? (isDark ? 50 : -50) : 0,
      y: !isFeatureEnabled('enableTransforms3D', deviceTier) ? -20 : 0,
      rotateY: isFeatureEnabled('enableTransforms3D', deviceTier) ? (isDark ? 15 : -15) : 0
    }
  }

  // Default transition - simple and fast
  const defaultTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const getTransition = () => {
    switch (type) {
      case 'menu':
        return menuTransition
      case 'admin':
        return adminTransition
      default:
        return defaultTransition
    }
  }

  const transition = getTransition()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={transition.initial}
        animate={transition.animate}
        exit={transition.exit}
        transition={{
          duration: type === 'menu' 
            ? getAdaptiveDuration(0.8, deviceTier)
            : type === 'admin' 
              ? getAdaptiveDuration(0.6, deviceTier)
              : getAdaptiveDuration(0.4, deviceTier),
          ease: [0.25, 0.1, 0.25, 1.0],
          ...(type === 'menu' && {
            scale: { 
              duration: getAdaptiveDuration(0.6, deviceTier), 
              ease: [0.25, 0.1, 0.25, 1.0] 
            },
            filter: isFeatureEnabled('enableBlur', deviceTier) 
              ? { duration: getAdaptiveDuration(0.4, deviceTier), ease: 'easeOut' }
              : { duration: 0 }
          }),
          ...(type === 'admin' && isFeatureEnabled('enableTransforms3D', deviceTier) && {
            rotateY: { 
              duration: getAdaptiveDuration(0.8, deviceTier), 
              ease: [0.25, 0.1, 0.25, 1.0] 
            }
          })
        }}
        className="min-h-screen w-full"
        style={{ 
          perspective: isFeatureEnabled('enableTransforms3D', deviceTier) ? '1000px' : 'none' 
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Loading overlay for transitions - Hardware Adaptive
export function TransitionOverlay({ type }: { type: 'menu' | 'admin' }) {
  const { isDark } = useTheme()
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('medium')

  useEffect(() => {
    const perfManager = getPerformanceManager()
    setDeviceTier(perfManager.getCurrentTier())
  }, [])

  if (type === 'menu') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isDark 
            ? 'bg-gradient-to-br from-black via-gray-900 to-black' 
            : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50'
        }`}
      >
        {/* Tech loading animation - Adaptive complexity */}
        <div className="relative">
          {/* Outer ring */}
          <motion.div
            animate={deviceTier !== 'low' ? { rotate: 360 } : {}}
            transition={{ 
              duration: getAdaptiveDuration(2, deviceTier), 
              repeat: deviceTier !== 'low' ? Infinity : 0, 
              ease: "linear" 
            }}
            className={`w-20 h-20 rounded-full border-2 border-t-transparent ${
              isDark ? 'border-yellow-400' : 'border-blue-400'
            }`}
          />
          {/* Inner ring - only on medium/high tier */}
          {deviceTier !== 'low' && (
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ 
                duration: getAdaptiveDuration(1.5, deviceTier), 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className={`absolute inset-2 w-16 h-16 rounded-full border-2 border-b-transparent ${
                isDark ? 'border-yellow-300' : 'border-blue-300'
              }`}
            />
          )}
          {/* Center dot */}
          <div className={`absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
            isDark ? 'bg-yellow-400' : 'bg-blue-400'
          }`} />
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`absolute mt-32 text-sm font-medium ${
            isDark ? 'text-yellow-400' : 'text-blue-600'
          }`}
        >
          Loading Menu...
        </motion.p>
      </motion.div>
    )
  }

  // Admin loading - Adaptive
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Secure loading animation */}
      <div className="relative">
        {/* Lock icon animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: getAdaptiveDuration(0.5, deviceTier), 
            ease: "backOut" 
          }}
          className="w-16 h-16 border-3 border-amber-400 rounded-lg relative"
        >
          <motion.div
            initial={{ y: -5 }}
            animate={{ y: 0 }}
            transition={{ 
              delay: getAdaptiveStagger(0.3, deviceTier), 
              duration: getAdaptiveDuration(0.3, deviceTier) 
            }}
            className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 border-2 border-amber-400 rounded-t-full"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: getAdaptiveStagger(0.6, deviceTier) }}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full"
          />
        </motion.div>
        
        {/* Security dots - only on high/medium tier */}
        {deviceTier !== 'low' && (
          <div className="absolute -inset-8 flex items-center justify-center">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: getAdaptiveStagger(0.8 + i * 0.1, deviceTier) }}
                className="w-1 h-1 bg-amber-400 rounded-full mx-1"
              />
            ))}
          </div>
        )}
      </div>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: getAdaptiveStagger(1, deviceTier) }}
        className="absolute mt-32 text-sm font-medium text-amber-400"
      >
        Authenticating...
      </motion.p>
    </motion.div>
  )
}
