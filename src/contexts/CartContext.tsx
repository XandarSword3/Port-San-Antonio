'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Dish } from '@/types'

interface CartItem {
  dish: Dish
  quantity: number
  selectedVariant?: {
    name: string
    price: number
    currency: string
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (dish: Dish, quantity?: number, variant?: CartItem['selectedVariant']) => void
  removeItem: (dishId: string, variant?: CartItem['selectedVariant']) => void
  updateQuantity: (dishId: string, quantity: number, variant?: CartItem['selectedVariant']) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (dish: Dish, quantity: number = 1, variant?: CartItem['selectedVariant']) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => 
        item.dish.id === dish.id && 
        JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        return [...prevItems, { dish, quantity, selectedVariant: variant }]
      }
    })
  }

  const removeItem = (dishId: string, variant?: CartItem['selectedVariant']) => {
    setItems(prevItems => 
      prevItems.filter(item => 
        !(item.dish.id === dishId && 
          JSON.stringify(item.selectedVariant) === JSON.stringify(variant))
      )
    )
  }

  const updateQuantity = (dishId: string, quantity: number, variant?: CartItem['selectedVariant']) => {
    if (quantity <= 0) {
      removeItem(dishId, variant)
      return
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.dish.id === dishId && 
        JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.selectedVariant?.price || item.dish.price || 0
      return total + (price * item.quantity)
    }, 0)
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
