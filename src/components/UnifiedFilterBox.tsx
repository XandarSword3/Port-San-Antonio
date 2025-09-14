'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { Category, FilterState, DietFilter } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import { translateCategory } from '@/lib/dishTranslations'

interface UnifiedFilterBoxProps {
  // Category props
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
  
  // Filter props
  filters: DietFilter[]
  onFilterToggle: (filterId: string) => void
  onClearAll: () => void
  hasActiveFilters: boolean
  availabilityOnly: boolean
  onAvailabilityToggle: () => void
  priceBucket: 'lte10' | 'btw11_20' | 'gt20' | null
  onPriceBucketChange: (bucket: 'lte10' | 'btw11_20' | 'gt20' | null) => void
  dietCounts: Record<string, number>
}

export default function UnifiedFilterBox({
  categories,
  selectedCategory,
  onCategorySelect,
  filters,
  onFilterToggle,
  onClearAll,
  hasActiveFilters,
  availabilityOnly,
  onAvailabilityToggle,
  priceBucket,
  onPriceBucketChange,
  dietCounts
}: UnifiedFilterBoxProps) {
  const { t, language } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const activeDietFilters = filters.filter(f => f.active)
  const totalActiveFilters = activeDietFilters.length + (availabilityOnly ? 1 : 0) + (priceBucket ? 1 : 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Categories Section - Always Visible */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {t('categories')}
          </h3>
        </div>
        
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => onCategorySelect(null)}
            className={`flex-shrink-0 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
              selectedCategory === null
                ? 'bg-luxury-light-accent text-white shadow-md dark:bg-luxury-dark-accent dark:text-luxury-dark-text'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('allDishes')}
          </button>
          {categories.map((category) => {
            const translatedCategory = translateCategory(category, language)
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  selectedCategory === category.id
                    ? 'bg-luxury-light-accent text-white shadow-md dark:bg-luxury-dark-accent dark:text-luxury-dark-text'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {translatedCategory?.name || category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Filters Section Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {t('filters')}
            </h3>
            {totalActiveFilters > 0 && (
              <span className="bg-luxury-light-accent text-white text-xs px-2 py-1 rounded-full font-medium dark:bg-luxury-dark-accent dark:text-luxury-dark-text">
                {totalActiveFilters} {t('active')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
              >
                {t('clearAll')}
              </button>
            )}
            <button
              onClick={handleToggleExpand}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {isExpanded ? (
                <>
                  <span>{t('collapse')}</span>
                  <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  <span>{t('expand')}</span>
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters - Always Visible */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 flex-wrap">
          {/* Availability Filter */}
          <button
            onClick={onAvailabilityToggle}
            className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
              availabilityOnly
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('available')}
          </button>

          {/* Price Filters */}
          {['lte10', 'btw11_20', 'gt20'].map((bucket) => (
            <button
              key={bucket}
              onClick={() => onPriceBucketChange(priceBucket === bucket ? null : bucket as any)}
              className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
                priceBucket === bucket
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {bucket === 'lte10' && t('under') + ' $20'}
              {bucket === 'btw11_20' && '$20-$50'}
              {bucket === 'gt20' && t('over') + ' $50'}
            </button>
          ))}

          {/* Top Diet Filters */}
          {filters.slice(0, 3).map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterToggle(filter.id)}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
                filter.active
                  ? 'bg-luxury-light-accent text-white shadow-md dark:bg-luxury-dark-accent dark:text-luxury-dark-text'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{filter.label}</span>
              {dietCounts[filter.id] && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter.active 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {dietCounts[filter.id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Filters Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                {t('dietaryPreferences')}
              </h4>
              <div className="flex gap-2 flex-wrap">
                {filters.slice(3).map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => onFilterToggle(filter.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
                      filter.active
                        ? 'bg-luxury-light-accent text-white shadow-md dark:bg-luxury-dark-accent dark:text-luxury-dark-text'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span>{filter.label}</span>
                    {dietCounts[filter.id] && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        filter.active 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}>
                        {dietCounts[filter.id]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
