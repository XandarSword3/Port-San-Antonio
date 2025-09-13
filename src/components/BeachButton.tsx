'use client'

import { motion } from 'framer-motion'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Waves } from 'lucide-react'

interface BeachButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ocean' | 'sand' | 'sunset'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: ReactNode
}

const BeachButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props 
}: BeachButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-luxury-dark-accent to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black shadow-lg hover:shadow-luxury-dark-accent/25 font-semibold',
    secondary: 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-luxury-dark-text shadow-lg border border-luxury-dark-border/20',
    ocean: 'bg-gradient-to-r from-luxury-dark-accent to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black shadow-lg hover:shadow-luxury-dark-accent/25',
    sand: 'bg-gradient-to-r from-luxury-dark-accent to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-black shadow-lg hover:shadow-luxury-dark-accent/25',
    sunset: 'bg-gradient-to-r from-luxury-dark-accent to-orange-500 text-black hover:from-orange-500 hover:to-orange-600',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <motion.div
      whileHover={!disabled && !isLoading ? { 
        scale: 1.05,
        y: -2,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
      } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
    >
      <button
        className={`
          relative overflow-hidden rounded-xl font-medium transition-all duration-300 w-full
          ${variants[variant]}
          ${sizes[size]}
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Wave animation overlay */}
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full scale-0"
          whileTap={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Waves className="w-4 h-4" />
            </motion.div>
          ) : icon}
          {children}
        </div>

        {/* Beach sparkle effects */}
        {!disabled && !isLoading && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%'
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.7,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        )}
      </button>
    </motion.div>
  )
}

export default BeachButton
