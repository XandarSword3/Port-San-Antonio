'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Import the existing types from the main types file
import type { Category as BaseCategory, Dish as BaseDish } from '../types'

// Use the existing types for compatibility
export type Category = BaseCategory
export type Dish = BaseDish

interface MenuContextType {
  categories: Category[]
  dishes: Dish[]
  loading: boolean
  error: string | null
  refreshMenu: () => Promise<void>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}

// Fallback data (existing JSON data as backup)
const fallbackCategories: Category[] = [
  { id: 'appetizers', name: 'Appetizers', order: 1 },
  { id: 'main-courses', name: 'Main Courses', order: 2 },
  { id: 'drinks', name: 'Drinks', order: 3 },
  { id: 'beers', name: 'Beers', order: 4 },
  { id: 'arak', name: 'Arak', order: 5 },
  { id: 'desserts', name: 'Desserts', order: 6 }
]

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Transform database dish to component dish format
  const transformDish = useCallback((dbDish: any): Dish => ({
    id: dbDish.id,
    name: dbDish.name,
    shortDesc: dbDish.short_desc || dbDish.name,
    fullDesc: dbDish.full_desc || `Delicious ${dbDish.name} from our kitchen`,
    price: dbDish.price || 0,
    categoryId: dbDish.category_id,
    currency: dbDish.currency || 'USD',
    image: dbDish.image_url || '/images/placeholder.jpg',
    available: dbDish.available !== false,
    sponsored: false,
    // Default values for compatibility with existing type
    variants: [],
    dietTags: [],
    allergens: [],
    ingredients: [],
    calories: null,
    rating: 4.5,
    reviewCount: 0,
    imageVariants: { 
      src: dbDish.image_url || '/images/placeholder.jpg'
    }
  }), [])

  // Load menu data from Supabase
  const loadMenuData = useCallback(async () => {
    try {
      console.log('🔄 Loading menu data from Supabase...')
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('order_index')

      if (categoriesError) {
        console.error('❌ Error loading categories:', categoriesError)
        setCategories(fallbackCategories)
      } else {
        console.log('✅ Categories loaded:', categoriesData?.length)
        const transformedCategories = categoriesData?.map(cat => ({
          id: cat.id,
          name: cat.name,
          order: cat.order_index,
          description: cat.description
        })) || fallbackCategories
        setCategories(transformedCategories)
      }

      // Load dishes
      const { data: dishesData, error: dishesError } = await supabase
        .from('dishes')
        .select('*')
        .eq('available', true)
        .order('category_id')

      if (dishesError) {
        console.error('❌ Error loading dishes:', dishesError)
        throw dishesError
      }

      console.log('✅ Dishes loaded:', dishesData?.length)
      const transformedDishes = dishesData?.map(transformDish) || []
      setDishes(transformedDishes)
      setError(null)

    } catch (err) {
      console.error('💥 Failed to load menu data:', err)
      setError('Failed to load menu. Please refresh the page.')
      // Load fallback data
      try {
        const dishesResponse = await fetch('/data/dishes.json')
        if (dishesResponse.ok) {
          const fallbackData = await dishesResponse.json()
          setDishes(fallbackData.dishes || [])
          console.log('📦 Loaded fallback menu data')
        }
      } catch (fallbackError) {
        console.error('❌ Failed to load fallback data:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }, [transformDish])

  // Refresh menu data
  const refreshMenu = useCallback(async () => {
    setLoading(true)
    await loadMenuData()
  }, [loadMenuData])

  // Setup real-time subscriptions
  useEffect(() => {
    // Initial load
    loadMenuData()

    // Subscribe to real-time changes
    console.log('🔔 Setting up real-time subscriptions...')
    
    const dishesSubscription = supabase
      .channel('dishes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dishes'
        },
        (payload) => {
          console.log('🔄 Dish change detected:', payload.eventType)
          // Reload dishes when changes occur
          loadMenuData()
        }
      )
      .subscribe()

    const categoriesSubscription = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        (payload) => {
          console.log('🔄 Category change detected:', payload.eventType)
          // Reload categories when changes occur
          loadMenuData()
        }
      )
      .subscribe()

    // Cleanup subscriptions
    return () => {
      console.log('🧹 Cleaning up subscriptions...')
      supabase.removeChannel(dishesSubscription)
      supabase.removeChannel(categoriesSubscription)
    }
  }, [loadMenuData])

  const value: MenuContextType = {
    categories,
    dishes,
    loading,
    error,
    refreshMenu
  }

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  )
}
