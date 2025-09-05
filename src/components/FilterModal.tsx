'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Filter, Sliders, DollarSign, Leaf, Clock, Star } from 'lucide-react'
import { FilterState, DietFilter } from '@/types'
import { EASING, DURATION } from '@/lib/animation'
import { useLanguage } from '@/contexts/LanguageContext'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  dietFilterOptions: DietFilter[]
  dietCounts: Record<string, number>
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  dietFilterOptions,
  dietCounts
}: FilterModalProps) {
  const { t, language } = useLanguage()
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      search: '',
      selectedCategory: null,
      activeDietFilters: [],
      availabilityOnly: false,
      priceBucket: null,
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
    onClose()
  }

  const handleDietFilterToggle = (filterId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      activeDietFilters: prev.activeDietFilters.includes(filterId)
        ? prev.activeDietFilters.filter(id => id !== filterId)
        : [...prev.activeDietFilters, filterId]
    }))
  }

  const handleAvailabilityToggle = () => {
    setLocalFilters(prev => ({ ...prev, availabilityOnly: !prev.availabilityOnly }))
  }

  const handlePriceBucketChange = (bucket: 'lte10' | 'btw11_20' | 'gt20' | null) => {
    setLocalFilters(prev => ({ ...prev, priceBucket: bucket }))
  }

  const getPriceBucketLabel = (bucket: string) => {
    switch (bucket) {
      case 'lte10': return t('priceUnder10')
      case 'btw11_20': return t('price11to20')
      case 'gt20': return t('priceOver20')
      default: return t('allPrices')
    }
  }

  const getDietFilterLabel = (tag: string) => {
    const labels: Record<string, string> = {
      'vegetarian': 'Vegetarian',
      'vegan': 'Vegan',
      'gluten-free': 'Gluten-Free',
      'nuts-free': 'Nuts-Free',
      'sugar-free': 'Sugar-Free',
      'dairy-free': 'Dairy-Free',
      'keto': 'Keto',
      'paleo': 'Paleo'
    }
    return labels[tag] || tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            data-testid="filter-modal"
            className="fixed inset-x-0 top-32 bottom-0 z-[100] flex items-start justify-center overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: DURATION.medium, ease: EASING.soft }}
          >
            <div className="relative w-full max-w-2xl mx-4 mt-4 mb-20">
              {/* Glassmorphism Container */}
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('filters')}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Refine your menu search
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                    aria-label="Close filters"
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-visible">
                  {/* Price Range Filter */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Price Range
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {(['lte10', 'btw11_20', 'gt20'] as const).map((bucket) => (
                        <button
                          key={bucket}
                          onClick={() => handlePriceBucketChange(
                            localFilters.priceBucket === bucket ? null : bucket
                          )}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            localFilters.priceBucket === bucket
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {getPriceBucketLabel(bucket)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Availability
                      </h3>
                    </div>
                    <button
                      onClick={handleAvailabilityToggle}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                        localFilters.availabilityOnly
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Available Items Only</span>
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
                          localFilters.availabilityOnly
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {localFilters.availabilityOnly && (
                            <div className="w-full h-full rounded-full bg-white scale-75" />
                          )}
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Dietary Filters */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Dietary Preferences
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {dietFilterOptions.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => handleDietFilterToggle(filter.id)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            localFilters.activeDietFilters.includes(filter.id)
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {getDietFilterLabel(filter.id)}
                            </span>
                            <span className="text-xs bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full">
                              {dietCounts[filter.id] || 0}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    Reset All
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApplyFilters}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
