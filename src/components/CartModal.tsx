'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useCurrency } from '@/contexts/CurrencyContext'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenFullCart?: () => void
}

export default function CartModal({ isOpen, onClose, onOpenFullCart }: CartModalProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const { formatPrice } = useCurrency()

  const handleQuantityChange = (dishId: string, newQuantity: number, variant?: any) => {
    updateQuantity(dishId, newQuantity, variant)
  }

  const handleRemoveItem = (dishId: string, variant?: any) => {
    removeItem(dishId, variant)
  }

  const totalPrice = getTotalPrice()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Order
                </h2>
                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-sm font-medium">
                  {items.length} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Your cart is empty
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Add some delicious Lebanese dishes to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.dish.id}-${JSON.stringify(item.selectedVariant)}`}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Dish Image */}
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                          {item.dish.image ? (
                            <img
                              src={item.dish.image}
                              alt={item.dish.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingBag className="h-6 w-6" />
                            </div>
                          )}
                        </div>

                        {/* Dish Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {item.dish.name}
                          </h3>
                          {item.selectedVariant && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {item.selectedVariant.name}
                            </p>
                          )}
                          <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                            {formatPrice(item.selectedVariant?.price || item.dish.price || 0)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(
                              item.dish.id, 
                              item.quantity - 1, 
                              item.selectedVariant
                            )}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(
                              item.dish.id, 
                              item.quantity + 1, 
                              item.selectedVariant
                            )}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.dish.id, item.selectedVariant)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenFullCart?.();
                    }}
                    className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium"
                  >
                    View Full Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
