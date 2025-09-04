'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Clock } from 'lucide-react'
import { Dish } from '@/types'
import { formatPrice } from '@/lib/utils'
import DishModal from './DishModal'
import { EASING, DURATION } from '@/lib/animation'
import { useLanguage } from '@/contexts/LanguageContext'

interface DishCardProps {
  dish: Dish
  onLongPress?: (dish: Dish) => void
}

export default function DishCard({ dish, onLongPress }: DishCardProps) {
  const { t, language } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [longPressProgress, setLongPressProgress] = useState(0)
  const [isLongPressing, setIsLongPressing] = useState(false)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    
    // Start long-press immediately
    setIsLongPressing(true)
    setLongPressProgress(0)
    startTimeRef.current = Date.now()
    
    // Animate progress over 3 seconds
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min((elapsed / 3000) * 100, 100)
      setLongPressProgress(progress)
      
      if (progress >= 100) {
        // Long-press completed
        clearInterval(progressIntervalRef.current!)
        progressIntervalRef.current = null
        setIsLongPressing(false)
        setLongPressProgress(0)
        onLongPress?.(dish)
        setIsModalOpen(true)
      }
    }, 16) // ~60fps
  }, [dish, onLongPress])

  const handlePointerUp = useCallback(() => {
    // Cancel long-press
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    
    setIsLongPressing(false)
    setLongPressProgress(0)
    startTimeRef.current = 0
  }, [])

  const handlePointerCancel = useCallback(() => {
    handlePointerUp()
  }, [handlePointerUp])

  const handlePointerLeave = useCallback(() => {
    handlePointerUp()
  }, [handlePointerUp])

  const handleDetailsClick = () => {
    console.log('modal: open', dish.id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  // Generate descriptive alt text
  const getAltText = () => {
    const category = dish.categoryId.charAt(0).toUpperCase() + dish.categoryId.slice(1)
    return `${dish.name} — ${dish.shortDesc} (${category})`
  }

  // Handle price display for variants
  const getPriceDisplay = () => {
    if (dish.variants && dish.variants.length > 0) {
      const minPrice = Math.min(...dish.variants.map(v => v.price))
      const maxPrice = Math.max(...dish.variants.map(v => v.price))
      if (minPrice === maxPrice) {
        return formatPrice(minPrice, dish.currency)
      }
      return `${formatPrice(minPrice, dish.currency)} - ${formatPrice(maxPrice, dish.currency)}`
    }
    return dish.price ? formatPrice(dish.price, dish.currency) : ''
  }

  return (
    <>
      <motion.div
        className="group relative overflow-hidden rounded-xl card card-hover transition-all duration-300 will-change-transform dish-card"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.medium, ease: EASING.soft }}
        viewport={{ once: true }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerLeave}
        style={{ touchAction: 'manipulation' }}
        data-testid="dish-card"
        // Remove accidental open on tap; use explicit Details button
      >
        {/* Long-press Progress Indicator */}
        <AnimatePresence>
          {isLongPressing && (
            <motion.div
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - longPressProgress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-100 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={dish.image}
            alt={getAltText()}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement
              if (target.src !== '/seed/resort-hero.jpg') {
                target.src = '/seed/resort-hero.jpg'
              }
            }}
          />
          
          {/* Dietary Tags */}
          {dish.dietTags && dish.dietTags.length > 0 && (
            <div className="absolute top-2 start-2 flex flex-wrap gap-1">
              {dish.dietTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Popularity Badge */}
          {dish.popularity > 80 && (
            <div className="absolute top-2 end-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-beach-dark-accent/30 dark:text-beach-dark-accent accent-element">
                Popular
              </span>
            </div>
          )}

          {/* Details Button */}
          <button
            onClick={handleDetailsClick}
            className="absolute bottom-2 end-2 p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white dark:bg-beach-dark-card/90 dark:text-beach-dark-text dark:hover:bg-beach-dark-card transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-beach-dark-accent focus:ring-offset-2"
            aria-label={`View details for ${dish.name}`}
            aria-haspopup="dialog"
            aria-controls={`dish-modal-${dish.id}`}
            data-testid="dish-details-button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDetailsClick();
              }
            }}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-beach-dark-text group-hover:text-resort-500 dark:group-hover:text-beach-dark-accent transition-colors duration-200">
              {dish.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-beach-dark-muted mt-1 line-clamp-2 text-muted">
              {dish.shortDesc}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-resort-500 dark:text-beach-dark-accent accent-element">
              {getPriceDisplay()}
            </div>
            
            {/* Availability Status */}
            <div className={`text-xs px-2 py-1 rounded-full ${
              dish.available 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
            }`}>
              {dish.available ? t('available') : t('unavailable')}
            </div>
          </div>

          {/* Allergens */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {dish.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                >
                  {allergen}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </motion.div>

      {/* Modal */}
      <DishModal
        dish={dish}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        id={`dish-modal-${dish.id}`}
      />
    </>
  )
}
