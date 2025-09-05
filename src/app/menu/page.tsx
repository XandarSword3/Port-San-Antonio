'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter } from 'lucide-react'
import { Dish, Category, FilterState } from '@/types'
import DishCard from '@/components/DishCard'
import CategoryStrip from '@/components/CategoryStrip'
import CategoryAccordion from '@/components/CategoryAccordion'
import FilterChips from '@/components/FilterChips'
import FilterModal from '@/components/FilterModal'
import QuickOrderModal from '@/components/QuickOrderModal'
import SideRail from '@/components/SideRail'
import MobileBanner from '@/components/MobileBanner'
import MenuSkeleton from '@/components/MenuSkeleton'
import SearchInput from '@/components/SearchInput'
import BackButton from '@/components/BackButton'
import { useLanguage } from '@/contexts/LanguageContext'
import { translateCategory } from '@/lib/dishTranslations'

export default function MenuPage() {
  const { t, language } = useLanguage()
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [ads, setAds] = useState<any[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedCategory: 'starters',
    activeDietFilters: [],
    availabilityOnly: false,
    priceBucket: null,
  })
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [quickOrderModalOpen, setQuickOrderModalOpen] = useState(false)
  const [selectedDishForOrder, setSelectedDishForOrder] = useState<Dish | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from JSON file and restore session filters
  useEffect(() => {
    const loadData = async () => {
      try {
        // First check if there are admin changes in localStorage
        const adminMenuData = localStorage.getItem('menuData')
        let data
        
        if (adminMenuData) {
          // Use admin-modified data
          console.log('Loading admin-modified menu data from localStorage')
          data = { dishes: JSON.parse(adminMenuData), categories: [], ads: [] }
        } else {
          // Load from API (original JSON file)
          console.log('Loading menu data from API')
          const response = await fetch('/api/menu')
          if (response.ok) {
            data = await response.json()
          } else {
            throw new Error('Failed to load menu data')
          }
        }
        
        const processedDishes: Dish[] = (data.dishes || []).map((d: any) => ({
          id: d.id,
          categoryId: d.categoryId,
          name: d.name,
          shortDesc: d.shortDesc || '',
          fullDesc: d.fullDesc || '',
          price: d.price || 0,
          variants: d.variants || [],
          currency: d.currency || 'USD',
          image: d.image || '',
          imageVariants: d.imageVariants || {},
          dietTags: d.dietTags || [],
          allergens: d.allergens || [],
          calories: d.calories || null,
          // popularity: d.popularity || 0, // Removed
          available: d.available || false,
          sponsored: d.sponsored || false
        }))
        setDishes(processedDishes)
        setCategories(data.categories || [])
        setAds(data.ads || [])

        // Restore session filters
        const savedFilters = sessionStorage.getItem('menuFilters')
        if (savedFilters) {
          try {
            const parsedFilters = JSON.parse(savedFilters)
            setFilters(prev => ({ ...prev, ...parsedFilters }))
          } catch (e) {
            console.warn('Failed to parse saved filters:', e)
          }
        }
      } catch (error) {
        console.error('Error loading menu data:', error)
        // Fallback to static data if API fails
        console.warn('API failed, using fallback data')
        try {
          const fallbackData = await import('@/../../data/dishes.json')
          const fallbackDishes: Dish[] = (fallbackData.dishes || []).map((d: any) => ({
            id: d.id,
            categoryId: d.categoryId,
            name: d.name,
            shortDesc: d.shortDesc || '',
            fullDesc: d.fullDesc || '',
            price: d.price || 0,
            variants: d.variants || [],
            currency: d.currency || 'USD',
            image: d.image || '',
            imageVariants: d.imageVariants || {},
            dietTags: d.dietTags || [],
            allergens: d.allergens || [],
            calories: d.calories || null,
            // popularity: d.popularity || 0, // Removed
            available: d.available || false,
            sponsored: d.sponsored || false
          }))
          setDishes(fallbackDishes)
          setCategories(fallbackData.categories || [])
          setAds(fallbackData.ads || [])
        } catch (fallbackError) {
          console.error('Fallback data loading failed:', fallbackError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Listen for admin updates
  useEffect(() => {
    const handleAdminUpdate = () => {
      console.log('Admin update detected, reloading menu data')
      const adminMenuData = localStorage.getItem('menuData')
      if (adminMenuData) {
        const data = { dishes: JSON.parse(adminMenuData), categories: [], ads: [] }
        const processedDishes: Dish[] = (data.dishes || []).map((d: any) => ({
          id: d.id,
          categoryId: d.categoryId,
          name: d.name,
          shortDesc: d.shortDesc || '',
          fullDesc: d.fullDesc || '',
          price: d.price || 0,
          variants: d.variants || [],
          currency: d.currency || 'USD',
          image: d.image || '',
          imageVariants: d.imageVariants || {},
          dietTags: d.dietTags || [],
          allergens: d.allergens || [],
          calories: d.calories || null,
          // popularity: d.popularity || 0, // Removed
          available: d.available || false,
          sponsored: d.sponsored || false
        }))
        setDishes(processedDishes)
      }
    }

    window.addEventListener('menuDataUpdated', handleAdminUpdate)
    return () => window.removeEventListener('menuDataUpdated', handleAdminUpdate)
  }, [])

  // Save filters to session storage
  useEffect(() => {
    sessionStorage.setItem('menuFilters', JSON.stringify(filters))
  }, [filters])

  const handleQuickOrder = (dish: Dish) => {
    setSelectedDishForOrder(dish)
    setQuickOrderModalOpen(true)
  }

  const handleLongPress = (dish: Dish) => {
    // Long press functionality can be implemented here
    console.log('Long press on dish:', dish.name)
  }

  // Filter dishes based on current filters
  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          dish.name.toLowerCase().includes(searchLower) ||
          dish.shortDesc?.toLowerCase().includes(searchLower) ||
          dish.fullDesc?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.selectedCategory && filters.selectedCategory !== 'all') {
        if (dish.categoryId !== filters.selectedCategory) return false
      }

      // Diet filters
      if (filters.activeDietFilters.length > 0) {
        const hasMatchingDiet = filters.activeDietFilters.some(diet => 
          dish.dietTags?.includes(diet)
        )
        if (!hasMatchingDiet) return false
      }

      // Availability filter
      if (filters.availabilityOnly && !dish.available) {
        return false
      }

      // Price filter
      if (filters.priceBucket) {
        const price = dish.price || 0
        switch (filters.priceBucket) {
          case 'lte10':
            if (price > 10) return false
            break
          case 'btw11_20':
            if (price < 11 || price > 20) return false
            break
          case 'gt20':
            if (price < 20) return false
            break
        }
      }

      return true
    })
  }, [dishes, filters])

  // Group dishes by category
  const dishesByCategory = useMemo(() => {
    const grouped: { [key: string]: Dish[] } = {}
    filteredDishes.forEach(dish => {
      if (!grouped[dish.categoryId]) {
        grouped[dish.categoryId] = []
      }
      grouped[dish.categoryId].push(dish)
    })
    return grouped
  }, [filteredDishes])

  // Get unique categories from filtered dishes
  const availableCategories = useMemo(() => {
    const categoryIds = new Set(filteredDishes.map(dish => dish.categoryId))
    return categories.filter(cat => categoryIds.has(cat.id))
  }, [filteredDishes, categories])

  if (isLoading) {
    return <MenuSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Banner */}
      <MobileBanner ads={ads} />

      {/* Header */}
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <BackButton />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('menu')}
            </h1>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <SearchInput
              value={filters.search}
              onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
              placeholder={t('searchMenu')}
            />
            <button
              onClick={() => setFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              data-testid="filter-button"
            >
              <Filter className="w-4 h-4" />
              {t('filters')}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <FilterChips
        filters={filters}
        onUpdateFilters={setFilters}
        availableCategories={availableCategories}
      />

      {/* Main Content */}
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SideRail
                selectedCategory={filters.selectedCategory}
                onCategorySelect={(categoryId: string) => 
                  setFilters(prev => ({ ...prev, selectedCategory: categoryId }))
                }
                onFilterToggle={() => setFilterPanelOpen(!filterPanelOpen)}
                filterPanelOpen={filterPanelOpen}
              />
            </div>

            {/* Menu Content */}
            <div className="lg:col-span-3">
              {Object.keys(dishesByCategory).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {t('noDishesFound')}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {availableCategories.map(category => {
                    const categoryDishes = dishesByCategory[category.id] || []
                    if (categoryDishes.length === 0) return null

                    return (
                      <CategoryAccordion
                        key={category.id}
                        category={category}
                        dishes={categoryDishes}
                        onQuickOrder={handleQuickOrder}
                        onLongPress={handleLongPress}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onUpdateFilters={setFilters}
        availableCategories={availableCategories}
      />

      {selectedDishForOrder && (
        <QuickOrderModal
          isOpen={quickOrderModalOpen}
          onClose={() => setQuickOrderModalOpen(false)}
          dish={selectedDishForOrder}
        />
      )}
    </div>
  )
}
