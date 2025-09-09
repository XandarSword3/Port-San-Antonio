'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Clock, AlertCircle, Star, ShoppingCart, Users, Leaf, Heart, Wheat, Fish as FishIcon, TreePine, Waves, Shell } from 'lucide-react'
import { Dish } from '@/types'
import { formatPrice } from '@/lib/utils'
import { getFoodImage, generateImageSrcSet, getImageDimensions } from '@/lib/imageUtils'
import { translateDish, translateDietTag, translateAllergen } from '@/lib/dishTranslations'
import DishModal from './DishModal'
import { EASING, DURATION } from '@/lib/animation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useCart } from '@/contexts/CartContext'
import { useItemView, useClickTracking, useLongPress, useCartTracking } from '@/hooks/useAnalytics'

interface DishCardProps {
  dish: Dish
  onLongPress?: (dish: Dish) => void
  onQuickOrder?: (dish: Dish) => void
}

export default function DishCard({ dish, onLongPress, onQuickOrder }: DishCardProps) {
  const { t, language } = useLanguage()
  const { formatPrice: formatCurrencyPrice } = useCurrency()
  const { addItem } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [longPressProgress, setLongPressProgress] = useState(0)
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Analytics hooks
  const itemViewRef = useItemView(dish.id, dish.name)
  const trackClick = useClickTracking()
  const { trackAddToCart } = useCartTracking()
  
  // Long press analytics tracking
  const longPressAnalytics = useLongPress(
    () => {
      console.log('Long press completed for:', dish.name)
    },
    dish.id,
    dish.name,
    1500
  )

  // Translate the dish data
  const translatedDish = translateDish(dish, language)

  // Get dietary tag icon
  const getDietaryIcon = (tag: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'vegetarian': Leaf,
      'vegan': Heart,
      'gluten-free': Wheat,
      'seafood': FishIcon,
      'dairy-free': AlertCircle,
      'halal': TreePine
    }
    return iconMap[tag.toLowerCase()] || Leaf
  }

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    
    // Start long-press immediately
    setIsLongPressing(true)
    setLongPressProgress(0)
    startTimeRef.current = Date.now()
    
    // Animate progress over 1.5 seconds
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min((elapsed / 1500) * 100, 100)
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

  const handleDetailsClick = (e?: React.MouseEvent) => {
    console.log('modal: open', dish.id)
    
    // Track click analytics
    trackClick(dish.id, dish.name, e?.nativeEvent)
    
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (dish.available) {
      // Track add to cart analytics
      trackAddToCart(dish.id, dish.name, 1)
      
      addItem(dish, 1)
      // Remove the modal opening call to prevent blur effect
      // onQuickOrder?.(dish)
    }
  }

  // Generate descriptive alt text
  const getAltText = () => {
    const category = translatedDish.categoryId.charAt(0).toUpperCase() + translatedDish.categoryId.slice(1)
    const price = getPriceDisplay()
    const availability = dish.available ? t('available') : t('unavailable')
    return `${translatedDish.name} — ${translatedDish.shortDesc || t('deliciousDish')} (${category}). Price: ${price}. ${availability}.`
  }

  // Get appropriate food image
  const getFoodImageUrl = () => {
    // Use the image property from the dish data directly
    return dish.image || getFoodImage(dish.id)
  }

  // Get error message for unavailable items
  const getErrorMessage = () => {
    if (!dish.available) {
      return t('unavailable')
    }
    return null
  }

  // Generate star rating display
  const renderRating = () => {
    if (!dish.rating || dish.rating === 0) return null
    
    const stars = []
    const fullStars = Math.floor(dish.rating)
    const hasHalfStar = dish.rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
      )
    }
    
    const emptyStars = 5 - Math.ceil(dish.rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      )
    }
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-0.5">
          {stars}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {dish.rating.toFixed(1)}
        </span>
        {dish.reviewCount && (
          <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {dish.reviewCount}
          </span>
        )}
      </div>
    )
  }

  // Handle price display for variants
  const getPriceDisplay = () => {
    if (dish.variants && dish.variants.length > 0) {
      const minPrice = Math.min(...dish.variants.map(v => v.price))
      const maxPrice = Math.max(...dish.variants.map(v => v.price))
      if (minPrice === maxPrice) {
        return formatCurrencyPrice(minPrice, dish.currency)
      }
      return `${formatCurrencyPrice(minPrice, dish.currency)} - ${formatCurrencyPrice(maxPrice, dish.currency)}`
    }
    return dish.price ? formatCurrencyPrice(dish.price, dish.currency) : ''
  }

  return (
    <>
      <motion.article
        ref={itemViewRef}
        className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 will-change-transform border border-gray-200 dark:border-gray-700 card-responsive hover:border-resort-500 dark:hover:border-beach-dark-accent backdrop-blur-sm"
        transition={{ 
          duration: DURATION.medium, 
          ease: EASING.soft
        }}
        whileHover={{
          scale: 1.03,
          y: -5,
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.4)',
          filter: 'brightness(1.05)',
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        viewport={{ once: true }}
        onPointerDown={(e) => {
          handlePointerDown(e)
          longPressAnalytics.onMouseDown(e)
        }}
        onPointerUp={(e) => {
          handlePointerUp()
          longPressAnalytics.onMouseUp()
        }}
        onPointerCancel={(e) => {
          handlePointerCancel()
          longPressAnalytics.onMouseLeave()
        }}
        onPointerLeave={(e) => {
          handlePointerLeave()
          longPressAnalytics.onMouseLeave()
        }}
        onTouchStart={longPressAnalytics.onTouchStart}
        onTouchEnd={longPressAnalytics.onTouchEnd}
        style={{ touchAction: 'manipulation' }}
        data-testid="dish-card"
        role="article"
        aria-labelledby={`dish-title-${dish.id}`}
        aria-describedby={`dish-desc-${dish.id}`}
        tabIndex={0}
        onClick={(e) => handleDetailsClick(e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleDetailsClick()
          }
        }}
      >
        {/* Long-press Progress Indicator */}
        <AnimatePresence>
          {isLongPressing && (
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - longPressProgress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-100 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* High-Quality Food Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <AnimatePresence mode="wait">
            {!imageLoaded && !imageError && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-4xl opacity-40">
                  {translatedDish.categoryId === 'starters' && '🥗'}
                  {translatedDish.categoryId === 'salads' && '🥙'}
                  {translatedDish.categoryId === 'pizza' && '🍕'}
                  {translatedDish.categoryId === 'pasta' && '🍝'}
                  {translatedDish.categoryId === 'mains' && '🍖'}
                  {translatedDish.categoryId === 'desserts' && '🍰'}
                  {translatedDish.categoryId === 'beverages' && '🥤'}
                  {translatedDish.categoryId === 'burgers' && '🍔'}
                  {translatedDish.categoryId === 'sandwiches' && '🥪'}
                  {translatedDish.categoryId === 'platters' && '🍽️'}
                  {translatedDish.categoryId === 'drinks' && '🥤'}
                  {translatedDish.categoryId === 'beers' && '🍺'}
                  {translatedDish.categoryId === 'arak' && '🍶'}
                  {translatedDish.categoryId === 'prosecco' && '🥂'}
                  {translatedDish.categoryId === 'wine' && '🍷'}
                  {translatedDish.categoryId === 'signatureCocktails' && '🍸'}
                  {!['starters', 'salads', 'pizza', 'pasta', 'mains', 'desserts', 'beverages', 'burgers', 'sandwiches', 'platters', 'drinks', 'beers', 'arak', 'prosecco', 'wine', 'signatureCocktails'].includes(translatedDish.categoryId) && '🍽️'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

                      <img
              src={getFoodImageUrl()}
              alt={getAltText()}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              } group-hover:scale-105`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ maxWidth: '300px' }}
              role="img"
              aria-describedby={`dish-desc-${dish.id}`}
            />

          {/* Image Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Dietary Tags */}
          {translatedDish.dietTags && translatedDish.dietTags.length > 0 && (
            <div className="absolute top-3 start-3 flex flex-wrap gap-1">
              {translatedDish.dietTags.map((tag) => (
                <motion.span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100/90 backdrop-blur-sm text-green-800 dark:bg-green-900/60 dark:text-green-300 shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {translateDietTag(tag, language)}
                </motion.span>
              ))}
            </div>
          )}

          {/* Popularity badge removed - no ordering occurs */}

          {/* Error/Unavailable Badge */}
          {!dish.available && (
            <div className="absolute top-3 end-3">
              <motion.span 
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100/90 backdrop-blur-sm text-red-800 dark:bg-red-900/60 dark:text-red-300 shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <AlertCircle className="w-3 h-3" />
                {getErrorMessage()}
              </motion.span>
            </div>
          )}

          {/* Details Button */}
          <button
            onClick={handleDetailsClick}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            className="absolute bottom-3 end-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-resort-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-110"
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
        <div className="p-5 space-y-4">
          {/* Title and Description */}
          <div className="space-y-2">
            <h3 
              id={`dish-title-${dish.id}`}
              className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-resort-500 dark:group-hover:text-beach-dark-accent transition-colors duration-200 leading-tight"
            >
              {translatedDish.name}
            </h3>
            <p 
              id={`dish-desc-${dish.id}`}
              className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed"
            >
              {translatedDish.shortDesc || t('deliciousDish')}
            </p>
            
            {/* Rating */}
            {renderRating()}
          </div>

          {/* Price and Status */}
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-resort-500 dark:text-beach-dark-accent">
              {getPriceDisplay()}
            </div>
            
            {/* Availability Status - only show if available */}
            {dish.available && (
              <div className="text-xs px-3 py-1 rounded-full bg-green-100/80 backdrop-blur-sm dark:bg-green-900/30 text-green-800 dark:text-green-400 font-medium">
                {t('available')}
              </div>
            )}
          </div>

          {/* Quick Order Button */}
          {dish.available ? (
            <motion.button
              onClick={handleQuickOrder}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              data-testid="quick-order-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {t('orderNow')}
              </div>
            </motion.button>
          ) : (
            <motion.button
              disabled
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl transition-all duration-300 font-medium text-sm shadow-lg cursor-not-allowed opacity-75"
              data-testid="unavailable-button"
            >
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {t('unavailable')}
              </div>
            </motion.button>
          )}

          {/* Allergens */}
          {translatedDish.allergens && translatedDish.allergens.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {translatedDish.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100/80 backdrop-blur-sm dark:bg-red-900/30 text-red-800 dark:text-red-400"
                >
                  {translateAllergen(allergen, language)}
                </span>
              ))}
            </div>
          )}

          {/* Dietary Tags with Beach Theme */}
          {dish.dietTags && dish.dietTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {dish.dietTags.map((tag: string) => {
                const IconComponent = getDietaryIcon(tag)
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700"
                  >
                    <IconComponent className="w-3 h-3" />
                    {translateDietTag(tag, language)}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Enhanced Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.article>

      {/* Dish Modal */}
      <DishModal
        dish={translatedDish}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        id={`dish-modal-${dish.id}`}
      />
    </>
  )
}
