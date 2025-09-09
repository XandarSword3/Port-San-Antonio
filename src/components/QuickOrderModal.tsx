'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Plus, Minus, Star, Clock } from 'lucide-react'
import { Dish } from '@/types'
import { formatPrice } from '@/lib/utils'
import { EASING, DURATION } from '@/lib/animation'
import { useLanguage } from '@/contexts/LanguageContext'

interface OrderDetails {
  quantity: number
  variant?: string
  specialInstructions?: string
  totalPrice: number
}

interface QuickOrderModalProps {
  isOpen: boolean
  onClose: () => void
  dish: Dish
  onSubmit?: (orderDetails: OrderDetails) => Promise<void>
}

export default function QuickOrderModal({
  isOpen,
  onClose,
  dish,
  onSubmit
}: QuickOrderModalProps) {
  const { t, language } = useLanguage()
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    dish.variants && dish.variants.length > 0 ? dish.variants[0].label : null
  )

  const translateVariantLabel = (label: string): string => {
    switch (label?.toLowerCase()) {
      case 'small':
        return t('sizeSmall')
      case 'large':
        return t('sizeLarge')
      case 'medium':
        return t('sizeMedium')
      default:
        return label
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    try {
      const orderDetails: OrderDetails = {
        quantity,
        variant: selectedVariant || undefined,
        specialInstructions: specialInstructions || undefined,
        totalPrice: getTotalPrice()
      }
      
      if (onSubmit) {
        await onSubmit(orderDetails)
      } else {
        console.log('Adding to cart:', orderDetails)
      }
      
      // Close modal and show success message
      onClose()
      // You could show a toast notification here
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Show error toast or message
    }
  }

  const getTotalPrice = () => {
    let basePrice = dish.price || 0
    if (selectedVariant && dish.variants) {
      const variant = dish.variants.find(v => v.label === selectedVariant)
      if (variant) {
        basePrice = variant.price
      }
    }
    return basePrice * quantity
  }

  const getCurrentPrice = () => {
    if (selectedVariant && dish.variants) {
      const variant = dish.variants.find(v => v.label === selectedVariant)
      if (variant) {
        return variant.price
      }
    }
    return dish.price || 0
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: DURATION.medium, ease: EASING.soft }}
          >
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden">
              {/* Glassmorphism Container */}
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                {/* Header */}
                <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                      <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('orderNow')}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('addToCart')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                    aria-label="Close order modal"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Dish Info */}
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {dish.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {dish.shortDesc || t('deliciousDish')}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatPrice(getCurrentPrice(), dish.currency)}
                        </div>
                        {/* Popularity badge removed - no ordering occurs */}
                      </div>
                    </div>
                  </div>

                  {/* Variants Selection */}
                  {dish.variants && dish.variants.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {t('selectOption')}
                      </h4>
                      <div className="grid gap-2">
                        {dish.variants.map((variant) => (
                          <button
                            key={variant.label}
                            onClick={() => setSelectedVariant(variant.label)}
                            className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                              selectedVariant === variant.label
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{translateVariantLabel(variant.label)}</span>
                              <span className="text-sm font-semibold">
                                {formatPrice(variant.price, dish.currency)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selection */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t('quantity')}
                    </h4>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold text-gray-900 dark:text-white min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 10}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t('specialInstructions')}
                    </h4>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder={t('specialInstructions')}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      rows={3}
                    />
                  </div>

                  {/* Total Price */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('price')}
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatPrice(getTotalPrice(), dish.currency)}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      {t('addToCart')}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
