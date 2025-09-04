'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { Dish, Category, FilterState, DietFilter } from '@/types'
import DishCard from '@/components/DishCard'
import CategoryStrip from '@/components/CategoryStrip'
import FilterChips from '@/components/FilterChips'
import SideRail from '@/components/SideRail'
import MobileBanner from '@/components/MobileBanner'
import MenuSkeleton from '@/components/MenuSkeleton'
import SearchInput from '@/components/SearchInput'
import BackButton from '@/components/BackButton'
import { EASING, DURATION } from '@/lib/animation'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MenuPage() {
  const { t } = useLanguage()
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
  const [isLoading, setIsLoading] = useState(true)

  // Load data from JSON file and restore session filters
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/menu')
        if (response.ok) {
          const data = await response.json()
          setDishes(data.dishes || [])
          setCategories(data.categories || [])
          setAds(data.ads || [])
        } else {
          // Fallback to static data if API fails
          console.warn('API failed, using fallback data')
          const fallbackData = await import('@/../../data/dishes.json')
          setDishes(fallbackData.dishes || [])
          setCategories(fallbackData.categories || [])
          setAds(fallbackData.ads || [])
        }
      } catch (error) {
        console.error('Error loading menu data:', error)
        // Fallback to static data
        try {
          const fallbackData = await import('@/../../data/dishes.json')
          setDishes(fallbackData.dishes || [])
          setCategories(fallbackData.categories || [])
          setAds(fallbackData.ads || [])
        } catch (fallbackError) {
          console.error('Fallback data also failed:', fallbackError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Restore filters from sessionStorage
    const saved = sessionStorage.getItem('menuFilters')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setFilters(prev => ({ ...prev, ...parsed }))
      } catch {}
    }

    // Listen for admin updates
    const handleAdminUpdate = () => {
      loadData()
    }

    window.addEventListener('admin-update', handleAdminUpdate)
    
    return () => {
      window.removeEventListener('admin-update', handleAdminUpdate)
    }
  }, [])

  // Create diet filter options - include predefined options plus any from dishes
  const dietFilterOptions = useMemo(() => {
    // Predefined filter options to ensure they're always available
    const predefinedFilters = [
      'vegetarian',
      'vegan',
      'gluten-free',
      'nuts-free',
      'sugar-free',
      'dairy-free',
      'keto',
      'paleo'
    ];
    
    const allDietTags = new Set<string>(predefinedFilters)
    dishes.forEach(dish => {
      if (dish.dietTags) {
        dish.dietTags.forEach(tag => allDietTags.add(tag))
      }
    })
    
    return Array.from(allDietTags).map(tag => ({
      id: tag,
      label: tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' '),
      active: filters.activeDietFilters.includes(tag)
    }))
  }, [dishes, filters.activeDietFilters])

  // Counts per diet filter considering other active filters
  const dietCounts = useMemo(() => {
    const baseFilter = (dish: Dish) => {
      // Apply all current filters except diet tag itself
      // Search
      const q = filters.search?.trim().toLowerCase();
      if (q) {
        const name = (dish.name ?? '').toString().toLowerCase();
        const shortDesc = (dish.shortDesc ?? '').toString().toLowerCase();
        const fullDesc = (dish.fullDesc ?? '').toString().toLowerCase();
        const allergens = (dish.allergens ?? []).join(' ').toLowerCase();
        const variants = (dish.variants ?? []).map(v => (v.label ?? '') + ' ' + (v.price ?? '')).join(' ').toLowerCase();
        if (!name.includes(q) && !shortDesc.includes(q) && !fullDesc.includes(q) && !allergens.includes(q) && !variants.includes(q)) {
          return false;
        }
      }
      if (filters.selectedCategory && dish.categoryId !== filters.selectedCategory) return false
      if (filters.availabilityOnly && !dish.available) return false
      if (filters.priceBucket) {
        const values = dish.variants && dish.variants.length ? dish.variants.map(v => v.price) : (dish.price ? [dish.price] : [])
        if (values.length === 0) return false
        const min = Math.min(...values)
        const max = Math.max(...values)
        switch (filters.priceBucket) {
          case 'lte10': if (!(min <= 10)) return false; break
          case 'btw11_20': if (!(max >= 11 && min <= 20)) return false; break
          case 'gt20': if (!(max > 20)) return false; break
        }
      }
      // For existing active diet tags, require them too
      if (filters.activeDietFilters.length > 0) {
        const hasAll = (filters.activeDietFilters || []).every(tag => dish.dietTags?.includes(tag))
        if (!hasAll) return false
      }
      return true
    }
    const counts: Record<string, number> = {}
    const tags = new Set<string>()
    dishes.forEach(d => (d.dietTags || []).forEach(tag => tags.add(tag)))
    Array.from(tags).forEach(tag => {
      counts[tag] = dishes.filter(d => baseFilter(d) && d.dietTags?.includes(tag)).length
    })
    return counts
  }, [dishes, filters])

  // Filter dishes based on current filters
  const filteredDishes = useMemo(() => {
    const matches: Dish[] = dishes.filter(dish => {
      // Search filter (defensive + matches name, shortDesc, fullDesc, ingredients, variants)
      const q = filters.search?.trim().toLowerCase();
      if (q) {
        const name = (dish.name ?? '').toString().toLowerCase();
        const shortDesc = (dish.shortDesc ?? '').toString().toLowerCase();
        const fullDesc = (dish.fullDesc ?? '').toString().toLowerCase();
        const allergens = (dish.allergens ?? []).join(' ').toLowerCase();
        const variants = (dish.variants ?? []).map(v => (v.label ?? '') + ' ' + (v.price ?? '')).join(' ').toLowerCase();
        if (!name.includes(q) && !shortDesc.includes(q) && !fullDesc.includes(q) && !allergens.includes(q) && !variants.includes(q)) {
          return false;
        }
      }

      // Category filter
      if (filters.selectedCategory && dish.categoryId !== filters.selectedCategory) {
        return false
      }

      // Diet filter
      if (filters.activeDietFilters.length > 0) {
        const hasMatchingDiet = dish.dietTags && dish.dietTags.some(tag => 
          filters.activeDietFilters.includes(tag)
        )
        if (!hasMatchingDiet) {
          return false
        }
      }

      // Availability
      if (filters.availabilityOnly && !dish.available) {
        return false
      }

      // Price buckets
      if (filters.priceBucket) {
        const priceValues = dish.variants && dish.variants.length > 0
          ? dish.variants.map(v => v.price)
          : (dish.price ? [dish.price] : [])

        if (priceValues.length === 0) return false

        const min = Math.min(...priceValues)
        const max = Math.max(...priceValues)

        switch (filters.priceBucket) {
          case 'lte10':
            if (!(min <= 10)) return false
            break
          case 'btw11_20':
            if (!(max >= 11 && min <= 20)) return false
            break
          case 'gt20':
            if (!(max > 20)) return false
            break
        }
      }

      return true
    })
    return matches
  }, [dishes, filters])

  // Persist filters to sessionStorage
  useEffect(() => {
    try {
      const toSave = {
        search: filters.search,
        selectedCategory: filters.selectedCategory,
        activeDietFilters: filters.activeDietFilters,
        availabilityOnly: filters.availabilityOnly,
        priceBucket: filters.priceBucket,
      }
      sessionStorage.setItem('menuFilters', JSON.stringify(toSave))
    } catch {}
  }, [filters])

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

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setFilters(prev => ({
      ...prev,
      selectedCategory: categoryId
    }))
  }

  // Handle diet filter toggle
  const handleDietFilterToggle = (filterId: string) => {
    setFilters(prev => ({
      ...prev,
      activeDietFilters: prev.activeDietFilters.includes(filterId)
        ? prev.activeDietFilters.filter(id => id !== filterId)
        : [...prev.activeDietFilters, filterId]
    }))
  }

  const handleAvailabilityToggle = () => {
    setFilters(prev => ({ ...prev, availabilityOnly: !prev.availabilityOnly }))
  }

  const handlePriceBucketChange = (bucket: 'lte10' | 'btw11_20' | 'gt20' | null) => {
    setFilters(prev => ({ ...prev, priceBucket: bucket }))
  }

  // Handle search input
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: '',
      selectedCategory: 'starters',
      activeDietFilters: [],
      availabilityOnly: false,
      priceBucket: null,
    })
  }

  // Handle long-press on dish card
  const handleDishLongPress = (dish: Dish) => {
    console.log('Long-press triggered for:', dish.name)
  }

  if (isLoading) {
    return <MenuSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white dark:bg-beach-dark-bg shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <BackButton />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-beach-dark-text accent-element">{t('menuTitle')}</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <SearchInput onSearch={handleSearchChange} placeholder={t('searchPlaceholder')} />
            </div>

            {/* Filter Button */}
            <button 
              onClick={() => {
                setFilterPanelOpen(prev => !prev)
                console.log('Filter panel toggled:', !filterPanelOpen)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${filterPanelOpen ? 'bg-blue-700 dark:bg-beach-dark-accent/90' : 'bg-blue-600 dark:bg-beach-dark-accent'} text-white hover:bg-blue-700 dark:hover:bg-beach-dark-accent/90`}
              aria-expanded={filterPanelOpen}
              aria-controls="filter-panel"
              data-testid="filter-button"
            >
              <Filter className="w-4 h-4" />
              {t('filters')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Category Strip */}
            <CategoryStrip
              categories={categories}
              selectedCategory={filters.selectedCategory}
              onCategorySelect={handleCategorySelect}
            />

            {/* Filter Chips */}
            <FilterChips
              filters={dietFilterOptions}
              onFilterToggle={handleDietFilterToggle}
              onClearAll={clearAllFilters}
              hasActiveFilters={filters.activeDietFilters.length > 0 || !!filters.search || !!filters.selectedCategory}
              isOpen={filterPanelOpen}
              availabilityOnly={!!filters.availabilityOnly}
              onAvailabilityToggle={handleAvailabilityToggle}
              priceBucket={filters.priceBucket || null}
              onPriceBucketChange={handlePriceBucketChange}
              dietCounts={dietCounts}
            />

            {/* Dishes Grid */}
            <div className="mt-8">
              {Object.keys(dishesByCategory).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-beach-dark-muted text-lg">No dishes found matching your filters.</p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-6 py-2 bg-blue-600 dark:bg-beach-dark-accent text-white rounded-lg hover:bg-blue-700 dark:hover:bg-beach-dark-accent/90 transition-colors duration-200"
                  >
                    {t('clearAll')}
                  </button>
                </div>
              ) : (
                Object.entries(dishesByCategory).map(([categoryId, categoryDishes]) => {
                  const category = categories.find(c => c.id === categoryId)
                  return (
                    <div key={categoryId} className="mb-12">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-beach-dark-text mb-6 accent-element">
                        {category?.name || categoryId}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryDishes.map((dish, index) => (
                                                     <motion.div
                             key={dish.id}
                             initial={{ opacity: 0, y: 12 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             transition={{ duration: DURATION.medium, ease: EASING.soft, delay: index * 0.06 }}
                             viewport={{ once: true }}
                           >
                            <DishCard
                              dish={dish}
                              onLongPress={handleDishLongPress}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Side Rail */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <SideRail ads={ads} />
          </div>
        </div>
      </div>

      {/* Mobile Banner */}
      <MobileBanner ads={ads} />
    </div>
  )
}
