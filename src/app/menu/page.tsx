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
    selectedCategory: null,
    activeDietFilters: [],
    availabilityOnly: false,
    priceBucket: null,
  })
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [quickOrderModalOpen, setQuickOrderModalOpen] = useState(false)
  const [selectedDishForOrder, setSelectedDishForOrder] = useState<Dish | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore filters from session storage on mount
  useEffect(() => {
    try {
      const savedFilters = sessionStorage.getItem('menuFilters')
      if (savedFilters && savedFilters !== 'undefined' && savedFilters.length > 0) {
        const parsedFilters = JSON.parse(savedFilters)
        setFilters(parsedFilters)
      }
    } catch (error) {
      console.error('Error parsing saved filters:', error)
      // Clear invalid session storage
      sessionStorage.removeItem('menuFilters')
    }
  }, [])

  // Load data from JSON file and restore session filters
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/menu')
        if (response.ok) {
          const data = await response.json()
          
          // Process dishes with proper typing
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
            available: d.available !== false,
            sponsored: d.sponsored || false
          }))
          
          setDishes(processedDishes)
          setCategories(data.categories || [])
          setAds(data.ads || [])
        }
      } catch (error) {
        console.error('Error loading menu data:', error)
        setDishes([])
        setCategories([])
        setAds([])
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

  // Create dietary filter options
  const dietFilterOptions = useMemo(() => [
    { id: 'vegetarian', label: 'Vegetarian', active: filters.activeDietFilters.includes('vegetarian') },
    { id: 'vegan', label: 'Vegan', active: filters.activeDietFilters.includes('vegan') },
    { id: 'gluten-free', label: 'Gluten Free', active: filters.activeDietFilters.includes('gluten-free') },
    { id: 'nuts-free', label: 'Nuts Free', active: filters.activeDietFilters.includes('nuts-free') },
    { id: 'sugar-free', label: 'Sugar Free', active: filters.activeDietFilters.includes('sugar-free') },
    { id: 'dairy-free', label: 'Dairy Free', active: filters.activeDietFilters.includes('dairy-free') },
    { id: 'keto', label: 'Keto', active: filters.activeDietFilters.includes('keto') },
    { id: 'paleo', label: 'Paleo', active: filters.activeDietFilters.includes('paleo') }
  ], [filters.activeDietFilters])

  // Handle diet filter toggle
  const toggleDietFilter = (filterId: string) => {
    setFilters(prev => {
      const wasActive = prev.activeDietFilters.includes(filterId)
      const newActiveDietFilters = wasActive
        ? prev.activeDietFilters.filter(id => id !== filterId)
        : [...prev.activeDietFilters, filterId]
      
      return {
        ...prev,
        activeDietFilters: newActiveDietFilters
      }
    })
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: '',
      selectedCategory: null,
      activeDietFilters: [],
      availabilityOnly: false,
      priceBucket: null,
    })
  }

  // Check if has active filters
  const hasActiveFilters = filters.activeDietFilters.length > 0 || 
                          filters.availabilityOnly || 
                          filters.priceBucket !== null

  // Filter dishes based on current filters
  const filteredDishes = useMemo(() => {
    let result = dishes

    // Filter by search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(dish => 
        dish.name.toLowerCase().includes(searchTerm) ||
        dish.shortDesc?.toLowerCase().includes(searchTerm) ||
        dish.fullDesc?.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by category
    if (filters.selectedCategory) {
      result = result.filter(dish => dish.categoryId === filters.selectedCategory)
    }

    // Filter by diet tags
    if (filters.activeDietFilters.length > 0) {
      result = result.filter(dish => {
        const hasMatchingDiet = filters.activeDietFilters.some(diet => 
          dish.dietTags && dish.dietTags.includes(diet)
        )
        return hasMatchingDiet
      })
    }

    // Filter by availability
    if (filters.availabilityOnly) {
      result = result.filter(dish => dish.available)
    }

    // Filter by price bucket
    if (filters.priceBucket) {
      result = result.filter(dish => {
        const price = dish.price || 0
        switch (filters.priceBucket) {
          case 'lte10': return price <= 10
          case 'btw11_20': return price >= 11 && price <= 20
          case 'gt20': return price > 20
          default: return true
        }
      })
    }

    return result
  }, [dishes, filters])

  // Calculate diet counts
  const dietCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    const dietTypes = ['vegetarian', 'vegan', 'gluten-free', 'nuts-free', 'sugar-free', 'dairy-free', 'keto', 'paleo']
    dietTypes.forEach(dietType => {
      counts[dietType] = dishes.filter(dish => 
        dish.dietTags && dish.dietTags.includes(dietType)
      ).length
    })
    return counts
  }, [dishes])

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
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <BackButton />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center flex-1">
              {t('menu')}
            </h1>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>

          {/* Search and Filter Row */}
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <SearchInput
                value={filters.search}
                onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
                placeholder={t('searchMenu')}
              />
            </div>
            <button
              onClick={() => setFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors shadow-sm"
              data-testid="filter-button"
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="bg-white text-primary-500 text-xs px-2 py-0.5 rounded-full font-medium">
                  {filters.activeDietFilters.length + (filters.availabilityOnly ? 1 : 0) + (filters.priceBucket ? 1 : 0)}
                </span>
              )}
              <span className="hidden sm:inline">{t('filters')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Strip */}
      <CategoryStrip
        categories={availableCategories}
        selectedCategory={filters.selectedCategory}
        onCategorySelect={(categoryId) => 
          setFilters(prev => ({ ...prev, selectedCategory: categoryId }))
        }
      />

      {/* Filter Chips */}
      <FilterChips
        filters={dietFilterOptions}
        onFilterToggle={toggleDietFilter}
        onClearAll={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        isOpen={true}
        availabilityOnly={filters.availabilityOnly}
        onAvailabilityToggle={() => setFilters(prev => ({ ...prev, availabilityOnly: !prev.availabilityOnly }))}
        priceBucket={filters.priceBucket}
        onPriceBucketChange={(bucket) => setFilters(prev => ({ ...prev, priceBucket: bucket }))}
        dietCounts={dietCounts}
      />

      {/* Main Content */}
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SideRail
                ads={[]}
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
        onFiltersChange={setFilters}
        dietFilterOptions={dietFilterOptions}
        dietCounts={dietCounts}
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
