'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseAvailable } from '../lib/supabase'

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

// No fallback categories - database only

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
    rating: 0,
    reviewCount: 0,
    reviews: [],
    imageVariants: { 
      src: dbDish.image_url || '/images/placeholder.jpg'
    }
  }), [])

  // Load menu data from Supabase
  const loadMenuData = useCallback(async () => {
    try {
      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        throw new Error('Supabase client unavailable - missing environment variables')
      }
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase!
        .from('categories')
        .select('*')
        .order('order_index')

      if (categoriesError) {
        console.error('❌ Error loading categories:', categoriesError)
        setCategories([])
      } else {
        console.log('✅ Categories loaded:', categoriesData?.length)
        const transformedCategories = categoriesData?.map(cat => ({
          id: cat.id,
          name: cat.name,
          order: cat.order_index,
          description: cat.description
        })) || []
        setCategories(transformedCategories)
      }

      // Load dishes - First try with available filter
      let dishesData: any[] | null = null;
      let dishesError: any = null;

      console.log('📋 Loading dishes with available=true filter...')
      const availableResult = await supabase!
        .from('dishes')
        .select('*')
        .eq('available', true)
        .order('category_id')

      dishesData = availableResult.data
      dishesError = availableResult.error

      // If no dishes found with available=true, try loading ALL dishes
      if (!dishesError && (!dishesData || dishesData.length === 0)) {
        console.warn('⚠️ No dishes found with available=true, loading ALL dishes as fallback...')
        const allDishesResult = await supabase!
          .from('dishes')
          .select('*')
          .order('category_id')
        
        dishesData = allDishesResult.data
        dishesError = allDishesResult.error
        
        if (dishesData && dishesData.length > 0) {
          console.log('✅ Loaded ALL dishes (including unavailable):', dishesData.length)
          console.log('💡 TIP: Set available=true on dishes in database to filter them')
        }
      } else if (!dishesError && dishesData) {
        console.log('✅ Dishes loaded (available only):', dishesData.length)
      }

      if (dishesError) {
        console.error('❌ Error loading dishes:', dishesError)
        throw dishesError
      }

      if (!dishesData || dishesData.length === 0) {
        console.error('❌ No dishes found in database!')
        console.log('💡 Please check:')
        console.log('   1. Dishes table exists in Supabase')
        console.log('   2. Dishes have data')
        console.log('   3. Row Level Security (RLS) policies allow read access')
        setError('No dishes found in database')
      }

      const transformedDishes = dishesData?.map(transformDish) || []
      setDishes(transformedDishes)
      
      // Only clear error if we have dishes
      if (transformedDishes.length > 0) {
        setError(null)
      }

    } catch (err) {
      console.error('💥 Failed to load menu data:', err)
      setError('Failed to load menu. Database connection required.')
      setDishes([])
      setCategories([])
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

    // Subscribe to real-time changes only if Supabase is available
    if (isSupabaseAvailable() && supabase) {
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
        if (supabase) {
          supabase.removeChannel(dishesSubscription)
          supabase.removeChannel(categoriesSubscription)
        }
      }
    } else {
      console.warn('⚠️ Real-time subscriptions disabled - Supabase unavailable')
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
