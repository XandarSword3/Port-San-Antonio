'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Clock, AlertTriangle } from 'lucide-react'
import { Dish } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatPrice } from '@/lib/utils'
import { translateDietTag, translateAllergen } from '@/lib/dishTranslations'
import BackButton from './BackButton'
import { useEffect, useRef } from 'react'

interface DishModalProps {
  dish: Dish
  isOpen: boolean
  onClose: () => void
  id: string
}

export default function DishModal({ dish, isOpen, onClose, id }: DishModalProps) {
  const { t, language } = useLanguage()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement
      const el = dialogRef.current
      setTimeout(() => el?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus(), 0)
      const handleFocus = (e: FocusEvent) => {
        if (!el) return
        if (isOpen && el !== e.target && el.contains(e.target as Node) === false) {
          e.preventDefault()
          el.focus()
        }
      }
      document.addEventListener('focus', handleFocus, true)
      return () => document.removeEventListener('focus', handleFocus, true)
    } else {
      previouslyFocused.current?.focus()
    }
  }, [isOpen])
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dish.name,
          text: dish.shortDesc,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${dish.name} - ${dish.shortDesc}`
      try {
        await navigator.clipboard.writeText(text)
        // You could show a toast here
        alert('Copied to clipboard!')
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
    }
  }

  // Generate descriptive alt text
  const getAltText = () => {
    const category = dish.categoryId.charAt(0).toUpperCase() + dish.categoryId.slice(1)
    return `${dish.name} — ${dish.shortDesc} (${category})`
  }

  // Handle price display for variants
  const getPriceDisplay = () => {
    if (dish.variants && dish.variants.length > 0) {
      return (
        <div className="space-y-2" data-testid="modal-price">
          <h4 className="font-semibold text-gray-900">{t('priceRange')}</h4>
          <div className="grid grid-cols-1 gap-2">
            {dish.variants.map((variant, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{variant.label}</span>
                <span className="text-lg font-bold text-resort-500 dark:text-beach-dark-accent accent-element">
                  {formatPrice(variant.price, dish.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return dish.price ? (
      <div className="text-3xl font-bold text-resort-500 dark:text-beach-dark-accent accent-element" data-testid="modal-price">
        {formatPrice(dish.price, dish.currency)}
      </div>
    ) : null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-description`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]" />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl modal-content"
            ref={dialogRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }}
            data-testid="dish-modal"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200 dark:border-beach-dark-muted/20">
              <div className="flex justify-between items-center mb-3">
                <BackButton label="" className="p-1" />
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 dark:bg-beach-dark-card text-gray-600 dark:text-beach-dark-muted hover:bg-gray-200 dark:hover:bg-beach-dark-muted/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-beach-dark-accent focus:ring-offset-2"
                  aria-label="Close modal"
                  data-testid="modal-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h2 
                id={`${id}-title`}
                className="text-2xl font-bold text-gray-900 dark:text-beach-dark-text pr-12"
                data-testid="modal-name"
              >
                {dish.name}
              </h2>
              
              <p 
                id={`${id}-description`}
                className="text-gray-600 dark:text-beach-dark-muted mt-2 text-muted"
              >
                {dish.shortDesc}
              </p>
            </div>

            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={dish.image}
                alt={getAltText()}
                className="w-full h-full object-cover"
              />
              
              {/* Dietary Tags */}
              {dish.dietTags && dish.dietTags.length > 0 && (
                <div className="absolute top-4 start-4 flex flex-wrap gap-2">
                  {dish.dietTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                    >
                      {translateDietTag(tag, language)}
                    </span>
                  ))}
                </div>
              )}

              {/* Popularity Badge */}
              {/* Popularity badge removed - no ordering occurs */}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Price */}
              {getPriceDisplay()}

              {/* Full Description */}
              {dish.fullDesc && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('details')}</h4>
                  <p className="text-gray-700 leading-relaxed">{dish.fullDesc}</p>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calories */}
                {dish.calories && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{dish.calories} {t('calories')}</span>
                  </div>
                )}

                {/* Allergens */}
                {dish.allergens && dish.allergens.length > 0 && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <span className="text-gray-700 font-medium">{t('allergens')}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dish.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {translateAllergen(allergen, language)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Availability Status */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                dish.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {dish.available ? t('available') : t('unavailable')}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Share2 className="w-4 h-4" />
                {t('share') ?? 'Share'}
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {t('close') ?? 'Close'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
