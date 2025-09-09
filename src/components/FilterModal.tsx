'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Filter, Sliders, DollarSign, Leaf, Clock, Star, Waves, Shell, Fish, Palmtree } from 'lucide-react'
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

  const handleDietFilterToggle = (filterId: string) => {
    console.log('FilterModal: Toggling diet filter:', filterId)
    const wasActive = filters.activeDietFilters.includes(filterId)
    const newActiveDietFilters = wasActive
      ? filters.activeDietFilters.filter(id => id !== filterId)
      : [...filters.activeDietFilters, filterId]
    
    console.log('FilterModal: Previous filters:', filters.activeDietFilters)
    console.log('FilterModal: New filters:', newActiveDietFilters)
    
    onFiltersChange({
      ...filters,
      activeDietFilters: newActiveDietFilters
    })
  }

  const handleAvailabilityToggle = () => {
    onFiltersChange({ ...filters, availabilityOnly: !filters.availabilityOnly })
  }

  const handlePriceBucketChange = (bucket: 'lte10' | 'btw11_20' | 'gt20' | null) => {
    onFiltersChange({ ...filters, priceBucket: bucket })
  }

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      search: '',
      selectedCategory: null,
      activeDietFilters: [],
      availabilityOnly: false,
      priceBucket: null,
    }
    onFiltersChange(resetFilters)
    onClose()
  }

  const handleApplyFilters = () => {
    onClose()
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
    const translationKeys: Record<string, string> = {
      'vegetarian': t('vegetarian'),
      'vegan': t('vegan'),
      'gluten-free': t('glutenFree'),
      'nuts-free': t('nutsFree'),
      'sugar-free': t('sugarFree'),
      'dairy-free': t('dairyFree'),
      'keto': t('keto'),
      'paleo': t('paleo')
    }
    return translationKeys[tag] || tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Beach-themed Backdrop */}
          <motion.div
            className="fixed inset-0 bg-gradient-to-b from-sky-900/70 via-blue-900/70 to-blue-800/70 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Floating beach elements in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[Waves, Shell, Fish, Palmtree].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{ 
                    opacity: [0, 0.1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50]
                  }}
                  transition={{
                    duration: 8,
                    delay: i * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${10 + i * 15}%`
                  }}
                >
                  <Icon className="w-16 h-16 text-white/5" />
                </motion.div>
              ))}
            </div>
          </motion.div>

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
                        {t('refineMenuSearch')}
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
                        {t('priceRange')}
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {(['lte10', 'btw11_20', 'gt20'] as const).map((bucket) => (
                        <button
                          key={bucket}
                          onClick={() => handlePriceBucketChange(
                            filters.priceBucket === bucket ? null : bucket
                          )}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            filters.priceBucket === bucket
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
                        {t('availability')}
                      </h3>
                    </div>
                    <button
                      onClick={handleAvailabilityToggle}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                        filters.availabilityOnly
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{t('availableItemsOnly')}</span>
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
                          filters.availabilityOnly
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {filters.availabilityOnly && (
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
                        {t('dietaryPreferences')}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {dietFilterOptions.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => handleDietFilterToggle(filter.id)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            filters.activeDietFilters.includes(filter.id)
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
                    {t('resetAll')}
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      onClick={handleApplyFilters}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                      {t('applyFilters')}
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
