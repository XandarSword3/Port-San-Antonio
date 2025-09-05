'use client'

import { motion } from 'framer-motion'

interface BeachLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function BeachLoader({ size = 'md', text = 'Loading...' }: BeachLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      {/* Animated Beach Elements */}
      <div className="relative">
        {/* Ocean Wave */}
        <motion.div
          className="w-20 h-8 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full relative overflow-hidden"
          animate={{
            scaleX: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Floating Bubbles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${-10 - i * 5}px`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Palm Tree */}
        <motion.div
          className="absolute -right-2 -top-1 text-2xl"
          animate={{
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🌴
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-300 font-medium`}
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {text}
      </motion.p>

      {/* Sand Dots Animation */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-amber-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}
