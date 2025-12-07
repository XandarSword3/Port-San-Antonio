'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter } from 'lucide-react'
import { Dish, Category, FilterState } from '@/types'
import { useMenu } from '@/contexts/MenuContext'
import DishCard from '@/components/DishCard'
import CategoryStrip from '@/components/CategoryStrip'
import CategoryAccordion from '@/components/CategoryAccordion'
import FilterChips from '@/components/FilterChips'
import FilterModal from '@/components/FilterModal'
import MenuStructuredData from '@/components/MenuStructuredData'
import ParticleBackground from '@/components/ParticleBackground'

import SideRail from '@/components/SideRail'
import MobileBanner from '@/components/MobileBanner'
import MenuSkeleton from '@/components/MenuSkeleton'
import BeachLoading from '@/components/BeachLoading'
import SearchInput from '@/components/SearchInput'
import ExpandableSearchBar from '@/components/ExpandableSearchBar'
import ExpandableMenuHeader from '@/components/ExpandableMenuHeader'
import UnifiedFilterBox from '@/components/UnifiedFilterBox'
import BackButton from '@/components/BackButton'
import PageTransition from '@/components/PageTransition'
import { useLanguage } from '@/contexts/LanguageContext'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { OfflineStorage } from '@/lib/offlineStorage'
import { translateCategory } from '@/lib/dishTranslations'
import { usePageView, useSearchTracking } from '@/hooks/useAnalytics'
import { 
  getPerformanceManager, 
  getAdaptiveDuration, 
  getAdaptiveStagger,
  type DeviceTier 
} from '@/lib/hardwareDetection'

export default function MenuPage() {
  const { t, language } = useLanguage()
  const { isOnline } = useOnlineStatus()
  
  // Analytics tracking
  usePageView('/menu')
  const trackSearch = useSearchTracking()
  
  // Hardware detection for adaptive animations
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('medium')
  const [mounted, setMounted] = useState(false)
  
  // Get menu data from context (database or fallback)
  const { dishes, categories, loading: menuLoading, error: menuError, refreshMenu } = useMenu()
  const [ads, setAds] = useState<any[]>([])
  const [usingAdminData, setUsingAdminData] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedCategory: null,
    activeDietFilters: [],
    availabilityOnly: false,
    priceBucket: null,
  })
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Initialize hardware detection
  useEffect(() => {
    setMounted(true)
    const perfManager = getPerformanceManager()
    const capabilities = perfManager.getCapabilities()
    setDeviceTier(capabilities.tier)
    
    perfManager.start()

    const handleTierChange = (e: CustomEvent) => {
      setDeviceTier(e.detail.tier)
    }

    window.addEventListener('performance-tier-changed', handleTierChange as EventListener)

    return () => {
      perfManager.stop()
      window.removeEventListener('performance-tier-changed', handleTierChange as EventListener)
    }
  }, [])

  // Check admin status
  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminAuthenticated')
    setIsAdmin(adminSession === 'true')
  }, [])

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

  // No ads - database only system
  useEffect(() => {
    setAds([])
  }, [])

  // Update loading state based on MenuContext
  useEffect(() => {
    setIsLoading(menuLoading)
  }, [menuLoading])

  // MenuContext handles real-time updates automatically

  // Save filters to session storage
  useEffect(() => {
    sessionStorage.setItem('menuFilters', JSON.stringify(filters))
  }, [filters])



  const handleLongPress = (dish: Dish) => {
    // Long press functionality can be implemented here
    console.log('Long press on dish:', dish.name)
  }

  // Create dietary filter options
  const dietFilterOptions = useMemo(() => [
    { id: 'vegetarian', label: t('vegetarian') || 'Vegetarian', active: filters.activeDietFilters.includes('vegetarian') },
    { id: 'vegan', label: t('vegan') || 'Vegan', active: filters.activeDietFilters.includes('vegan') },
    { id: 'gluten-free', label: t('glutenFree') || 'Gluten Free', active: filters.activeDietFilters.includes('gluten-free') },
    { id: 'nuts-free', label: t('nutsFree') || 'Nuts Free', active: filters.activeDietFilters.includes('nuts-free') },
    { id: 'sugar-free', label: t('sugarFree') || 'Sugar Free', active: filters.activeDietFilters.includes('sugar-free') },
    { id: 'dairy-free', label: t('dairyFree') || 'Dairy Free', active: filters.activeDietFilters.includes('dairy-free') },
    { id: 'keto', label: t('keto') || 'Keto', active: filters.activeDietFilters.includes('keto') },
    { id: 'paleo', label: t('paleo') || 'Paleo', active: filters.activeDietFilters.includes('paleo') }
  ], [filters.activeDietFilters, t])

  // Handle diet filter toggle
  const toggleDietFilter = (filterId: string) => {
    console.log('Toggling diet filter:', filterId)
    setFilters(prev => {
      const wasActive = prev.activeDietFilters.includes(filterId)
      const newActiveDietFilters = wasActive
        ? prev.activeDietFilters.filter(id => id !== filterId)
        : [...prev.activeDietFilters, filterId]
      
      console.log('Previous filters:', prev.activeDietFilters)
      console.log('New filters:', newActiveDietFilters)
      
      const newFilters = {
        ...prev,
        activeDietFilters: newActiveDietFilters
      }
      
      console.log('Full new filter state:', newFilters)
      return newFilters
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
    return <BeachLoading isLoading={true} message={t('loadingMenu')} />
  }

  return (
    <PageTransition type="menu">
      <MenuStructuredData dishes={dishes} categories={categories} />
      <div className="relative min-h-screen bg-luxury-light-bg dark:bg-luxury-dark-bg">
      
      {/* Hardware-Adaptive Particle Background */}
      {mounted && (
        <ParticleBackground 
          colorScheme="blue" 
          enableInteraction={deviceTier !== 'low'}
          className="opacity-20"
        />
      )}
      
      {/* Mobile Banner */}
      <MobileBanner ads={ads} />

      {/* Expandable Header */}
      <ExpandableMenuHeader
        searchValue={filters.search}
        onSearchChange={(value) => {
          setFilters(prev => ({ ...prev, search: value }))
          
          // Track search analytics if user actually searched
          if (value.length > 2) {
            // Count results after filtering
            const searchResults = filteredDishes.filter(dish => 
              dish.name.toLowerCase().includes(value.toLowerCase()) ||
              dish.shortDesc?.toLowerCase().includes(value.toLowerCase()) ||
              dish.fullDesc?.toLowerCase().includes(value.toLowerCase())
            )
            trackSearch(value, searchResults.length)
          }
        }}
        onFilterClick={() => setFilterModalOpen(true)}
        hasActiveFilters={hasActiveFilters}
        filterCount={filters.activeDietFilters.length + (filters.availabilityOnly ? 1 : 0) + (filters.priceBucket ? 1 : 0)}
        isAdmin={isAdmin}
        usingAdminData={usingAdminData}
        onResetAdminData={() => {
          localStorage.removeItem('menuData')
          window.location.reload()
        }}
      />

      {/* Unified Filter Box */}
      <div className="px-3 sm:px-4 mt-4">
        <UnifiedFilterBox
          categories={availableCategories}
          selectedCategory={filters.selectedCategory}
          onCategorySelect={(categoryId) => 
            setFilters(prev => ({ ...prev, selectedCategory: categoryId }))
          }
          filters={dietFilterOptions}
          onFilterToggle={toggleDietFilter}
          onClearAll={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
          availabilityOnly={!!filters.availabilityOnly}
          onAvailabilityToggle={() => setFilters(prev => ({ ...prev, availabilityOnly: !prev.availabilityOnly }))}
          priceBucket={filters.priceBucket || null}
          onPriceBucketChange={(bucket) => setFilters(prev => ({ ...prev, priceBucket: bucket }))}
          dietCounts={dietCounts}
        />
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
            {/* Sidebar - Hidden on mobile and tablet, visible on larger screens */}
            <div className="hidden xl:block xl:col-span-1">
              <div className="sticky top-48 space-y-4">
                <SideRail
                  ads={[]}
                />
              </div>
            </div>

            {/* Menu Content - Full width on mobile/tablet, 3/4 on desktop */}
            <div className="xl:col-span-3">
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


      </div>
    </PageTransition>
  )
}
