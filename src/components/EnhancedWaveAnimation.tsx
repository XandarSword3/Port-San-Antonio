'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const EnhancedWaveAnimation = () => {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const waveVariants = {
    animate: {
      d: [
        `M0,100 Q${windowWidth * 0.25},80 ${windowWidth * 0.5},100 T${windowWidth},100 L${windowWidth},120 L0,120 Z`,
        `M0,100 Q${windowWidth * 0.25},120 ${windowWidth * 0.5},100 T${windowWidth},100 L${windowWidth},120 L0,120 Z`,
        `M0,100 Q${windowWidth * 0.25},90 ${windowWidth * 0.5},100 T${windowWidth},100 L${windowWidth},120 L0,120 Z`,
      ]
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-[2] overflow-hidden">
      {/* Multiple wave layers */}
      <svg 
        width="100%" 
        height="120" 
        viewBox={`0 0 ${windowWidth} 120`}
        className="absolute bottom-0"
        preserveAspectRatio="none"
      >
        {/* Deep ocean wave */}
        <motion.path
          variants={waveVariants}
          animate="animate"
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          fill="url(#deepWave)"
          opacity="0.7"
        />
        
        {/* Medium wave */}
        <motion.path
          variants={waveVariants}
          animate="animate"
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          fill="url(#mediumWave)"
          opacity="0.5"
        />
        
        {/* Surface wave */}
        <motion.path
          variants={waveVariants}
          animate="animate"
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          fill="url(#surfaceWave)"
          opacity="0.3"
        />

        <defs>
          <linearGradient id="deepWave" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9"/>
          </linearGradient>
          <linearGradient id="mediumWave" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.7"/>
          </linearGradient>
          <linearGradient id="surfaceWave" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Sparkle effects on waves */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [
              Math.random() * windowWidth,
              Math.random() * windowWidth,
              Math.random() * windowWidth
            ]
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-16 w-2 h-2 bg-white rounded-full"
          style={{
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
          }}
        />
      ))}
    </div>
  )
}

export default EnhancedWaveAnimation
