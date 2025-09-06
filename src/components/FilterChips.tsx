'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { DietFilter } from '@/types'
import { cn } from '@/lib/utils'
import { EASING, DURATION } from '@/lib/animation'
import { useLanguage } from '@/contexts/LanguageContext'

interface FilterChipsProps {
  filters: DietFilter[]
  onFilterToggle: (filterId: string) => void
  onClearAll: () => void
  hasActiveFilters: boolean
  isOpen?: boolean
  availabilityOnly?: boolean
  onAvailabilityToggle?: () => void
  priceBucket?: 'lte10' | 'btw11_20' | 'gt20' | null
  onPriceBucketChange?: (bucket: 'lte10' | 'btw11_20' | 'gt20' | null) => void
  dietCounts?: Record<string, number>
}

const dietTagColors: Record<string, string> = {
  'sugar-free': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30',
  'vegetarian': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30',
  'vegan': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/30',
  'gluten-free': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30',
  'nuts-free': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/30',
  'dairy-free': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30',
  'keto': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30',
  'paleo': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30'
}

export default function FilterChips({ 
  filters, 
  onFilterToggle, 
  onClearAll,
  hasActiveFilters,
  isOpen = false,
  availabilityOnly = false,
  onAvailabilityToggle,
  priceBucket = null,
  onPriceBucketChange,
  dietCounts = {}
}: FilterChipsProps) {
  const { t } = useLanguage()
  const activeFilters = filters.filter(filter => filter.active)
  
  // If panel is explicitly closed and no active filters, don't show anything
  if (!isOpen && activeFilters.length === 0) return null

  return (
    <motion.div
      id="filter-panel"
      data-testid="filter-panel"
      className="flex flex-wrap items-center gap-2 p-4 bg-white dark:bg-beach-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: DURATION.fast, ease: EASING.soft }}
    >
      <div className="w-full flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-beach-dark-muted">
          {t('filters')}: {activeFilters.length} active
        </span>
        {hasActiveFilters && (
          <button 
            onClick={onClearAll}
            className="text-xs text-blue-600 dark:text-beach-dark-accent hover:underline"
            data-testid="clear-filters"
          >
            {t('clearAll')}
          </button>
        )}
      </div>
      
      <div className="w-full flex flex-wrap gap-2">
        {/* Availability toggle */}
        <button
          onClick={onAvailabilityToggle}
          aria-pressed={availabilityOnly}
          aria-label="Toggle available only"
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-all duration-200 hover:scale-105",
            availabilityOnly ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30' : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-beach-dark-bg dark:text-beach-dark-muted dark:border-gray-600'
          )}
        >
          {t('available')}
        </button>

        {/* Price buckets */}
        <div role="group" aria-label="Price">
          {[
            { id: 'lte10' as const, label: '<= $10' },
            { id: 'btw11_20' as const, label: '$11–$20' },
            { id: 'gt20' as const, label: '> $20' },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => onPriceBucketChange && onPriceBucketChange(priceBucket === b.id ? null : b.id)}
              aria-pressed={priceBucket === b.id}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 mr-2",
                priceBucket === b.id ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30' : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-beach-dark-bg dark:text-beach-dark-muted dark:border-gray-600'
              )}
            >
              {b.label}
            </button>
          ))}
        </div>

        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterToggle(filter.id)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer",
              filter.active ? 
                (dietTagColors[filter.id] || 'bg-gray-100 text-gray-800 border-gray-200') :
                'bg-gray-50 text-gray-500 border-gray-200 dark:bg-beach-dark-bg dark:text-beach-dark-muted dark:border-gray-600'
            )}
            aria-pressed={filter.active}
            data-testid="filter-chip"
            type="button"
          >
            {filter.label}
            <span className="ml-1 inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded bg-black/10 text-[10px] text-gray-700 dark:bg-white/10 dark:text-beach-dark-text">
              {dietCounts[filter.id] ?? 0}
            </span>
            {filter.active && <X className="h-3 w-3 ml-1" />}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
